import type { StrapiCohort, StrapiTeam } from "@/api/strapi";

export interface ModuleTeamLead {
  name: string;
  initials: string;
  focus: string;
}

export interface ModuleTeam {
  id: string;
  shortName: string;
  name: string;
  toolName: string;
  toolHref: string;
  toolExternal?: boolean;
  cohortYear: number;
  purpose: string;
  prms: ModuleTeamLead[];
  students: string[];
}

export interface CohortGroup {
  year: number;
  label: string;
  teams: ModuleTeam[];
}

type ModuleMetadata = {
  shortName?: string;
  toolName: string;
  toolHref: string;
  toolExternal?: boolean;
  purpose: string;
  prmFocus: string;
};

const MODULE_METADATA: Record<string, ModuleMetadata> = {
  "ai development": {
    shortName: "AI Development",
    toolName: "AI Business Ethics Canvas",
    toolHref: "https://main.dn6y4rvhmhz3f.amplifyapp.com/",
    toolExternal: true,
    purpose:
      "Builds and trains the AI Business Ethics Canvas, transforming guided practitioner prompts and curated case studies into customized, values-aligned PDF project proposals.",
    prmFocus:
      "Leads sprint direction, AI proposal architecture & student mentorship.",
  },
  "ai ethics": {
    shortName: "AI Ethics",
    toolName: "AI Ethics Dashboard",
    toolHref: "/ai-ethics-dashboard",
    purpose:
      "Evaluates popular AI platforms across bias, privacy, transparency, and equity so development practitioners adopt responsible AI tools with confidence.",
    prmFocus:
      "Directs ethical AI benchmarking criteria, scoring rubrics & research synthesis.",
  },
  "human centered design": {
    shortName: "Human Centered Design",
    toolName: "Human Centered Design",
    toolHref: "/human-centered-design",
    purpose:
      "Creates participatory research kits, stakeholder persona templates, field surveys, and HCD readiness assessments that center lived community experience.",
    prmFocus:
      "Mentors participatory design methodology, user empathy kits & quiz design.",
  },
  "project planning": {
    shortName: "Project Planning",
    toolName: "Project Planning",
    toolHref: "/project-planning",
    purpose:
      "Curates practical project methodologies, including Agile, Lean, DMAIC, Waterfall, and Journey Mapping, paired with ethical accountability checklists.",
    prmFocus:
      "Guides planning framework curation, keyword matching & milestone checklists.",
  },
  "project evaluation": {
    shortName: "Project Evaluation",
    toolName: "Project Evaluation",
    toolHref: "/project-evaluation",
    purpose:
      "Designs structured ethical impact rubrics and measurable indicators to assess worthwhile outcomes and detect unintended community harm early.",
    prmFocus:
      "Leads outcome indicator modeling, evaluation scoring & impact testing.",
  },
  "infrastructure and interface": {
    shortName: "Infrastructure & UI",
    toolName: "Open-Access Web Platform",
    toolHref: "/ethics-of-innovation",
    purpose:
      "Architects the open-access web application, CMS content pipelines, authentication, and interactive data visualizations powering every module.",
    prmFocus:
      "Oversees full-stack architecture, CMS integration & user interface engineering.",
  },
  maldevelopment: {
    shortName: "Maldevelopment",
    toolName: "Worthwhile Development & Cases",
    toolHref: "/worthwhile-development",
    purpose:
      "Investigates real-world global interventions to contrast capability-expanding worthwhile development against maldevelopment that harms or excludes.",
    prmFocus:
      "Mentors qualitative case study analysis & maldevelopment taxonomy research.",
  },
  "development ethics": {
    shortName: "Development Ethics",
    toolName: "Human Centered Innovations",
    toolHref: "/development-ethics",
    purpose:
      "Grounds the toolkit in core development ethics scholarship, translating values-based principles into practical guidance for social impact teams.",
    prmFocus:
      "Guides ethical framework synthesis, research reviews & scholarly citations.",
  },
  "ethics of innovation": {
    shortName: "Ethics of Innovation",
    toolName: "Ethics of Innovation",
    toolHref: "/ethics-of-innovation",
    purpose:
      "Researches the 9 Principles for Digital Development, covering open standards, privacy, scale, and sustainability for ethical technology design.",
    prmFocus:
      "Mentors digital ethics case research & interactive principle checklists.",
  },
  "public policy": {
    shortName: "Public Policy",
    toolName: "Geopolitical Analysis & Funding",
    toolHref: "/geopolitical-analysis",
    purpose:
      "Connects development ethics frameworks to international policy contexts, World Bank regional data, and practitioner funding ecosystems.",
    prmFocus:
      "Guides regional policy research, funding alignment & ethical governance briefs.",
  },
  "pro public policy": {
    shortName: "Public Policy",
    toolName: "Geopolitical Analysis & Funding",
    toolHref: "/geopolitical-analysis",
    purpose:
      "Connects development ethics frameworks to international policy contexts, World Bank regional data, and practitioner funding ecosystems.",
    prmFocus:
      "Guides regional policy research, funding alignment & ethical governance briefs.",
  },
  "human rights and capabilities": {
    shortName: "Capabilities & Rights",
    toolName: "The Capability Approach",
    toolHref: "/capability-approach",
    purpose:
      "Operationalizes Amartya Sen and Martha Nussbaum's Capability Approach so development work expands genuine human freedoms beyond GDP.",
    prmFocus:
      "Guides human capabilities scholarship & rights-based evaluation research.",
  },
  "operational protocols": {
    shortName: "Operational Protocols",
    toolName: "Project Planning & Protocols",
    toolHref: "/project-planning",
    purpose:
      "Establishes ethical operational protocols, field governance standards, and repeatable team workflows across partner engagements.",
    prmFocus:
      "Leads operational workflow research, partner alignment & governance documentation.",
  },
  "marketing and outreach": {
    shortName: "Marketing & Outreach",
    toolName: "The Development Lens Podcast",
    toolHref: "/podcast",
    purpose:
      "Shares student research, global partner stories, and toolkit adoption guides through outreach campaigns and The Development Lens podcast.",
    prmFocus:
      "Directs community storytelling, partner outreach & podcast production.",
  },
  "training and knowledge development": {
    shortName: "Training & Knowledge",
    toolName: "Case Studies & Guides",
    toolHref: "/case-studies",
    purpose:
      "Builds practitioner learning modules, onboarding guides, and workshops that help teams apply development ethics frameworks in the field.",
    prmFocus:
      "Guides workshop curriculum design, knowledge synthesis & training guides.",
  },
};

function normalizeKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function initialsOf(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getMetadataForTeam(teamName: string): ModuleMetadata {
  const key = normalizeKey(teamName);
  if (MODULE_METADATA[key]) return MODULE_METADATA[key];

  // Partial fallback match (e.g. "AI Development Team" -> "ai development")
  for (const [metaKey, meta] of Object.entries(MODULE_METADATA)) {
    if (key.includes(metaKey) || metaKey.includes(key)) {
      return meta;
    }
  }

  return {
    toolName: "Development Ethics Toolkit",
    toolHref: "/acknowledgements",
    purpose:
      "Contributes student-led research, frameworks, and practical resources to expand ethical, human-centered social impact.",
    prmFocus:
      "Mentors undergraduate student researchers and guides module deliverables.",
  };
}

function buildTeamFromMembers(
  cohortYear: number,
  teamName: string,
  memberNames: string[],
  overrides?: { id?: string; purpose?: string | null },
): ModuleTeam {
  const cleanName = teamName.trim() || "Research Module";
  const meta = getMetadataForTeam(cleanName);

  const prms: ModuleTeamLead[] = [];
  const students: string[] = [];

  for (const raw of memberNames) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const prmMatch = trimmed.match(/^PRM\s*[:\-–]\s*(.+)$/i);
    if (prmMatch && prmMatch[1]) {
      const leadName = prmMatch[1].trim();
      prms.push({
        name: leadName,
        initials: initialsOf(leadName),
        focus: meta.prmFocus,
      });
    } else {
      students.push(trimmed);
    }
  }

  const displayName = /team$/i.test(cleanName)
    ? cleanName
    : `${cleanName} Module Team`;

  return {
    id: overrides?.id ?? `${cohortYear}-${slugify(cleanName)}`,
    shortName: meta.shortName ?? cleanName,
    name: displayName,
    toolName: meta.toolName,
    toolHref: meta.toolHref,
    toolExternal: meta.toolExternal,
    cohortYear,
    purpose: overrides?.purpose?.trim() || meta.purpose,
    prms,
    students,
  };
}

