// Curated entries: grants with no machine-readable feed, added by the research
// module through pull requests to data/curated.json. The file starts empty; the
// schema test keeps malformed entries out of main.
import { readFile } from "node:fs/promises";
import { z } from "zod";
import {
  DeadlineType,
  FundingType,
  GRANTS_SCHEMA_VERSION,
  Geography,
  GrantExtras,
  type NormalizedGrant,
  type RawFetch,
  type SourceAdapter,
} from "../../../../shared/types/Grants.js";
import { VALUES } from "../../../../shared/types/Common.js";
import { fieldDefsFor } from "./field-defs.js";

const isoDate = z.iso.date();

/** One hand-written entry. Dates are plain "YYYY-MM-DD"; `verified_at` is the day the page was last checked. */
export const CuratedEntry = z.strictObject({
  external_id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "lowercase letters, digits and dashes"),
  title: z.string().min(1),
  funder: z.string().min(1),
  summary: z.string().min(1),
  url: z.url(),
  apply_url: z.url().nullable().default(null),
  funding_type: FundingType.default("grant"),
  amount_min: z.number().int().nonnegative().nullable().default(null),
  amount_max: z.number().int().nonnegative().nullable().default(null),
  currency: z.string().length(3).default("USD"),
  deadline: isoDate.nullable().default(null),
  deadline_type: DeadlineType.default("unknown"),
  opens_at: isoDate.nullable().default(null),
  posted_at: isoDate.nullable().default(null),
  verified_at: isoDate,
  geographies: z.array(Geography).default([]),
  sdgs: z.array(z.number().int().min(1).max(17)).default([]),
  values: z.array(z.enum(VALUES)).default([]),
  tags: z.array(z.string().min(1)).default([]),
  extras: GrantExtras.default({}),
});
export type CuratedEntry = z.infer<typeof CuratedEntry>;
export type CuratedEntryInput = z.input<typeof CuratedEntry>;

export const CuratedFile = z.array(CuratedEntry);

export type CuratedOptions = {
  /** Path of the JSON file; defaults to data/curated.json in this package. */
  file?: string;
  /** In-memory entries instead of a file (tests, sample data). */
  entries?: unknown[];
  /** Registry id; "curated" unless a test or the sample seeder wants its own source. */
  sourceId?: string;
  name?: string;
  licenseNote?: string;
};

const DEFAULT_FILE = new URL("../../data/curated.json", import.meta.url);

export function createCuratedAdapter(options: CuratedOptions = {}): SourceAdapter {
  const sourceId = options.sourceId ?? "curated";
  const file = options.file ?? DEFAULT_FILE.pathname;

  return {
    source: {
      id: sourceId,
      name: options.name ?? "Curated by the research module",
      adapter: "curated",
      config: options.entries ? { entries: "in-memory" } : { file },
      license_note: options.licenseNote ?? "Hand-written summaries; every entry links to its original source page.",
      enabled: true,
      last_run_at: null,
    },
    fieldDefs: fieldDefsFor("curated", sourceId),

    async *fetch({ limit } = {}) {
      const entries = options.entries ?? (JSON.parse(await readFile(file, "utf8")) as unknown);
      if (!Array.isArray(entries)) throw new Error(`${file}: expected a JSON array`);
      const fetched_at = new Date().toISOString();
      for (const [index, payload] of entries.entries()) {
        if (limit !== undefined && index >= limit) return;
        const entry = payload as Partial<CuratedEntryInput>;
        yield { external_id: entry.external_id ?? `entry-${index}`, url: entry.url ?? "", fetched_at, payload };
      }
    },

    normalize(raw: RawFetch): NormalizedGrant | null {
      const parsed = CuratedEntry.safeParse(raw.payload);
      if (!parsed.success) return null;
      const { verified_at, posted_at, ...entry } = parsed.data;
      // Hand-written dates become noon UTC so every time zone shows the same calendar day.
      return {
        ...entry,
        source_id: sourceId,
        posted_at: posted_at ? `${posted_at}T12:00:00.000Z` : null,
        last_verified_at: `${verified_at}T12:00:00.000Z`,
        schema_version: GRANTS_SCHEMA_VERSION,
        relevance: { score: 100, reasons: ["curated"] },
      };
    },
  };
}
