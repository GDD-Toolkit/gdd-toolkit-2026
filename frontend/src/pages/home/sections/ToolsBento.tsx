import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  ClipboardList,
  Compass,
  Gauge,
  Globe2,
  Users,
} from "lucide-react";

const DASHBOARD_METRICS = [
  { label: "Transparency & Explainability", width: "74%", color: "bg-[#A07CFF]" },
  { label: "Data Privacy & Consent", width: "64%", color: "bg-[#6D83F2]" },
  { label: "Equitable Access Score", width: "82%", color: "bg-emerald-400" },
];

const INNOVATION_PRINCIPLES = [
  { label: "Design w/ User", href: "/ethics-of-innovation/user" },
  { label: "Ecosystems", href: "/ethics-of-innovation/ecosystem" },
  { label: "Scale", href: "/ethics-of-innovation/scale" },
  { label: "Sustainability", href: "/ethics-of-innovation/sustainability" },
  { label: "Open Standards", href: "/ethics-of-innovation/standards" },
  { label: "+4 more", href: "/ethics-of-innovation" },
];

const WORLD_REGIONS = [
  { name: "Sub-Saharan Africa", dot: "bg-[#FFCC00]" },
  { name: "South Asia", dot: "bg-[#227FBA]" },
  { name: "East Asia", dot: "bg-[#E1812C]" },
  { name: "Latin America", dot: "bg-[#39943A]" },
  { name: "MENA", dot: "bg-[#803E85]" },
];

const CORE_TOOLS = [
  {
    code: "05 · DESIGN TOOL",
    title: "Human Centered Design",
    description:
      "Participatory persona guides, field surveys, and an interactive HCD readiness quiz for real community impact.",
    cta: "Open HCD Guide",
    href: "/human-centered-design",
    Icon: Users,
  },
  {
    code: "06 · PLANNING SUITE",
    title: "Project Planning",
    description:
      "Intelligent tool matcher for Agile, Lean, DMAIC, Waterfall, and Journey Mapping with accountability checklists.",
    cta: "Launch Planner",
    href: "/project-planning",
    Icon: ClipboardList,
  },
  {
    code: "07 · EVALUATION RUBRIC",
    title: "Project Evaluation",
    description:
      "Structured scoring metrics to measure worthwhile outcomes and flag unintended harms early.",
    cta: "Evaluate Impact",
    href: "/project-evaluation",
    Icon: BarChart3,
  },
];

