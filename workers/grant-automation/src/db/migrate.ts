// Applies every SQL file under drizzle/ that is not yet recorded in
// grants.__drizzle_migrations. Connects as grants_owner. Safe to re-run.
import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { env } from "../env.js";
import { createDb } from "./client.js";

const db = createDb(env.DATABASE_OWNER_URL);
try {
  await migrate(db, {
    migrationsFolder: fileURLToPath(new URL("../../drizzle", import.meta.url)),
    migrationsSchema: "grants",
    migrationsTable: "__drizzle_migrations",
  });
  console.log("grants: migrations applied");
} finally {
  await db.$client.end();
}
