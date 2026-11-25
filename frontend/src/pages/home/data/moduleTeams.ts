export interface ModuleTeam {
  id: string;
  shortName: string;
  name: string;
  toolName: string;
  toolHref: string;
  toolExternal?: boolean;
  cohort: string;
  purpose: string;
  prm: {
    name: string;
    initials: string;
    focus: string;
  };
  students: string[];
}

export const MODULE_TEAMS: ModuleTeam[] = [
  {
    id: "ai-development",
    shortName: "AI Development",
    name: "AI Development Module Team",
    toolName: "AI Business Ethics Canvas",
    toolHref: "https://main.dn6y4rvhmhz3f.amplifyapp.com/",
    toolExternal: true,
    cohort: "Cohort 2025",
    purpose:
      "Builds and trains the AI Business Ethics Canvas—transforming guided practitioner prompts and curated case studies into customized, values-aligned PDF project proposals.",
    prm: {
      name: "Krishnan Tholkappian",
      initials: "KT",
      focus: "Leads sprint direction, AI proposal architecture & student mentorship.",
    },
    students: [
      "Youssef Ali Ahmed",
      "Nakshatra Hiray",
      "Siddhant Jain",
      "Richard Thomas",
      "Esha Vigneswaran",
    ],
  },
  {
    id: "ai-ethics",
    shortName: "AI Ethics",
    name: "AI Ethics Module Team",
    toolName: "AI Ethics Dashboard",
    toolHref: "/ai-ethics-dashboard",
    cohort: "Cohort 2025",
    purpose:
      "Evaluates popular AI platforms across bias, privacy, transparency, and equity so development practitioners adopt responsible AI tools with confidence.",
    prm: {
      name: "Justin Jones",
      initials: "JJ",
      focus: "Directs ethical AI benchmarking criteria, scoring rubrics & research synthesis.",
    },
    students: ["William Bachran", "Zoey Katz", "Ashlyn Wu", "Anna Howell"],
  },
  {
    id: "human-centered-design",
    shortName: "Human Centered Design",
    name: "Human Centered Design Module Team",
    toolName: "Human Centered Design",
    toolHref: "/human-centered-design",
    cohort: "Cohort 2025",
    purpose:
      "Creates participatory research kits, stakeholder persona templates, field surveys, and HCD readiness assessments that center lived community experience.",
    prm: {
      name: "Rowan Kuske",
      initials: "RK",
      focus: "Mentors participatory design methodology, user empathy kits & quiz design.",
    },
    students: [
      "Donovan Campos",
      "Isabella Canlas",
      "Sumer Elsalawi",
      "Arvind Kakanavaram",
      "Madeline Namias",
    ],
  },
  {
    id: "project-planning",
    shortName: "Project Planning",
    name: "Project Planning Module Team",
    toolName: "Project Planning",
    toolHref: "/project-planning",
    cohort: "Cohort 2025",
    purpose:
      "Curates practical project methodologies—including Agile, Lean, DMAIC, Waterfall, and Journey Mapping—paired with ethical accountability checklists.",
    prm: {
      name: "Ruth Whitehouse",
      initials: "RW",
      focus: "Guides planning framework curation, keyword matching & milestone checklists.",
    },
    students: ["Jaspreet Sonu", "Grace Wieber", "Neeraja Yasam"],
  },
  {
    id: "project-evaluation",
    shortName: "Project Evaluation",
    name: "Project Evaluation Module Team",
    toolName: "Project Evaluation",
    toolHref: "/project-evaluation",
    cohort: "Cohort 2025",
    purpose:
      "Designs structured ethical impact rubrics and measurable indicators to assess worthwhile outcomes and detect unintended community harm early.",
    prm: {
      name: "Jiun Park",
      initials: "JP",
      focus: "Leads outcome indicator modeling, evaluation scoring & impact testing.",
    },
    students: ["Avery Demarco", "Alia Mubagal"],
  },
  {
    id: "infrastructure-interface",
    shortName: "Infrastructure & UI",
    name: "Infrastructure & Interface Team",
    toolName: "Open-Access Web Platform",
    toolHref: "/ethics-of-innovation",
    cohort: "Cohort 2025",
    purpose:
      "Architects the open-access web application, CMS content pipelines, authentication, and interactive data visualizations powering every module.",
    prm: {
      name: "Rohan Tadisetty",
      initials: "RT",
      focus: "Oversees full-stack architecture, CMS integration & user interface engineering.",
    },
    students: ["Saikousil Tirumalasetty", "Inemesit Udo-Akang", "Raymond Wu"],
  },
  {
    id: "maldevelopment",
    shortName: "Maldevelopment",
    name: "Maldevelopment Research Team",
    toolName: "Worthwhile Development & Cases",
    toolHref: "/worthwhile-development",
    cohort: "Cohort 2025",
    purpose:
      "Investigates real-world global interventions to contrast capability-expanding worthwhile development against maldevelopment that harms or excludes.",
    prm: {
      name: "Eugene Choi",
      initials: "EC",
      focus: "Mentors qualitative case study analysis & maldevelopment taxonomy research.",
    },
    students: ["Emelia Adler", "Lexi Bernstein", "Daniella Hikin", "Grace Wieber"],
  },
  {
    id: "public-policy",
    shortName: "Public Policy",
    name: "Public Policy Module Team",
    toolName: "Geopolitical Analysis & Funding",
    toolHref: "/geopolitical-analysis",
    cohort: "Cohort 2025",
    purpose:
      "Connects development ethics frameworks to international policy contexts, World Bank regional data, and practitioner funding ecosystems.",
    prm: {
      name: "Shirin Saberi",
      initials: "SS",
      focus: "Guides regional policy research, funding alignment & ethical governance briefs.",
    },
    students: [
      "Antonella Almendariz",
      "Mitchell Kuta",
      "Lexi Schwartz",
      "Nola Tischler",
    ],
  },
];

export const HERO_KPIS = [
  { value: "07", label: "Interactive & AI Tools", sublabel: "Planning to Evaluation" },
  { value: "06", label: "UMD FIRE Cohorts", sublabel: "2020 – 2025 Research" },
  { value: "100+", label: "Student Researchers", sublabel: "PRM-Mentored Modules" },
  { value: "GLOBAL", label: "DICT & OWLI Partners", sublabel: "Philippines & Kenya" },
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
      "Operationalizing Amartya Sen & Martha Nussbaum's human development framework beyond purely economic metrics.",
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
