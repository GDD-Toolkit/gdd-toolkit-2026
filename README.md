# GDD Toolkit 2026

## Running locally

Start the Strapi CMS (`backend/research-cms`) and the Vite frontend (`frontend`) together from the repo root:

```bash
npm install                                  # installs `concurrently` for the root dev script
npm run dev                                  # runs both; Ctrl+C stops both
```

Each app still needs its own `npm install` and `.env` first (see `backend/research-cms/README.md` and `frontend/.env.example`). In local mode the CMS also expects `docker compose up -d` in `backend/research-cms`. To run only one side, use `npm run dev:backend` or `npm run dev:frontend`.
