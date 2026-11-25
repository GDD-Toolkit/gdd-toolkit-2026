import { existsSync } from "node:fs";

// Loads ./.env (relative to the working directory, i.e. workers/grant-automation)
// when present. Each value is read lazily so importing this module never throws
// for a variable the current command does not use.
if (existsSync(".env")) process.loadEnvFile(".env");

function need(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name} (see .env.example)`);
  return value;
}

export const env = {
  /** Ingestion worker: role grants_worker. */
  get DATABASE_URL() {
    return need("DATABASE_URL");
  },
  /** Migrations: role grants_owner. */
  get DATABASE_OWNER_URL() {
    return need("DATABASE_OWNER_URL");
  },
  /** Read API (P1) and the privilege test: role grants_reader. Optional. */
  get DATABASE_READER_URL() {
    return process.env.DATABASE_READER_URL;
  },
  /**
   * Bootstrap only: the compose superuser locally, the RDS master user in production.
   * In production it is built from Strapi's own DATABASE_* keys (SSM /gdd/prod/backend),
   * so the master password is never copied anywhere.
   */
  get DATABASE_ADMIN_URL() {
    if (process.env.DATABASE_ADMIN_URL) return process.env.DATABASE_ADMIN_URL;
    const { DATABASE_HOST: host, DATABASE_USERNAME: user, DATABASE_PASSWORD: password, DATABASE_NAME: name } = process.env;
    if (!host || !user || !password || !name) return need("DATABASE_ADMIN_URL");
    const port = process.env.DATABASE_PORT ?? "5432";
    return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(name)}`;
  },
  get DATABASE_SSL() {
    return process.env.DATABASE_SSL === "true";
  },
  /** Read API port. nginx proxies /grants/api/ here in production. */
  get PORT() {
    return Number(process.env.PORT ?? 4100);
  },
  /** Strapi origin the curation route asks about the caller's role. */
  get STRAPI_URL() {
    return process.env.STRAPI_URL ?? "http://localhost:1337";
  },
  /** Browser origins allowed to call the read API. */
  get CORS_ORIGINS() {
    return (process.env.CORS_ORIGINS ?? "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);
  },
  rolePassword(role: "owner" | "worker" | "reader") {
    return need(`GRANTS_${role.toUpperCase()}_PASSWORD`);
  },
};
