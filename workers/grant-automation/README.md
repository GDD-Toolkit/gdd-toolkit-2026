# grant-automation

Ingests grant opportunities into the `grants` schema of the toolkit's Postgres database and serves them to the funding page over a small read API. The design lives in the Lavish plan (`.lavish/grant-aggregation-plan.html`, gitignored, main checkout); this README is the operator's guide.

## What is here

- `shared/types/Grants.ts`, `Common.ts`, `GrantsApi.ts` (repo root) — zod schemas shared with the frontend: the grant record, the vocabularies, and the API contract (query params, responses, listing rules).
- `src/db/schema.ts` — the Drizzle definition of the `grants` schema: `grants`, `grant_sources`, `grant_field_defs`, `ingest_runs`, `grant_raw`, `curation_log`; indexes, generated search column, CHECK constraints built from the shared vocabularies.
- `drizzle/` — generated, reviewed SQL migrations. Applied by `npm run db:migrate`.
- `scripts/bootstrap.ts` — creates the schema and the roles `grants_owner` (migrations), `grants_worker` (ingestion, curation writes) and `grants_reader` (read API).
- `src/pipeline/` — `ingest.ts` (fetch → normalize → gates → upsert → sweep, one `ingest_runs` row per run), `relevance.ts` (keyword scoring and the stale rule), `dedupe.ts` (cross-source duplicates), `upsert.ts` (transactional upsert keyed on `(source_id, external_id)`; unchanged content writes nothing but `last_seen_at`), `sweep.ts` (statuses follow the calendar; rows a source stops listing are closed), `status.ts`, `hash.ts`, `report.ts` (the run summary line and the rejects file).
- `src/adapters/` — one module per source: `grants-gov.ts`, `eu-ft.ts`, and `curated.ts`, which reads `data/curated.json` (entries the research module adds by pull request; `test/curated.schema.test.ts` is the CI gate). `index.ts` maps `data/sources.json` to adapters.
- `data/sources.json` — the sources the worker runs, in order, with the attribution text each one's terms require (`license_note`, shown on the page). `data/relevance.json` — what gets in (see "Tuning relevance").
- `data/field-defs.json` — the registry of extras keys (label, type, filterable, facet, order) and which adapters fill them. A new key here is a new dialog row and, when filterable, a new filter control, with no frontend deploy.
- `rejects/` (gitignored) — `<source>.jsonl`, rewritten on every run: the records the last run left out and why.
- `src/api/` — the Hono read API (`app.ts` routes, `auth.ts` admin check, `server.ts` entrypoint). `src/db/queries.ts` holds every query; the listing and the facets share one WHERE builder.
- `src/dev/sample-entries.ts`, `scripts/seed-sample.ts` — six sample grants for local development.
- `ecosystem.config.cjs` — pm2 processes for the EC2.

## Commands

| Command | What it does |
|---|---|
| `npm run typecheck` | `tsc --noEmit` over `src`, `scripts`, `test` and `shared/types` |
| `npm test` | hermetic unit tests (schema contract, zod, pipeline, data files, adapters replaying recorded responses) |
| `npm run test:db` | database tests: ingest, gates, sweep, API, privileges (needs `.env`) |
| `npm run test:live` | calls the real Grants.gov and EU APIs once each and checks the adapters can still read them |
| `npm run db:bootstrap` | create schema + roles as the admin user (`--print` shows the SQL) |
| `npm run db:generate -- --name <name>` | diff `src/db/schema.ts` into a new SQL migration |
| `npm run db:migrate` | apply pending migrations as `grants_owner` |
| `npm run ingest` | run every source in `data/sources.json`; one failing source does not stop the others; exit code 1 if any failed |
| `npm run ingest -- --source grants-gov [--dry-run] [--limit N]` | one source. `--dry-run` fetches and gates but writes nothing to the database. `--limit N` stops after N records and skips the sweep. `--file path` (curated only) reads another file |
| `npm run api` / `npm run dev` | the read API on `PORT` (default 4100); `dev` restarts on change |
| `npm run seed:sample` / `-- --clean` | load or remove the six sample grants (source `sample`) |

The root `npm run dev` starts Strapi, the frontend and this API together.

## Local setup

Prerequisites: Node 22 and a Postgres 16. The default `.env.example` points at the CMS compose stack (`docker compose up -d` in `backend/research-cms`, Postgres on port 5532, database `strapi`), which mirrors production: the `grants` schema lives in the same database as Strapi. Any other Postgres works if you change the URLs.

1. At the repo root: `npm install`. `zod` is a root dependency because `shared/` has no package.json of its own; the frontend and this worker both resolve it from the root `node_modules`.
2. In this directory: `npm install`, then `cp .env.example .env`.
3. `npm run db:bootstrap` — creates the schema and roles with the passwords in `.env`. Safe to re-run.
4. `npm run db:migrate`.
5. `npm run seed:sample`, then `npm run api` and open `http://localhost:4100/grants`.
6. `npm run typecheck`, `npm test`, `npm run test:db`.

