// Relevance without an LLM: two gates read from data/relevance.json, which the
// research module tunes by pull request.
//   Gate 1: the source's own taxonomy (Grants.gov categories and agencies, EU
//           programme ids). Adapters apply it when they search.
//   Gate 2: topic keywords, scored here. Keep a record when the score reaches
//           `threshold`.
import { readFileSync } from "node:fs";
import { z } from "zod";
import type { NormalizedGrant } from "../../../../shared/types/Grants.js";
import { addDays } from "./status.js";

export const RelevanceConfig = z.strictObject({
  threshold: z.number(),
  gate1: z.strictObject({
    /** Grants.gov funding-activity category codes to search. */
    grants_gov_categories: z.array(z.string().min(1)),
    /** Every Grants.gov sub-agency whose code starts with `prefix` is searched as well; `weight` is added to its records' scores. */
    grants_gov_agency_prefixes: z.array(z.strictObject({ prefix: z.string().min(1), weight: z.number().default(0) })),
    /** Launch-market agencies (Philippines / Southeast Asia): always searched, and kept without keyword hits. */
    grants_gov_priority_agencies: z.array(z.string().min(1)),
    /** EU programmes to search. `weight` is added to the score of every record in the programme. */
    eu_programmes: z.array(z.strictObject({ id: z.string().regex(/^\d+$/), name: z.string().min(1), weight: z.number().default(0) })),
  }),
  gate2: z.strictObject({
    keywords: z.array(z.strictObject({ term: z.string().min(2), weight: z.number().positive() })),
    block: z.array(z.string().min(2)),
  }),
});
export type RelevanceConfig = z.infer<typeof RelevanceConfig>;

/** Keyword hits add up to this much, however many match. */
export const KEYWORD_CAP = 6;
/** Each block term that matches. */
export const BLOCK_WEIGHT = -5;

const DEFAULT_FILE = new URL("../../data/relevance.json", import.meta.url);

export const loadRelevance = (file: string | URL = DEFAULT_FILE): RelevanceConfig =>
  RelevanceConfig.parse(JSON.parse(readFileSync(file, "utf8")));

/** Whole-term match, case-insensitive; spaces and hyphens are interchangeable and a plural "s" is allowed. */
function termPattern(term: string): RegExp {
  const body = term
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/[\s-]+/g, "[\\s-]+");
  return new RegExp(`(?<![\\p{L}\\p{N}])${body}s?(?![\\p{L}\\p{N}])`, "iu");
}

/** A gate-1 match the adapter found, with the score it carries (0 when it only explains why the record was fetched). */
export type Gate1Match = { reason: string; weight?: number };
export type Scorer = (text: string, gate1?: Gate1Match[]) => NormalizedGrant["relevance"];

export function createScorer(config: RelevanceConfig): Scorer {
  const keywords = config.gate2.keywords.map((keyword) => ({ ...keyword, pattern: termPattern(keyword.term) }));
  const blocks = config.gate2.block.map((term) => ({ term, pattern: termPattern(term) }));

  return (text, gate1 = []) => {
    const reasons: string[] = [];
    let score = 0;
    for (const match of gate1) {
      score += match.weight ?? 0;
      reasons.push(match.weight ? `${match.weight > 0 ? "+" : ""}${match.weight} ${match.reason}` : match.reason);
    }
    let keywordScore = 0;
    for (const { term, weight, pattern } of keywords) {
      if (!pattern.test(text)) continue;
      keywordScore += weight;
      reasons.push(`+${weight} ${term}`);
    }
    score += Math.min(keywordScore, KEYWORD_CAP);
    for (const { term, pattern } of blocks) {
      if (!pattern.test(text)) continue;
      score += BLOCK_WEIGHT;
      reasons.push(`${BLOCK_WEIGHT} ${term}`);
    }
    return { score, reasons };
  };
}

/** Calls with no closing date that were posted longer ago than this are presumed dead. */
export const UNDATED_MAX_AGE_DAYS = 365;

/**
 * Why a freshly fetched record is not worth listing, or null. Feeds keep
 * returning calls long after they end: Grants.gov forecasts from 2019, EU
 * topics flagged open with a 2023 deadline, notices of intent from 2020 with a
 * placeholder closing date. An evergreen programme that falls foul of the
 * one-year rule can be added to data/curated.json, which skips this check.
 */
export function staleReason(grant: Pick<NormalizedGrant, "deadline" | "posted_at">, today: string): string | null {
  if (grant.deadline) return grant.deadline < today ? `deadline ${grant.deadline} has passed` : null;
  const posted = grant.posted_at?.slice(0, 10);
  return posted && posted < addDays(today, -UNDATED_MAX_AGE_DAYS)
    ? `no closing date and posted ${posted}, more than a year ago`
    : null;
}
