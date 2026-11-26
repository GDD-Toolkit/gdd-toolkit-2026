// Grants.gov: search2 lists the candidates, fetchOpportunity supplies each record.
// No key. The verified contract (fields, quirks, terms) is recorded in
// .claude/skills/grants-gov-integration/SKILL.md and summarised in the README.
import { z } from "zod";
import {
  GRANTS_SCHEMA_VERSION,
  type FundingType,
  type GrantExtras,
  type NormalizedGrant,
  type RawFetch,
  type SourceAdapter,
} from "../../../../shared/types/Grants.js";
import { fetchJson, inBatches } from "../lib/http.js";
import { excerpt, htmlToText, httpUrl, leadingDate, mentionsSoutheastAsia, noonUTC, positiveInt, withoutCrossReference } from "../lib/text.js";
import { createScorer, type Gate1Match, type RelevanceConfig } from "../pipeline/relevance.js";
import { fieldDefsFor } from "./field-defs.js";
import type { SourceSeed } from "./index.js";

const API = "https://api.grants.gov/v1/api";
const STATUSES = "posted|forecasted";
const PAGE_SIZE = 500;
/** Detail requests in flight. The API publishes no rate limit; this keeps a full run near a minute. */
const DETAIL_CONCURRENCY = 4;

export const grantsGovPageUrl = (id: string | number) => `https://www.grants.gov/search-results-detail/${id}`;

const text = z.string().nullish();
const numeric = z.union([z.string(), z.number()]).nullish();
const Coded = z.object({ id: z.string(), description: z.string() });

const SearchHit = z.object({
  id: z.string(),
  number: text,
  title: text,
  agencyCode: text,
  agency: text, // the doc page calls this agencyName; the live API returns `agency`
});
type SearchHit = z.infer<typeof SearchHit>;

const AgencyOption = z.object({ value: z.string() });
const SearchResponse = z.object({
  data: z.object({
    hitCount: z.number(),
    oppHits: z.array(SearchHit),
    agencies: z.array(AgencyOption.extend({ subAgencyOptions: z.array(AgencyOption).default([]) })).default([]),
  }),
});

/** `synopsis` for posted opportunities, `forecast` for forecasted ones: same fields, different date names. */
const Body = z.object({
  agencyName: text,
  agencyCode: text,
  synopsisDesc: text,
  forecastDesc: text,
  responseDateStr: text,
  responseDateDesc: text,
  estApplicationResponseDateStr: text,
  estSynopsisPostingDateStr: text,
  postingDateStr: text,
  awardCeiling: numeric,
  awardFloor: numeric,
  estimatedFunding: numeric,
  numberOfAwards: numeric,
  costSharing: z.boolean().nullish(),
  applicantEligibilityDesc: text,
  fundingActivityCategoryDesc: text,
  fundingDescLinkUrl: text,
  applicantTypes: z.array(Coded).nullish(),
  fundingInstruments: z.array(Coded).nullish(),
  fundingActivityCategories: z.array(Coded).nullish(),
});

const Detail = z.object({
  id: z.number(),
  opportunityNumber: text,
  opportunityTitle: text,
  docType: text,
  agencyDetails: z.object({ agencyName: text, agencyCode: text }).nullish(),
  topAgencyDetails: z.object({ agencyName: text }).nullish(),
  cfdas: z.array(z.object({ cfdaNumber: text, programTitle: text })).nullish(),
  synopsis: Body.nullish(),
  forecast: Body.nullish(),
});

const Payload = z.object({ hit: SearchHit, detail: Detail });

const ROLLING = /\b(rolling|continuous|ongoing|open until|until funds|any time|anytime)\b/i;
// "Non-domestic (non-U.S.) Entities (Foreign Institutions) are eligible to apply" and its negation are NIH boilerplate.
const FOREIGN = /\b(foreign|non-?u\.?s\.?|non-domestic|overseas|international organi[sz]ations?)\b/i;
const GLOBAL_TITLE = /\b(global|international|worldwide|overseas)\b/i;
/** A closing date further away than this many years is a placeholder, not a deadline. */
const OPEN_ENDED_YEARS = 10;
const FOREIGN_BARRED = /\b(foreign|non-?u\.?s\.?|non-domestic)\b[^.]{0,120}\b(not eligible|ineligible|may not apply|not allowed)\b/i;

