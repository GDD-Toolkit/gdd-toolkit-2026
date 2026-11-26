// Source of truth for the `grants` schema. `npm run db:generate` turns changes
// here into a reviewed SQL migration under drizzle/.
//
// Column property names are the snake_case column names on purpose: they match
// the shared zod keys (shared/types/Grants.ts) and the API JSON, so a validated
// Grant maps onto a row without renaming (see rows.ts).
import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  char,
  check,
  customType,
  date,
  index,
  integer,
  jsonb,
  pgSchema,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { GrantData, GrantSource, IngestRunStats } from "../../../../shared/types/Grants.js";
import {
  CURATIONS,
  DEADLINE_TYPES,
  FIELD_TYPES,
  FUNDING_TYPES,
  GRANT_STATUSES,
  RUN_STATUSES,
} from "../../../../shared/types/Grants.js";

export const grantsSchema = pgSchema("grants");

const tsvector = customType<{ data: string }>({ dataType: () => "tsvector" });
const textArray = (name: string) => text(name).array().notNull().default(sql`'{}'::text[]`);
const timestamptz = (name: string) => timestamp(name, { withTimezone: true });

// Enums are text + CHECK, not Postgres enum types: adding a value is a code
// change and a one-line migration, never an ALTER TYPE.
const oneOf = (column: string, values: readonly string[]) =>
  sql.raw(`${column} in (${values.map((v) => `'${v}'`).join(", ")})`);

const EMPTY_STATS: IngestRunStats = { fetched: 0, relevant: 0, inserted: 0, updated: 0, unchanged: 0, closed: 0 };

/** Adapter registry and per-source config; `enabled` is the kill switch. */
export const grantSources = grantsSchema.table("grant_sources", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  adapter: text("adapter").notNull(),
  config: jsonb("config").$type<GrantSource["config"]>().notNull().default({}),
  license_note: text("license_note"),
  enabled: boolean("enabled").notNull().default(true),
  last_run_at: timestamptz("last_run_at"),
});

/** One row per opportunity. Core in columns for indexing; the full validated record in `data`. */
export const grants = grantsSchema.table(
  "grants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source_id: text("source_id")
      .notNull()
      .references(() => grantSources.id),
    external_id: text("external_id").notNull(),
    title: text("title").notNull(),
    funder: text("funder").notNull().default(""),
    summary: text("summary").notNull().default(""),
    url: text("url").notNull(),
    apply_url: text("apply_url"),
    funding_type: text("funding_type").notNull().default("grant"),
    amount_min: bigint("amount_min", { mode: "number" }),
    amount_max: bigint("amount_max", { mode: "number" }),
    currency: char("currency", { length: 3 }).notNull().default("USD"),
    deadline: date("deadline"), // "YYYY-MM-DD" string
    deadline_type: text("deadline_type").notNull().default("unknown"),
    opens_at: date("opens_at"), // forecasted while in the future
    status: text("status").notNull().default("open"),
    posted_at: timestamptz("posted_at"),
    first_seen_at: timestamptz("first_seen_at").notNull().defaultNow(),
    last_seen_at: timestamptz("last_seen_at").notNull().defaultNow(),
    last_verified_at: timestamptz("last_verified_at").notNull().defaultNow(),
    geographies: textArray("geographies"),
    sdgs: smallint("sdgs").array().notNull().default(sql`'{}'::smallint[]`),
    values: textArray("values"),
    tags: textArray("tags"),
    curation: text("curation").notNull().default("auto"),
    data: jsonb("data").$type<GrantData>().notNull(),
    // Generated columns must be IMMUTABLE; array_to_string() is only STABLE, so
    // tags stay out of the search vector and are matched as a facet instead.
    search: tsvector("search").generatedAlwaysAs(
      sql`setweight(to_tsvector('english', title), 'A') || setweight(to_tsvector('english', funder), 'B') || setweight(to_tsvector('english', summary), 'C')`,
    ),
    content_hash: text("content_hash").notNull(),
    schema_version: smallint("schema_version").notNull().default(1),
  },
  (t) => [
    uniqueIndex("grants_source_external_uq").on(t.source_id, t.external_id),
    index("grants_deadline_idx").on(t.deadline),
    index("grants_status_idx").on(t.status),
    index("grants_amount_max_idx").on(t.amount_max),
    index("grants_last_seen_at_idx").on(t.last_seen_at),
    index("grants_geographies_gin").using("gin", t.geographies),
    index("grants_sdgs_gin").using("gin", t.sdgs),
    index("grants_values_gin").using("gin", t.values),
    index("grants_tags_gin").using("gin", t.tags),
    index("grants_search_gin").using("gin", t.search),
    index("grants_data_gin").using("gin", t.data.op("jsonb_path_ops")),
    check("grants_status_chk", oneOf("status", GRANT_STATUSES)),
    check("grants_curation_chk", oneOf("curation", CURATIONS)),
    check("grants_funding_type_chk", oneOf("funding_type", FUNDING_TYPES)),
    check("grants_deadline_type_chk", oneOf("deadline_type", DEADLINE_TYPES)),
  ],
);

