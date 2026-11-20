import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env.js";
import * as schema from "./schema.js";

/** One pool per role URL (owner for migrations, worker for ingestion, reader for the API). */
export function createDb(connectionString: string) {
  return drizzle({
    connection: {
      connectionString,
      // RDS requires TLS; the CA bundle is not pinned yet (tracked in the README).
      ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : undefined,
    },
    schema,
  });
}

export type Db = ReturnType<typeof createDb>;
