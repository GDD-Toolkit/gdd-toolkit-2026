// Replays recorded Grants.gov responses (test/fixtures/grants-gov) through the adapter.
import { describe, expect, it } from "vitest";
import { createGrantsGovAdapter, inStableOrder } from "../src/adapters/grants-gov.js";
import { contentHash, payloadHash } from "../src/pipeline/hash.js";
import { loadSources } from "../src/adapters/index.js";
import { loadRelevance, staleReason } from "../src/pipeline/relevance.js";
import { NormalizedGrantSchema, collect, fakeFetch, fixture, normalizeAt } from "./helpers.js";

const seed = loadSources().find((source) => source.id === "grants-gov")!;
const relevance = loadRelevance();
const AT = "2026-11-05T15:00:00.000Z";
const RECORDED = ["364047", "347707", "363786", "363872", "355824", "355829"];

function replay() {
  return fakeFetch(({ url, body }) => {
    const request = body as Record<string, unknown>;
    if (url.endsWith("/fetchOpportunity")) {
      const id = String(request.opportunityId);
      return fixture(RECORDED.includes(id) ? `grants-gov/detail-${id}.json` : "grants-gov/detail-not-found.json");
    }
    if (request.agencies) return fixture("grants-gov/search-agencies.json");
    if (request.fundingCategories) {
      // The recording holds the first two of 1,018 hits; later pages are empty here.
      const page = fixture("grants-gov/search-categories.json");
      return request.startRecordNum === 0 ? page : { ...page, data: { ...page.data, oppHits: [] } };
    }
    return fixture("grants-gov/search-facets.json");
  });
}

const detail = (id: string) => ({
  external_id: id,
  url: "",
  fetched_at: AT,
  payload: { hit: { id, title: "from the search hit" }, detail: fixture(`grants-gov/detail-${id}.json`).data },
});

