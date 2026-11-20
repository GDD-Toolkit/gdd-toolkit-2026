import { describe, expect, it } from "vitest";
import { buildDedupeIndex, canonicalUrl, titleKey } from "../src/pipeline/dedupe.js";

describe("canonicalUrl", () => {
  it("ignores scheme, www, case of the host, trailing slashes, fragments and tracking parameters", () => {
    const canonical = "grants.gov/search-results-detail/364047";
    for (const url of [
      "https://www.grants.gov/search-results-detail/364047",
      "http://GRANTS.gov/search-results-detail/364047/",
      "https://www.grants.gov/search-results-detail/364047?utm_source=newsletter&fbclid=abc#apply",
    ]) {
      expect(canonicalUrl(url)).toBe(canonical);
    }
  });

  it("keeps the parameters that identify the page, in a stable order", () => {
    expect(canonicalUrl("https://webgate.ec.europa.eu/prospect/external/publishedcalls.htm?callId=187757&utm_medium=x")).toBe(
      "webgate.ec.europa.eu/prospect/external/publishedcalls.htm?callId=187757",
    );
    expect(canonicalUrl("https://example.org/a?b=2&a=1")).toBe(canonicalUrl("https://example.org/a?a=1&b=2"));
    expect(canonicalUrl("https://example.org/a?callId=1")).not.toBe(canonicalUrl("https://example.org/a?callId=2"));
  });
});

describe("titleKey", () => {
  it("ignores case, punctuation and accents", () => {
    expect(titleKey("MSCA Postdoctoral Fellowships — 2027", "European Commission")).toBe(
      titleKey("msca postdoctoral fellowships 2027", "EUROPEAN COMMISSION"),
    );
    expect(titleKey("Small Grants Program", "U.S. Mission to Vietnam")).not.toBe(titleKey("Small Grants Program", "U.S. Mission to Laos"));
  });
});

describe("buildDedupeIndex", () => {
  const index = buildDedupeIndex([
    { source_id: "grants-gov", external_id: "364047", url: "https://www.grants.gov/search-results-detail/364047", title: "Disability programme", funder: "U.S. Mission to Vietnam" },
    { source_id: "eu-ft", external_id: "NDICI-2026-MOBAF", url: "https://ec.europa.eu/x/NDICI-2026-MOBAF", title: "Intra-Africa Academic Mobility Scheme", funder: "European Commission" },
    { source_id: "curated", external_id: "later", url: "https://ec.europa.eu/x/NDICI-2026-MOBAF", title: "Same page, added later", funder: "EC" },
  ]);

  it("matches on the canonical URL", () => {
    expect(index.match({ url: "http://grants.gov/search-results-detail/364047/?utm_source=x", title: "Another title", funder: "Someone" })).toEqual({
      source_id: "grants-gov",
      external_id: "364047",
    });
  });

  it("matches on title and funder when the URL differs; the first row in wins", () => {
    expect(index.match({ url: "https://example.org/mobility", title: "Intra-Africa academic mobility scheme!", funder: "European commission" })).toEqual({
      source_id: "eu-ft",
      external_id: "NDICI-2026-MOBAF",
    });
    expect(index.match({ url: "https://ec.europa.eu/x/NDICI-2026-MOBAF", title: "x", funder: "y" })?.source_id).toBe("eu-ft");
  });

  it("returns null for a new call", () => {
    expect(index.match({ url: "https://example.org/new", title: "Intra-Africa Academic Mobility Scheme", funder: "African Union" })).toBeNull();
  });
});
