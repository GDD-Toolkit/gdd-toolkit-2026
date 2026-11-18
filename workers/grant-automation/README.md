# grant-automation

Ingests grant opportunities into the `grants` schema of the toolkit's Postgres database and serves them to the funding page over a small read API. The design lives in the Lavish plan (`.lavish/grant-aggregation-plan.html`, gitignored, main checkout); this README is the operator's guide.

This first pull request (P0) lays the foundation: the shared types, the schema and the database roles. The read API, the page and the ingestion follow in later pull requests.

## What is here

- `shared/types/Grants.ts`, `Common.ts` (repo root) — zod schemas shared with the frontend: the grant record and the vocabularies.
- `src/db/schema.ts` — the Drizzle definition of the `grants` schema: `grants`, `grant_sources`, `grant_field_defs`, `ingest_runs`, `grant_raw`, `curation_log`; indexes, generated search column, CHECK constraints built from the shared vocabularies.
- `drizzle/` — generated, reviewed SQL migrations. Applied by `npm run db:migrate`.
- `scripts/bootstrap.ts` — creates the schema and the roles `grants_owner` (migrations), `grants_worker` (ingestion, curation writes) and `grants_reader` (read API).
- `src/db/rows.ts`, `src/pipeline/status.ts`, `src/pipeline/hash.ts` — the mapping between a grant record and a table row, the status derived from the record's dates, and the content hash the ingestion uses to skip unchanged rows.

## Commands

| Command | What it does |
|---|---|
| `npm run typecheck` | `tsc --noEmit` over `src`, `scripts`, `test` and `shared/types` |
| `npm test` | hermetic unit tests (schema contract, zod) |
| `npm run test:db` | database tests: schema, search column, CHECK constraints, privileges (needs `.env`) |
| `npm run db:bootstrap` | create schema + roles as the admin user (`--print` shows the SQL) |
| `npm run db:generate -- --name <name>` | diff `src/db/schema.ts` into a new SQL migration |
| `npm run db:migrate` | apply pending migrations as `grants_owner` |

## Local setup

Prerequisites: Node 22 and a Postgres 16. The default `.env.example` points at the CMS compose stack (`docker compose up -d` in `backend/research-cms`, Postgres on port 5532, database `strapi`), which mirrors production: the `grants` schema lives in the same database as Strapi. Any other Postgres works if you change the URLs.

1. At the repo root: `npm install`. `zod` is a root dependency because `shared/` has no package.json of its own; the frontend and this worker both resolve it from the root `node_modules`.
2. In this directory: `npm install`, then `cp .env.example .env`.
3. `npm run db:bootstrap` — creates the schema and roles with the passwords in `.env`. Safe to re-run.
4. `npm run db:migrate`.
5. `npm run typecheck`, `npm test`, `npm run test:db`.

Strapi never sees the schema: its boot-time sync only inspects `DATABASE_SCHEMA` (`public`). Strapi's role has no grant on `grants`, and the three grant roles have none on `public`.

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

## Tearing down locally

```
docker compose -f ../../backend/research-cms/docker-compose.yml exec -T postgres \
  psql -U strapi -d strapi -c "DROP OWNED BY grants_owner, grants_worker, grants_reader CASCADE; DROP ROLE grants_owner, grants_worker, grants_reader;"
```

## Known gaps

- TLS to RDS runs with `rejectUnauthorized: false`. Pin the RDS CA bundle before the API is exposed.
- `grants_worker` has no DELETE anywhere. `grant_raw` pruning (P3) will need `DELETE ON grants.grant_raw`.
