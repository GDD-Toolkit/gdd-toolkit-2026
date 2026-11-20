// Local development only: loads six sample grants under the source "sample"
// so the page has something to show before the first real ingest.
//   npm run seed:sample            insert / refresh them
//   npm run seed:sample -- --clean remove them again (uses DATABASE_OWNER_URL)
import { sql } from "drizzle-orm";
import { createCuratedAdapter } from "../src/adapters/curated.js";
import { createDb } from "../src/db/client.js";
import { SAMPLE_SOURCE_ID, sampleEntries } from "../src/dev/sample-entries.js";
import { env } from "../src/env.js";
import { runIngest } from "../src/pipeline/ingest.js";

if (process.argv.includes("--clean")) {
  const owner = createDb(env.DATABASE_OWNER_URL);
  try {
    await owner.execute(sql`delete from grants.curation_log where grant_id in (select id from grants.grants where source_id = ${SAMPLE_SOURCE_ID})`);
    await owner.execute(sql`delete from grants.grant_raw where source_id = ${SAMPLE_SOURCE_ID}`);
    await owner.execute(sql`delete from grants.grants where source_id = ${SAMPLE_SOURCE_ID}`);
    await owner.execute(sql`delete from grants.ingest_runs where source_id = ${SAMPLE_SOURCE_ID}`);
    await owner.execute(sql`delete from grants.grant_sources where id = ${SAMPLE_SOURCE_ID}`);
    console.log("sample data removed");
  } finally {
    await owner.$client.end();
  }
} else {
  const worker = createDb(env.DATABASE_URL);
  try {
    const adapter = createCuratedAdapter({ sourceId: SAMPLE_SOURCE_ID, name: "Sample data (local only)", entries: sampleEntries() });
    const result = await runIngest(worker, adapter, { log: (line) => console.log(line) });
    console.log(JSON.stringify(result.stats));
  } finally {
    await worker.$client.end();
  }
}
