// Needs the migrated local database. `npm run test:db`.
import { sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createCuratedAdapter } from "../src/adapters/curated.js";
import { createDb } from "../src/db/client.js";
import { sampleEntries } from "../src/dev/sample-entries.js";
import { env } from "../src/env.js";
import { runIngest } from "../src/pipeline/ingest.js";

const SOURCE = "test-ingest";
const worker = createDb(env.DATABASE_URL);
const owner = createDb(env.DATABASE_OWNER_URL);

async function removeSource(id: string) {
  await owner.execute(sql`delete from grants.curation_log where grant_id in (select id from grants.grants where source_id = ${id})`);
  await owner.execute(sql`delete from grants.grant_raw where source_id = ${id}`);
  await owner.execute(sql`delete from grants.grants where source_id = ${id}`);
  await owner.execute(sql`delete from grants.ingest_runs where source_id = ${id}`);
  await owner.execute(sql`delete from grants.grant_sources where id = ${id}`);
}

beforeAll(async () => {
  await removeSource(SOURCE);
  await removeSource(`${SOURCE}-dry`);
});
afterAll(async () => {
  await removeSource(SOURCE);
  await removeSource(`${SOURCE}-dry`);
  await Promise.all([worker.$client.end(), owner.$client.end()]);
});

describe("runIngest (curated adapter)", () => {
  it("inserts, then reports unchanged, then updates only what changed; ids stay stable", async () => {
    const entries = sampleEntries();
    const first = await runIngest(worker, createCuratedAdapter({ sourceId: SOURCE, entries }));
    expect(first.runId).toBeTruthy();
    expect(first.stats).toMatchObject({ fetched: 6, relevant: 6, inserted: 6, updated: 0, unchanged: 0 });

    const idsBefore = await worker.execute<{ external_id: string; id: string; status: string }>(
      sql`select external_id, id, status from grants.grants where source_id = ${SOURCE} order by external_id`,
    );
    expect(new Set(idsBefore.rows.map((r) => r.status))).toEqual(new Set(["open", "closing_soon", "forecasted", "rolling", "closed"]));

    const second = await runIngest(worker, createCuratedAdapter({ sourceId: SOURCE, entries }));
    expect(second.stats).toMatchObject({ inserted: 0, updated: 0, unchanged: 6 });

    const revised = entries.map((e, i) => (i === 0 ? { ...e, title: `${e.title} (revised)` } : e));
    const third = await runIngest(worker, createCuratedAdapter({ sourceId: SOURCE, entries: revised }));
    expect(third.stats).toMatchObject({ inserted: 0, updated: 1, unchanged: 5 });

    const after = await worker.execute<{ external_id: string; id: string; title: string }>(
      sql`select external_id, id, title from grants.grants where source_id = ${SOURCE} order by external_id`,
    );
    expect(after.rows.map((r) => r.id)).toEqual(idsBefore.rows.map((r) => r.id));
    expect(after.rows.find((r) => r.external_id === "gpsa-call-2027")?.title).toMatch(/\(revised\)$/);

    const raw = await worker.execute<{ n: number }>(sql`select count(*)::int as n from grants.grant_raw where source_id = ${SOURCE}`);
    expect(raw.rows[0]?.n).toBe(7); // six payloads plus the one that changed

    const runs = await worker.execute<{ status: string; stats: { inserted: number } }>(
      sql`select status, stats from grants.ingest_runs where source_id = ${SOURCE} order by started_at`,
    );
    expect(runs.rows.map((r) => r.status)).toEqual(["ok", "ok", "ok"]);
    expect(runs.rows[0]?.stats.inserted).toBe(6);

    const defs = await worker.execute<{ sources: string[] }>(sql`select sources from grants.grant_field_defs where key = 'funder_type'`);
    expect(defs.rows[0]?.sources).toContain(SOURCE);

    const source = await worker.execute<{ last_run_at: string | null }>(sql`select last_run_at from grants.grant_sources where id = ${SOURCE}`);
    expect(source.rows[0]?.last_run_at).toMatch(/^\d{4}-\d{2}-\d{2} /);
  });

  it("dry run writes nothing", async () => {
    const result = await runIngest(worker, createCuratedAdapter({ sourceId: `${SOURCE}-dry`, entries: sampleEntries() }), { dryRun: true });
    expect(result.runId).toBeNull();
    expect(result.stats).toMatchObject({ fetched: 6, relevant: 6, inserted: 0 });
    const rows = await worker.execute<{ n: number }>(sql`select count(*)::int as n from grants.grant_sources where id = ${`${SOURCE}-dry`}`);
    expect(rows.rows[0]?.n).toBe(0);
  });

  it("skips a source disabled in grant_sources", async () => {
    await owner.execute(sql`update grants.grant_sources set enabled = false where id = ${SOURCE}`);
    try {
      const result = await runIngest(worker, createCuratedAdapter({ sourceId: SOURCE, entries: sampleEntries() }));
      expect(result.skipped).toBe("disabled");
      expect(result.stats.fetched).toBe(0);
    } finally {
      await owner.execute(sql`update grants.grant_sources set enabled = true where id = ${SOURCE}`);
    }
  });

  it("counts malformed entries as rejected without failing the run", async () => {
    const result = await runIngest(worker, createCuratedAdapter({ sourceId: SOURCE, entries: [sampleEntries()[0], { title: "broken" }] }));
    expect(result.rejected).toBe(1);
    expect(result.stats).toMatchObject({ fetched: 2, relevant: 1 });
  });
});
