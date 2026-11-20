// CI gate for the research module's pull requests: data/curated.json and
// data/field-defs.json must parse, or the PR fails here.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { GrantFieldDef } from "../../../shared/types/Grants.js";
import { CuratedEntry, CuratedFile } from "../src/adapters/curated.js";
import { sampleEntries } from "../src/dev/sample-entries.js";

const read = (file: string) => JSON.parse(readFileSync(new URL(`../data/${file}`, import.meta.url), "utf8")) as unknown;

describe("data/curated.json", () => {
  it("is a valid curated file", () => {
    expect(() => CuratedFile.parse(read("curated.json"))).not.toThrow();
  });

  it("has unique external ids", () => {
    const ids = CuratedFile.parse(read("curated.json")).map((e) => e.external_id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("curated entry schema", () => {
  it("accepts the sample entries", () => {
    expect(CuratedFile.parse(sampleEntries("2026-11-03"))).toHaveLength(6);
  });

  it("rejects what the page could not render", () => {
    const base = sampleEntries("2026-11-03")[0]!;
    expect(CuratedEntry.safeParse({ ...base, bogus: 1 }).success).toBe(false);
    expect(CuratedEntry.safeParse({ ...base, url: "thegpsa.org" }).success).toBe(false);
    expect(CuratedEntry.safeParse({ ...base, deadline: "03/31/2027" }).success).toBe(false);
    expect(CuratedEntry.safeParse({ ...base, external_id: "GPSA 2027" }).success).toBe(false);
    expect(CuratedEntry.safeParse({ ...base, geographies: ["mars"] }).success).toBe(false);
    expect(CuratedEntry.safeParse({ ...base, extras: { nested: { a: 1 } } }).success).toBe(false);
    const { verified_at, ...unverified } = base;
    void verified_at;
    expect(CuratedEntry.safeParse(unverified).success).toBe(false);
  });
});

describe("data/field-defs.json", () => {
  it("is a list of field defs with unique keys", () => {
    const defs = z.array(GrantFieldDef).parse(read("field-defs.json"));
    expect(new Set(defs.map((d) => d.key)).size).toBe(defs.length);
    expect(defs.find((d) => d.key === "applicant_types")?.filterable).toBe(false);
  });
});
