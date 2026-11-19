import { and, eq, inArray, sql, type SQL } from "drizzle-orm";
import type { GrantFieldDef, NormalizedGrant, RawFetch } from "../../../../shared/types/Grants.js";
import type { Db } from "../db/client.js";
import { normalizedToRow } from "../db/rows.js";
import { grantFieldDefs, grantRaw, grants } from "../db/schema.js";
import { payloadHash } from "./hash.js";

export type UpsertItem = { raw: RawFetch; grant: NormalizedGrant };
export type UpsertCounts = { inserted: number; updated: number; unchanged: number };

/** Columns rewritten when the content hash changes. id, first_seen_at and curation are never touched. */
const REFRESHED = [
  "title",
  "funder",
  "summary",
  "url",
  "apply_url",
  "funding_type",
  "amount_min",
  "amount_max",
  "currency",
  "deadline",
  "deadline_type",
  "opens_at",
  "status",
  "posted_at",
  "last_verified_at",
  "geographies",
  "sdgs",
  "values",
  "tags",
  "data",
  "content_hash",
  "schema_version",
] as const;

const refreshedFromExcluded = Object.fromEntries(REFRESHED.map((column) => [column, sql.raw(`excluded."${column}"`)])) as Record<
  (typeof REFRESHED)[number],
  SQL
>;

/**
 * One transaction per batch (≤ 100 rows): raw payloads, then the grants upsert
 * keyed on (source_id, external_id), then last_seen_at for everything seen,
 * then the field-def registry (which only ever grows).
 */
export async function upsertBatch(
  db: Db,
  runId: string,
  sourceId: string,
  fieldDefs: GrantFieldDef[],
  items: UpsertItem[],
): Promise<UpsertCounts> {
  if (items.length === 0) return { inserted: 0, updated: 0, unchanged: 0 };
  const rows = items.map(({ grant }) => normalizedToRow(grant));

  return db.transaction(async (tx) => {
    await tx
      .insert(grantRaw)
      .values(
        items.map(({ raw }) => ({
          source_id: sourceId,
          external_id: raw.external_id,
          run_id: runId,
          fetched_at: new Date(raw.fetched_at),
          payload: raw.payload,
          content_hash: payloadHash(raw.payload),
        })),
      )
      .onConflictDoNothing();

    // Rows whose content did not change are not returned (setWhere false), so
    // returned rows split into inserted (xmax = 0) and updated.
    const written = await tx
      .insert(grants)
      .values(rows)
      .onConflictDoUpdate({
        target: [grants.source_id, grants.external_id],
        set: { ...refreshedFromExcluded, last_seen_at: sql`now()` },
        setWhere: sql`${grants.content_hash} is distinct from excluded.content_hash`,
      })
      .returning({ inserted: sql<boolean>`(xmax = 0)` });
    const inserted = written.filter((w) => w.inserted).length;

    await tx
      .update(grants)
      .set({ last_seen_at: sql`now()` })
      .where(
        and(
          eq(grants.source_id, sourceId),
          inArray(
            grants.external_id,
            rows.map((r) => r.external_id),
          ),
        ),
      );

    if (fieldDefs.length > 0) {
      await tx
        .insert(grantFieldDefs)
        .values(fieldDefs.map((def) => ({ ...def, options: def.options ?? null })))
        .onConflictDoUpdate({
          target: grantFieldDefs.key,
          set: {
            label: sql`excluded.label`,
            type: sql`excluded.type`,
            options: sql`excluded.options`,
            filterable: sql`excluded.filterable`,
            facet: sql`excluded.facet`,
            display_order: sql`excluded.display_order`,
            sources: sql`(select array_agg(distinct s order by s) from unnest(${grantFieldDefs.sources} || excluded.sources) as s)`,
          },
        });
    }

    return { inserted, updated: written.length - inserted, unchanged: items.length - written.length };
  });
}
