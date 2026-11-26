import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  ClipboardList,
  Compass,
  ExternalLink,
  Gauge,
  Globe2,
  Users,
} from "lucide-react";

const SIX_TOOLS = [
  {
    code: "02 · EDUCATIONAL TOOL",
    title: "AI Ethics Dashboard",
    description:
      "Compare popular AI platforms on bias, privacy, transparency, and readiness for ethical development work.",
    cta: "Open Dashboard",
    href: "/ai-ethics-dashboard",
    Icon: Gauge,
  },
  {
    code: "03 · INTERACTIVE EXPLORER",
    title: "Ethics of Innovation",
    description:
      "Master the 9 Principles for Digital Development, from Designing with Users to Open Standards and Privacy.",
    cta: "Explore 9 Principles",
    href: "/ethics-of-innovation",
    Icon: Compass,
  },
  {
    code: "04 · 3D GLOBAL DATA",
    title: "Geopolitical Analysis",
    description:
      "Navigate an interactive 3D globe comparing World Bank regions across all 7 worthwhile development values.",
    cta: "Explore World Globe",
    href: "/geopolitical-analysis",
    Icon: Globe2,
    regions: [
      { name: "Africa", dot: "bg-[#FFCC00]" },
      { name: "South Asia", dot: "bg-[#227FBA]" },
      { name: "East Asia", dot: "bg-[#E1812C]" },
      { name: "LatAm", dot: "bg-[#39943A]" },
    ],
  },
  {
    code: "05 · DESIGN METHODS",
    title: "Human Centered Design",
    description:
      "Access participatory persona kits, field surveys, and an interactive HCD readiness assessment quiz.",
    cta: "Start HCD Guide",
    href: "/human-centered-design",
    Icon: Users,
  },
  {
    code: "06 · PLANNING SUITE",
    title: "Project Planning",
    description:
      "Match Agile, Lean, DMAIC, Waterfall, or Journey Mapping to your project stage with ethical checklists.",
    cta: "Match Planning Tools",
    href: "/project-planning",
    Icon: ClipboardList,
  },
  {
    code: "07 · IMPACT RUBRIC",
    title: "Project Evaluation",
    description:
      "Score outcomes against measurable ethical indicators to surface unintended community harms early.",
    cta: "Evaluate a Project",
    href: "/project-evaluation",
    Icon: BarChart3,
  },
];

export default function ToolsSuite() {
  return (
    <section
      id="tools"
      aria-labelledby="tools-heading"
      className="w-full bg-white py-20 text-[#202B20] md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#187347]">
              01 / Practical Toolkit
            </p>
            <h2
              id="tools-heading"
              className="mt-2 text-3xl font-semibold tracking-tight text-[#202B20] sm:text-4xl"
              style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
            >
              Seven Purpose-Built Tools for Practitioners
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#596556]">
            Values-based decision-making and human-centered design integrated
            across every stage of your project lifecycle.
          </p>
        </div>

        {/* Flagship Featured Card: AI Business Ethics Canvas */}
        <div className="mt-10 grid grid-cols-1 items-center gap-8 rounded-2xl border-[1.5px] border-[#3F673C] bg-[#F2F6EF] p-7 lg:grid-cols-12 lg:p-8">
          <div className="flex flex-col gap-3.5 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-3.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
                <Brain className="h-3 w-3" aria-hidden="true" />
                01 · Flagship AI Assistant
              </span>
              <span className="inline-flex items-center rounded-full border border-[#94B985] bg-white px-3 py-1 text-xs font-medium text-[#284B26]">
                Trained on Curated Global Case Studies
              </span>
            </div>

            <h3
              className="text-2xl font-semibold text-[#202B20] sm:text-3xl"
              style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
            >
              AI Business Ethics Canvas
            </h3>

            <p className="text-sm leading-relaxed text-[#394838] sm:text-base">
              Turn guided questionnaire responses into a polished,
              values-aligned PDF project proposal grounded in global development
              case studies, highlighting ethical risks, affected stakeholders,
              and recommended design pathways in minutes.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="https://main.dn6y4rvhmhz3f.amplifyapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
              >
                Launch AI Assistant
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <span className="font-mono text-[11px] font-medium text-[#284B26]">
                01 Prompts &rarr; 02 Case Study RAG &rarr; 03 Risks &rarr; 04 PDF
              </span>
            </div>
          </div>

          {/* Right Sample Proposal Preview Card */}
          <div className="rounded-xl border-[1.5px] border-[#94B985] bg-white p-5 shadow-sm lg:col-span-5">
            <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
              Generated Proposal · Ethical_Brief.pdf
            </p>
            <h4
              className="mt-1.5 text-lg font-semibold text-[#202B20]"
              style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
            >
              Clean Water Micro-Grid: Rift Valley
            </h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-[#94B985] bg-[#EDF4E8] px-2.5 py-0.5 text-[11px] font-medium text-[#187347]">
                &#10003; 7 Values Checked
              </span>
              <span className="rounded-full border border-[#D6CE8A] bg-[#FAF8E4] px-2.5 py-0.5 text-[11px] font-medium text-[#6F6057]">
                &#9888; 3 Risk Flags
              </span>
              <span className="rounded-full border border-[#A2B7D8] bg-[#EFF4FA] px-2.5 py-0.5 text-[11px] font-medium text-[#395273]">
                4 Matched Cases
              </span>
            </div>
            <ul className="mt-3 space-y-1 text-xs leading-relaxed text-[#596556]">
              <li>
                &bull; Stakeholder impact map &amp; participatory consent plan
              </li>
              <li>
                &bull; Maldevelopment safeguards derived from Kenya &amp; PH
                cases
              </li>
            </ul>
          </div>
        </div>

        {/* 6 Green-Outlined Tool Cards */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SIX_TOOLS.map(
            ({ code, title, description, cta, href, Icon, regions }) => (
              <motion.div
                key={title}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col justify-between gap-5 rounded-xl border-[1.5px] border-[#B2C9A8] bg-white p-6 transition-colors hover:border-[#3F673C] hover:bg-[#FAFDF8]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                      {code}
                    </span>
                    <Icon
                      className="h-4 w-4 text-[#3F673C]"
                      aria-hidden="true"
                    />
                  </div>

                  <h3
                    className="mt-2.5 text-xl font-semibold text-[#202B20]"
                    style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
                  >
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[#596556]">
                    {description}
                  </p>

                  {regions && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {regions.map((r) => (
                        <span
                          key={r.name}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E3D9] bg-[#F2F6EF] px-2.5 py-0.5 text-[11px] font-medium text-[#284B26]"
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${r.dot}`}
                            aria-hidden="true"
                          />
                          {r.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to={href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3F673C] transition-colors hover:text-[#187347]"
                >
                  {cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

