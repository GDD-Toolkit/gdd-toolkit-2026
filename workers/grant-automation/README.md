# grant-automation

Ingests grant opportunities into the `grants` schema of the toolkit's Postgres database and serves them to the funding page over a small read API. The design lives in the Lavish plan (`.lavish/grant-aggregation-plan.html`, gitignored, main checkout); this README is the operator's guide.

## What is here

- `shared/types/Grants.ts`, `Common.ts`, `GrantsApi.ts` (repo root) — zod schemas shared with the frontend: the grant record, the vocabularies, and the API contract (query params, responses, listing rules).
- `src/db/schema.ts` — the Drizzle definition of the `grants` schema: `grants`, `grant_sources`, `grant_field_defs`, `ingest_runs`, `grant_raw`, `curation_log`; indexes, generated search column, CHECK constraints built from the shared vocabularies.
- `drizzle/` — generated, reviewed SQL migrations. Applied by `npm run db:migrate`.
- `scripts/bootstrap.ts` — creates the schema and the roles `grants_owner` (migrations), `grants_worker` (ingestion, curation writes) and `grants_reader` (read API).
- `src/db/rows.ts`, `src/pipeline/status.ts`, `src/pipeline/hash.ts` — the mapping between a grant record and a table row, the status derived from the record's dates, and the content hash the ingestion uses to skip unchanged rows.
- `src/api/` — the Hono read API (`app.ts` routes, `auth.ts` admin check, `server.ts` entrypoint). `src/db/queries.ts` holds every query; the listing and the facets share one WHERE builder.
- `ecosystem.config.cjs` — pm2 processes for the EC2.

## Commands

| Command | What it does |
|---|---|
| `npm run typecheck` | `tsc --noEmit` over `src`, `scripts`, `test` and `shared/types` |
| `npm test` | hermetic unit tests (schema contract, zod) |
| `npm run test:db` | database tests: schema, search column, CHECK constraints, privileges (needs `.env`) |
| `npm run db:bootstrap` | create schema + roles as the admin user (`--print` shows the SQL) |
| `npm run db:generate -- --name <name>` | diff `src/db/schema.ts` into a new SQL migration |
| `npm run db:migrate` | apply pending migrations as `grants_owner` |
| `npm run api` / `npm run dev` | the read API on `PORT` (default 4100); `dev` restarts on change |

The root `npm run dev` starts Strapi, the frontend and this API together.

## Local setup

Prerequisites: Node 22 and a Postgres 16. The default `.env.example` points at the CMS compose stack (`docker compose up -d` in `backend/research-cms`, Postgres on port 5532, database `strapi`), which mirrors production: the `grants` schema lives in the same database as Strapi. Any other Postgres works if you change the URLs.

1. At the repo root: `npm install`. `zod` is a root dependency because `shared/` has no package.json of its own; the frontend and this worker both resolve it from the root `node_modules`.
2. In this directory: `npm install`, then `cp .env.example .env`.
3. `npm run db:bootstrap` — creates the schema and roles with the passwords in `.env`. Safe to re-run.
4. `npm run db:migrate`.
5. `npm run api` and open `http://localhost:4100/grants`.
6. `npm run typecheck`, `npm test`, `npm run test:db`.

Strapi never sees the schema: its boot-time sync only inspects `DATABASE_SCHEMA` (`public`). Strapi's role has no grant on `grants`, and the three grant roles have none on `public`.

## The read API

Contract: `shared/types/GrantsApi.ts`. Public `GET /grants`, `/grants/facets`, `/grants/field-defs`, `/grants/:id`, `/sources`, `/healthz`. Rows with `curation = hidden` are never listed but still resolve by id, so bookmarks keep working. Featured rows sort first.

`PATCH /grants/:id/curation` (`{ "curation": "auto" | "hidden" | "featured" }`) is the only write. The caller sends the Strapi users-permissions JWT as `Authorization: Bearer …`; the API forwards it to `STRAPI_URL/api/account/me` and allows the change when the account is confirmed, not blocked and has the site role `admin`. Every change is appended to `grants.curation_log`. No secret is shared with this process. 30 changes per admin per minute.