Strapi never sees the schema: its boot-time sync only inspects `DATABASE_SCHEMA` (`public`). Strapi's role has no grant on `grants`, and the three grant roles have none on `public`.

## The read API

Contract: `shared/types/GrantsApi.ts`. Public `GET /grants`, `/grants/facets`, `/grants/field-defs`, `/grants/:id`, `/sources`, `/healthz`. Rows with `curation = hidden` are never listed but still resolve by id, so bookmarks keep working. Featured rows sort first.

`PATCH /grants/:id/curation` (`{ "curation": "auto" | "hidden" | "featured" }`) is the only write. The caller sends the Strapi users-permissions JWT as `Authorization: Bearer …`; the API forwards it to `STRAPI_URL/api/account/me` and allows the change when the account is confirmed, not blocked and has the site role `admin`. Every change is appended to `grants.curation_log`. No secret is shared with this process. 30 changes per admin per minute.

Caching: lists and facets send an `ETag` with `max-age=0, must-revalidate`, so a change is visible on the next fetch and unchanged responses cost a 304. Field defs and sources are cacheable for five minutes; facet counts are cached in memory for five minutes per filter set and dropped on every curation change.

## Ingestion

One run of a source: **fetch** (the adapter) → **normalize** (to the shared grant shape) → **gates** → **upsert** → **sweep** → one row in `grants.ingest_runs` with the counts, one summary line in the log.

Gates, in order. Curated entries skip the first two: they are hand-picked.

1. **Stale.** A deadline that has passed, or no closing date and posted more than a year ago. Both feeds keep listing dead calls (Grants.gov forecasts from 2019, EU topics flagged open with a 2023 deadline). An evergreen programme caught by the one-year rule belongs in `data/curated.json`.
2. **Relevance.** Score under the threshold in `data/relevance.json`.
3. **Duplicate.** Same canonical URL, or same title and funder, as a live row of another source. The row that was there first wins.

Upsert is idempotent: a second run right after the first reports every row unchanged. Statuses are never set by adapters; they are derived from the dates (and from the source saying "forecast"), at upsert and again by the sweep.

The sweep closes a row that three full runs in a row did not return, and reopens it if it comes back. It refuses to close anything for being missing when a run returned fewer than 20% of the source's known live rows (a broken fetch must not empty the page); `sweep_skipped` in the run's stats says so. `--limit` runs are marked partial and never count.

To stop a source without a deploy: `update grants.grant_sources set enabled = false where id = '<id>'` (as `grants_owner`). The next run skips it.

### Sources

Both APIs need no key. The full verified contracts are in `.claude/skills/grants-gov-integration` and `.claude/skills/eu-funding-tenders-integration` (local, gitignored); the points that shaped the code:

**Grants.gov** (`search2` + `fetchOpportunity`, about 1,050 requests and 30 seconds per run)
- The `agencies` filter takes sub-agency codes only (`DOS` matches nothing), so the adapter reads the `DOS-*` codes from the search's own facet on every run.
- Filters in different fields are ANDed, so the agency list and the category list are two searches, unioned by id.
- `fetchOpportunity` returns its code lists in a different order on every call; the adapter sorts them so an unchanged record hashes the same.
- A closing date of 2099-01-01 is the agencies' way of saying "none"; it becomes a rolling deadline.
- USAID no longer posts. Its former calls appear under State Department (`DOS-*`) codes.
- Terms: the attribution sentence in `data/sources.json` must stay on the page, and content must not be modified, which is why summaries are excerpts.

