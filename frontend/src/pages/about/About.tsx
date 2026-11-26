import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  ClipboardList,
  Compass,
  ExternalLink,
  Gauge,
  Globe2,
  GraduationCap,
  Handshake,
  Headphones,
  HeartHandshake,
  Scale,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users,
} from "lucide-react";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialReveal,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import {
  HERO_KPIS,
  RESEARCH_PILLARS,
  WORTHWHILE_VALUES,
} from "@/pages/home/data/moduleTeams";

const VALUE_DETAILS: Record<
  (typeof WORTHWHILE_VALUES)[number],
  { summary: string; Icon: typeof Sprout }
> = {
  "Well-being": {
    summary:
      "Advancing physical, social, and economic flourishing so communities thrive beyond narrow GDP indicators.",
    Icon: Sparkles,
  },
  Equality: {
    summary:
      "Reducing structural disparities and ensuring marginalized groups share fairly in development gains.",
    Icon: Scale,
  },
  "Agency & Empowerment": {
    summary:
      "Equipping people to shape decisions affecting their own lives rather than acting as passive recipients.",
    Icon: Users,
  },
  Sustainability: {
    summary:
      "Designing solutions that respect ecological limits and endure well past initial funding cycles.",
    Icon: Sprout,
  },
  "Human Rights": {
    summary:
      "Protecting dignity, equity, and fundamental freedoms as non-negotiable standards in every intervention.",
    Icon: ShieldCheck,
  },
  "Cultural Freedom": {
    summary:
      "Honoring local knowledge, languages, and traditions instead of imposing one-size-fits-all models.",
    Icon: Globe2,
  },
  Responsibility: {
    summary:
      "Holding institutions, innovators, and researchers accountable for both intended outcomes and unforeseen harms.",
    Icon: HeartHandshake,
  },
};

const FACULTY_MENTORS = [
  {
    name: "Dr. Ben Huffman",
    role: "FIRE Faculty Leader · Global Development & Design",
    initials: "BH",
    affiliation: "University of Maryland · FIRE Program",
    bio: "Guides multi-cohort undergraduate research squads and Peer Research Mentors translating development ethics scholarship into practical, open-access digital tools.",
    href: "https://www.fire.umd.edu/ben-huffman",
    linkLabel: "UMD FIRE Profile",
  },
  {
    name: "Dr. Stacy Kosko",
    role: "Founding Research Designer & Faculty Collaborator",
    initials: "SK",
    affiliation: "Department of Government & Politics · UMD",
    bio: "Co-founded the Global Development & Design stream, grounding the toolkit in development ethics, the Capability Approach, and participatory global citizenship.",
    href: "https://gvpt.umd.edu/facultyprofile/kosko/stacy-j",
    linkLabel: "UMD Faculty Profile",
  },
];

const INTERNATIONAL_PARTNERS = [
  {
    organization: "DICT Philippines",
    fullName: "Department of Information and Communications Technology",
    region: "Philippines · Southeast Asia",
    leader: "Director Rik Amores",
    description:
      "Collaborates with UMD FIRE teams on digital inclusion, ethical ICT deployment, and community-centered innovation ecosystems across the Philippines.",
    href: "https://dict.gov.ph/",
    linkLabel: "Visit DICT",
  },
  {
    organization: "OWLI Kenya",
    fullName: "One World Leadership Institute",
    region: "Kenya · East Africa",
    leader: "Executive Director Joseph Odhiambo",
    description:
      "Partners on participatory fieldwork, local leadership perspectives, and real-world testing of ethical project planning and evaluation frameworks.",
    href: "https://oneworldleadership.org/",
    linkLabel: "Visit OWLI",
  },
];

