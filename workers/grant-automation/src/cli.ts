// npm run ingest                                  every source in data/sources.json, one after another
// npm run ingest -- --source grants-gov           one source
//   [--dry-run]   fetch, normalize and gate; write nothing to the database
//   [--limit N]   stop after N raw records (a partial run: no sweep)
//   [--file path] curated only: read another JSON file
import { parseArgs } from "node:util";
import { createAdapter, loadSources } from "./adapters/index.js";
import { createDb } from "./db/client.js";
import { env } from "./env.js";
import { runAll } from "./pipeline/ingest.js";
import { loadRelevance } from "./pipeline/relevance.js";
import { REJECTS_DIR } from "./pipeline/report.js";

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    source: { type: "string" },
    file: { type: "string" },
    "dry-run": { type: "boolean", default: false },
    limit: { type: "string" },
  },
});

const sources = loadSources();
const wanted = values.source ? sources.filter((source) => source.id === values.source) : sources;
const limit = values.limit === undefined ? undefined : Number(values.limit);
if (positionals[0] !== "ingest" || wanted.length === 0 || (limit !== undefined && !(Number.isInteger(limit) && limit > 0))) {
  console.error(`usage: ingest [--source <${sources.map((source) => source.id).join("|")}>] [--dry-run] [--limit N] [--file path]`);
  process.exit(2);
}

const relevance = loadRelevance();
const adapters = wanted.map((seed) =>
  createAdapter(values.file && seed.adapter === "curated" ? { ...seed, config: { ...seed.config, file: values.file } } : seed, relevance),
);

const db = createDb(env.DATABASE_URL);
let failed = false;
try {
  const outcomes = await runAll(db, adapters, (adapter) => ({
    dryRun: values["dry-run"],
    limit,
    log: (line) => console.log(line),
    rejectsDir: REJECTS_DIR,
    dedupe: true,
    // Curated entries are hand-picked: they skip the relevance and stale gates.
    ...(adapter.source.adapter === "curated" ? {} : { threshold: relevance.threshold, dropStale: true }),
  }));
  failed = outcomes.some((outcome) => outcome.error);
  console.log(JSON.stringify(outcomes));
} finally {
  await db.$client.end();
}
if (failed) process.exit(1);