export default function ToolsBento() {
  return (
    <section
      id="tools"
      aria-labelledby="tools-heading"
      className="w-full bg-[#09090B] py-20 text-white md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-[#A07CFF]">
              01 // The Ethical Development Suite
            </p>
            <h2
              id="tools-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Seven Purpose-Built Tools for Practitioners
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            Values-based decision-making and human-centered design integrated
            across every stage of your social impact project lifecycle.
          </p>
        </div>

        {/* Bento Row 1: AI Business Ethics Canvas + AI Ethics Dashboard */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* 01 Flagship AI Assistant */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col justify-between gap-6 rounded-2xl border border-[#A07CFF]/45 bg-[#12141E] p-7 shadow-lg shadow-[#6D83F2]/5 lg:col-span-7"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#A07CFF] to-[#6D83F2] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
                  <Brain className="h-3 w-3" aria-hidden="true" />
                  01 · Flagship AI Assistant
                </span>
                <span className="inline-flex items-center rounded-full border border-[#3B3F5C] bg-[#1E2235] px-3 py-1 text-xs font-medium text-[#C4B5FD]">
                  PDF Proposal Generator
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-[26px]">
                AI Business Ethics Canvas
              </h3>
              <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-400">
                Turn structured responses to our guided questionnaire into a
                polished, values-aligned PDF project proposal grounded in our
                curated database of global development case studies—highlighting
                ethical risks, affected stakeholders, and design pathways in
                minutes.
              </p>
            </div>

            {/* Workflow Strip */}
            <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-white/10 bg-[#0A0B10] px-4 py-3.5 sm:flex-row sm:items-center">
              <span className="font-mono text-xs text-[#C4B5FD]">
                01 Prompts &rarr; 02 Case Study RAG &rarr; 03 Risks &rarr; 04 PDF
              </span>
              <a
                href="https://main.dn6y4rvhmhz3f.amplifyapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#A07CFF] to-[#6D83F2] px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110"
              >
                Launch
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </motion.div>

          {/* 02 AI Ethics Dashboard */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-[#12141E] p-7 transition-colors hover:border-[#A07CFF]/40 lg:col-span-5"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#A07CFF]">
                  02 · Educational Tool
                </span>
                <Gauge className="h-4 w-4 text-[#A07CFF]" aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">
                AI Ethics Dashboard
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Evaluate popular AI platforms across bias, data privacy, and
                ethical readiness before deploying in community projects.
              </p>
            </div>

            {/* Visual Scorecard Preview */}
            <div className="space-y-3 rounded-xl border border-white/5 bg-[#0A0B10] p-4">
              {DASHBOARD_METRICS.map((metric) => (
                <div key={metric.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
                    <span>{metric.label}</span>
                    <span className="font-mono text-slate-400">
                      {metric.width}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${metric.color}`}
                      style={{ width: metric.width }}
                    />
                  </div>
                </div>
              ))}
              <Link
                to="/ai-ethics-dashboard"
                className="inline-flex items-center gap-1.5 pt-1 text-xs font-semibold text-[#A07CFF] transition-colors hover:text-[#C4B5FD]"
              >
                Open AI Ethics Dashboard
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bento Row 2: Ethics of Innovation + Geopolitical Analysis */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 03 Ethics of Innovation */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-[#12141E] p-7 transition-colors hover:border-[#A07CFF]/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#A07CFF]">
                  03 · Interactive Explorer
                </span>
                <Compass className="h-4 w-4 text-[#A07CFF]" aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-xl font-bold tracking-tight text-white">
                <Link
                  to="/ethics-of-innovation"
                  className="hover:text-[#C4B5FD] transition-colors"
                >
                  Ethics of Innovation
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Master the 9 Principles for Digital Development—with interactive
                deep-dives into sustainability, open standards, privacy, and
                collaborative design.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {INNOVATION_PRINCIPLES.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="rounded-full border border-[#2D3148] bg-[#1A1D2B] px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:border-[#A07CFF]/50 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* 04 Geopolitical Analysis */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-[#12141E] p-7 transition-colors hover:border-[#A07CFF]/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#A07CFF]">
                  04 · 3D Global Data Explorer
                </span>
                <Globe2 className="h-4 w-4 text-[#A07CFF]" aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-xl font-bold tracking-tight text-white">
                <Link
                  to="/geopolitical-analysis"
                  className="hover:text-[#C4B5FD] transition-colors"
                >
                  Geopolitical Analysis
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Explore an interactive 3D globe mapping World Bank regions
                across all 7 worthwhile development values—Well-being, Equality,
                Agency, and Human Rights.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                {WORLD_REGIONS.map((region) => (
                  <span
                    key={region.name}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1D2B] px-2.5 py-1 text-xs font-medium text-slate-200"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${region.dot}`}
                      aria-hidden="true"
                    />
                    {region.name}
                  </span>
                ))}
              </div>
              <Link
                to="/geopolitical-analysis"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#A07CFF] hover:text-[#C4B5FD]"
              >
                Explore Globe
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bento Row 3: HCD, Project Planning, Project Evaluation */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CORE_TOOLS.map(({ code, title, description, cta, href, Icon }) => (
            <motion.div
              key={title}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-[#12141E] p-6 transition-colors hover:border-[#A07CFF]/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#A07CFF]">
                    {code}
                  </span>
                  <Icon className="h-4 w-4 text-[#A07CFF]" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {description}
                </p>
              </div>

              <Link
                to={href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#A07CFF] transition-colors hover:text-[#C4B5FD]"
              >
                {cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
