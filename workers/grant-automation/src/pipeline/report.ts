// What a run leaves behind for people: one summary line per source in the pm2
// log, and rejects/<source>.jsonl, the list the research module reads when it
// tunes data/relevance.json. (The ingest_runs row is written by ingest.ts.)
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { IngestRunStats } from "../../../../shared/types/Grants.js";

export const REJECT_REASONS = ["unparseable", "stale", "relevance", "duplicate"] as const;
export type RejectReason = (typeof REJECT_REASONS)[number];

export type Reject = {
  source_id: string;
  external_id: string;
  url: string;
  reason: RejectReason;
  /** Human-readable: the passed deadline, the row it duplicates, … */
  detail: string;
  title?: string;
  score?: number;
  reasons?: string[];
};

/** Default folder, next to data/. Gitignored. */
export const REJECTS_DIR = new URL("../../rejects/", import.meta.url).pathname;

/**
 * Rewrites <dir>/<source>.jsonl with this run's rejects, one JSON object per
 * line. Stale records are counted in the run stats but not listed: there are
 * hundreds every night and none of them is a tuning decision.
 */
export async function writeRejects(dir: string, sourceId: string, rejects: Reject[]): Promise<string> {
  await mkdir(dir, { recursive: true });
  const file = join(dir, `${sourceId}.jsonl`);
  const lines = rejects.filter((reject) => reject.reason !== "stale").map((reject) => JSON.stringify(reject));
  await writeFile(file, lines.length > 0 ? `${lines.join("\n")}\n` : "");
  return file;
}

export function summaryLine(sourceId: string, stats: IngestRunStats, dryRun: boolean): string {
  const rejected = Object.entries(stats.rejected ?? {})
    .filter(([, count]) => count > 0)
    .map(([reason, count]) => `${count} ${reason}`)
    .join(", ");
  const written = dryRun
    ? "dry run, nothing written"
    : `inserted ${stats.inserted}, updated ${stats.updated}, unchanged ${stats.unchanged}, closed ${stats.closed}`;
  return (
    `${sourceId}: fetched ${stats.fetched}, kept ${stats.relevant}` +
    (rejected ? `, rejected ${rejected}` : "") +
    `; ${written}` +
    (stats.partial ? " (partial run, no sweep)" : "") +
    (stats.sweep_skipped ? `; sweep: ${stats.sweep_skipped}` : "")
  );
}
