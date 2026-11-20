// Needs the migrated local database. `npm run test:db`.
// The gates, the sweep and runAll, driven by an in-memory adapter.
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { NormalizedGrant, SourceAdapter } from "../../../shared/types/Grants.js";
import { createDb } from "../src/db/client.js";
import { env } from "../src/env.js";
import { runAll, runIngest } from "../src/pipeline/ingest.js";
import { addDays, todayISO } from "../src/pipeline/status.js";
import { SWEEP_MISSED_RUNS, sweep } from "../src/pipeline/sweep.js";

const TODAY = todayISO();
const SOURCES = ["missing", "partial", "guard", "dates", "forecast", "gates", "gates-other", "all-fails", "all-ok"].map((name) => `test-sweep-${name}`);
const source = (name: string) => `test-sweep-${name}`;
const worker = createDb(env.DATABASE_URL);
const owner = createDb(env.DATABASE_OWNER_URL);

async function removeSource(id: string) {
  await owner.execute(sql`delete from grants.grant_raw where source_id = ${id}`);
  await owner.execute(sql`delete from grants.grants where source_id = ${id}`);
  await owner.execute(sql`delete from grants.ingest_runs where source_id = ${id}`);
  await owner.execute(sql`delete from grants.grant_sources where id = ${id}`);
}
const removeAll = async () => {
  for (const id of SOURCES) await removeSource(id);
};

let rejectsDir: string;
beforeAll(async () => {
  await removeAll();
  rejectsDir = await mkdtemp(join(tmpdir(), "grant-rejects-"));
});
afterAll(async () => {
  await removeAll();
  await rm(rejectsDir, { recursive: true, force: true });
  await Promise.all([worker.$client.end(), owner.$client.end()]);
});

const grant = (sourceId: string, id: string, overrides: Partial<NormalizedGrant> = {}): NormalizedGrant => ({
  source_id: sourceId,
  external_id: id,
  title: `Sweep test ${sourceId} ${id}`,
  funder: "Test funder",
  summary: "",
  url: `https://example.test/${sourceId}/${id}`,
  apply_url: null,
  funding_type: "grant",
  amount_min: null,
  amount_max: null,
  currency: "USD",
  deadline: addDays(TODAY, 90),
  deadline_type: "fixed",
  opens_at: null,
  posted_at: null,
  last_verified_at: new Date().toISOString(),
  geographies: [],
  sdgs: [],
  values: [],
  tags: [],
  schema_version: 1,
  extras: {},
  relevance: { score: 10, reasons: ["test"] },
  ...overrides,
});

/** An adapter that returns exactly the given records. A record titled "unparseable" normalizes to null. */
function memoryAdapter(sourceId: string, grants: NormalizedGrant[], fail?: string): SourceAdapter {
  return {
    source: { id: sourceId, name: sourceId, adapter: "memory", config: {}, license_note: "test data", enabled: true, last_run_at: null },
    fieldDefs: [],
    async *fetch({ limit } = {}) {
      if (fail) throw new Error(fail);
      for (const item of grants.slice(0, limit)) {
        yield { external_id: item.external_id, url: item.url, fetched_at: new Date().toISOString(), payload: item };
      }
    },
    normalize: (raw) => ((raw.payload as NormalizedGrant).title === "unparseable" ? null : (raw.payload as NormalizedGrant)),
  };
}

async function statuses(sourceId: string): Promise<Record<string, string>> {
  const result = await worker.execute<{ external_id: string; status: string }>(
    sql`select external_id, status from grants.grants where source_id = ${sourceId} order by external_id`,
  );
  return Object.fromEntries(result.rows.map((row) => [row.external_id, row.status]));
}

