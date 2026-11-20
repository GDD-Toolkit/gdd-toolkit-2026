import { defineConfig } from "drizzle-kit";

// Only `drizzle-kit generate` is used: it diffs src/db/schema.ts against the
// snapshot in drizzle/meta and writes a reviewed SQL file. `npm run db:migrate`
// applies those files through drizzle-orm's migrator (src/db/migrate.ts).
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  schemaFilter: ["grants"],
  migrations: { schema: "grants", table: "__drizzle_migrations" },
});
