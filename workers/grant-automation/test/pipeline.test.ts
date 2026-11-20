import { describe, expect, it } from "vitest";
import type { NormalizedGrant } from "../../../shared/types/Grants.js";
import { createCuratedAdapter } from "../src/adapters/curated.js";
import { sampleEntries } from "../src/dev/sample-entries.js";
import { contentHash, stableStringify } from "../src/pipeline/hash.js";
import { addDays, deriveStatus } from "../src/pipeline/status.js";

const TODAY = "2026-11-03";

async function normalizeAll(entries: unknown[], sourceId = "t"): Promise<(NormalizedGrant | null)[]> {
  const adapter = createCuratedAdapter({ sourceId, entries });
  const out: (NormalizedGrant | null)[] = [];
  for await (const raw of adapter.fetch({})) out.push(adapter.normalize(raw));
  return out;
}

describe("curated adapter", () => {
  it("normalizes every sample entry", async () => {
    const grants = await normalizeAll(sampleEntries(TODAY));
    expect(grants).toHaveLength(6);
    for (const grant of grants) {
      expect(grant).not.toBeNull();
      expect(grant!.source_id).toBe("t");
      expect(grant!.last_verified_at).toBe(`${TODAY}T12:00:00.000Z`);
      expect(grant!.schema_version).toBe(1);
      expect(grant!.relevance.reasons).toEqual(["curated"]);
    }
  });

  it("returns null for a malformed entry and keeps going", async () => {
    const [bad, good] = await normalizeAll([{ title: "no id" }, sampleEntries(TODAY)[0]]);
    expect(bad).toBeNull();
    expect(good?.external_id).toBe("gpsa-call-2027");
  });

  it("declares the field defs under its own source id", () => {
    const adapter = createCuratedAdapter({ sourceId: "t", entries: [] });
    expect(adapter.fieldDefs.map((d) => d.key)).toContain("funder_type");
    expect(adapter.fieldDefs.every((d) => d.sources.join() === "t")).toBe(true);
  });
});

describe("contentHash", () => {
  it("is stable across key order and the worker timestamp, and changes with content", async () => {
    const [grant] = (await normalizeAll(sampleEntries(TODAY))) as NormalizedGrant[];
    const reordered = JSON.parse(stableStringify(grant)) as NormalizedGrant;
    expect(contentHash(reordered)).toBe(contentHash(grant!));
    expect(contentHash({ ...grant!, last_verified_at: "2030-01-01T00:00:00.000Z" })).toBe(contentHash(grant!));
    expect(contentHash({ ...grant!, relevance: { score: 1, reasons: [] } })).toBe(contentHash(grant!));
    expect(contentHash({ ...grant!, title: `${grant!.title}!` })).not.toBe(contentHash(grant!));
    expect(contentHash({ ...grant!, extras: { ...grant!.extras, funder_type: "other" } })).not.toBe(contentHash(grant!));
  });
});

describe("deriveStatus", () => {
  const status = (inputs: { opens_at?: string | null; deadline?: string | null; deadline_type?: "fixed" | "rolling" | "multiple" | "unknown" }) =>
    deriveStatus({ opens_at: null, deadline: null, deadline_type: "fixed", ...inputs }, TODAY);

  it("maps dates to statuses", () => {
    expect(status({ opens_at: addDays(TODAY, 1), deadline: addDays(TODAY, 90) })).toBe("forecasted");
    expect(status({ opens_at: TODAY, deadline: addDays(TODAY, 90) })).toBe("open");
    expect(status({ deadline: addDays(TODAY, -1) })).toBe("closed");
    expect(status({ deadline: TODAY })).toBe("closing_soon");
    expect(status({ deadline: addDays(TODAY, 30) })).toBe("closing_soon");
    expect(status({ deadline: addDays(TODAY, 31) })).toBe("open");
    expect(status({ deadline_type: "rolling" })).toBe("rolling");
    expect(status({ deadline_type: "unknown" })).toBe("open");
  });

  it("addDays crosses month and year boundaries", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
});
