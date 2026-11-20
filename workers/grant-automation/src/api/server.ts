// npm run api — the read API on PORT (default 4100).
import { serve } from "@hono/node-server";
import { createDb } from "../db/client.js";
import { env } from "../env.js";
import { createApp } from "./app.js";

const reader = createDb(env.DATABASE_READER_URL ?? env.DATABASE_URL);
const writer = createDb(env.DATABASE_URL);
const app = createApp({ reader, writer, strapiUrl: env.STRAPI_URL, corsOrigins: env.CORS_ORIGINS });

const server = serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`grants api listening on http://localhost:${info.port} (Strapi at ${env.STRAPI_URL}, CORS ${env.CORS_ORIGINS.join(", ")})`);
});

async function shutdown() {
  server.close();
  await Promise.all([reader.$client.end(), writer.$client.end()]);
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
