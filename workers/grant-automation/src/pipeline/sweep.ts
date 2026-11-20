// The sweep runs at the end of every full ingest of a source and is the only
// thing, besides the hidden flag, that takes a row out of the listing:
//   - statuses are re-derived from today's date (open → closing_soon → closed);
//   - a row the source stopped listing for SWEEP_MISSED_RUNS full runs is closed.
import { and, eq, inArray, ne, sql } from "drizzle-orm";
import type { DeadlineType, GrantStatus } from "../../../../shared/types/Grants.js";
import type { Db } from "../db/client.js";
import { grants, ingestRuns } from "../db/schema.js";
import { deriveStatus, todayISO } from "./status.js";

/** A row is closed once this many full runs in a row (the current one included) did not return it. */
export const SWEEP_MISSED_RUNS = 3;
/** Below this share of known live rows, the fetch is treated as broken and nothing is closed for being missing. */
export const SWEEP_MIN_SEEN_RATIO = 0.2;

export type SweepResult = {
  /** Rows that moved to closed. */
  closed: number;
  /** Rows whose status changed at all. */
  changed: number;
  /** Set when the missing-row rule was not applied. */
  skipped?: string;
};

const CHUNK = 500;

export async function sweep(db: Db, sourceId: string, runId: string, today = todayISO()): Promise<SweepResult> {
  // Timestamps are compared inside Postgres: JavaScript dates drop the microseconds.
  const runStart = sql`(select r.started_at from ${ingestRuns} r where r.id = ${runId})`;
  // Start of the oldest of the last SWEEP_MISSED_RUNS full runs. Partial (--limit)
  // and failed runs never count as a run that missed a row.
  const missedSince = sql`(
    select r.started_at from ${ingestRuns} r
    where r.source_id = ${sourceId} and r.status = 'ok' and r.id <> ${runId}
      and coalesce((r.stats->>'partial')::boolean, false) = false
    order by r.started_at desc offset ${SWEEP_MISSED_RUNS - 2} limit 1)`;

  const rows = await db
    .select({
      id: grants.id,
      status: grants.status,
      opens_at: grants.opens_at,
      deadline: grants.deadline,
      deadline_type: grants.deadline_type,
      forecast: sql<boolean>`coalesce((${grants.data}->>'forecast')::boolean, false)`,
      seenNow: sql<boolean>`${grants.last_seen_at} >= ${runStart}`,
      missing: sql<boolean>`coalesce(${grants.last_seen_at} < ${missedSince}, false)`,
    })
    .from(grants)
    .where(and(eq(grants.source_id, sourceId), ne(grants.status, "archived")));

  let skipped: string | undefined;
  const live = rows.filter((row) => row.status !== "closed");
  const seen = live.filter((row) => row.seenNow).length;
  if (live.length > 0 && seen / live.length < SWEEP_MIN_SEEN_RATIO) {
    skipped = `only ${seen} of ${live.length} known rows were fetched (under ${SWEEP_MIN_SEEN_RATIO * 100}%), so no row was closed for being missing`;
  }

  const moves = new Map<GrantStatus, string[]>();
  let closed = 0;
  for (const row of rows) {
    // A closed row the source did not return stays closed: only being seen again reopens it.
    if (row.status === "closed" && !row.seenNow) continue;
    const next =
      row.missing && !skipped ? "closed" : deriveStatus({ ...row, deadline_type: row.deadline_type as DeadlineType }, today);
    if (next === row.status) continue;
    if (next === "closed") closed += 1;
    moves.set(next, [...(moves.get(next) ?? []), row.id]);
  }

  let changed = 0;
  for (const [status, ids] of moves) {
    for (let start = 0; start < ids.length; start += CHUNK) {
      await db
        .update(grants)
        .set({ status })
        .where(inArray(grants.id, ids.slice(start, start + CHUNK)));
    }
    changed += ids.length;
  }
  return { closed, changed, ...(skipped ? { skipped } : {}) };
}