const PLATFORM_DESTINATIONS = [
  {
    eyebrow: "01 · AI BENCHMARKS",
    title: "AI Ethics Dashboard",
    description:
      "Compare AI platforms on bias, privacy, transparency, and readiness for responsible development work.",
    href: "/ai-ethics-dashboard",
    Icon: Gauge,
  },
  {
    eyebrow: "02 · 9 PRINCIPLES",
    title: "Ethics of Innovation",
    description:
      "Interactive explorer for the Principles for Digital Development—from user design to privacy and open standards.",
    href: "/ethics-of-innovation",
    Icon: Compass,
  },
  {
    eyebrow: "03 · 3D GLOBAL DATA",
    title: "Geopolitical Analysis",
    description:
      "Navigate regional World Bank indicators across all seven worthwhile development values.",
    href: "/geopolitical-analysis",
    Icon: Globe2,
  },
  {
    eyebrow: "04 · FIELD METHODS",
    title: "Human Centered Design",
    description:
      "Participatory persona kits, field surveys, and an HCD readiness assessment for community-first design.",
    href: "/human-centered-design",
    Icon: Users,
  },
  {
    eyebrow: "05 · PLANNING SUITE",
    title: "Project Planning",
    description:
      "Match Agile, Lean, DMAIC, Waterfall, or Journey Mapping to your project with ethical checklists.",
    href: "/project-planning",
    Icon: ClipboardList,
  },
  {
    eyebrow: "06 · IMPACT RUBRIC",
    title: "Project Evaluation",
    description:
      "Assess project outcomes against measurable ethical indicators to surface unintended harms early.",
    href: "/project-evaluation",
    Icon: BarChart3,
  },
  {
    eyebrow: "07 · FIELD EVIDENCE",
    title: "Global Case Studies",
    description:
      "Student-authored investigations contrasting worthwhile development initiatives against maldevelopment.",
    href: "/case-studies",
    Icon: BookOpen,
  },
  {
    eyebrow: "08 · PODCAST & FUNDING",
    title: "The Development Lens",
    description:
      "Conversations with faculty, student researchers, and global partners putting the toolkit into practice.",
    href: "/podcast",
    Icon: Headphones,
  },
];

