import type { Core } from "@strapi/strapi";

type Env = Core.Config.Shared.ConfigParams["env"];

/**
 * DATA_SOURCE decides which database, file store and mail server Strapi uses:
 *   local      -> the docker-compose.yml stack next to this project
 *   production -> the services named by DATABASE_*, AWS_* and SMTP_* in .env
 * There is no default, so a missing value can never silently point at the wrong data.
 */
export function isLocalDataSource(env: Env): boolean {
  const value = env("DATA_SOURCE");
  if (value === "local") return true;
  if (value === "production") return false;
  throw new Error(
    `DATA_SOURCE must be "local" or "production" (got ${value ?? "nothing"}). Set it in backend/research-cms/.env`
  );
}
