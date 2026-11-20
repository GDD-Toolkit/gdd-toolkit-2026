import { eq, sql } from "drizzle-orm";
import type { IngestRunStats, NormalizedGrant, RawFetch, SourceAdapter } from "../../../../shared/types/Grants.js";
import type { Db } from "../db/client.js";
import { grantSources, ingestRuns } from "../db/schema.js";
import { loadDedupeIndex } from "./dedupe.js";
import { staleReason } from "./relevance.js";
import { summaryLine, writeRejects, type Reject, type RejectReason } from "./report.js";
import { todayISO } from "./status.js";
import { sweep } from "./sweep.js";
import { upsertBatch, type UpsertItem } from "./upsert.js";

export type IngestOptions = {
  /** Fetch and normalize, write nothing, report what would happen. */
  dryRun?: boolean;
  /** Stop after this many raw records. A limited run is partial: it never sweeps. */
  limit?: number;
  log?: (line: string) => void;
  /** Gate 2: reject records scoring below this. Omit to keep every record. */
  threshold?: number;
  /** Reject records whose deadline has passed, and undated ones posted over a year ago. */
  dropStale?: boolean;
  /** Reject records that duplicate a live row of another source. */
  dedupe?: boolean;
  /** Folder for <source>.jsonl, the rejects of this run. Omit to write no file. */
  rejectsDir?: string;
};

export type IngestResult = {
  runId: string | null;
  stats: IngestRunStats;
  /** Records fetched but not kept, all reasons together; the breakdown is stats.rejected. */
  rejected: number;
  skipped?: "disabled";
};

const BATCH = 100;

/**
 * fetch → normalize → stale / relevance / duplicate gates → upsert → sweep for
 * one adapter, recorded as one grants.ingest_runs row.
 */
export async function runIngest(db: Db, adapter: SourceAdapter, options: IngestOptions = {}): Promise<IngestResult> {
  const log = options.log ?? (() => {});
  const { source } = adapter;
  const counts: Record<RejectReason, number> = { unparseable: 0, stale: 0, relevance: 0, duplicate: 0 };
  const stats: IngestRunStats = { fetched: 0, relevant: 0, inserted: 0, updated: 0, unchanged: 0, closed: 0, rejected: counts };
  const rejects: Reject[] = [];
  const rejected = () => Object.values(counts).reduce((sum, count) => sum + count, 0);
  const reject = (reason: RejectReason, raw: RawFetch, detail: string, grant?: NormalizedGrant) => {
    counts[reason] += 1;
    rejects.push({
      source_id: source.id,
      external_id: raw.external_id,
      url: raw.url,
      reason,
      detail,
      ...(grant ? { title: grant.title, score: grant.relevance.score, reasons: grant.relevance.reasons } : {}),
    });
  };

  let runId: string | null = null;
  if (!options.dryRun) {
    const [existing] = await db.select({ enabled: grantSources.enabled }).from(grantSources).where(eq(grantSources.id, source.id));
    if (existing && !existing.enabled) {
      log(`${source.id}: disabled in grant_sources, skipping`);
      return { runId: null, stats, rejected: 0, skipped: "disabled" };
    }
    await db
      .insert(grantSources)
      .values({ id: source.id, name: source.name, adapter: source.adapter, config: source.config, license_note: source.license_note })
      .onConflictDoUpdate({
        target: grantSources.id,
        set: { name: source.name, adapter: source.adapter, config: source.config, license_note: source.license_note },
      });
    const [run] = await db.insert(ingestRuns).values({ source_id: source.id }).returning({ id: ingestRuns.id });
    runId = run!.id;
  }

  const batch: UpsertItem[] = [];
  const flush = async () => {
    if (batch.length === 0) return;
    const items = batch.splice(0);
    if (!runId) return;
    const written = await upsertBatch(db, runId, source.id, adapter.fieldDefs, items);
    stats.inserted += written.inserted;
    stats.updated += written.updated;
    stats.unchanged += written.unchanged;
  };

  try {
    const today = todayISO();
    const duplicates = options.dedupe ? await loadDedupeIndex(db, source.id) : null;

    for await (const raw of adapter.fetch({ limit: options.limit })) {
      stats.fetched += 1;
      const grant = adapter.normalize(raw);
      if (!grant) {
        reject("unparseable", raw, "the adapter could not read this record");
        log(`${source.id}: could not normalize ${raw.external_id} (${raw.url})`);
        continue;
      }
      const stale = options.dropStale ? staleReason(grant, today) : null;
      if (stale) {
        reject("stale", raw, stale, grant);
        continue;
      }
      if (options.threshold !== undefined && grant.relevance.score < options.threshold) {
        reject("relevance", raw, `score ${grant.relevance.score} is under the threshold of ${options.threshold}`, grant);
        continue;
      }
      const duplicate = duplicates?.match(grant);
      if (duplicate) {
        reject("duplicate", raw, `same call as ${duplicate.source_id}/${duplicate.external_id}`, grant);
        continue;
      }
      stats.relevant += 1;
      batch.push({ raw, grant });
      if (batch.length >= BATCH) await flush();
    }
    await flush();

    if (runId) {
      if (options.limit !== undefined) {
        stats.partial = true;
      } else {
        const swept = await sweep(db, source.id, runId, today);
        stats.closed = swept.closed;
        if (swept.skipped) stats.sweep_skipped = swept.skipped;
      }
      await db.update(ingestRuns).set({ status: "ok", finished_at: sql`now()`, stats }).where(eq(ingestRuns.id, runId));
      await db.update(grantSources).set({ last_run_at: sql`now()` }).where(eq(grantSources.id, source.id));
    }
  } catch (error) {
    if (runId) {
      await db
        .update(ingestRuns)
        .set({ status: "failed", finished_at: sql`now()`, stats, error: error instanceof Error ? error.message : String(error) })
        .where(eq(ingestRuns.id, runId));
    }
    throw error;
  }

  if (options.rejectsDir) await writeRejects(options.rejectsDir, source.id, rejects);
  log(summaryLine(source.id, stats, Boolean(options.dryRun)));
  return { runId, stats, rejected: rejected() };
}

export type SourceOutcome = { source_id: string; result?: IngestResult; error?: string };

/** Runs every adapter in turn. One source failing is recorded and the rest still run. */
export async function runAll(
  db: Db,
  adapters: SourceAdapter[],
  optionsFor: (adapter: SourceAdapter) => IngestOptions,
): Promise<SourceOutcome[]> {
  const outcomes: SourceOutcome[] = [];
  for (const adapter of adapters) {
    const options = optionsFor(adapter);
    try {
      outcomes.push({ source_id: adapter.source.id, result: await runIngest(db, adapter, options) });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      options.log?.(`${adapter.source.id}: FAILED: ${message}`);
      outcomes.push({ source_id: adapter.source.id, error: message });
    }
  }
  return outcomes;
}
