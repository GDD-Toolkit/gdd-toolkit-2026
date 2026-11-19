# Production deploy (EC2 + Docker Compose + Caddy)

One EC2 box in us-east-2 (Elastic IP `3.140.167.228`) runs the whole site as containers:

| Service | What | Reached at |
|---|---|---|
| `caddy` | reverse proxy, gets and renews TLS certificates | ports 80, 443 (the only published ports) |
| `frontend` | the Vite build served by nginx | `https://$SITE_HOST/` |
| `grant-api` | grants read API | `https://$SITE_HOST/grants/api/...` |
| `cms` | Strapi (API + admin) | `https://$CMS_HOST/` |
| `grant-ingest` | nightly ingestion, one-shot | host cron, see below |

The database is RDS and uploads go to S3, so the containers hold no data. Caddy's
certificates live in the `caddy_data` volume.

## Files on the server

Everything lives in this `deploy/` folder. Three files are created by hand and are gitignored:

| File | Template | Contents |
|---|---|---|
| `.env` | `deploy/.env.example` | hostnames, `CADDY_TLS`, image tag |
| `.env.cms` | `backend/research-cms/.env.example` | Strapi secrets, `DATABASE_*`, `AWS_*`, `SMTP_*`, `GOOGLE_*` (copy from the current `~/gdd-cms/.env`) |
| `.env.grants` | `workers/grant-automation/.env.example` | grants role URLs, `DATABASE_SSL=true` (copy from the current worker `.env`) |

The compose file sets `DATA_SOURCE`, `PUBLIC_URL`, `FRONTEND_URL`, `GOOGLE_AUTH_REDIRECT_URL`,
`IS_PROXIED`, `STRAPI_URL`, `CORS_ORIGINS` and `PORT` from the hostnames, overriding the env files.

## Testing before DNS exists

Keep `CADDY_TLS=internal`. Caddy then serves both hostnames with its own self-signed
certificate. To open the site in a browser, map the names to the Elastic IP in your hosts file
(Windows: `C:\Windows\System32\drivers\etc\hosts`, as admin):

```
3.140.167.228 devethicstoolkit.umd.edu
3.140.167.228 cms.devethicstoolkit.umd.edu
```

Open `https://cms.devethicstoolkit.umd.edu/_health` once and accept the warning, then the site.
Remove the lines when DNS is live. From a terminal, the same thing without editing the hosts file:

```
curl -k --resolve devethicstoolkit.umd.edu:443:3.140.167.228 https://devethicstoolkit.umd.edu/
curl -k --resolve cms.devethicstoolkit.umd.edu:443:3.140.167.228 https://cms.devethicstoolkit.umd.edu/_health
```

## Switching to real certificates

Once `dig +short devethicstoolkit.umd.edu` and `dig +short cms.devethicstoolkit.umd.edu`
both print the Elastic IP, set `CADDY_TLS=<your email>` in `.env` and run
`docker compose -f docker-compose.prod.yml up -d caddy`. Caddy gets Let's Encrypt
certificates within a minute (`docker compose -f docker-compose.prod.yml logs -f caddy`).
Port 80 must stay open: Let's Encrypt validates over it, and Caddy redirects HTTP to HTTPS.

## Everyday commands (from this folder)

```
docker compose -f docker-compose.prod.yml pull           # fetch new images
docker compose -f docker-compose.prod.yml up -d          # start / apply changes
docker compose -f docker-compose.prod.yml ps             # status and health
docker compose -f docker-compose.prod.yml logs -f cms    # follow one service
```

Grants database migrations (after a release that adds one):

```
docker compose -f docker-compose.prod.yml run --rm grant-api npm run db:migrate
```

## Nightly grant ingestion

`grant-ingest` is not started by `up`. The host's crontab (`crontab -e` as `ubuntu`) runs it;
the box is on UTC, so 08:00 is 03:00 Eastern in winter:

```
0 8 * * * cd /home/ubuntu/gdd/deploy && docker compose -f docker-compose.prod.yml run --rm grant-ingest >> /home/ubuntu/grant-ingest.log 2>&1
```

## Building locally

The compose file can build every image itself, from the repo root context:

```
cp .env.example .env
docker compose -f docker-compose.prod.yml build
```