/**
 * fetchOpportunity returns its code lists (applicant types, categories, listings)
 * in a different order on every call. Sorting every array of `{ id }` objects
 * makes two fetches of an unchanged record identical, so the raw payload and the
 * content hash only change when the record does.
 */
export function inStableOrder(value: unknown): unknown {
  if (Array.isArray(value)) {
    const items = value.map(inStableOrder);
    const keyed = items.every((item) => item !== null && typeof item === "object" && "id" in item);
    return keyed ? items.sort((a, b) => String((a as { id: unknown }).id).localeCompare(String((b as { id: unknown }).id))) : items;
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, inStableOrder(inner)]));
  }
  return value;
}

function fundingType(instruments: string[]): FundingType {
  if (instruments.includes("G")) return "grant";
  if (instruments.includes("CA")) return "cooperative_agreement";
  return instruments.length > 0 ? "other" : "grant";
}

export function createGrantsGovAdapter(
  seed: SourceSeed,
  relevance: RelevanceConfig,
  fetchImpl: typeof fetch = fetch,
): SourceAdapter {
  const { grants_gov_categories: categories, grants_gov_agency_prefixes: prefixes, grants_gov_priority_agencies } = relevance.gate1;
  const priority = new Set(grants_gov_priority_agencies);
  const prefixOf = (code: string) => prefixes.find(({ prefix }) => code.startsWith(prefix));
  const inAgencyGate = (code: string) => priority.has(code) || prefixOf(code) !== undefined;
  const score = createScorer(relevance);

  const post = (path: string, body: unknown) =>
    fetchJson(`${API}/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }, fetchImpl);

  return {
    source: { ...seed, enabled: true, last_run_at: null },
    fieldDefs: fieldDefsFor("grants-gov", seed.id),

    async *fetch({ limit } = {}) {
      // A top-level code such as "DOS" matches nothing, so the sub-agency codes come from the live facet.
      const facets = SearchResponse.parse(await post("search2", { rows: 1, oppStatuses: STATUSES })).data;
      const listed = facets.agencies.flatMap((agency) => [agency.value, ...agency.subAgencyOptions.map((sub) => sub.value)]);
      const agencies = [...new Set([...listed.filter(inAgencyGate), ...priority])];

      // Filters in different fields are ANDed, so each gate-1 list gets its own search; hits are unioned by id.
      const hits = new Map<string, SearchHit>();
      const searches = [{ agencies: agencies.join("|") }, { fundingCategories: categories.join("|") }];
      for (const filter of searches) {
        if (Object.values(filter)[0] === "") continue; // an empty filter would match everything
        for (let start = 0; limit === undefined || hits.size < limit; start += PAGE_SIZE) {
          const page = SearchResponse.parse(
            await post("search2", { rows: PAGE_SIZE, startRecordNum: start, oppStatuses: STATUSES, ...filter }),
          ).data;
          for (const hit of page.oppHits) if (!hits.has(hit.id)) hits.set(hit.id, hit);
          if (page.oppHits.length === 0 || start + PAGE_SIZE >= page.hitCount) break;
        }
      }

      yield* inBatches([...hits.values()].slice(0, limit), DETAIL_CONCURRENCY, async (hit): Promise<RawFetch> => {
        const fetched = { external_id: hit.id, url: grantsGovPageUrl(hit.id), fetched_at: new Date().toISOString() };
        try {
          const response = (await post("fetchOpportunity", { opportunityId: Number(hit.id) })) as { data?: unknown };
          return { ...fetched, payload: { hit, detail: inStableOrder(response.data ?? null) } };
        } catch (error) {
          // One record failing must not end the run; normalize() rejects it as unparseable.
          return { ...fetched, payload: { hit, detail: null, error: error instanceof Error ? error.message : String(error) } };
        }
      });
    },

    normalize(raw: RawFetch): NormalizedGrant | null {
      const parsed = Payload.safeParse(raw.payload);
      if (!parsed.success) return null; // includes "no record found", which has no id
      const { hit, detail } = parsed.data;
      const forecast = detail.docType === "forecast" || !detail.synopsis;
      const body = detail.synopsis ?? detail.forecast;
      const title = htmlToText(detail.opportunityTitle ?? hit.title);
      if (!body || !title) return null;

      const agencyCode = detail.agencyDetails?.agencyCode ?? body.agencyCode ?? hit.agencyCode ?? "";
      const funder = htmlToText(detail.agencyDetails?.agencyName ?? body.agencyName ?? hit.agency);
      const department = htmlToText(detail.topAgencyDetails?.agencyName);
      const description = htmlToText(body.synopsisDesc ?? body.forecastDesc);
      const eligibility = htmlToText(body.applicantEligibilityDesc);
      const categoryNote = htmlToText(body.fundingActivityCategoryDesc);
      const categoryCodes = (body.fundingActivityCategories ?? []).map((category) => category.id);
      // Agencies enter a date decades away (2099-01-01) to mean "no closing date".
      const closes = leadingDate(forecast ? body.estApplicationResponseDateStr : body.responseDateStr);
      const openEnded = closes !== null && Number(closes.slice(0, 4)) - Number(raw.fetched_at.slice(0, 4)) > OPEN_ENDED_YEARS;
      const deadline = openEnded ? null : closes;
      const posted = leadingDate(body.postingDateStr);
      const applyUrl = httpUrl(body.fundingDescLinkUrl);

      const gate1: Gate1Match[] = [];
      if (priority.has(agencyCode)) gate1.push({ reason: `agency ${agencyCode} (Philippines / Southeast Asia)`, weight: relevance.threshold });
      else if (prefixOf(agencyCode)) gate1.push({ reason: `agency ${agencyCode}`, weight: prefixOf(agencyCode)!.weight });
      const matchedCategories = categoryCodes.filter((code) => categories.includes(code));
      if (matchedCategories.length > 0) gate1.push({ reason: `category ${matchedCategories.join(", ")}` });

      const geographies: string[] = [];
      const topical = [title, funder, description, categoryNote].join("\n");
      if (priority.has(agencyCode) || mentionsSoutheastAsia(topical)) geographies.push("philippines_sea");
      if (!priority.has(agencyCode)) {
        const abroad =
          inAgencyGate(agencyCode) || GLOBAL_TITLE.test(title) || (FOREIGN.test(eligibility) && !FOREIGN_BARRED.test(eligibility));
        geographies.push(abroad ? "worldwide" : "us_only");
      }

      const extras: GrantExtras = { funder_type: "government" };
      if (detail.opportunityNumber ?? hit.number) extras.opportunity_number = (detail.opportunityNumber ?? hit.number)!;
      if (department && department !== funder) extras.department = department;
      if (eligibility) extras.eligibility = excerpt(eligibility, 120);
      const applicantTypes = (body.applicantTypes ?? []).map((type) => withoutCrossReference(type.description)).filter(Boolean);
      if (applicantTypes.length > 0) extras.applicant_types = applicantTypes;
      const listings = (detail.cfdas ?? []).map((aln) => [aln.cfdaNumber, aln.programTitle].filter(Boolean).join(" ")).filter(Boolean);
      if (listings.length > 0) extras.assistance_listings = listings;
      const totalFunding = positiveInt(body.estimatedFunding);
      if (totalFunding) extras.estimated_total_funding = { amount: totalFunding, currency: "USD" };
      const awards = positiveInt(body.numberOfAwards);
      if (awards) extras.expected_awards = awards;
      if (typeof body.costSharing === "boolean") extras.cost_sharing = body.costSharing ? "Required" : "Not required";

      return {
        source_id: seed.id,
        external_id: raw.external_id,
        title,
        funder,
        summary: excerpt(description),
        url: grantsGovPageUrl(detail.id),
        apply_url: applyUrl,
        funding_type: fundingType((body.fundingInstruments ?? []).map((instrument) => instrument.id)),
        amount_min: positiveInt(body.awardFloor),
        amount_max: positiveInt(body.awardCeiling),
        currency: "USD",
        deadline,
        deadline_type: deadline ? "fixed" : openEnded || ROLLING.test(body.responseDateDesc ?? "") ? "rolling" : "unknown",
        opens_at: forecast ? leadingDate(body.estSynopsisPostingDateStr) : null,
        ...(forecast ? { forecast: true } : {}),
        posted_at: posted ? noonUTC(posted) : null,
        last_verified_at: raw.fetched_at,
        geographies,
        sdgs: [],
        values: [],
        tags: (body.fundingActivityCategories ?? [])
          .map((category) => withoutCrossReference(category.description))
          .filter((label) => label && label !== "Other"),
        schema_version: GRANTS_SCHEMA_VERSION,
        extras,
        relevance: score([topical, department, eligibility].join("\n"), gate1),
      };
    },
  };
}