**EU Funding & Tenders Portal** (the portal's own search API; about 10 requests and 10 seconds per run)
- Undocumented. `npm run test:live` checks the response shape and the `apiVersion` the adapter was verified against.
- The body is multipart and every part must be typed `application/json`, otherwise the filter is silently ignored.
- Results must be sorted by `identifier`: the default sort repeats and drops results across pages.
- The search result already carries description, budget and deadlines, so there is no per-topic request.
- About 60% of what the API returns as open or forthcoming are legacy records with deadlines in 2023 to 2025; the stale gate removes them.
- Type 2 records are external-action calls (EuropeAid); they have no description, so their summary line is built from the reference and the country.

### Tuning relevance

`data/relevance.json` is data, not code: change it by pull request (`npm test` checks the shape), then look at what the change does with a dry run.

- `gate1` decides what is fetched: Grants.gov funding categories, Grants.gov agency prefixes (with a `weight` added to the score of their records), the launch-market agencies (Philippines / Southeast Asia: always kept, tagged with that geography) and EU programmes (each with a `weight`; negative means the programme needs more keyword evidence).
- `gate2` scores the title and description: each keyword that appears adds its `weight` once, keyword points are capped at 6, each `block` term subtracts 5. A record is kept when its score reaches `threshold`.
- `npm run ingest -- --source eu-ft --dry-run` rewrites `rejects/eu-ft.jsonl` without touching the database. Each line has the title, the score and the reasons, so a keyword that would rescue a good call is easy to spot.

### Adding a source

1. Read the provider's documentation and terms first, and record what you verified.
2. `src/adapters/<name>.ts` exporting a factory `(seed, relevance, fetchImpl?) => SourceAdapter`; register it in `src/adapters/index.ts`.
3. A row in `data/sources.json` with the attribution the terms require.
4. Its extras in `data/field-defs.json` (reuse existing keys where the meaning matches).
5. Recorded responses under `test/fixtures/<name>/` and a test that replays them.

## Changing the schema

1. Edit `src/db/schema.ts` and the matching zod schema in `shared/types/Grants.ts`. `npm test` fails when they drift (column set, vocabularies, row mapping).
2. `npm run db:generate -- --name <name>` and review the new SQL file under `drizzle/`.
3. `npm run db:migrate`.

Never edit a migration that has been applied anywhere; add a new one.

## Adding a curated entry

Append to `data/curated.json` (shape: `CuratedEntry` in `src/adapters/curated.ts`; `src/dev/sample-entries.ts` shows six complete examples). `external_id` is a stable lowercase slug, `verified_at` is the day you checked the page, `url` is the official page. `npm test` must pass; then `npm run ingest -- --source curated`.

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
6. `npm run test:db`. Every write is rolled back or removed; it proves the schema, the search column, the facets, the CHECK constraints, the API, that `grants_reader` cannot write and that `grants_worker` cannot read `public.up_users`.
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

## Production runbook — P2 (ingestion)

After P0 and P1. Nothing here touches Strapi.

1. `git pull`, then `npm ci` in `workers/grant-automation`. No migration: P2 adds no tables or columns.
2. `npm run test:live` — both APIs are reachable from the server and still have the shape the adapters expect.
3. `npm run ingest -- --dry-run` — expected: three summary lines (`grants-gov`, `eu-ft`, `curated`) ending in `dry run, nothing written`, and `select count(*) from grants.ingest_runs` unchanged.
4. `npm run ingest` — the first real run, about 45 seconds. Expected on 2026-11-05: roughly 20 Grants.gov and 90 EU rows inserted.
5. `npm run ingest` again — expected: `inserted 0, updated 0` and every row unchanged.
6. `curl http://127.0.0.1:4100/sources` shows the three sources with today's `last_run_at`; the page shows "Grants.gov · verified <today>" on cards and the "Data sources" notices at the bottom.
7. Schedule it. pm2 evaluates `cron_restart` in the time zone of the pm2 daemon, so run `date +%Z` first. On UTC keep `0 8 * * *` in `ecosystem.config.cjs` (03:00 Eastern in winter, 04:00 in summer); on Eastern time change it to `0 3 * * *`. Then:

   ```
   pm2 start ecosystem.config.cjs --only grant-ingest
   pm2 save
   ```

   Starting it runs one ingest immediately; after that the process sits in `stopped` between runs, which is expected (`autorestart: false`).
8. The next morning: `pm2 logs grant-ingest --lines 20` shows the three summary lines, and `select source_id, status, started_at, stats from grants.ingest_runs order by started_at desc limit 3;` shows three `ok` rows.

If a source misbehaves: `update grants.grant_sources set enabled = false where id = '<id>';`. To stop the schedule: `pm2 delete grant-ingest`.

## Tearing down locally

```
docker compose -f ../../backend/research-cms/docker-compose.yml exec -T postgres \
  psql -U strapi -d strapi -c "DROP OWNED BY grants_owner, grants_worker, grants_reader CASCADE; DROP ROLE grants_owner, grants_worker, grants_reader;"
```

## Known gaps

- TLS to RDS runs with `rejectUnauthorized: false`. Pin the RDS CA bundle before the API is exposed.
- `grants_worker` has no DELETE anywhere. `grant_raw` pruning (P3) will need `DELETE ON grants.grant_raw`.
- The pm2 schedule was written from pm2's documentation and source (the cron job restarts the process whatever its state, in the daemon's time zone) but has not been run under pm2 yet. Step 8 of the P2 runbook is its first real check.
- Duplicate detection is exact (canonical URL, or title + funder). The fuzzy title match waits for P3, when the Federal Register adapter creates near-duplicates of Grants.gov records.
- No LLM yet: `sdgs` and `values` are empty for feed rows, and geography is a coarse heuristic. P3 enrichment fills them.
- Grants.gov detail payloads in `grant_raw` include the contact name and email each agency publishes. Decide in the compliance review (issue #60) whether to strip them before storing.
- The curation route writes through the `grants_worker` connection; the API process therefore holds both the reader and the worker URL.
