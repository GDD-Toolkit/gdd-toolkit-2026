// Vocabularies shared across the toolkit. Region, Value and SDG were types in
// CaseStudies.ts until PR #67 removed that file; they live here as `as const`
// arrays so both the frontend and the grant-automation worker can validate
// against them at runtime as well as at compile time.

export const REGIONS = [
  "North America",
  "Latin America and Caribbean",
  "Sub-Saharan Africa",
  "Middle East, North Africa, Afghanistan, & Pakistan",
  "Europe & Central Asia",
  "South Asia",
  "East Asia & Pacific",
  "Global",
] as const;
export type Region = (typeof REGIONS)[number];

/** The toolkit's human-development values. */
export const VALUES = [
  "Well-Being",
  "Equality",
  "Empowerment",
  "Sustainability",
  "Human Rights",
  "Cultural Freedom",
  "Responsibility",
] as const;
export type Value = (typeof VALUES)[number];

/** UN Sustainable Development Goals, by number. */
export const SDGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] as const;
export type SDG = (typeof SDGS)[number];