function unwrapTeams(
  raw: StrapiTeam[] | { data?: StrapiTeam[] } | null | undefined,
): StrapiTeam[] {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  return [];
}

/**
 * Normalizes Strapi v5 (or v4) `coherts` records into descending CohortGroup[]
 * ready for the homepage Module Teams Carousel.
 */
export function normalizeStrapiCohorts(rawCohorts: StrapiCohort[]): CohortGroup[] {
  const groups: CohortGroup[] = [];

  for (const entry of rawCohorts) {
    const rawYear = entry.year ?? entry.attributes?.year;
    const year = typeof rawYear === "number" ? rawYear : Number(rawYear);
    if (!Number.isFinite(year) || year <= 0) continue;

    const rawTeams = unwrapTeams(entry.teams ?? entry.attributes?.teams);
    const teams: ModuleTeam[] = rawTeams
      .map((team, idx) => {
        const teamName = (
          team.Team_name ??
          team.attributes?.Team_name ??
          ""
        ).trim();
        if (!teamName) return null;

        const teammates = team.teammates ?? team.attributes?.teammates ?? [];
        const memberNames = Array.isArray(teammates)
          ? teammates
              .map((m) => (m?.member_name ?? "").trim())
              .filter(Boolean)
          : [];

        const cmsPurpose =
          team.purpose ??
          team.attributes?.purpose ??
          team.description ??
          team.attributes?.description ??
          null;

        const id =
          team.documentId ??
          (team.id !== undefined ? `${year}-team-${team.id}` : `${year}-${idx}`);

        return buildTeamFromMembers(year, teamName, memberNames, {
          id,
          purpose: cmsPurpose,
        });
      })
      .filter((t): t is ModuleTeam => t !== null);

    groups.push({
      year,
      label: `Cohort ${year}`,
      teams,
    });
  }

  return groups.sort((a, b) => b.year - a.year);
}

/**
 * Fallback dataset covering all 6 UMD FIRE cohorts (2025 -> 2020 descending),
 * used seamlessly when Strapi is offline, unconfigured, or returns no cohorts.
 */
