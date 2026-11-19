import { readFileSync } from "node:fs";
import { z } from "zod";
import { GrantFieldDef } from "../../../../shared/types/Grants.js";

const FILE = new URL("../../data/field-defs.json", import.meta.url);

/**
 * The extras an adapter populates. data/field-defs.json is the one registry
 * (a key shared by several adapters is defined once); `sources` there names
 * adapters, and the rows returned here carry the source id the adapter runs as.
 */
export function fieldDefsFor(adapter: string, sourceId = adapter): GrantFieldDef[] {
  return z
    .array(GrantFieldDef)
    .parse(JSON.parse(readFileSync(FILE, "utf8")))
    .filter((def) => def.sources.includes(adapter))
    .map((def) => ({ ...def, sources: [sourceId] }));
}