/** Registry of extras keys: how to label, render, filter and facet them. */
export const grantFieldDefs = grantsSchema.table(
  "grant_field_defs",
  {
    key: text("key").primaryKey(),
    label: text("label").notNull(),
    type: text("type").notNull(),
    options: jsonb("options").$type<string[]>(),
    filterable: boolean("filterable").notNull().default(false),
    facet: boolean("facet").notNull().default(false),
    display_order: integer("display_order").notNull().default(0),
    sources: textArray("sources"),
    created_at: timestamptz("created_at").notNull().defaultNow(),
  },
  (t) => [check("grant_field_defs_type_chk", oneOf("type", FIELD_TYPES))],
);

/** One row per adapter run. */
export const ingestRuns = grantsSchema.table(
  "ingest_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source_id: text("source_id")
      .notNull()
      .references(() => grantSources.id),
    started_at: timestamptz("started_at").notNull().defaultNow(),
    finished_at: timestamptz("finished_at"),
    status: text("status").notNull().default("running"),
    stats: jsonb("stats").$type<IngestRunStats>().notNull().default(EMPTY_STATS),
    error: text("error"),
  },
  (t) => [
    index("ingest_runs_source_started_idx").on(t.source_id, t.started_at.desc()),
    check("ingest_runs_status_chk", oneOf("status", RUN_STATUSES)),
  ],
);

/** The fetched payload a grant was built from: replay and audit. Unchanged refetches add nothing. */
export const grantRaw = grantsSchema.table(
  "grant_raw",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source_id: text("source_id")
      .notNull()
      .references(() => grantSources.id),
    external_id: text("external_id").notNull(),
    run_id: uuid("run_id")
      .notNull()
      .references(() => ingestRuns.id),
    fetched_at: timestamptz("fetched_at").notNull().defaultNow(),
    payload: jsonb("payload").notNull(),
    content_hash: text("content_hash").notNull(),
  },
  (t) => [
    uniqueIndex("grant_raw_source_external_hash_uq").on(t.source_id, t.external_id, t.content_hash),
    index("grant_raw_source_external_idx").on(t.source_id, t.external_id),
  ],
);

/** Every admin change to grants.curation, appended by PATCH /grants/:id/curation. */
export const curationLog = grantsSchema.table(
  "curation_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    grant_id: uuid("grant_id")
      .notNull()
      .references(() => grants.id),
    user_id: integer("user_id").notNull(), // Strapi up_users.id
    from_curation: text("from_curation").notNull(),
    to_curation: text("to_curation").notNull(),
    at: timestamptz("at").notNull().defaultNow(),
  },
  (t) => [index("curation_log_grant_idx").on(t.grant_id, t.at.desc())],
);
