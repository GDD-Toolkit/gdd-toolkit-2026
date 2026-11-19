// Calls the real APIs: `npm run test:live`. Not part of `npm test`.
// Run it when an adapter starts failing or before changing one: it tells an
// upstream change (this fails) from a bug of ours (the fixture tests fail).
import { describe, expect, it } from "vitest";
import { EU_FT_API_VERSION, createEuFtAdapter } from "../src/adapters/eu-ft.js";
import { createGrantsGovAdapter } from "../src/adapters/grants-gov.js";
import { loadSources } from "../src/adapters/index.js";
import { loadRelevance } from "../src/pipeline/relevance.js";
import { NormalizedGrantSchema, collect } from "./helpers.js";

const sources = loadSources();
const relevance = loadRelevance();
const seed = (id: string) => sources.find((source) => source.id === id)!;

describe("live contract", () => {
  it("Grants.gov: search2 and fetchOpportunity still return records the adapter can read", async () => {
    const adapter = createGrantsGovAdapter(seed("grants-gov"), relevance);
    const raws = await collect(adapter, { limit: 5 });
    expect(raws).toHaveLength(5);
    for (const raw of raws) expect(() => NormalizedGrantSchema.parse(adapter.normalize(raw)), raw.url).not.toThrow();
  }, 120_000);

  it("EU Funding & Tenders: the search API still returns records the adapter can read, at the verified version", async () => {
    let apiVersion: unknown;
    const recording: typeof fetch = async (input, init) => {
      const response = await fetch(input, init);
      apiVersion = ((await response.clone().json()) as { apiVersion?: unknown }).apiVersion;
      return response;
    };
    const adapter = createEuFtAdapter(seed("eu-ft"), relevance, recording);
    const raws = await collect(adapter, { limit: 100 });
    expect(raws).toHaveLength(100);
    for (const raw of raws) expect(() => NormalizedGrantSchema.parse(adapter.normalize(raw)), raw.external_id).not.toThrow();
    // A new version is not a failure of ours, but it is the moment to re-read the response shape.
    expect(apiVersion).toBe(EU_FT_API_VERSION);
  }, 120_000);
});
