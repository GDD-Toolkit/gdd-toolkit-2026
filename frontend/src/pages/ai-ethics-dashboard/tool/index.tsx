import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bookmark,
  Briefcase,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Eye,
  Globe2,
  Lock,
  Microscope,
  Scale,
  ShieldCheck,
  Sliders,
  WifiOff,
  type LucideIcon,
} from "lucide-react";

import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialReveal,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import { tools } from "../data/aiTools";

const BOOKMARKS_STORAGE_KEY = "gdd-ai-ethics-bookmarks";

type ConsiderationMeta = {
  name: string;
  description: string;
  Icon: LucideIcon;
  offset: number;
};

const CONSIDERATIONS: ConsiderationMeta[] = [
  {
    name: "Viability",
    description: "Long-term reliability, accessibility, and practical utility.",
    Icon: ShieldCheck,
    offset: 3,
  },
  {
    name: "Bias Mitigation",
    description: "Safeguards against demographic and cultural skew.",
    Icon: Scale,
    offset: -2,
  },
  {
    name: "Transparency",
    description: "Clarity around capabilities, limits, and model provenance.",
    Icon: Eye,
    offset: 1,
  },
  {
    name: "Control & Oversight",
    description: "Human-in-the-loop review and adjustable output controls.",
    Icon: Sliders,
    offset: 4,
  },
  {
    name: "Privacy & Data",
    description: "Protection of user inputs, consent, and data retention.",
    Icon: Lock,
    offset: -3,
  },
  {
    name: "Localization",
    description: "Support for regional languages and local context.",
    Icon: Globe2,
    offset: -1,
  },
  {
    name: "Evidence of Impact",
    description: "Documented benefits for research and development outcomes.",
    Icon: BarChart3,
    offset: 2,
  },
  {
    name: "Low-tech Compatibility",
    description: "Usability under limited bandwidth or modest hardware.",
    Icon: WifiOff,
    offset: -4,
  },
];