describe("sweep: rows the source stops listing", () => {
  it(`closes a row on the ${SWEEP_MISSED_RUNS}rd full run that misses it, and reopens it when it comes back`, async () => {
    const id = source("missing");
    const [a, b, c] = ["a", "b", "c"].map((name) => grant(id, name));
    const run = (grants: NormalizedGrant[]) => runIngest(worker, memoryAdapter(id, grants));

    await run([a!, b!, c!]);
    expect(await statuses(id)).toEqual({ a: "open", b: "open", c: "open" });

    expect((await run([b!, c!])).stats.closed).toBe(0); // missed once
    expect((await run([b!, c!])).stats.closed).toBe(0); // missed twice
    expect((await statuses(id)).a).toBe("open");

    const third = await run([b!, c!]);
    expect(third.stats.closed).toBe(1);
    expect(await statuses(id)).toEqual({ a: "closed", b: "open", c: "open" });

    expect((await run([b!, c!])).stats.closed).toBe(0); // already closed: not counted again
    const back = await run([a!, b!, c!]);
    expect(back.stats).toMatchObject({ unchanged: 3, closed: 0 });
    expect((await statuses(id)).a).toBe("open");
  });

  it("partial (--limit) runs neither sweep nor count as a missed run", async () => {
    const id = source("partial");
    const [a, b] = ["a", "b"].map((name) => grant(id, name));
    await runIngest(worker, memoryAdapter(id, [b!, a!]));
    for (let i = 0; i < SWEEP_MISSED_RUNS + 1; i += 1) {
      const result = await runIngest(worker, memoryAdapter(id, [b!, a!]), { limit: 1 });
      expect(result.stats).toMatchObject({ fetched: 1, partial: true, closed: 0 });
    }
    expect(await statuses(id)).toEqual({ a: "open", b: "open" });
    const stored = await worker.execute<{ partial: boolean }>(
      sql`select (stats->>'partial')::boolean as partial from grants.ingest_runs where source_id = ${id} order by started_at desc limit 1`,
    );
    expect(stored.rows[0]?.partial).toBe(true);
  });

  it("refuses to close anything when fewer than 20% of the known rows were fetched", async () => {
    const id = source("guard");
    const all = Array.from({ length: 10 }, (_, i) => grant(id, `g${i}`));
    await runIngest(worker, memoryAdapter(id, all));

    // A broken fetch: one row of ten, run after run.
    for (let i = 0; i < SWEEP_MISSED_RUNS + 1; i += 1) {
      const result = await runIngest(worker, memoryAdapter(id, all.slice(0, 1)));
      expect(result.stats.closed).toBe(0);
      expect(result.stats.sweep_skipped).toMatch(/only 1 of 10 known rows were fetched \(under 20%\)/);
    }
    expect(Object.values(await statuses(id)).every((status) => status === "open")).toBe(true);

    // Two of ten is not under 20%: the eight rows missing for long enough are closed.
    const result = await runIngest(worker, memoryAdapter(id, all.slice(0, 2)));
    expect(result.stats.sweep_skipped).toBeUndefined();
    expect(result.stats.closed).toBe(8);
    expect(Object.values(await statuses(id)).filter((status) => status === "closed")).toHaveLength(8);
  });
});

describe("sweep: statuses follow the calendar", () => {
  it("moves an unchanged row to closing_soon and then closed as the deadline approaches and passes", async () => {
    const id = source("dates");
    const { runId } = await runIngest(worker, memoryAdapter(id, [grant(id, "a", { deadline: addDays(TODAY, 40) }), grant(id, "b", { deadline: null, deadline_type: "rolling" })]));
    expect(await statuses(id)).toEqual({ a: "open", b: "rolling" });

    expect(await sweep(worker, id, runId!, addDays(TODAY, 15))).toEqual({ closed: 0, changed: 1 });
    expect(await statuses(id)).toEqual({ a: "closing_soon", b: "rolling" });

    expect(await sweep(worker, id, runId!, addDays(TODAY, 41))).toEqual({ closed: 1, changed: 1 });
    expect(await statuses(id)).toEqual({ a: "closed", b: "rolling" });
  });

  it("keeps a row forecasted while the source says so, whatever its dates; opens it when the flag goes", async () => {
    const id = source("forecast");
    const overdue = { opens_at: addDays(TODAY, -10), deadline: addDays(TODAY, 60) };
    const { runId } = await runIngest(worker, memoryAdapter(id, [grant(id, "a", { ...overdue, forecast: true })]));
    expect(await statuses(id)).toEqual({ a: "forecasted" });
    await sweep(worker, id, runId!);
    expect(await statuses(id)).toEqual({ a: "forecasted" });

    const posted = await runIngest(worker, memoryAdapter(id, [grant(id, "a", overdue)]));
    expect(posted.stats).toMatchObject({ updated: 1 });
    expect(await statuses(id)).toEqual({ a: "open" });
  });
});