const RAW_FALLBACK_COHORTS: {
  year: number;
  modules: { name: string; members: string[] }[];
}[] = [
  {
    year: 2025,
    modules: [
      {
        name: "AI Development",
        members: [
          "PRM: Krishnan Tholkappian",
          "Youssef Ali Ahmed",
          "Nakshatra Hiray",
          "Siddhant Jain",
          "Richard Thomas",
          "Esha Vigneswaran",
        ],
      },
      {
        name: "AI Ethics",
        members: [
          "PRM: Justin Jones",
          "William Bachran",
          "Zoey Katz",
          "Ashlyn Wu",
          "Anna Howell",
        ],
      },
      {
        name: "Human Centered Design",
        members: [
          "PRM: Rowan Kuske",
          "Donovan Campos",
          "Isabella Canlas",
          "Sumer Elsalawi",
          "Arvind Kakanavaram",
          "Madeline Namias",
        ],
      },
      {
        name: "Project Planning",
        members: [
          "PRM: Ruth Whitehouse",
          "Jaspreet Sonu",
          "Grace Wieber",
          "Neeraja Yasam",
        ],
      },
      {
        name: "Project Evaluation",
        members: ["PRM: Jiun Park", "Avery Demarco", "Alia Mubagal"],
      },
      {
        name: "Infrastructure and Interface",
        members: [
          "PRM: Rohan Tadisetty",
          "Saikousil Tirumalasetty",
          "Inemesit Udo-Akang",
          "Raymond Wu",
        ],
      },
      {
        name: "Maldevelopment",
        members: [
          "PRM: Eugene Choi",
          "Emelia Adler",
          "Lexi Bernstein",
          "Daniella Hikin",
          "Grace Wieber",
        ],
      },
      {
        name: "Pro Public Policy",
        members: [
          "PRM: Shirin Saberi",
          "Antonella Almendariz",
          "Mitchell Kuta",
          "Lexi Schwartz",
          "Nola Tischler",
        ],
      },
      {
        name: "Marketing and Outreach",
        members: [
          "PRM: Sabeen Kirwi",
          "Rory Gilmore",
          "Nolan Rogalski",
          "Darian Tamami",
          "Sophia Tamayo",
          "Nevan Vando",
        ],
      },
      {
        name: "Training and Knowledge Development",
        members: [
          "PRM: Javon Lecky",
          "MeiMei Castranova",
          "Nora Grennon",
          "Eric Li",
        ],
      },
    ],
  },
  {
    year: 2024,
    modules: [
      {
        name: "Development Ethics",
        members: [
          "PRM: Regina Hrabinski",
          "Ishan Ho",
          "Manuela Prieto",
          "Rishit Roy",
          "Sara Saleh",
        ],
      },
      {
        name: "Human Centered Design",
        members: [
          "PRM: Khadija Wane",
          "Alyssa Moreno",
          "Ariana Urbano Veliz",
          "Ishani Ghosh",
          "Maanya Upadhyay",
          "Margaret Senturia",
          "Ohan Semirjyan",
          "Ruth Whitehous",
          "Sarah Borgos",
          "Tami Mumuney",
        ],
      },
      {
        name: "Infrastructure and Interface",
        members: [
          "PRM: Jessica Nguyen",
          "PRM: Somil Varshney",
          "Ainsley Jacobsen",
          "Rohan Tadisetty",
          "Saisidharth Seyyadri",
          "Sarah King",
          "Sequoia Santoro",
        ],
      },
      {
        name: "Operational Protocols",
        members: [
          "PRM: Gayatri Lnu",
          "Milenko Stojkovic",
          "Rowan Kuske",
          "Stella Kahric",
          "Timothy Fasold",
        ],
      },
      {
        name: "Project Evaluation",
        members: [
          "PRM: Emilia Guzman",
          "Alexandra Jordan",
          "Jiun Park",
          "Miles Taylor",
          "Riley Revilla",
        ],
      },
      {
        name: "Project Planning",
        members: [
          "PRM: Julie Burke",
          "Jack Noyes",
          "Krishnan Tholkappian",
          "Lila Sheingate",
          "Lilia Shahal",
          "Sabeen Kirwi",
        ],
      },
      {
        name: "Public Policy",
        members: [
          "PRM: Alex Krucoff",
          "Aryaan Ahmed",
          "Cameron Deocampo",
          "Eugene Choi",
          "Gideon Eichenwald",
          "Justin Jones",
          "Natalie Shiloni",
          "Shirin Saberi",
          "Wallace Savoy",
        ],
      },
      {
        name: "Training and Knowledge Development",
        members: [
          "PRM: Rachel Odumade",
          "Aidyn Phillips",
          "Emanuella Chiemeka",
          "Javon Lecky",
        ],
      },
    ],
  },
  {
    year: 2023,
    modules: [
      {
        name: "Development Ethics",
        members: [
          "PRM: Bailey Sullivan",
          "Mayank Barnwal",
          "Christian Galeano Ramos",
          "Anderson Lemus-Del Cid",
          "Ananya Malipeddi",
        ],
      },
      {
        name: "Operational Protocols",
        members: [
          "PRM: Miral Mohammed",
          "Swaminathan Gayatri Lnu",
          "Colin Freas",
          "Alex Krucoff",
          "Miguel Queen",
        ],
      },
      {
        name: "Human Centered Design",
        members: [
          "PRM: Ashley Chau",
          "Wending Zhang",
          "Rachel Odumade",
          "Grace Liao",
        ],
      },
      {
        name: "Project Evaluation",
        members: [
          "PRM: Angie Nguyen",
          "Emilia Guzman",
          "Tobias West",
          "Regina Noel Kelly Hrabinski",
        ],
      },
      {
        name: "Infrastructure and Interface",
        members: [
          "PRM: Jessica Nguyen",
          "Oluwatobiloba Adegbaju",
          "Ojie Okodogbe",
          "Neha Veeragandham",
          "Khardiatou Wane",
          "Bodhi Getsug",
        ],
      },
      {
        name: "Marketing and Outreach",
        members: [
          "PRM: Emily Chung",
          "Ozioma Farrah Chigbo",
          "Lakayla James",
          "Caroline Meury",
          "Isaiah Ragsdale",
        ],
      },
      {
        name: "Project Planning",
        members: [
          "PRM: Quentin Hoglund",
          "Amisiyas Seyoum",
          "Niharika Sur",
          "Guhan Pradeep",
          "Julieanna Burke",
          "Peter Delalio",
        ],
      },
    ],
  },
  {
    year: 2022,
    modules: [
      {
        name: "Development Ethics",
        members: [
          "PRM: Zayna",
          "Tomomi Hayashi",
          "Andrew Wallen",
          "Morgan Borders",
          "Rohin Mishra",
          "Juliette Corseri",
        ],
      },
      {
        name: "Ethics of Innovation",
        members: [
          "PRM: Steven",
          "Henry Matthew Birger",
          "Drew Roland Durst",
          "Edward Rizkilla",
          "Christopher Li",
        ],
      },
      {
        name: "Human Centered Design",
        members: [
          "PRM: Tara Lui",
          "Ashley Chau",
          "Jennifer Chiang",
          "Jenna Nagie",
          "Fe Eugenie Batoon",
        ],
      },
      {
        name: "Maldevelopment",
        members: [
          "PRM: Ethan",
          "Bailey Sullivan",
          "Frances Chen",
          "Joseph Diaz",
          "Sophie Garcia",
        ],
      },
      {
        name: "Infrastructure and Interface",
        members: [
          "PRM: Shiv",
          "Jessica Nguyen",
          "Zoe Cheng",
          "Evan Hardy",
          "Rory Rutledge",
          "Joshua Gabriel Fitch",
        ],
      },
      {
        name: "Marketing and Outreach",
        members: [
          "PRM: Rylan",
          "Ezinne Uzoho",
          "Nick Murray",
          "Emily Chung",
          "Sarah Meklir",
        ],
      },
      {
        name: "Project Planning",
        members: [
          "PRM: Mikhaela",
          "Sarah Dominguez",
          "Haley Robinson",
          "Jordan Snarski",
        ],
      },
    ],
  },
  {
    year: 2021,
    modules: [
      {
        name: "Development Ethics",
        members: [
          "PRM: Cameron Busser",
          "Jessica Chernoff",
          "Samira Mirza",
          "Juliana Woods",
          "Anastasia Katsafanas",
          "Nadia Panni",
          "Madeline Keen",
          "Isaiah Winger",
        ],
      },
      {
        name: "Ethics of Innovation",
        members: [
          "PRM: Raya Seid",
          "Ryan Bassett",
          "Steven Berit",
          "Mirabella Hitzges",
          "Petra Zika",
        ],
      },
      {
        name: "Human Centered Design",
        members: ["PRM: Courtney Davidson", "Tara Lui", "Madeline Omu-Ray"],
      },
      {
        name: "Human Rights & Capabilities",
        members: [
          "PRM: Roma Sheth",
          "Jeremy Christian Mccallum",
          "Daniela Nemi",
          "Jada Smallwood",
          "Olivia Wolfson",
        ],
      },
      {
        name: "Infrastructure and Interface",
        members: [
          "PRM: Shivasree Margam",
          "Brett Caplan",
          "Blen Mulugeta",
          "Sharon Zhang",
        ],
      },
      {
        name: "Marketing & Outreach",
        members: [
          "PRM: Madeline Merrill",
          "Nikita Bandarupalli",
          "Sophia Eitel",
          "Ava Reiner",
          "Alexandra Rogan",
          "Khushi Shah",
        ],
      },
      {
        name: "Project Planning",
        members: [
          "PRM: Mikhaela Mari Cuadera",
          "Emma Orange",
          "Kelan Shah",
          "Zoe Singer",
          "Joseph Udovich",
        ],
      },
    ],
  },
  {
    year: 2020,
    modules: [
      {
        name: "Development Ethics",
        members: ["Vera Gbedemah", "Ethan Paul"],
      },
      {
        name: "Ethics of Innovation",
        members: ["Ange Guianin", "Natasha Panduwawala", "Raya Seid"],
      },
      {
        name: "Human Centered Design",
        members: ["Amarachi Joe-Nweke", "Arrington Lancaster"],
      },
      {
        name: "Human Rights and Capabilities",
        members: ["Maria Castro-Rodriguez", "John Lin", "Roma Seth"],
      },
      {
        name: "Infrastructure and Interface",
        members: ["Manasvi Chegu", "Jalen Coles", "Shivasree Margam"],
      },
      {
        name: "Marketing and Outreach",
        members: [
          "Connie Cheung",
          "Madeline Merrill",
          "Anna Patterson",
          "Sofia Retamal",
        ],
      },
      {
        name: "Project Planning",
        members: ["Mikhaela-Mari Cuadera", "Mahlet Dagne", "Rachel Silberg"],
      },
    ],
  },
];

