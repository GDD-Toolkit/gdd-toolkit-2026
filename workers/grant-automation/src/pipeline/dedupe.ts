// Cross-source duplicates. Within a source, (source_id, external_id) already
// makes a record unique. Across sources the same call can arrive twice (a
// curated entry for a call that a feed also lists), so an incoming record is
// checked against every other source's live rows and the first one in wins.
//
// Matching is exact on the canonical URL or on the slugged title + funder. The
// fuzzy (trigram) title match from the plan waits for P3, when the Federal
// Register adapter creates near-duplicates of Grants.gov records.
import { and, ne, notInArray } from "drizzle-orm";
import type { Db } from "../db/client.js";
import { grants } from "../db/schema.js";

const TRACKING_PARAM = /^(utm_\w+|fbclid|gclid|mc_cid|mc_eid)$/i;

/** Host without "www.", path without a trailing slash, query without tracking parameters, no scheme or fragment. */
export function canonicalUrl(url: string): string {
  if (!URL.canParse(url)) return url.trim().toLowerCase();
  const parsed = new URL(url);
  for (const key of [...parsed.searchParams.keys()]) {
    if (TRACKING_PARAM.test(key)) parsed.searchParams.delete(key);
  }
  parsed.searchParams.sort();
  const query = parsed.searchParams.toString();
  return `${parsed.host.toLowerCase().replace(/^www\./, "")}${parsed.pathname.replace(/\/+$/, "")}${query ? `?${query}` : ""}`;
}

const slug = (text: string) =>
  text
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const titleKey = (title: string, funder: string) => `${slug(title)}|${slug(funder)}`;

export type DedupeRef = { source_id: string; external_id: string };
type Candidate = { url: string; title: string; funder: string };

export type DedupeIndex = {
  /** The row an incoming record duplicates, or null. */
  match(grant: Candidate): DedupeRef | null;
};

export function buildDedupeIndex(rows: (DedupeRef & Candidate)[]): DedupeIndex {
  const byUrl = new Map<string, DedupeRef>();
  const byTitle = new Map<string, DedupeRef>();
  for (const { source_id, external_id, url, title, funder } of rows) {
    const ref = { source_id, external_id };
    if (!byUrl.has(canonicalUrl(url))) byUrl.set(canonicalUrl(url), ref);
    if (!byTitle.has(titleKey(title, funder))) byTitle.set(titleKey(title, funder), ref);
  }
  return {
    match: (grant) => byUrl.get(canonicalUrl(grant.url)) ?? byTitle.get(titleKey(grant.title, grant.funder)) ?? null,
  };
}

/** Index over the live rows of every source except `sourceId`. A few thousand rows at most, read once per run. */
export async function loadDedupeIndex(db: Db, sourceId: string): Promise<DedupeIndex> {
  const rows = await db
    .select({
      source_id: grants.source_id,
      external_id: grants.external_id,
      url: grants.url,
      title: grants.title,
      funder: grants.funder,
    })
    .from(grants)
    .where(and(ne(grants.source_id, sourceId), notInArray(grants.status, ["closed", "archived"])));
  return buildDedupeIndex(rows);
}
