import { readFileSync } from "node:fs";
import { z } from "zod";
import type { SourceAdapter } from "../../../../shared/types/Grants.js";
import type { RelevanceConfig } from "../pipeline/relevance.js";
import { createCuratedAdapter } from "./curated.js";
import { createEuFtAdapter } from "./eu-ft.js";
import { createGrantsGovAdapter } from "./grants-gov.js";

/** One row of data/sources.json: what the worker seeds into grants.grant_sources. `enabled` lives only in the database. */
export const SourceSeed = z.strictObject({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  name: z.string().min(1),
  adapter: z.string().min(1),
  config: z.record(z.string(), z.unknown()).default({}),
  /** Shown on the page as the source's attribution; required before a source can run. */
  license_note: z.string().min(1),
});
export type SourceSeed = z.infer<typeof SourceSeed>;

const SOURCES_FILE = new URL("../../data/sources.json", import.meta.url);
export const loadSources = (file: string | URL = SOURCES_FILE): SourceSeed[] =>
  z.array(SourceSeed).parse(JSON.parse(readFileSync(file, "utf8")));

/** Adapter modules by name (the `adapter` column). */
export const ADAPTERS: Record<string, (seed: SourceSeed, relevance: RelevanceConfig) => SourceAdapter> = {
  curated: (seed) =>
    createCuratedAdapter({
      sourceId: seed.id,
      name: seed.name,
      licenseNote: seed.license_note,
      file: typeof seed.config.file === "string" ? seed.config.file : undefined,
    }),
  "grants-gov": createGrantsGovAdapter,
  "eu-ft": createEuFtAdapter,
};

export function createAdapter(seed: SourceSeed, relevance: RelevanceConfig): SourceAdapter {
  const create = ADAPTERS[seed.adapter];
  if (!create) throw new Error(`data/sources.json: source "${seed.id}" names an unknown adapter "${seed.adapter}"`);
  return create(seed, relevance);
}
