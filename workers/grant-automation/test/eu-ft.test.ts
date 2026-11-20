// Replays a recorded EU Funding & Tenders search page (test/fixtures/eu-ft) through the adapter.
// The API is undocumented, so the first block is the contract: the fields the adapter relies on.
import { describe, expect, it } from "vitest";
import type { NormalizedGrant, RawFetch } from "../../../shared/types/Grants.js";
import { EU_FT_API_VERSION, EuFtPage, createEuFtAdapter } from "../src/adapters/eu-ft.js";
import { loadSources } from "../src/adapters/index.js";
import { loadRelevance, staleReason } from "../src/pipeline/relevance.js";
import { NormalizedGrantSchema, collect, fakeFetch, fixture } from "./helpers.js";

const seed = loadSources().find((source) => source.id === "eu-ft")!;
const relevance = loadRelevance();
const AT = "2026-11-05T15:00:00.000Z";
const page = fixture("eu-ft/search-page.json");
const adapter = createEuFtAdapter(seed, relevance);

const raw = (identifier: string): RawFetch => {
  const result = page.results.find((r: any) => r.metadata.identifier[0] === identifier);
  return { external_id: identifier, url: result.url, fetched_at: AT, payload: result };
};
const normalize = (identifier: string) => adapter.normalize(raw(identifier)) as NormalizedGrant;

describe("eu-ft contract (recorded 2026-11-05)", () => {
  it("is the API version the adapter was verified against", () => {
    expect(page.apiVersion).toBe(EU_FT_API_VERSION);
  });

  it("parses with the adapter's page schema: every metadata value is an array of strings", () => {
    const parsed = EuFtPage.parse(page);
    expect(parsed.results).toHaveLength(10);
  });

  it("current topics carry the fields normalize() reads", () => {
    const current = page.results.filter((r: any) => r.metadata.DATASOURCE[0] === "SEDIA" && r.metadata.type[0] === "1");
    expect(current.length).toBeGreaterThanOrEqual(6);
    for (const result of current) {
      for (const key of ["identifier", "title", "frameworkProgramme", "status", "startDate", "deadlineDate", "deadlineModel", "typesOfAction", "descriptionByte", "budgetOverview"]) {
        expect(result.metadata[key]?.length, `${result.metadata.identifier[0]} ${key}`).toBeGreaterThan(0);
      }
      expect(() => JSON.parse(result.metadata.budgetOverview[0]).budgetTopicActionMap).not.toThrow();
    }
  });
});

describe("eu-ft fetch", () => {
  it("posts multipart parts typed application/json, sorted by identifier, and stops after a short page", async () => {
    const { impl, calls } = fakeFetch(() => page);
    const raws = await collect(createEuFtAdapter(seed, relevance, impl));
    expect(raws.map((r) => r.external_id)).toEqual(page.results.map((r: any) => r.metadata.identifier[0]));
    expect(calls).toHaveLength(1);

    const url = new URL(calls[0]!.url);
    expect(url.origin + url.pathname).toBe("https://api.tech.ec.europa.eu/search-api/prod/rest/search");
    expect(Object.fromEntries(url.searchParams)).toEqual({ apiKey: "SEDIA", text: "***", pageSize: "100", pageNumber: "1" });

    const form = calls[0]!.body as FormData;
    const part = async (name: string) => {
      const blob = form.get(name) as Blob;
      expect(blob.type, name).toBe("application/json"); // a plain field makes the API ignore the filter
      return JSON.parse(await blob.text());
    };
    expect(await part("languages")).toEqual(["en"]);
    expect(await part("sort")).toEqual({ field: "identifier", order: "ASC" });
    const { must } = (await part("query")).bool;
    expect(must[0]).toEqual({ terms: { type: ["1", "2"] } });
    expect(must[1]).toEqual({ terms: { status: ["31094501", "31094502"] } });
    expect(must[2].terms.frameworkProgramme).toEqual(relevance.gate1.eu_programmes.map((programme) => programme.id));
  });

  it("pages until totalResults is reached, skips repeated identifiers and honours --limit", async () => {
    const full = { ...page, totalResults: 150, results: Array.from({ length: 100 }, (_, i) => page.results[i % 10]) };
    const { impl, calls } = fakeFetch(({ url }) => (url.includes("pageNumber=1") ? full : { ...page, totalResults: 150 }));
    const raws = await collect(createEuFtAdapter(seed, relevance, impl));
    expect(calls.map((call) => new URL(call.url).searchParams.get("pageNumber"))).toEqual(["1", "2"]);
    expect(raws).toHaveLength(10); // the same ten identifiers, however often the API repeats them

    expect(await collect(createEuFtAdapter(seed, relevance, fakeFetch(() => page).impl), { limit: 3 })).toHaveLength(3);
  });

  it("fails loudly when the response shape changes", async () => {
    const { impl } = fakeFetch(() => ({ totalResults: "many", results: {} }));
    await expect(collect(createEuFtAdapter(seed, relevance, impl))).rejects.toThrow();
  });
});

