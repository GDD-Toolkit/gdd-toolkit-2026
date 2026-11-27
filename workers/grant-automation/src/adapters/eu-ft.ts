// EU Funding & Tenders Portal: the portal's own search API ("SEDIA"). No key and
// no official documentation, so the response shape is checked on every page and
// by test/eu-ft.test.ts. The observed contract is recorded in
// .claude/skills/eu-funding-tenders-integration/SKILL.md and summarised in the README.
//
// The search result already carries the description, budget and deadlines of a
// topic, so there is no per-topic request.
import { z } from "zod";
import {
  GRANTS_SCHEMA_VERSION,
  type DeadlineType,
  type FundingType,
  type GrantExtras,
  type NormalizedGrant,
  type RawFetch,
  type SourceAdapter,
} from "../../../../shared/types/Grants.js";
import { fetchJson } from "../lib/http.js";
import { excerpt, htmlToText, httpUrl, leadingDate, mentionsSoutheastAsia, positiveInt, SEA_COUNTRY_CODES } from "../lib/text.js";
import { createScorer, type RelevanceConfig } from "../pipeline/relevance.js";
import { fieldDefsFor } from "./field-defs.js";
import type { SourceSeed } from "./index.js";

const SEARCH = "https://api.tech.ec.europa.eu/search-api/prod/rest/search";
/** The version the adapter was verified against (2.157.1 on 2026-11-05, re-checked 2026-11-26). A different value is a prompt to re-check, not an error. */
export const EU_FT_API_VERSION = "2.159";
const PAGE_SIZE = 100; // the API caps it here
/** 1 = grant topics, 2 = external-action calls for proposals (EuropeAid / PROSPECT). 8 (cascade funding) is out of scope. */
const TYPES = ["1", "2"];
const FORTHCOMING = "31094501";
const OPEN = "31094502";
/** frameworkProgramme id of NDICI – Global Europe, the one grant programme aimed outside the EU. */
const GLOBAL_EUROPE = "45876777";

export const euFtTopicUrl = (identifier: string) =>
  `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/${encodeURIComponent(identifier)}`;

/** Every metadata value is an array of strings, JSON documents included. */
const Metadata = z.record(z.string(), z.array(z.string()));
const Result = z.object({ reference: z.string(), url: z.string().nullish(), metadata: Metadata });
export const EuFtPage = z.object({
  apiVersion: z.string().nullish(),
  totalResults: z.number(),
  results: z.array(Result),
});

const BudgetOverview = z.object({
  budgetTopicActionMap: z.record(
    z.string(),
    z.array(
      z.object({
        action: z.string().nullish(),
        expectedGrants: z.number().nullish(),
        minContribution: z.number().nullish(),
        maxContribution: z.number().nullish(),
        budgetYearMap: z.record(z.string(), z.union([z.string(), z.number()])).nullish(),
      }),
    ),
  ),
});

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

function fundingType(actions: string[]): FundingType {
  const all = actions.join(" ");
  if (/fellowship/i.test(all)) return "fellowship";
  if (/prize/i.test(all)) return "prize";
  if (/procurement/i.test(all)) return "other";
  return "grant";
}

function budgetOf(identifier: string, encoded: string | undefined) {
  if (!encoded) return null;
  let json: unknown;
  try {
    json = JSON.parse(encoded);
  } catch {
    return null;
  }
  const parsed = BudgetOverview.safeParse(json);
  if (!parsed.success) return null;
  const all = Object.values(parsed.data.budgetTopicActionMap).flat();
  // An overview can cover a whole call; this topic's rows start with its identifier.
  const mine = all.filter((row) => row.action?.startsWith(identifier));
  const rows = mine.length > 0 ? mine : all;
  const positives = (pick: (row: (typeof rows)[number]) => unknown) =>
    rows.map((row) => positiveInt(pick(row))).filter((n): n is number => n !== null);
  const min = positives((row) => row.minContribution);
  const max = positives((row) => row.maxContribution);
  // Sub-actions of one topic repeat the same budget line, so take the largest rather than the sum.
  const totals = positives((row) => Object.values(row.budgetYearMap ?? {}).reduce<number>((sum, v) => sum + (Number(v) || 0), 0));
  const grants = positives((row) => row.expectedGrants);
  return {
    amount_min: min.length > 0 ? Math.min(...min) : null,
    amount_max: max.length > 0 ? Math.max(...max) : null,
    total: totals.length > 0 ? Math.max(...totals) : null,
    expected: grants.length > 0 ? Math.max(...grants) : null,
  };
}