Caching: lists and facets send an `ETag` with `max-age=0, must-revalidate`, so a change is visible on the next fetch and unchanged responses cost a 304. Field defs and sources are cacheable for five minutes; facet counts are cached in memory for five minutes per filter set and dropped on every curation change.

## Changing the schema

1. Edit `src/db/schema.ts` and the matching zod schema in `shared/types/Grants.ts`. `npm test` fails when they drift (column set, vocabularies, row mapping).
2. `npm run db:generate -- --name <name>` and review the new SQL file under `drizzle/`.
3. `npm run db:migrate`.

Never edit a migration that has been applied anywhere; add a new one.

## Production runbook — P0 (schema and roles)

Run on the Strapi EC2, which sits inside the RDS security group (RDS is not reachable from elsewhere).

0. Take an RDS snapshot first.
1. `git pull` the deployed branch, then `npm ci` at the repo root and again in `workers/grant-automation`.
2. Create `workers/grant-automation/.env` from `.env.example`:
   - `DATABASE_ADMIN_URL=postgres://<master user>:<master password>@<rds endpoint>:5432/<DATABASE_NAME from Strapi's .env>`
   - three new random passwords, for example `openssl rand -base64 24` each
   - the three role URLs with those passwords, the same host and the same database
   - `DATABASE_SSL=true`
3. `npm run db:bootstrap -- --print` and read the SQL that is about to run.
4. `npm run db:bootstrap`. Expected: `grants schema owned by grants_owner; roles: grants_owner, grants_reader, grants_worker`.
5. `npm run db:migrate`. Expected: `grants: migrations applied`.
6. `npm run test:db`. Every write is rolled back or removed; it proves the schema, the search column, the facets, the CHECK constraints, that `grants_reader` cannot write and that `grants_worker` cannot read `public.up_users`.
7. Remove `DATABASE_ADMIN_URL` from `.env` (the worker never needs the master credentials) and `chmod 600 .env`.
8. `pm2 restart` the Strapi process and check `pm2 logs` for a clean boot with no schema changes.

Rollback, as the master user: `DROP OWNED BY grants_owner, grants_worker, grants_reader CASCADE; DROP ROLE grants_owner, grants_worker, grants_reader;`, or restore the snapshot.

## Production runbook — P1 (read API, page, Strapi cleanup)

Waits for the EC2's DNS name; until then the page is verified locally only.

1. In `workers/grant-automation/.env` set `PORT=4100`, `STRAPI_URL=http://127.0.0.1:1337`, `CORS_ORIGINS=<the site origin>`.
2. `pm2 start ecosystem.config.cjs` (process `grant-api`), then `curl http://127.0.0.1:4100/healthz`.
3. nginx: inside the existing `server` block add

   ```
   location /grants/api/ {
       proxy_pass http://127.0.0.1:4100/;
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```

   then `nginx -t && systemctl reload nginx`, and `curl https://<dns name>/grants/api/healthz`.
4. Frontend build with `VITE_GRANTS_API_URL=https://<dns name>/grants/api`.
5. Before deploying the Strapi change, as the master user: `select count(*) from up_users_saved_grants_lnk;` — expected 0 (the seed had no grants and the old page never wrote to Strapi). If not 0, export the rows and accept the loss: those grants no longer exist anywhere.
6. Take an RDS snapshot, deploy the Strapi change, restart. Strapi's schema sync drops `funding_resources`, its component tables and `up_users_saved_grants_lnk`, and adds `up_users.saved_grant_ids`. Rolling back means restoring the snapshot, not re-adding files.
7. Check: the admin panel no longer lists Funding_Resource; `POST /api/account/bookmarks/grants/<uuid>` with a user JWT returns the profile with `savedGrantIds`.

## Tearing down locally

```
docker compose -f ../../backend/research-cms/docker-compose.yml exec -T postgres \
  psql -U strapi -d strapi -c "DROP OWNED BY grants_owner, grants_worker, grants_reader CASCADE; DROP ROLE grants_owner, grants_worker, grants_reader;"
```

## Known gaps

- TLS to RDS runs with `rejectUnauthorized: false`. Pin the RDS CA bundle before the API is exposed.
- `grants_worker` has no DELETE anywhere. `grant_raw` pruning (P3) will need `DELETE ON grants.grant_raw`.
- The curation route writes through the `grants_worker` connection; the API process therefore holds both the reader and the worker URL.
