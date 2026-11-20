import { describe, expect, it } from "vitest";
import { ADAPTERS, loadSources } from "../src/adapters/index.js";
import { fieldDefsFor } from "../src/adapters/field-defs.js";
import { excerpt, htmlToText, positiveInt, withoutCrossReference } from "../src/lib/text.js";
import { BLOCK_WEIGHT, KEYWORD_CAP, RelevanceConfig, createScorer, loadRelevance, staleReason } from "../src/pipeline/relevance.js";

const config = RelevanceConfig.parse({
  threshold: 4,
  gate1: { grants_gov_categories: ["HL"], grants_gov_agency_prefixes: [], grants_gov_priority_agencies: [], eu_programmes: [] },
  gate2: {
    keywords: [
      { term: "global health", weight: 2 },
      { term: "civil society", weight: 2 },
      { term: "human right", weight: 2 },
      { term: "low- and middle-income", weight: 2 },
      { term: "WASH", weight: 2 },
      { term: "Philippines", weight: 4 },
    ],
    block: ["clinical trial required", "weapons"],
  },
});
const score = createScorer(config);

describe("data files (the pull-request gate for the research module)", () => {
  it("data/relevance.json parses and has something in each gate", () => {
    const live = loadRelevance();
    expect(live.threshold).toBeGreaterThan(0);
    expect(live.gate1.grants_gov_categories.length).toBeGreaterThan(0);
    expect(live.gate1.grants_gov_priority_agencies).toContain("DOS-PHL");
    expect(live.gate1.eu_programmes.map((programme) => programme.id)).toContain("45876777");
    expect(live.gate2.keywords.length).toBeGreaterThan(0);
    const terms = live.gate2.keywords.map((keyword) => keyword.term.toLowerCase());
    expect(new Set(terms).size).toBe(terms.length);
  });

  it("data/sources.json names known adapters, unique ids and an attribution for each", () => {
    const sources = loadSources();
    expect(sources.map((source) => source.id)).toEqual(["grants-gov", "eu-ft", "curated"]);
    for (const source of sources) {
      expect(Object.keys(ADAPTERS)).toContain(source.adapter);
      expect(source.license_note.length).toBeGreaterThan(20);
    }
    expect(sources[0]!.license_note).toContain("not endorsed or certified by the U.S. Department of Health and Human Services");
  });

  it("data/field-defs.json gives every adapter its extras under the id it runs as", () => {
    expect(fieldDefsFor("grants-gov").map((def) => def.key)).toEqual(
      expect.arrayContaining(["opportunity_number", "applicant_types", "estimated_total_funding", "funder_type"]),
    );
    expect(fieldDefsFor("eu-ft", "eu-test").every((def) => def.sources.join() === "eu-test")).toBe(true);
    expect(fieldDefsFor("eu-ft").map((def) => def.key)).not.toContain("assistance_listings");
  });
});

describe("gate 2 scoring", () => {
  it("adds each matching keyword once, case-insensitively, and explains itself", () => {
    expect(score("A GLOBAL HEALTH programme for civil society. Global health again.")).toEqual({
      score: 4,
      reasons: ["+2 global health", "+2 civil society"],
    });
  });

  it("matches whole terms only, with plurals and with spaces or hyphens between words", () => {
    expect(score("Washington state car wash operators").score).toBe(2); // "wash" as a word, never inside Washington
    expect(score("Washington state").score).toBe(0);
    expect(score("human rights defenders").score).toBe(2);
    expect(score("low and middle income countries").score).toBe(2);
    expect(score("Low- and Middle-Income Country (LMIC) faculty").score).toBe(2);
    expect(score("the Philippines").score).toBe(4);
    expect(score("Filipino").score).toBe(0);
  });

  it(`caps keyword points at ${KEYWORD_CAP} and subtracts ${-BLOCK_WEIGHT} per block term`, () => {
    const everything = "global health, civil society, human rights, WASH, Philippines";
    expect(score(everything).score).toBe(KEYWORD_CAP);
    expect(score(`${everything} (R01 Clinical Trial Required)`)).toMatchObject({ score: KEYWORD_CAP + BLOCK_WEIGHT });
    expect(score("weapons").reasons).toEqual([`${BLOCK_WEIGHT} weapons`]);
  });

  it("adds gate-1 weights on top of the keyword cap and lists every gate-1 match", () => {
    expect(score("civil society", [{ reason: "programme X", weight: 4 }, { reason: "category HL" }])).toEqual({
      score: 6,
      reasons: ["+4 programme X", "category HL", "+2 civil society"],
    });
    expect(score("civil society, global health", [{ reason: "programme Horizon Europe", weight: -2 }])).toEqual({
      score: 2,
      reasons: ["-2 programme Horizon Europe", "+2 global health", "+2 civil society"],
    });
  });
});

describe("staleReason", () => {
  const today = "2026-11-05";
  it("drops a passed deadline and keeps today's", () => {
    expect(staleReason({ deadline: "2026-11-04", posted_at: null }, today)).toMatch(/2026-11-04 has passed/);
    expect(staleReason({ deadline: "2026-11-05", posted_at: null }, today)).toBeNull();
  });
  it("drops an undated record posted over a year ago, whatever its deadline type", () => {
    expect(staleReason({ deadline: null, posted_at: "2025-11-04T12:00:00.000Z" }, today)).toMatch(/more than a year ago/);
    expect(staleReason({ deadline: null, posted_at: "2025-11-06T12:00:00.000Z" }, today)).toBeNull();
    expect(staleReason({ deadline: null, posted_at: null }, today)).toBeNull();
  });
  it("never judges a dated record by its age", () => {
    expect(staleReason({ deadline: "2027-01-01", posted_at: "2019-01-01T12:00:00.000Z" }, today)).toBeNull();
  });
});

describe("text helpers", () => {
  it("htmlToText strips tags, scripts and entities", () => {
    expect(htmlToText("<p>U.S. Embassy&nbsp;Praia &ndash; <b>Self-Help</b></p><script>x()</script>")).toBe("U.S. Embassy Praia – Self-Help");
    expect(htmlToText(null)).toBe("");
  });
  it("excerpt keeps short text, ends on a sentence when it can, otherwise marks the cut", () => {
    expect(excerpt("Short text.")).toBe("Short text.");
    expect(excerpt("One two three. Four five six seven eight.", 5)).toBe("One two three.");
    expect(excerpt("one two three four five six", 3)).toBe("one two three…");
  });
  it("withoutCrossReference drops only the trailing cross-reference", () => {
    expect(withoutCrossReference('Others (see text field entitled "Additional Information on Eligibility" for clarification)')).toBe("Others");
    expect(withoutCrossReference("Unrestricted (i.e., open to any type of entity above), subject to any clarification")).toBe("Unrestricted");
    expect(withoutCrossReference("Nonprofits having a 501(c)(3) status with the IRS, other than institutions of higher education")).toBe(
      "Nonprofits having a 501(c)(3) status with the IRS, other than institutions of higher education",
    );
  });
  it("positiveInt reads numeric strings and treats 0 as not stated", () => {
    expect(positiveInt("28500000")).toBe(28500000);
    expect(positiveInt("28,500,000")).toBe(28500000);
    expect(positiveInt("0")).toBeNull();
    expect(positiveInt(undefined)).toBeNull();
  });
});
