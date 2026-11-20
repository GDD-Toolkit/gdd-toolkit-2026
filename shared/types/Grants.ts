// Shared grant types: runtime zod schemas plus the inferred TypeScript types.
// Keys are snake_case on purpose — they are the column names in grants.grants
// and the JSON the read API returns, so nothing is renamed between layers.
import { z } from "zod";
import { VALUES } from "./Common.js";

/** Bump when GrantCore changes shape; every stored row carries it. */
export const GRANTS_SCHEMA_VERSION = 1 as const;

// Vocabularies are plain arrays so the database CHECK constraints can be built
// from the same list (workers/grant-automation/src/db/schema.ts).
export const GRANT_STATUSES = ["open", "closing_soon", "rolling", "forecasted", "closed", "archived"] as const;
export const DEADLINE_TYPES = ["fixed", "rolling", "multiple", "unknown"] as const;
export const FUNDING_TYPES = ["grant", "fellowship", "scholarship", "prize", "cooperative_agreement", "other"] as const;
export const CURATIONS = ["auto", "reviewed", "featured", "hidden"] as const;
/** Coarse heuristic facet at MVP; P3 enrichment appends REGIONS / ISO codes. */
export const GEOGRAPHIES = ["us_only", "eu_and_partners", "worldwide", "philippines_sea"] as const;
export const FIELD_TYPES = ["string", "number", "date", "enum", "list", "url", "money"] as const;
export const RUN_STATUSES = ["running", "ok", "failed"] as const;

export const GrantStatus = z.enum(GRANT_STATUSES);
export const DeadlineType = z.enum(DEADLINE_TYPES);
export const FundingType = z.enum(FUNDING_TYPES);
export const Curation = z.enum(CURATIONS);
export const Geography = z.enum(GEOGRAPHIES);

/** The strict, indexed core. One key per column in grants.grants. */
export const GrantCore = z.strictObject({
  id: z.uuid(),
  source_id: z.string().min(1), // FK → grant_sources.id, e.g. "grants-gov", "curated"
  external_id: z.string().min(1), // id in the source; (source_id, external_id) is unique
  title: z.string().min(1),
  funder: z.string(),
  summary: z.string(), // ≤ 60 words for the card
  url: z.url(), // canonical page at the source
  apply_url: z.url().nullable(),
  funding_type: FundingType,
  amount_min: z.number().int().nonnegative().nullable(),
  amount_max: z.number().int().nonnegative().nullable(),
  currency: z.string().length(3), // ISO 4217
  deadline: z.iso.date().nullable(), // "YYYY-MM-DD"
  deadline_type: DeadlineType,
  opens_at: z.iso.date().nullable(), // "YYYY-MM-DD"; the status is forecasted while this is in the future
  status: GrantStatus, // derived by the sweep, never by adapters
  posted_at: z.iso.datetime().nullable(),
  first_seen_at: z.iso.datetime(),
  last_seen_at: z.iso.datetime(), // bumped every run the source still lists it
  last_verified_at: z.iso.datetime(), // bumped only when the detail page was re-fetched
  // facets — array columns with GIN indexes
  geographies: z.array(z.string()), // GEOGRAPHIES values at MVP, shown as "heuristic"
  sdgs: z.array(z.number().int().min(1).max(17)),
  values: z.array(z.enum(VALUES)),
  tags: z.array(z.string()),
  curation: Curation,
  content_hash: z.string(), // sha256 of the normalized record minus timestamps
  schema_version: z.literal(GRANTS_SCHEMA_VERSION),
});

/** Values an extra field may hold. Mirrors GrantFieldDef.type. */
export const FieldValue = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(z.string()),
  z.object({ amount: z.number(), currency: z.string().length(3) }), // money
]);
/** Keys are grant_field_defs.key. */
export const GrantExtras = z.record(z.string(), FieldValue);
/** What the API returns; stored whole in grants.grants.data. */
export const Grant = GrantCore.extend({ extras: GrantExtras });