describe("grants-gov fetch", () => {
  it("reads the agency codes from the live facet, searches each gate on its own and unions the hits", async () => {
    const { impl, calls } = replay();
    const raws = await collect(createGrantsGovAdapter(seed, relevance, impl));

    const searches = calls.filter((call) => call.url.endsWith("/search2")).map((call) => call.body as Record<string, string | number>);
    expect(searches[0]).toEqual({ rows: 1, oppStatuses: "posted|forecasted" });
    expect(searches.slice(1).every((search) => search.oppStatuses === "posted|forecasted" && search.rows === 500)).toBe(true);

    const agencies = String(searches[1]!.agencies).split("|");
    expect(agencies).toEqual(expect.arrayContaining(["DOS-DRL", "DOS-GHSD", "DOS-PHL", "DOS-VNM", "USAID-PHI", "DOS-ASEAN"]));
    expect(agencies).not.toContain("DOS"); // the top-level code matches nothing
    expect(agencies.some((code) => code.startsWith("HHS"))).toBe(false);
    expect(searches[1]).not.toHaveProperty("fundingCategories"); // the API ANDs different filters
    expect(searches[1]!.startRecordNum).toBe(0);
    // The category search pages until a page comes back empty.
    const byCategory = searches.slice(2);
    expect(byCategory.map((search) => search.startRecordNum)).toEqual([0, 500]);
    expect(byCategory.every((search) => search.fundingCategories === relevance.gate1.grants_gov_categories.join("|"))).toBe(true);
    expect(byCategory.some((search) => "agencies" in search)).toBe(false);

    // 8 agency hits + 2 category hits, no id twice, one detail request each.
    expect(raws.map((raw) => raw.external_id)).toHaveLength(10);
    expect(new Set(raws.map((raw) => raw.external_id)).size).toBe(10);
    expect(calls.filter((call) => call.url.endsWith("/fetchOpportunity"))).toHaveLength(10);
    expect(raws[0]).toMatchObject({ url: expect.stringMatching(/^https:\/\/www\.grants\.gov\/search-results-detail\/\d+$/) });
    expect(calls.every((call) => new Headers(call.init.headers).get("User-Agent")?.startsWith("gdd-toolkit-grant-automation/"))).toBe(true);
  });

  it("stores an unchanged record identically although the API shuffles its code lists on every call", async () => {
    // Seen live on 2026-11-05: eight of nineteen kept records came back "updated" seconds after being inserted.
    const shuffled = (response: any) => {
      const copy = structuredClone(response);
      const body = copy.data.synopsis ?? copy.data.forecast;
      for (const list of [body?.applicantTypes, body?.fundingActivityCategories, copy.data.cfdas]) list?.reverse();
      return copy;
    };
    const run = async (reorder: boolean) => {
      const { impl } = fakeFetch(({ url, body }) => {
        if (!url.endsWith("/fetchOpportunity")) return fixture("grants-gov/search-categories.json");
        const response = fixture(`grants-gov/detail-${(body as { opportunityId: number }).opportunityId}.json`);
        return reorder ? shuffled(response) : response;
      });
      const adapter = createGrantsGovAdapter(seed, relevance, impl);
      const [raw] = await collect(adapter, { limit: 1 });
      return { raw: raw!, grant: adapter.normalize({ ...raw!, fetched_at: AT })! };
    };
    const [first, second] = [await run(false), await run(true)];
    expect(first.raw.external_id).toBe("355824");
    expect(first.grant.extras.applicant_types).toHaveLength(11);
    expect(payloadHash(second.raw.payload)).toBe(payloadHash(first.raw.payload));
    expect(contentHash(second.grant)).toBe(contentHash(first.grant));
    expect(inStableOrder([{ id: "25" }, { id: "06" }, { id: "12" }])).toEqual([{ id: "06" }, { id: "12" }, { id: "25" }]);
    expect(inStableOrder(["b", "a"])).toEqual(["b", "a"]); // plain lists keep their order
  });

  it("honours --limit before asking for details", async () => {
    const { impl, calls } = replay();
    const raws = await collect(createGrantsGovAdapter(seed, relevance, impl), { limit: 3 });
    expect(raws).toHaveLength(3);
    expect(calls.filter((call) => call.url.endsWith("/fetchOpportunity"))).toHaveLength(3);
  });

  it("turns a record the API no longer has, or a failed request, into an unparseable record instead of failing the run", async () => {
    const { impl } = replay();
    const adapter = createGrantsGovAdapter(seed, relevance, impl);
    const raws = await collect(adapter);
    const normalized = raws.map((raw) => adapter.normalize(raw));
    expect(normalized.filter((grant) => grant === null)).toHaveLength(6); // the six Cambodia forecasts were not recorded
    expect(normalized.filter((grant) => grant !== null)).toHaveLength(4);

    const failing = fakeFetch(({ url }) =>
      url.endsWith("/fetchOpportunity") ? new Response("gone", { status: 404 }) : fixture("grants-gov/search-agencies.json"),
    );
    const broken = createGrantsGovAdapter(seed, relevance, failing.impl);
    const [first] = await collect(broken, { limit: 1 });
    expect(first!.payload).toMatchObject({ detail: null, error: expect.any(String) });
    expect(first!.payload).toMatchObject({ error: expect.stringContaining("HTTP 404") });
    expect(broken.normalize(first!)).toBeNull();
  });
});