export default function AboutPage() {
  const reduced = useReducedMotion();

  return (
    <div className="min-h-screen w-full bg-white text-[#202B20]">

      {/* Forest Green Editorial Hero */}
      <EditorialPageHero
        id="about-hero"
        titleId="about-hero-heading"
        backLink={{ label: "Back to Home", to: "/" }}
        badges={[
          { label: "UMD FIRE · Global Development & Design", tone: "cream" },
          { label: "Free & Open Access", tone: "sage" },
        ]}
        title={
          <>
            About the{" "}
            <em className="font-normal italic text-[#E9E6B2]">GDD Toolkit</em>
          </>
        }
        subtitle="Born inside the University of Maryland's First-Year Innovation & Research Experience (FIRE), the Global Development & Design Toolkit unites ethical scholarship, interactive planning tools, and international partnership to help practitioners build genuinely worthwhile development."
        actions={
          <>
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 rounded-full bg-[#E9E6B2] px-6 py-3 text-sm font-semibold text-[#202B20] shadow-sm transition-all duration-200 hover:bg-[#f2efbf] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C]"
            >
              Browse Case Studies
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/acknowledgements"
              className="inline-flex items-center gap-2 rounded-full border border-[#9AB887] bg-[#2E502B] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-[#E9E6B2] hover:bg-[#254223] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C]"
            >
              Meet All 6 Cohorts
              <ArrowRight className="h-4 w-4 text-[#E9E6B2]" aria-hidden="true" />
            </Link>
          </>
        }
        footnote="University of Maryland FIRE · Dr. Ben Huffman & Dr. Stacy Kosko · DICT Philippines · OWLI Kenya"
        aside={
          <div className="rounded-2xl border-[1.5px] border-[#E9E6B2]/80 bg-white p-6 text-[#202B20] shadow-xl">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
              Program Snapshot · 2020–2025
            </p>
            <p
              className="mt-2 text-lg font-semibold leading-snug text-[#202B20]"
              style={EDITORIAL_SERIF_STYLE}
            >
              Student-built, faculty-mentored, and freely available to
              practitioners worldwide.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3.5">
              {HERO_KPIS.map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-xl border border-[#B2C9A8] bg-[#F2F6EF] px-4 py-3"
                >
                  <p
                    className="text-2xl font-bold leading-tight text-[#187347]"
                    style={EDITORIAL_SERIF_STYLE}
                  >
                    {kpi.value}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-[#394838]">
                    {kpi.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-[#D6CE8A] bg-[#F6F4D8] px-4 py-3 text-xs leading-relaxed text-[#394838]">
              <span className="font-semibold text-[#284B26]">
                Our guiding question:
              </span>{" "}
              How can development projects expand real human capabilities while
              actively preventing unintended harm and maldevelopment?
            </div>
          </div>
        }
      />

      {/* Section 1: Program Mission & Theoretical Foundations */}
      <EditorialSection
        id="mission"
        tone="white"
        ariaLabelledBy="mission-heading"
      >
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="01 / Program Mission"
            titleId="mission-heading"
            title="Bridging Ethical Theory and Field Practice"
            description="Closing the gap between value-neutral project management and genuinely human-centered global impact."
          />
        </EditorialReveal>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <EditorialReveal className="flex flex-col justify-between gap-5 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-7 lg:col-span-7">
            <div className="space-y-4 text-sm leading-relaxed text-[#394838] sm:text-base">
              <p>
                Global development initiatives often succeed on technical metrics
                while overlooking dignity, local agency, or long-term
                sustainability. The{" "}
                <span className="font-semibold text-[#202B20]">
                  UMD FIRE Global Development &amp; Design (GDD)
                </span>{" "}
                stream brings together undergraduate researchers, Peer Research
                Mentors (PRMs), faculty scholars, and international practitioners
                to change how projects are conceived, designed, and evaluated.
              </p>
              <p>
                Across six consecutive cohorts (2020–2025), student module teams
                have built an open-access suite spanning AI ethics benchmarking,
                3D geopolitical indicator analysis, human-centered design kits,
                planning methodology matchers, ethical evaluation rubrics, and
                real-world case studies—free for students, NGOs, policymakers,
                and community leaders alike.
              </p>
            </div>

            <div className="rounded-xl border border-[#94B985] bg-[#F6F4D8] p-4">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#284B26]">
                How Our Research Squads Work
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[#394838] sm:text-sm">
                Each year, specialized module teams—led by returning Peer
                Research Mentors—conduct primary research, partner with global
                counterparts, and ship open-access updates directly to this
                platform.
              </p>
            </div>
          </EditorialReveal>

          <EditorialReveal
            delay={0.08}
            className="flex flex-col justify-between gap-4 lg:col-span-5"
          >
            {RESEARCH_PILLARS.map((pillar) => (
              <Link
                key={pillar.code}
                to={pillar.href}
                className="group flex flex-1 flex-col justify-between rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3F673C] hover:bg-[#F2F6EF]"
              >
                <div>
                  <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                    {pillar.code}
                  </span>
                  <h3
                    className="mt-1.5 flex items-center justify-between text-lg font-semibold text-[#202B20] group-hover:text-[#187347]"
                    style={EDITORIAL_SERIF_STYLE}
                  >
                    <span>{pillar.title}</span>
                    <ArrowRight
                      className="h-4 w-4 text-[#596556] transition-transform group-hover:translate-x-1 group-hover:text-[#187347]"
                      aria-hidden="true"
                    />
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#596556]">
                    {pillar.description}
                  </p>
                </div>
              </Link>
            ))}
          </EditorialReveal>
        </div>
      </EditorialSection>

      {/* Section 2: 7 Values of Worthwhile Development */}
      <EditorialSection
        id="seven-values"
        tone="sage"
        ariaLabelledBy="values-heading"
      >
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="02 / Ethical Compass"
            titleId="values-heading"
            title="The 7 Values of Worthwhile Development"
            description="Every tool and case study in the toolkit anchors decisions around seven interdependent ethical dimensions."
            action={
              <Link
                to="/worthwhile-development"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:brightness-110"
              >
                Explore Framework
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            }
          />
        </EditorialReveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WORTHWHILE_VALUES.map((value, index) => {
            const { summary, Icon } = VALUE_DETAILS[value];
            return (
              <EditorialReveal
                key={value}
                delay={index * 0.04}
                className="h-full"
              >
                <motion.div
                  whileHover={reduced ? undefined : { y: -3 }}
                  transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
                  className="flex h-full flex-col justify-between rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-5 transition-colors hover:border-[#3F673C] hover:bg-[#FAFDF8]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                        VALUE {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#B2C9A8] bg-[#EDF4E8] text-[#284B26]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                    <h3
                      className="mt-3 text-lg font-semibold text-[#202B20]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {value}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#596556] sm:text-sm">
                      {summary}
                    </p>
                  </div>
                </motion.div>
              </EditorialReveal>
            );
          })}

          {/* 8th Card: Capability Approach Bridge */}
          <EditorialReveal delay={0.3} className="h-full">
            <Link
              to="/capability-approach"
              className="group flex h-full flex-col justify-between rounded-2xl border-[1.5px] border-[#3F673C] bg-[#F6F4D8] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div>
                <span className="inline-flex items-center rounded-full bg-[#3F673C] px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
                  Human Capabilities
                </span>
                <h3
                  className="mt-3 text-lg font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  Operationalizing Ethics in Practice
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#394838] sm:text-sm">
                  See how Amartya Sen and Martha Nussbaum&apos;s Capability
                  Approach translates these seven values into actionable design
                  decisions.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#187347]">
                Read Capability Approach
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </EditorialReveal>
        </div>
      </EditorialSection>

      {/* Section 3: Faculty Mentors & International Partners */}
      <EditorialSection
        id="leadership-partners"
        tone="white"
        ariaLabelledBy="leadership-heading"
      >
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="03 / Mentors & Global Partners"
            titleId="leadership-heading"
            title="Faculty Leadership & International Collaboration"
            description="Built through sustained mentorship at the University of Maryland and field-grounded dialogue with international partner organizations."
          />
        </EditorialReveal>

        {/* Faculty Mentors */}
        <div className="mt-10">
          <p className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#284B26]">
            <GraduationCap className="h-4 w-4 text-[#187347]" aria-hidden="true" />
            Faculty Mentors
          </p>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            {FACULTY_MENTORS.map((mentor, idx) => (
              <EditorialReveal key={mentor.name} delay={idx * 0.06}>
                <article className="flex h-full flex-col justify-between rounded-2xl border-[1.5px] border-[#94B985] bg-[#F6F4D8] p-6 sm:p-7">
                  <div>
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3F673C] to-[#187347] text-sm font-bold text-white shadow-xs"
                        aria-hidden="true"
                      >
                        {mentor.initials}
                      </div>
                      <div className="min-w-0">
                        <h3
                          className="text-xl font-semibold text-[#202B20]"
                          style={EDITORIAL_SERIF_STYLE}
                        >
                          {mentor.name}
                        </h3>
                        <p className="mt-0.5 text-xs font-semibold text-[#187347]">
                          {mentor.role}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#596556]">
                          {mentor.affiliation}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-[#394838]">
                      {mentor.bio}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-[#D6CE8A] pt-4">
                    <a
                      href={mentor.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#284B26] transition-colors hover:text-[#187347]"
                    >
                      {mentor.linkLabel}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </EditorialReveal>
            ))}
          </div>
        </div>

        {/* International Partners */}
        <div className="mt-10">
          <p className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#284B26]">
            <Handshake className="h-4 w-4 text-[#187347]" aria-hidden="true" />
            International Partners
          </p>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            {INTERNATIONAL_PARTNERS.map((partner, idx) => (
              <EditorialReveal key={partner.organization} delay={idx * 0.06}>
                <article className="flex h-full flex-col justify-between rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-6 transition-colors hover:border-[#3F673C] sm:p-7">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full border border-[#94B985] bg-[#EDF4E8] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                        {partner.region}
                      </span>
                      <span className="text-xs font-medium text-[#596556]">
                        {partner.leader}
                      </span>
                    </div>
                    <h3
                      className="mt-3 text-xl font-semibold text-[#202B20]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {partner.organization}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-[#284B26]">
                      {partner.fullName}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[#394838]">
                      {partner.description}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-[#D5E3D9] pt-4">
                    <a
                      href={partner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3F673C] transition-colors hover:text-[#187347]"
                    >
                      {partner.linkLabel}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </EditorialReveal>
            ))}
          </div>
        </div>

        {/* Acknowledgements Banner */}
        <EditorialReveal delay={0.1}>
          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border-[1.5px] border-[#3F673C] bg-[#F2F6EF] p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                2020–2025 Student Contributors
              </p>
              <h3
                className="mt-1.5 text-2xl font-semibold text-[#202B20]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Powered by 100+ Undergraduate Researchers &amp; PRMs
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#394838]">
                Explore the full directory of Peer Research Mentors and student
                cohorts who designed, researched, and built every module in the
                toolkit.
              </p>
            </div>
            <Link
              to="/acknowledgements"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:brightness-110"
            >
              View Acknowledgements
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </EditorialReveal>
      </EditorialSection>

      {/* Section 4: Explore Tools & Resources */}
      <EditorialSection
        id="explore-platform"
        tone="sage"
        ariaLabelledBy="explore-heading"
      >
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="04 / Explore the Platform"
            titleId="explore-heading"
            title="Start Using the Toolkit"
            description="Jump straight into our interactive modules, field case studies, funding tracker, and podcast."
            action={
              <Link
                to="/funding-sources"
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#3F673C] bg-white px-5 py-2.5 text-xs font-semibold text-[#284B26] transition-colors hover:bg-[#EDF4E8]"
              >
                Funding Sources Tracker
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            }
          />
        </EditorialReveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_DESTINATIONS.map((item, idx) => {
            const Icon = item.Icon;
            return (
              <EditorialReveal key={item.href} delay={idx * 0.03} className="h-full">
                <Link
                  to={item.href}
                  className="group flex h-full flex-col justify-between gap-4 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3F673C] hover:bg-[#FAFDF8]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                        {item.eyebrow}
                      </span>
                      <Icon
                        className="h-4 w-4 text-[#3F673C]"
                        aria-hidden="true"
                      />
                    </div>
                    <h3
                      className="mt-2.5 text-lg font-semibold text-[#202B20] group-hover:text-[#187347]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#596556] sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#3F673C] group-hover:text-[#187347]">
                    Open Module
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </EditorialReveal>
            );
          })}
        </div>
      </EditorialSection>
    </div>
  );
}