export function createEuFtAdapter(seed: SourceSeed, relevance: RelevanceConfig, fetchImpl: typeof fetch = fetch): SourceAdapter {
  const programmes = new Map(relevance.gate1.eu_programmes.map((programme) => [programme.id, programme]));
  const score = createScorer(relevance);
  const query = {
    bool: {
      must: [
        { terms: { type: TYPES } },
        { terms: { status: [FORTHCOMING, OPEN] } },
        { terms: { frameworkProgramme: [...programmes.keys()] } },
      ],
    },
  };

  async function page(pageNumber: number) {
    // Every part must declare application/json: a plain form field makes the API ignore the filter.
    const form = new FormData();
    const part = (value: unknown) => new Blob([JSON.stringify(value)], { type: "application/json" });
    form.append("query", part(query));
    form.append("languages", part(["en"]));
    // The portal's default sort repeats and drops results across pages; identifier order does not.
    form.append("sort", part({ field: "identifier", order: "ASC" }));
    const url = `${SEARCH}?apiKey=SEDIA&text=***&pageSize=${PAGE_SIZE}&pageNumber=${pageNumber}`;
    return EuFtPage.parse(await fetchJson(url, { method: "POST", body: form }, fetchImpl));
  }

  return {
    source: { ...seed, enabled: true, last_run_at: null },
    fieldDefs: fieldDefsFor("eu-ft", seed.id),

    async *fetch({ limit } = {}) {
      const seen = new Set<string>();
      for (let pageNumber = 1; ; pageNumber += 1) {
        const { results, totalResults } = await page(pageNumber);
        const fetched_at = new Date().toISOString();
        for (const result of results) {
          const identifier = result.metadata.identifier?.[0];
          if (!identifier || seen.has(identifier)) continue;
          if (limit !== undefined && seen.size >= limit) return;
          seen.add(identifier);
          yield { external_id: identifier, url: httpUrl(result.url) ?? "", fetched_at, payload: result };
        }
        if (results.length < PAGE_SIZE || pageNumber * PAGE_SIZE >= totalResults) return;
      }
    },

    normalize(raw: RawFetch): NormalizedGrant | null {
      const parsed = Result.safeParse(raw.payload);
      if (!parsed.success) return null;
      const { metadata } = parsed.data;
      const first = (key: string) => metadata[key]?.[0];
      const identifier = first("identifier");
      const title = htmlToText(first("title"));
      if (!identifier || !title) return null;
      // Topics: the portal page, built from the identifier (older records link to a JSON file instead).
      // External-action calls: the PROSPECT page the result links to.
      const url = first("type") === "2" ? (httpUrl(parsed.data.url) ?? httpUrl(first("url"))) : euFtTopicUrl(identifier);
      if (!url) return null;

      const programme = programmes.get(first("frameworkProgramme") ?? "");
      const externalAction = first("type") === "2";
      const today = raw.fetched_at.slice(0, 10);
      const deadlines = [...new Set((metadata.deadlineDate ?? []).map(leadingDate).filter((d): d is string => d !== null))].sort();
      const model = first("deadlineModel");
      let deadline: string | null = deadlines[0] ?? null;
      let deadline_type: DeadlineType = deadline ? "fixed" : "unknown";
      if (deadlines.length > 1) {
        deadline_type = "multiple";
        // Two-stage: the first stage is the one a new applicant must meet. Cut-offs: the next one still ahead.
        if (model !== "two-stage") deadline = deadlines.find((d) => d >= today) ?? deadlines.at(-1)!;
      }
      const started = first("startDate");
      const extras: GrantExtras = { funder_type: "multilateral", opportunity_number: identifier };
      if (programme) extras.programme = programme.name;
      const gate1 = programme ? [{ reason: `programme ${programme.name}`, weight: programme.weight }] : [];
      const shared = {
        source_id: seed.id,
        external_id: raw.external_id,
        title,
        funder: "European Commission",
        url,
        apply_url: null,
        currency: first("currency")?.length === 3 ? first("currency")! : "EUR",
        deadline,
        deadline_type,
        ...(first("status") === FORTHCOMING ? { forecast: true } : {}),
        last_verified_at: raw.fetched_at,
        sdgs: [],
        values: [],
        schema_version: GRANTS_SCHEMA_VERSION,
      } satisfies Partial<NormalizedGrant>;

      if (externalAction) {
        // The country is the last segment of "EuropeAid/187757/DD/ACT/KH" (ISO 3166 alpha-2, or "Multi").
        const code = identifier.split("/").at(-1)?.toUpperCase() ?? "";
        const country = /^[A-Z]{2}$/.test(code) ? (countryNames.of(code) ?? code) : "several countries";
        const total = positiveInt(first("budget"));
        if (total) extras.estimated_total_funding = { amount: total, currency: shared.currency };
        return {
          ...shared,
          // These records carry no description; the line is built from their own fields.
          summary: `EU external action call for proposals ${identifier}, for ${country}.`,
          funding_type: "grant",
          amount_min: null,
          amount_max: null,
          opens_at: null,
          posted_at: started && !Number.isNaN(Date.parse(started)) ? new Date(started).toISOString() : null,
          geographies: SEA_COUNTRY_CODES.has(code) || mentionsSoutheastAsia(title) ? ["philippines_sea", "worldwide"] : ["worldwide"],
          tags: ["External action", ...(country === "several countries" ? [] : [country])],
          extras,
          relevance: score([title, country].join("\n"), gate1),
        };
      }

      const description = htmlToText(first("descriptionByte"));
      const actions = [...new Set((metadata.typesOfAction ?? []).map((action) => action.replace(/\s+/g, " ").trim()))];
      const callTitle = htmlToText(first("callTitle"));
      const budget = budgetOf(identifier, first("budgetOverview"));
      if (callTitle && callTitle !== first("callIdentifier") && callTitle !== title) extras.call = callTitle;
      if (actions.length > 0) extras.types_of_action = actions;
      if (model) extras.deadline_model = model;
      if (deadlines.length > 1) extras.all_deadlines = deadlines;
      if (budget?.total) extras.estimated_total_funding = { amount: budget.total, currency: "EUR" };
      if (budget?.expected) extras.expected_awards = budget.expected;
      const topical = [title, callTitle, description, (metadata.tags ?? []).join(", ")].join("\n");
      const beyondEurope = first("frameworkProgramme") === GLOBAL_EUROPE;

      return {
        ...shared,
        summary: excerpt(description),
        funding_type: fundingType(actions),
        amount_min: budget?.amount_min ?? null,
        amount_max: budget?.amount_max ?? null,
        opens_at: leadingDate(started),
        posted_at: null, // the search result has no publication date for topics
        geographies: [
          ...(mentionsSoutheastAsia(topical) ? ["philippines_sea"] : []),
          beyondEurope ? "worldwide" : "eu_and_partners",
        ],
        tags: [...(programme ? [programme.name] : []), ...actions].slice(0, 6),
        extras,
        relevance: score(topical, gate1),
      };
    },
  };
}