export const FALLBACK_COHORTS: CohortGroup[] = RAW_FALLBACK_COHORTS.map(
  ({ year, modules }) => ({
    year,
    label: `Cohort ${year}`,
    teams: modules.map((mod) =>
      buildTeamFromMembers(year, mod.name, mod.members),
    ),
  }),
).sort((a, b) => b.year - a.year);

export const MODULE_TEAMS: ModuleTeam[] = FALLBACK_COHORTS[0].teams;

export const WORTHWHILE_VALUES = [
  "Well-being",
  "Equality",
  "Agency & Empowerment",
  "Sustainability",
  "Human Rights",
  "Cultural Freedom",
  "Responsibility",
] as const;

export const HERO_KPIS = [
  { value: "07", label: "Interactive Tools" },
  { value: "06", label: "FIRE Cohorts" },
  { value: "100+", label: "Researchers" },
  { value: "07", label: "Core Values" },
] as const;

export const RESEARCH_PILLARS = [
  {
    code: "FOUNDATION 01",
    title: "Development Ethics",
    description:
      "Closing the gap between value-neutral project plans and genuinely ethical, human-centered social impact.",
    href: "/development-ethics",
  },
  {
    code: "FOUNDATION 02",
    title: "Worthwhile vs. Maldevelopment",
    description:
      "Student investigations contrasting capability-expanding initiatives against interventions that exclude or harm.",
    href: "/worthwhile-development",
  },
  {
    code: "FOUNDATION 03",
    title: "The Capability Approach",
    description:
      "Operationalizing Amartya Sen & Martha Nussbaum's human development lens beyond purely economic metrics.",
    href: "/capability-approach",
  },
] as const;

export const FEATURED_CASE_STUDIES = [
  {
    id: "singapore",
    tag: "SINGAPORE · SMART NATION",
    title:
      "Harnessing ICTs for Efficient Development in Smart Nation Singapore",
    summary: "Digital inclusion, civic trust & ethical governance",
    image: "/singapore.jpg",
    alt: "Smart Nation Singapore skyline",
    href: "/case-studies?id=452a4ce6-286e-4903-87ea-63477f0841cd",
  },
  {
    id: "health-training",
    tag: "SOUTH ASIA · EDUCATION",
    title: "Health Professional Education and Training",
    summary: "Capacity building & equitable clinical outcomes",
    image: "/healthtraining-1.png",
    alt: "Health Professional Education and Training",
    href: "/case-studies?id=eec11844-bf7c-4dec-9c9c-f28666a9076c",
  },
] as const;
