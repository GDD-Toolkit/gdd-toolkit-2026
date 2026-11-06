# Project planning content deployment

The tool matrix and modals now read `/api/project-planning-tools` from `VITE_STRAPI_URL`. There is no bundled JSON fallback. Search, keyword filters, selection and display pagination operate on the full published collection loaded across all REST pages.

Before deploying this frontend, merge and deploy the corresponding `GDD-Toolkit/gdd-cms` project planning tool schema, then run `npm run seed:planning-tools` in that repository with the intended database configuration. Confirm the public endpoint returns all 16 migrated tools. See `data/project-planning-tools/README.md` in the CMS repository for the field contract and import behavior.

The new collection is separate from the legacy `/api/project-plannings` endpoint. Images using `/assets/...` remain served by the frontend; their URLs and all nested tool content are preserved in the seed records. Future content changes belong in Strapi.

If the CMS is unavailable or the response does not match the tool contract, the page displays a retry action. An empty published collection displays an empty state. The CMS must be deployed and seeded first to avoid an empty or failed tool matrix during rollout.