describe("grants-gov normalize", () => {
  const adapter = createGrantsGovAdapter(seed, relevance);

  it("posted opportunity from a Southeast Asia mission (golden)", () => {
    expect(normalizeAt(adapter, detail("364047"), AT)).toEqual({
      source_id: "grants-gov",
      external_id: "364047",
      title: "Improved quality of life of persons with disabilities in provinces heavily sprayed with agent orange in Ca Mau and Quang Ngai",
      funder: "U.S. Mission to Vietnam",
      summary: "Improve quality of life of persons with disabilities in provinces heavily sprayed with agent orange in Ca Mau and Quang Ngai",
      url: "https://www.grants.gov/search-results-detail/364047",
      apply_url:
        "https://mygrants.servicenowservices.com/mygrants?id=mygrants_form&table=x_g_usd4_o_grant_funding_opportunity&sys_id=fade2bdc87e34b90d95c42e50cbb3576&view=Default",
      funding_type: "cooperative_agreement",
      amount_min: null,
      amount_max: 28500000,
      currency: "USD",
      deadline: "2026-11-19",
      deadline_type: "fixed",
      opens_at: null,
      posted_at: "2026-10-09T12:00:00.000Z",
      last_verified_at: AT,
      geographies: ["philippines_sea"],
      sdgs: [],
      values: [],
      tags: [],
      schema_version: 1,
      extras: {
        funder_type: "government",
        opportunity_number: "OFOP0003897",
        department: "Department of State",
        eligibility: "Nonprofit and nongovernmental organizations",
        applicant_types: ["Others"],
        assistance_listings: ["19.124 East Asia and Pacific Grants Program"],
        expected_awards: 1,
        cost_sharing: "Not required",
      },
      // A launch-market agency passes on its own: no keyword matched.
      relevance: { score: 4, reasons: ["+4 agency DOS-VNM (Philippines / Southeast Asia)", "category O"] },
    });
  });

  it("current forecast: estimated dates, the forecast flag, foreign eligibility", () => {
    const grant = normalizeAt(adapter, detail("363872"), AT)!;
    expect(grant).toMatchObject({
      title: "Emerging Global Leader Award (K43)",
      funder: "National Institutes of Health",
      forecast: true,
      opens_at: "2027-04-07",
      deadline: "2027-10-12",
      deadline_type: "fixed",
      funding_type: "grant",
      amount_min: null,
      amount_max: null,
      geographies: ["worldwide"],
      tags: ["Health"],
      apply_url: null,
    });
    expect(grant.extras).toMatchObject({ department: "Department of Health and Human Services", opportunity_number: "PAR-28-070" });
    expect(grant.relevance).toEqual({ score: 4, reasons: ["category HL", "+2 low- and middle-income", "+2 LMIC"] });
    expect(grant.summary.split(" ").length).toBeLessThanOrEqual(60);
    expect(staleReason(grant, "2026-11-05")).toBeNull();
  });

  it("forecast from 2023 that Grants.gov still lists: normalized, then caught by the stale rule", () => {
    const grant = normalizeAt(adapter, detail("347707"), AT)!;
    expect(grant).toMatchObject({
      funder: "U.S. Mission to the Philippines",
      forecast: true,
      deadline: "2023-05-22",
      amount_min: 5000,
      amount_max: 20000,
      geographies: ["philippines_sea"],
    });
    expect(grant.extras.estimated_total_funding).toEqual({ amount: 40000, currency: "USD" });
    expect(grant.extras.applicant_types).toEqual(["Unrestricted"]);
    expect(staleReason(grant, "2026-11-05")).toBe("deadline 2023-05-22 has passed");
  });

  it("placeholder closing date (2099-01-01) means open-ended, not a deadline", () => {
    const grant = normalizeAt(adapter, detail("363786"), AT)!;
    expect(grant).toMatchObject({ title: "Egypt Annual Program Statement", deadline: null, deadline_type: "rolling", geographies: ["worldwide"] });
    expect(grant.relevance).toEqual({ score: 4, reasons: ["+2 agency DOS-NEA", "category O", "+2 civil society"] });
  });

  it("domestic programme in a gate-1 category: no keyword, scored 0, tagged us_only", () => {
    const grant = normalizeAt(adapter, detail("355824"), AT)!;
    expect(grant.relevance).toEqual({ score: 0, reasons: ["category HL"] });
    expect(grant.geographies).toEqual(["us_only"]);
    expect(grant.extras.applicant_types).toContain("Nonprofits having a 501(c)(3) status with the IRS, other than institutions of higher education");
  });

  it("every normalized fixture is a storable record", () => {
    for (const id of RECORDED) expect(() => NormalizedGrantSchema.parse(normalizeAt(adapter, detail(id), AT))).not.toThrow();
  });

  it("returns null for the not-found response and for junk", () => {
    const notFound = { hit: { id: "1", title: "x" }, detail: fixture("grants-gov/detail-not-found.json").data };
    expect(adapter.normalize({ external_id: "1", url: "", fetched_at: AT, payload: notFound })).toBeNull();
    expect(adapter.normalize({ external_id: "1", url: "", fetched_at: AT, payload: "junk" })).toBeNull();
  });
});