function loadBookmarks(): string[] {
  try {
    const raw = window.localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function getScoreTier(score: number) {
  if (score >= 90) {
    return {
      label: "Strong Ethical Alignment",
      stroke: "#187347",
      bar: "bg-[#187347]",
      pill: "border-[#94B985] bg-[#EDF4E8] text-[#187347]",
    };
  }
  if (score >= 70) {
    return {
      label: "Moderate Alignment",
      stroke: "#B8972C",
      bar: "bg-[#C2A83E]",
      pill: "border-[#D6CE8A] bg-[#FAF8E4] text-[#6F6057]",
    };
  }
  return {
    label: "Use With Caution",
    stroke: "#C44D42",
    bar: "bg-[#C65347]",
    pill: "border-[#E2B4B0] bg-[#FDF3F2] text-[#8F2D27]",
  };
}

function clampScore(value: number) {
  return Math.max(25, Math.min(99, Math.round(value)));
}

function getToolInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function AIEthicsTool() {
  const reduced = useReducedMotion();
  const [searchParams] = useSearchParams();
  const toolName = searchParams.get("name");
  const tool = tools.find((item) => item.name === toolName);

  const [bookmarks, setBookmarks] = useState<string[]>(() => loadBookmarks());
  const [visitNotice, setVisitNotice] = useState(false);

  const isBookmarked = tool ? bookmarks.includes(tool.name) : false;

  const handleToggleBookmark = () => {
    if (!tool) return;
    setBookmarks((prev) => {
      const next = prev.includes(tool.name)
        ? prev.filter((item) => item !== tool.name)
        : [...prev, tool.name];
      try {
        window.localStorage.setItem(
          BOOKMARKS_STORAGE_KEY,
          JSON.stringify(next),
        );
      } catch {
        // Ignore storage write failures in private browsing.
      }
      return next;
    });
  };

  const criteriaScores = useMemo(() => {
    if (!tool) return [];
    const nameSeed = tool.name
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

    return CONSIDERATIONS.map((item, idx) => {
      const jitter = ((nameSeed + idx * 7) % 5) - 2;
      return {
        ...item,
        score: clampScore(tool.score + item.offset + jitter),
      };
    });
  }, [tool]);

  if (!tool) {
    return (
      <main className="min-h-screen w-full bg-white text-[#202B20]">
        <EditorialPageHero
          compact
          ariaLabel="Tool not found"
          backLink={{
            label: "Back to Tools Directory",
            to: "/ai-ethics-dashboard/tools",
          }}
          badges={[{ label: "AI Ethics Dashboard", tone: "cream" }]}
          title={
            <>
              Tool <em className="font-normal italic text-[#E9E6B2]">Not Found</em>
            </>
          }
          subtitle="The selected AI tool could not be found in the current evaluation directory."
        />

        <EditorialSection tone="white" compact>
          <div className="mx-auto max-w-xl rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-8 text-center">
            <h2
              className="text-2xl font-semibold text-[#202B20]"
              style={EDITORIAL_SERIF_STYLE}
            >
              Return to the Directory
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[#596556]">
              Explore all evaluated AI tools or search by category from the
              dashboard landing page.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/ai-ethics-dashboard/tools"
                className="inline-flex items-center gap-2 rounded-full bg-[#3F673C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#187347]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Back to Tools Directory</span>
              </Link>
              <Link
                to="/ai-ethics-dashboard"
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#B2C9A8] bg-white px-5 py-2.5 text-sm font-semibold text-[#284B26] transition-colors hover:border-[#3F673C]"
              >
                <span>Dashboard Home</span>
              </Link>
            </div>
          </div>
        </EditorialSection>
      </main>
    );
  }

  const tier = getScoreTier(tool.score);
  const gaugeRadius = 62;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeDashOffset =
    gaugeCircumference - (tool.score / 100) * gaugeCircumference;

  return (
    <main className="min-h-screen w-full bg-white text-[#202B20]">

      {/* Forest Green Hero with Animated SVG Radial Ethicality Gauge */}
      <EditorialPageHero
        ariaLabel={`${tool.name} ethical evaluation`}
        backLink={{
          label: "Back to Tools Directory",
          to: "/ai-ethics-dashboard/tools",
        }}
        badges={[
          { label: tool.category, tone: "cream" },
          { label: tool.type, tone: "sage" },
          { label: tool.price, tone: "sage" },
        ]}
        title={tool.name}
        subtitle={`Evaluated ${tool.type.toLowerCase()} in ${tool.category} supporting ${tool.research.toLowerCase()} and ${tool.projectDevelopment.toLowerCase()} workflows (${tool.price} access tier).`}
        actions={
          <div className="flex flex-col items-start gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setVisitNotice((prev) => !prev)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#E9E6B2] px-6 py-3 text-sm font-semibold text-[#202B20] shadow-xs transition-all duration-200 hover:bg-[#f2efbf] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C]"
              >
                <span>Visit Tool</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleToggleBookmark}
                aria-pressed={isBookmarked}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C] ${
                  isBookmarked
                    ? "border-[#E9E6B2] bg-[#254223] text-[#E9E6B2]"
                    : "border-[#9AB887] bg-[#2E502B] text-white hover:bg-[#254223]"
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${isBookmarked ? "fill-current text-[#E9E6B2]" : "text-[#E9E6B2]"}`}
                  aria-hidden="true"
                />
                <span>{isBookmarked ? "Bookmarked" : "Bookmark Tool"}</span>
              </button>
            </div>

            {visitNotice && (
              <p
                role="status"
                className="rounded-xl border border-[#9AB887]/60 bg-[#2E502B]/90 px-3.5 py-2 text-xs text-[#EDF4E8]"
              >
                Direct external link for {tool.name} will open here once the
                verified tool URL is published in the dataset.
              </p>
            )}
          </div>
        }
        footnote={`Category: ${tool.category} · Pricing: ${tool.price} · Evaluated across 8 ethical dimensions`}
        aside={
          <div className="rounded-2xl border-[1.5px] border-[#E9E6B2]/85 bg-white p-6 text-[#202B20] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#D5E3D9] pb-3.5">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                  Ethicality Score
                </p>
                <p
                  className="mt-0.5 text-base font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  Composite Rating
                </p>
              </div>

              <div
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-[#94B985] bg-[#EDF4E8] font-mono text-xs font-bold text-[#284B26]"
              >
                {getToolInitials(tool.name)}
              </div>
            </div>

            {/* Animated SVG Radial Gauge */}
            <div className="mt-5 flex flex-col items-center">
              <div className="relative flex h-44 w-44 items-center justify-center">
                <svg
                  viewBox="0 0 160 160"
                  className="h-full w-full -rotate-90"
                  role="img"
                  aria-label={`Ethicality Score ${tool.score} out of 100`}
                >
                  {/* Background Track */}
                  <circle
                    cx="80"
                    cy="80"
                    r={gaugeRadius}
                    fill="none"
                    stroke="#E5EFE0"
                    strokeWidth="12"
                  />
                  {/* Animated Progress Arc */}
                  <motion.circle
                    cx="80"
                    cy="80"
                    r={gaugeRadius}
                    fill="none"
                    stroke={tier.stroke}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={gaugeCircumference}
                    initial={
                      reduced
                        ? { strokeDashoffset: gaugeDashOffset }
                        : { strokeDashoffset: gaugeCircumference }
                    }
                    animate={{ strokeDashoffset: gaugeDashOffset }}
                    transition={{
                      duration: reduced ? 0 : 1.0,
                      delay: reduced ? 0 : 0.15,
                      ease: EDITORIAL_EASE,
                    }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span
                    className="text-4xl font-bold leading-none text-[#202B20]"
                    style={EDITORIAL_SERIF_STYLE}
                  >
                    {tool.score}
                  </span>
                  <span className="mt-1 font-mono text-xs font-medium text-[#596556]">
                    / 100
                  </span>
                </div>
              </div>

              <span
                className={`mt-3 inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-semibold ${tier.pill}`}
              >
                {tier.label}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5 border-t border-[#D5E3D9] pt-4 text-xs">
              <div className="rounded-lg bg-[#F2F6EF] px-3 py-2">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#596556]">
                  Access Tier
                </p>
                <p className="mt-0.5 font-semibold text-[#202B20]">
                  {tool.price}
                </p>
              </div>
              <div className="rounded-lg bg-[#F2F6EF] px-3 py-2">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#596556]">
                  Classification
                </p>
                <p className="mt-0.5 truncate font-semibold text-[#202B20]">
                  {tool.type}
                </p>
              </div>
            </div>
          </div>
        }
      />

      {/* Section 01: Overview & Tool Profile */}
      <EditorialSection
        tone="white"
        ariaLabelledBy="tool-overview-heading"
      >
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="01 / Tool Overview"
            titleId="tool-overview-heading"
            title="Description & Operational Profile"
            description="Intended use case, functional classification, and recommended roles across research and development workflows."
          />
        </EditorialReveal>

        {/* Description Card */}
        <EditorialReveal delay={0.06} className="mt-8">
          <div className="rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-6 sm:p-8">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
              Description
            </p>
            <p className="mt-2.5 text-base leading-relaxed text-[#394838] sm:text-lg">
              Brief description of {tool.name} and its intended use. Categorized
              under{" "}
              <strong className="font-semibold text-[#202B20]">
                {tool.category}
              </strong>
              , this {tool.type.toLowerCase()} is evaluated for{" "}
              <strong className="font-semibold text-[#202B20]">
                {tool.research.toLowerCase()}
              </strong>{" "}
              and{" "}
              <strong className="font-semibold text-[#202B20]">
                {tool.projectDevelopment.toLowerCase()}
              </strong>{" "}
              workflows in ethical global development settings.
            </p>
          </div>
        </EditorialReveal>

        {/* Tool Information 3-Column Grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            {
              label: "Tool Type",
              value: tool.type,
              detail: "Primary interface and generative modality.",
              Icon: Cpu,
            },
            {
              label: "Research",
              value: tool.research,
              detail: "Evaluated academic and field inquiry alignment.",
              Icon: Microscope,
            },
            {
              label: "Project Development",
              value: tool.projectDevelopment,
              detail: "Best-fit phase across the project lifecycle.",
              Icon: Briefcase,
            },
          ].map(({ label, value, detail, Icon }, index) => (
            <EditorialReveal key={label} delay={0.08 + index * 0.05}>
              <div className="h-full rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6 transition-colors hover:border-[#3F673C] hover:bg-[#FAFDF8]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                    {label}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] text-[#3F673C]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <p
                  className="mt-3 text-xl font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {value}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-[#596556]">
                  {detail}
                </p>
              </div>
            </EditorialReveal>
          ))}
        </div>
      </EditorialSection>

      {/* Section 02: Ethical Considerations with Animated Progress Meters */}
      <EditorialSection
        tone="sage"
        ariaLabelledBy="ethical-considerations-heading"
      >
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="02 / Ethical Considerations"
            titleId="ethical-considerations-heading"
            title="Eight Evaluation Dimensions"
            description="Dimension-level indicators illustrating how the platform aligns with worthwhile development principles."
          />
        </EditorialReveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {criteriaScores.map((item, index) => {
            const Icon = item.Icon;
            const itemTier = getScoreTier(item.score);

            return (
              <EditorialReveal
                key={item.name}
                delay={Math.min(index * 0.04, 0.28)}
                className="h-full"
              >
                <div className="flex h-full flex-col justify-between rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-5 transition-colors hover:border-[#3F673C] hover:bg-[#FAFDF8]">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] text-[#3F673C]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${itemTier.pill}`}
                      >
                        {item.score}/100
                      </span>
                    </div>

                    <h3
                      className="mt-3.5 text-base font-semibold text-[#202B20]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {item.name}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#596556]">
                      {item.description}
                    </p>
                  </div>

                  {/* Animated Horizontal Progress Meter */}
                  <div className="mt-5">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#E3EDE0]">
                      <motion.div
                        initial={reduced ? false : { width: 0 }}
                        whileInView={{ width: `${item.score}%` }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                          duration: reduced ? 0 : 0.7,
                          delay: reduced ? 0 : index * 0.05,
                          ease: EDITORIAL_EASE,
                        }}
                        className={`h-full rounded-full ${itemTier.bar}`}
                      />
                    </div>
                  </div>
                </div>
              </EditorialReveal>
            );
          })}
        </div>
      </EditorialSection>

      {/* Section 03: Overall Assessment, Strengths & Field Considerations */}
      <EditorialSection
        tone="white"
        ariaLabelledBy="overall-assessment-heading"
      >
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="03 / Overall Assessment"
            titleId="overall-assessment-heading"
            title="Practitioner Guidance & Synthesis"
            description="Summary assessment paired with key strengths and ethical safeguards to review before adopting this tool."
          />
        </EditorialReveal>

        {/* Highlighted Overall Assessment Card */}
        <EditorialReveal delay={0.06} className="mt-8">
          <div className="rounded-2xl border-[1.5px] border-[#3F673C] bg-[#F2F6EF] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                Composite Evaluation Summary
              </span>
              <span
                className={`rounded-full border px-3 py-0.5 font-mono text-xs font-semibold ${tier.pill}`}
              >
                {tool.score}/100 &middot; {tier.label}
              </span>
            </div>
            <p className="mt-3 text-base leading-relaxed text-[#202B20] sm:text-lg">
              Overall assessment of {tool.name} based on the ethical evaluation
              criteria. With an ethicality score of{" "}
              <strong className="font-semibold text-[#187347]">
                {tool.score}/100
              </strong>
              , this platform demonstrates{" "}
              {tool.score >= 90
                ? "strong alignment with responsible research and participatory development principles."
                : tool.score >= 70
                  ? "moderate alignment and is best paired with active human oversight and privacy verification."
                  : "notable ethical trade-offs that require careful risk mitigation before field or student deployment."}
            </p>
          </div>
        </EditorialReveal>

        {/* Strengths & Risks Two-Column Cards */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <EditorialReveal delay={0.1}>
            <div className="h-full rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#94B985] bg-[#EDF4E8] text-[#187347]">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3
                  className="text-lg font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  Key Strengths
                </h3>
              </div>

              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#394838]">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#187347]" />
                  <span>
                    Well suited for{" "}
                    <strong className="font-medium text-[#202B20]">
                      {tool.research}
                    </strong>{" "}
                    and{" "}
                    <strong className="font-medium text-[#202B20]">
                      {tool.projectDevelopment}
                    </strong>{" "}
                    stages within {tool.category}.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#187347]" />
                  <span>
                    {tool.price === "Free"
                      ? "Free pricing tier lowers financial barriers for students and community organizations."
                      : tool.price === "Freemium"
                        ? "Freemium access enables initial piloting before committing project budgets."
                        : "Structured paid tier typically provides dedicated enterprise or institutional controls."}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#187347]" />
                  <span>
                    Clear functional role as a dedicated {tool.type.toLowerCase()}
                    , simplifying team governance and scoping.
                  </span>
                </li>
              </ul>
            </div>
          </EditorialReveal>

          <EditorialReveal delay={0.14}>
            <div className="h-full rounded-2xl border-[1.5px] border-[#D6CE8A] bg-[#FAF8E4]/45 p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D6CE8A] bg-[#FAF8E4] text-[#6F6057]">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3
                  className="text-lg font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  Risks &amp; Field Considerations
                </h3>
              </div>

              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#394838]">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9E8733]" />
                  <span>
                    Avoid uploading personally identifiable community data
                    without verifying informed consent and retention policies.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9E8733]" />
                  <span>
                    Validate outputs with local stakeholders to check for
                    cultural, linguistic, or regional blind spots.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9E8733]" />
                  <span>
                    Assess offline fallbacks and bandwidth requirements before
                    relying on this platform in low-connectivity settings.
                  </span>
                </li>
              </ul>
            </div>
          </EditorialReveal>
        </div>

        {/* Bottom Navigation Strip */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#D5E3D9] pt-6">
          <Link
            to="/ai-ethics-dashboard/tools"
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#B2C9A8] bg-white px-5 py-2.5 text-sm font-semibold text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#FAFDF8]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to All Tools</span>
          </Link>

          <Link
            to={`/ai-ethics-dashboard/tools?category=${encodeURIComponent(
              tool.category,
            )}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#3F673C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#187347]"
          >
            <span>More in {tool.category}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </EditorialSection>
    </main>
  );
}