describe("gates", () => {
  const id = source("gates");
  const other = source("gates-other");
  const records = () => [
    grant(id, "keep"),
    grant(id, "low", { relevance: { score: 2, reasons: ["+2 civil society"] } }),
    grant(id, "passed", { deadline: addDays(TODAY, -1) }),
    grant(id, "undated-old", { deadline: null, deadline_type: "rolling", posted_at: `${addDays(TODAY, -800)}T12:00:00.000Z` }),
    grant(id, "broken", { title: "unparseable" }),
    grant(id, "twin", { url: `https://www.example.test/${other}/original/?utm_source=feed` }),
  ];
  const gates = () => ({ threshold: 4, dropStale: true, dedupe: true, rejectsDir });

  it("a dry run counts every reason and writes nothing to the database", async () => {
    await runIngest(worker, memoryAdapter(other, [grant(other, "original")]));
    const result = await runIngest(worker, memoryAdapter(id, records()), { ...gates(), dryRun: true });
    expect(result.runId).toBeNull();
    expect(result.rejected).toBe(5);
    expect(result.stats).toMatchObject({
      fetched: 6,
      relevant: 1,
      inserted: 0,
      rejected: { unparseable: 1, stale: 2, relevance: 1, duplicate: 1 },
    });
    expect(await statuses(id)).toEqual({});
  });

  it("a real run keeps the one good record, stores the counts, and lists the tuning rejects in <source>.jsonl", async () => {
    const result = await runIngest(worker, memoryAdapter(id, records()), gates());
    expect(result.stats).toMatchObject({ fetched: 6, relevant: 1, inserted: 1 });
    expect(await statuses(id)).toEqual({ keep: "open" });

    const stored = await worker.execute<{ stats: { rejected: Record<string, number> } }>(
      sql`select stats from grants.ingest_runs where id = ${result.runId}`,
    );
    expect(stored.rows[0]?.stats.rejected).toEqual({ unparseable: 1, stale: 2, relevance: 1, duplicate: 1 });

    const lines = (await readFile(join(rejectsDir, `${id}.jsonl`), "utf8")).trim().split("\n").map((line) => JSON.parse(line));
    expect(lines.map((line) => [line.external_id, line.reason])).toEqual([
      ["low", "relevance"],
      ["broken", "unparseable"],
      ["twin", "duplicate"],
    ]); // stale records are counted, not listed
    expect(lines[0]).toMatchObject({ source_id: id, score: 2, reasons: ["+2 civil society"], detail: "score 2 is under the threshold of 4" });
    expect(lines[2].detail).toBe(`same call as ${other}/original`);
  });

  it("without options every parseable record is kept (curated entries, the sample seeder)", async () => {
    const result = await runIngest(worker, memoryAdapter(id, records()), { dryRun: true });
    expect(result.stats).toMatchObject({ fetched: 6, relevant: 5, rejected: { unparseable: 1, stale: 0, relevance: 0, duplicate: 0 } });
  });
});

describe("runAll", () => {
  it("records a failing source and still runs the next one", async () => {
    const failing = source("all-fails");
    const fine = source("all-ok");
    const lines: string[] = [];
    const outcomes = await runAll(
      worker,
      [memoryAdapter(failing, [], "upstream is down"), memoryAdapter(fine, [grant(fine, "a")])],
      () => ({ log: (line) => lines.push(line) }),
    );
    expect(outcomes).toEqual([
      { source_id: failing, error: "upstream is down" },
      { source_id: fine, result: expect.objectContaining({ stats: expect.objectContaining({ inserted: 1 }) }) },
    ]);
    expect(lines).toContain(`${failing}: FAILED: upstream is down`);

    const run = await worker.execute<{ status: string; error: string | null }>(
      sql`select status, error from grants.ingest_runs where source_id = ${failing}`,
    );
    expect(run.rows).toEqual([{ status: "failed", error: "upstream is down" }]);
    expect(await statuses(fine)).toEqual({ a: "open" });
  });
});