describe("eu-ft normalize", () => {
  it("single-stage Horizon topic (golden)", () => {
    const grant = normalize("HORIZON-CL4-2027-01-MAT-PROD-02");
    const { summary, ...rest } = grant;
    expect(summary).toMatch(/^Expected Outcome: Advanced manufacturing technology and machinery becomes available in Europe/);
    expect(summary.split(" ").length).toBeLessThanOrEqual(60);
    expect(rest).toEqual({
      source_id: "eu-ft",
      external_id: "HORIZON-CL4-2027-01-MAT-PROD-02",
      title: "Advanced manufacturing for key products (IA) (Made in Europe partnership)",
      funder: "European Commission",
      url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/HORIZON-CL4-2027-01-MAT-PROD-02",
      apply_url: null,
      funding_type: "grant",
      amount_min: 6000000,
      amount_max: 8000000,
      currency: "EUR",
      deadline: "2027-02-02",
      deadline_type: "fixed",
      opens_at: "2026-10-13",
      posted_at: null,
      last_verified_at: AT,
      geographies: ["eu_and_partners"],
      sdgs: [],
      values: [],
      tags: ["Horizon Europe", "HORIZON Innovation Actions"],
      schema_version: 1,
      extras: {
        funder_type: "multilateral",
        opportunity_number: "HORIZON-CL4-2027-01-MAT-PROD-02",
        programme: "Horizon Europe",
        call: "INDUSTRY",
        types_of_action: ["HORIZON Innovation Actions"],
        deadline_model: "single-stage",
        estimated_total_funding: { amount: 36000000, currency: "EUR" },
        expected_awards: 6,
      },
      // Horizon needs three keyword hits; an industrial topic has none.
      relevance: { score: -2, reasons: ["-2 programme Horizon Europe"] },
    });
  });

  it("two-stage topic: the first stage is the deadline, every date is listed, forthcoming is a forecast", () => {
    const grant = normalize("HORIZON-CL2-2027-02-DEMOCRACY-09-two-stage");
    expect(grant).toMatchObject({ deadline: "2027-05-04", deadline_type: "multiple", opens_at: "2027-03-02", forecast: true });
    expect(grant.extras).toMatchObject({ deadline_model: "two-stage", all_deadlines: ["2027-05-04", "2027-09-30"] });
    expect(grant.relevance.score).toBeGreaterThanOrEqual(relevance.threshold);
  });

  it("multiple cut-off topic: the next cut-off still ahead, or the last one when all have passed", () => {
    const result = raw("ERC-2023-POC");
    expect(adapter.normalize({ ...result, fetched_at: "2023-02-01T00:00:00.000Z" })).toMatchObject({ deadline: "2023-04-20", deadline_type: "multiple" });
    const late = adapter.normalize(result)!;
    expect(late).toMatchObject({ deadline: "2023-09-21", deadline_type: "multiple" });
    expect(late.extras.all_deadlines).toEqual(["2023-01-24", "2023-04-20", "2023-09-21"]);
    // A legacy record: still flagged open by the API, dropped by the stale rule.
    expect(staleReason(late, "2026-11-05")).toBe("deadline 2023-09-21 has passed");
    expect(late.url).toBe("https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/ERC-2023-POC");
    expect(late.summary).toBe("");
  });

  it("fellowship action type, and the MSCA keyword carrying a Horizon topic over the threshold", () => {
    const grant = normalize("HORIZON-WIDERA-2027-03-WIDENING-01");
    expect(grant).toMatchObject({ funding_type: "fellowship", amount_min: 100000, amount_max: 500000, forecast: true });
    expect(grant.relevance).toEqual({ score: 4, reasons: ["-2 programme Horizon Europe", "+6 MSCA"] });
  });

  it("Global Europe is tagged worldwide and passes on the programme alone", () => {
    const grant = normalize("NDICI-2026-MOBAF");
    expect(grant).toMatchObject({ geographies: ["worldwide"], amount_min: null, amount_max: null, deadline: "2027-02-02" });
    expect(grant.forecast).toBeUndefined();
    expect(grant.extras.programme).toBe("NDICI – Global Europe");
    expect(grant.relevance.reasons[0]).toBe("+4 programme NDICI – Global Europe");
  });

  it("external-action call: built summary, country from the identifier, total budget, Southeast Asia tag", () => {
    expect(normalize("EuropeAid/187757/DD/ACT/KH")).toEqual({
      source_id: "eu-ft",
      external_id: "EuropeAid/187757/DD/ACT/KH",
      title: "Support to Civil Society Organisations (CSOs) and Support to Human Rights and Democracy (HR&D)",
      funder: "European Commission",
      summary: "EU external action call for proposals EuropeAid/187757/DD/ACT/KH, for Cambodia.",
      url: "https://webgate.ec.europa.eu/prospect/external/publishedcalls.htm?callId=187757",
      apply_url: null,
      funding_type: "grant",
      amount_min: null,
      amount_max: null,
      currency: "EUR",
      deadline: "2026-12-11",
      deadline_type: "fixed",
      opens_at: null,
      posted_at: "2026-10-22T04:00:57.000Z",
      last_verified_at: AT,
      geographies: ["philippines_sea", "worldwide"],
      sdgs: [],
      values: [],
      tags: ["External action", "Cambodia"],
      schema_version: 1,
      extras: {
        funder_type: "multilateral",
        opportunity_number: "EuropeAid/187757/DD/ACT/KH",
        programme: "External action (EuropeAid)",
        estimated_total_funding: { amount: 5993000, currency: "EUR" },
      },
      relevance: { score: 10, reasons: ["+4 programme External action (EuropeAid)", "+2 civil society", "+2 human rights", "+2 democracy"] },
    });
  });

  it("external-action call from 2021 with no deadline is caught by the stale rule", () => {
    const grant = normalize("EuropeAid/172802/ID/ACT/RS");
    expect(grant).toMatchObject({ deadline: null, deadline_type: "unknown", posted_at: "2021-07-30T10:00:02.000Z", tags: ["External action", "Serbia"] });
    expect(staleReason(grant, "2026-11-05")).toMatch(/no closing date and posted 2021-07-30/);
  });

  it("every normalized fixture is a storable record; junk is null", () => {
    for (const result of page.results) {
      expect(() => NormalizedGrantSchema.parse(normalize(result.metadata.identifier[0]))).not.toThrow();
    }
    expect(adapter.normalize({ external_id: "x", url: "", fetched_at: AT, payload: { reference: "x", metadata: {} } })).toBeNull();
    expect(adapter.normalize({ external_id: "x", url: "", fetched_at: AT, payload: null })).toBeNull();
  });
});