/** One row of grants.grant_field_defs: how the page labels, renders, filters and facets an extras key. */
export const GrantFieldDef = z.object({
  key: z.string().regex(/^[a-z][a-z0-9_]*$/),
  label: z.string(),
  type: z.enum(FIELD_TYPES),
  options: z.array(z.string()).nullish(), // for enum
  filterable: z.boolean(), // API accepts ?extras[key]=… and the page shows a control
  facet: z.boolean(), // included in GET /grants/facets counts
  display_order: z.number().int(),
  sources: z.array(z.string()), // adapters that populate it; the UI groups by this
});

export const GrantSource = z.object({
  id: z.string(),
  name: z.string(),
  adapter: z.string(), // module name under src/adapters
  config: z.record(z.string(), z.unknown()), // adapter-specific: feed URLs, query params, allowlists
  license_note: z.string().nullable(),
  enabled: z.boolean(),
  last_run_at: z.iso.datetime().nullable(),
});

export const IngestRunStats = z.object({
  fetched: z.number(),
  relevant: z.number(),
  inserted: z.number(),
  updated: z.number(),
  unchanged: z.number(),
  closed: z.number(),
  /** Records left out, by reason: unparseable, stale, relevance, duplicate. */
  rejected: z.record(z.string(), z.number()).optional(),
  /** True for --limit runs: they never sweep and never count as a missed run. */
  partial: z.boolean().optional(),
  /** Why the missing-row sweep did not run, when it did not. */
  sweep_skipped: z.string().optional(),
  llm_items: z.number().optional(),
  llm_usd: z.number().optional(),
});

export const IngestRun = z.object({
  id: z.uuid(),
  source_id: z.string(),
  started_at: z.iso.datetime(),
  finished_at: z.iso.datetime().nullable(),
  status: z.enum(RUN_STATUSES),
  stats: IngestRunStats,
  error: z.string().nullable(),
});

export type GrantStatus = z.infer<typeof GrantStatus>;
export type DeadlineType = z.infer<typeof DeadlineType>;
export type FundingType = z.infer<typeof FundingType>;
export type Curation = z.infer<typeof Curation>;
export type Geography = z.infer<typeof Geography>;
export type GrantCore = z.infer<typeof GrantCore>;
export type FieldValue = z.infer<typeof FieldValue>;
export type GrantExtras = z.infer<typeof GrantExtras>;
export type Grant = z.infer<typeof Grant>;
export type GrantFieldDef = z.infer<typeof GrantFieldDef>;
export type GrantSource = z.infer<typeof GrantSource>;
export type IngestRunStats = z.infer<typeof IngestRunStats>;
export type IngestRun = z.infer<typeof IngestRun>;

// ---------- adapter contract (worker side; types only) ----------
export type RawFetch = { external_id: string; url: string; fetched_at: string; payload: unknown };

/** What an adapter must produce: the core minus DB-derived fields, plus extras and a relevance trace. */
export type NormalizedGrant = Omit<
  Grant,
  "id" | "status" | "first_seen_at" | "last_seen_at" | "curation" | "content_hash"
> & {
  /** True when the source itself lists the item as forecasted / forthcoming; the status stays forecasted until it stops. */
  forecast?: boolean;
  relevance: { score: number; reasons: string[] };
};

/** What grants.grants.data stores: the normalized record as ingested, extras included. Core columns stay authoritative. */
export type GrantData = Omit<NormalizedGrant, "relevance">;

export interface SourceAdapter {
  readonly source: GrantSource;
  /** Extras this adapter contributes; upserted into the registry each run. */
  readonly fieldDefs: GrantFieldDef[];
  fetch(opts: { since?: string; limit?: number }): AsyncIterable<RawFetch>;
  /** null = unparseable, logged to rejects. */
  normalize(raw: RawFetch): NormalizedGrant | null;
}
