// The contract between the grants read API (workers/grant-automation/src/api)
// and the frontend (frontend/src/api/grants.ts). Both sides parse with these
// schemas, so a response the page cannot understand fails loudly on either end.
//
// Endpoints (base = VITE_GRANTS_API_URL, e.g. http://localhost:4100):
//   GET  /grants               GrantQuery as search params → GrantListResponse
//   GET  /grants/facets        same params              → GrantFacets
//   GET  /grants/field-defs                             → GrantFieldDef[] (display_order asc)
//   GET  /grants/:id                                    → GrantDetailResponse (hidden rows still resolve)
//   PATCH /grants/:id/curation CurationPatch, Authorization: Bearer <Strapi JWT>, site admin only → GrantDetailResponse
//   GET  /sources                                       → SourceSummary[]
//   GET  /healthz                                       → HealthResponse
// Errors: { error: { status, message } } with the matching HTTP status.
//
// Listing rules: rows with curation = hidden are never listed (they resolve by id);
// featured rows sort first; the default sort is `relevance` when `q` is set and
// `deadline` (nulls last) otherwise; array filters are any-of within a facet and
// all-of across facets; facet counts are computed with every other active filter
// applied, so a facet never offers an empty choice.
import { z } from "zod";
import { VALUES } from "./Common.js";
import { FUNDING_TYPES, GRANT_STATUSES, Grant, GrantFieldDef } from "./Grants.js";

export const GRANT_SORTS = ["deadline", "-deadline", "title", "-title", "-amount_max", "-first_seen_at", "relevance"] as const;
export const GrantSort = z.enum(GRANT_SORTS);
export type GrantSort = z.infer<typeof GrantSort>;

/** Statuses a listing shows when the client sends none: everything that is not closed. */
export const DEFAULT_STATUSES = ["open", "closing_soon", "rolling", "forecasted"] as const;
export const PAGE_SIZE_DEFAULT = 24;
export const PAGE_SIZE_MAX = 100;

const nonNegativeInt = z.coerce.number().int().nonnegative();
const EXTRAS_KEY = /^[a-z][a-z0-9_]*$/;

export const GrantQuery = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  status: z.array(z.enum(GRANT_STATUSES)).min(1).optional(),
  geography: z.array(z.string().min(1)).min(1).optional(),
  sdg: z.array(z.coerce.number().int().min(1).max(17)).min(1).optional(),
  value: z.array(z.enum(VALUES)).min(1).optional(),
  funding_type: z.array(z.enum(FUNDING_TYPES)).min(1).optional(),
  source: z.array(z.string().min(1)).min(1).optional(),
  amount_min: nonNegativeInt.optional(),
  amount_max: nonNegativeInt.optional(),
  deadline_before: z.iso.date().optional(),
  deadline_after: z.iso.date().optional(),
  /** Filters on registered extras keys. The API ignores keys whose field def is not filterable. */
  extras: z.record(z.string().regex(EXTRAS_KEY), z.string().min(1)).optional(),
  /** Exact ids, for the Account page. Ignores the status default so archived rows resolve. */
  ids: z.array(z.uuid()).min(1).max(PAGE_SIZE_MAX).optional(),
  sort: GrantSort.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(PAGE_SIZE_MAX).default(PAGE_SIZE_DEFAULT),
});
/** Parsed query: page and pageSize always present. */
export type GrantQuery = z.infer<typeof GrantQuery>;
/** What a caller may pass: everything optional. */
export type GrantQueryInput = z.input<typeof GrantQuery>;

const ARRAY_KEYS: ReadonlySet<string> = new Set(["status", "geography", "sdg", "value", "funding_type", "source", "ids"]);

/**
 * URLSearchParams → GrantQuery. Repeated keys form arrays (`sdg=1&sdg=16`),
 * `extras[key]=value` fills `extras`, unknown keys are ignored (so `?grant=<uuid>`
 * can share the URL) and invalid values are dropped rather than failing the page.
 */
export function grantQueryFromSearchParams(params: URLSearchParams): GrantQuery {
  const raw: Record<string, unknown> = {};
  const extras: Record<string, string> = {};
  for (const key of new Set(params.keys())) {
    const extra = /^extras\[([^\]]+)\]$/.exec(key);
    if (extra) {
      const value = params.get(key);
      if (value) extras[extra[1]!] = value;
      continue;
    }
    const values = params.getAll(key).filter((v) => v !== "");
    if (values.length === 0) continue;
    raw[key] = ARRAY_KEYS.has(key) ? values : values[values.length - 1];
  }
  if (Object.keys(extras).length > 0) raw.extras = extras;

  const first = GrantQuery.safeParse(raw);
  if (first.success) return first.data;
  const cleaned = { ...raw };
  for (const issue of first.error.issues) {
    const top = issue.path[0];
    if (typeof top === "string") delete cleaned[top];
  }
  const second = GrantQuery.safeParse(cleaned);
  return second.success ? second.data : GrantQuery.parse({});
}

/** GrantQuery → URLSearchParams, the inverse of grantQueryFromSearchParams. Empty values are skipped. */
export function grantQueryToSearchParams(query: GrantQueryInput): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value == null || value === "") continue;
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, String(item));
    } else if (typeof value === "object") {
      for (const [extraKey, extraValue] of Object.entries(value)) {
        if (extraValue) params.set(`extras[${extraKey}]`, String(extraValue));
      }
    } else {
      params.set(key, String(value));
    }
  }
  return params;
}

// ---------- responses ----------
export const GrantListMeta = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
});
export const GrantListResponse = z.object({ data: z.array(Grant), meta: GrantListMeta });
export type GrantListResponse = z.infer<typeof GrantListResponse>;

export const GrantSourceRef = z.object({ name: z.string(), last_run_at: z.iso.datetime().nullable() });
export const GrantDetailResponse = Grant.extend({ source: GrantSourceRef });
export type GrantDetailResponse = z.infer<typeof GrantDetailResponse>;

export const SourceSummary = z.object({
  id: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  last_run_at: z.iso.datetime().nullable(),
  license_note: z.string().nullable(),
});
export type SourceSummary = z.infer<typeof SourceSummary>;
export const SourcesResponse = z.array(SourceSummary);
export const FieldDefsResponse = z.array(GrantFieldDef);

/** value → number of matching grants. Keys are the facet values (sdgs as "1".."17", sources as source_id). */
export const FacetCounts = z.record(z.string(), z.number().int().nonnegative());
export const GrantFacets = z.object({
  total: z.number().int().nonnegative(),
  status: FacetCounts,
  geographies: FacetCounts,
  sdgs: FacetCounts,
  values: FacetCounts,
  funding_types: FacetCounts,
  sources: FacetCounts,
  /** Rows closing within 30 days under the current filters. */
  closing_soon: z.number().int().nonnegative(),
  amount: z.object({ min: z.number().nullable(), max: z.number().nullable() }),
});
export type GrantFacets = z.infer<typeof GrantFacets>;

export const CURATION_PATCH_VALUES = ["auto", "hidden", "featured"] as const;
export const CurationPatch = z.object({ curation: z.enum(CURATION_PATCH_VALUES) });
export type CurationPatch = z.infer<typeof CurationPatch>;

export const HealthResponse = z.object({
  ok: z.boolean(),
  db: z.boolean(),
  last_ingest_at: z.iso.datetime().nullable(),
});
export type HealthResponse = z.infer<typeof HealthResponse>;

export const ApiErrorResponse = z.object({ error: z.object({ status: z.number().int(), message: z.string() }) });
export type ApiErrorResponse = z.infer<typeof ApiErrorResponse>;
