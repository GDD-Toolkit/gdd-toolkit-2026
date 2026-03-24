export type Region =
  | "North America"
  | "Latin America and Caribbean"
  | "Sub-Saharan Africa"
  | "Middle East, North Africa, Afghanistan, & Pakistan"
  | "Europe & Central Asia"
  | "South Asia"
  | "East Asia & Pacific"
  | "Global";

export type Value =
  | "Well-Being"
  | "Equality"
  | "Empowerment"
  | "Sustainability"
  | "Human Rights"
  | "Cultural Freedom"
  | "Responsibility";

export type SDG =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17;

export type Author = {
  name?: string,
  contact: string, //email address or number
}

const Indicators = {
  "Well-Being": [
    "Readily available access to essential goods including water, food, sanitation",
    "Readily available access to institutionalized goods including healthcare, education, sanitation",
    "Accessible income",
    "Self-Reported happiness",
    "Access to individual agency and autonomy",
  ],
  Equality: [
    "Equal access to education",
    "Equal access to healthcare",
    "Equal access to housing",
    "Equal access to political participation",
    "Equal access to social participation",
  ],
  Empowerment: [
    "Political representation",
    "Transparent information flow",
    "Freedom to make decisions without coercion",
    "Self-reported autonomy",
    "Government frameworks for protection of rights",
  ],
  Sustainability: [
    "Presence of CO2 emissions thresholds",
    "Efforts to preserve biodiversity and ecosystems",
    "Sustainable food production",
    "Conservative natural resource usage",
    "Integration of renewable resources",
  ],
  "Human Rights": [
    "Core set of freedoms guaranteed regardless of characteristics or status",
    "Others have obligations and duties to uphold the human right to life",
    "Right to standard level of living, health, and education",
    "Protections against discrimination",
    "Adherence to International Human Rights Treaties",
  ],
  "Cultural Freedom": [
    "Empowering individuals to freely participate in the development",
    "Protect and promote human rights",
    "Promote the freedom to enjoy one’s culture in a way consistent with human rights",
    "Ability to participate in cultural practices",
    "Promote the protection of minority cultures against wholesale destruction",
  ],
  Responsibility: [
    "Giving and receiving bilateral and multilateral aid",
    "Limited distortion of policies by high level leaders at the cost of public good",
    "Limited abuse of power by mid-level leaders in interactions with citizens",
    "Accountable use of public accommodations",
    "Transparent administrative proceedings",
  ],
} as const;

export type IndicatorsByValue = typeof Indicators;

export type ProjectEvaluation = {
  [K in keyof IndicatorsByValue as Lowercase<K>]: {
    summary: string;
    indicators_checked?: IndicatorsByValue[K];
    score?: "A" | "B" | "C" | "F";
  };
};

export type Project = {
  id: string;
  name: string;
  image?: string;
  regions: Region[];
  values: Value[];
  sdgs: SDG[];
  keywords: string[];
  sdgs_content: string;
  description: string;
  lessons_learned: string;
  evaluation: ProjectEvaluation;
};

export type Policy = {
  id: string;
  name: string;
  image?: string;
  region: Region;
  values: Value[];
  sdgs: SDG[];
  issue: string;
  introduction: string;
  goal: string;
  methods: string;
  solutions?: string;
  findings_implications: string;
  relation_sdgs_values: string;
  references: string[];
  evaluation: ProjectEvaluation;
  authors?: Author[];
};

export type Maldevelopment = {
  id: string;
  name: string;
  image?: string;
  region: Region;
  values: Value[];
  sdgs: SDG[];
  summary: string,
  relation_sdgs_values: string;
  references: string[];
  authors?: Author[];
  evaluation: ProjectEvaluation;
}