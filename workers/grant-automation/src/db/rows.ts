import type { Grant, GrantData, NormalizedGrant } from "../../../../shared/types/Grants.js";
import { Grant as GrantSchema } from "../../../../shared/types/Grants.js";
import { contentHash } from "../pipeline/hash.js";
import { deriveStatus, todayISO } from "../pipeline/status.js";
import type { grants } from "./schema.js";

export type GrantRow = typeof grants.$inferInsert;
export type GrantSelect = typeof grants.$inferSelect;

/** A validated Grant → an insertable grants.grants row. Timestamps become Dates; the whole record lands in `data`. */
export function grantToRow(grant: Grant): GrantRow {
  const { extras, posted_at, first_seen_at, last_seen_at, last_verified_at, ...core } = grant;
  void extras; // lives inside `data`, not in a column
  return {
    ...core,
    posted_at: posted_at ? new Date(posted_at) : null,
    first_seen_at: new Date(first_seen_at),
    last_seen_at: new Date(last_seen_at),
    last_verified_at: new Date(last_verified_at),
    data: grant,
  };
}

/** What an adapter produced → an insertable row. Status is derived; id, first_seen_at and curation come from the database. */
export function normalizedToRow(grant: NormalizedGrant, today = todayISO()): GrantRow {
  const { relevance, extras, forecast, posted_at, last_verified_at, ...core } = grant;
  void relevance;
  // `forecast` has no column; the sweep reads it back from `data`.
  const data: GrantData = { ...core, posted_at, last_verified_at, extras, ...(forecast ? { forecast } : {}) };
  return {
    ...core,
    status: deriveStatus({ ...core, forecast }, today),
    posted_at: posted_at ? new Date(posted_at) : null,
    last_verified_at: new Date(last_verified_at),
    data,
    content_hash: contentHash(grant),
  };
}

/** A row → the Grant the API returns. Columns are authoritative; only `extras` is read from `data`. */
export function rowToGrant(row: GrantSelect): Grant {
  const { data, search, posted_at, first_seen_at, last_seen_at, last_verified_at, ...core } = row;
  void search;
  return GrantSchema.parse({
    ...core,
    posted_at: posted_at?.toISOString() ?? null,
    first_seen_at: first_seen_at.toISOString(),
    last_seen_at: last_seen_at.toISOString(),
    last_verified_at: last_verified_at.toISOString(),
    extras: data.extras,
  });
}
