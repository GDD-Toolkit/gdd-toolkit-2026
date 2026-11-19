import type { Grant } from "@shared/types/Grants";
import type { GrantDetailResponse, SourceSummary } from "@shared/types/GrantsApi";

/** A complete, valid grant for component and API tests. */
export const sampleGrant: Grant = {
  id: "0f6c9a2e-5c1b-4f0e-9d5a-2b7e1c3d4a5b",
  source_id: "grants-gov",
  external_id: "SMOKE-0001",
  title: "Community water and sanitation small grants, Philippines 2027",
  funder: "Example Foundation",
  summary: "Small grants for community organisations improving water access and sanitation in Mindanao.",
  url: "https://example.org/grants/smoke-0001",
  apply_url: "https://example.org/apply/smoke-0001",
  funding_type: "grant",
  amount_min: 5000,
  amount_max: 50000,
  currency: "USD",
  deadline: "2027-03-31",
  deadline_type: "fixed",
  opens_at: null,
  status: "open",
  posted_at: "2026-11-01T12:00:00.000Z",
  // Noon UTC so the local calendar date is 3 Nov in every test time zone.
  first_seen_at: "2026-11-03T12:00:00.000Z",
  last_seen_at: "2026-11-03T12:00:00.000Z",
  last_verified_at: "2026-11-03T12:00:00.000Z",
  geographies: ["philippines_sea"],
  sdgs: [6],
  values: ["Well-Being", "Sustainability"],
  tags: ["wash", "community"],
  curation: "auto",
  content_hash: "sha256:0000000000000000000000000000000000000000000000000000000000000000",
  schema_version: 1,
  extras: {
    applicant_types: ["nonprofit", "community organisation"],
    agency_code: "EXAMPLE",
    award_ceiling: { amount: 50000, currency: "USD" },
    eligibility: "Registered community organisations in Mindanao.",
  },
};

export const sampleDetail: GrantDetailResponse = {
  ...sampleGrant,
  source: { name: "Grants.gov", last_run_at: "2026-11-03T12:00:00.000Z" },
};

export const sampleSources: SourceSummary[] = [
  { id: "grants-gov", name: "Grants.gov", enabled: true, last_run_at: "2026-11-03T12:00:00.000Z", license_note: null },
];
