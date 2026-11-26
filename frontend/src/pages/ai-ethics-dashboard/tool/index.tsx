import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ExternalLink,
  Info,
  SearchX,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialReveal,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import { getAITools } from "../../../api/strapi";

type EthicalConsideration = {
  viability?: number;
  bias_mitigation_score?: number;
  transparency_score?: number;
  control_oversight_score?: number;
  privacy_data_ethics_score?: number;
  localization_accessibility_score?: number;
  evidence_of_impact_score?: number;
  low_tech_compativility_score?: number;
  ethical_failsafes_score?: number;
  accountability_responsability_score?: number;
  documentation_support_score?: number;

  integration_description?: string;
  offline_capabilties_description?: string;
  sustainability_description?: string;
  bias_migration_description?: string;
  transparency_description?: string;
  control_oversight_description?: string;
  privacy_data_ethics_description?: string;
  localization_accessibility_description?: string;
  evidence_of_impact_description?: string;
  low_tech_compatbability_description?: string;
  ethical_failsafes_description?: string;
  accountability_responsability_description?: string;
  documentation_support_description?: string;
};

type StrapiAITool = {
  id: number;
  documentId?: string;
  name: string;
  about_section?: string;
  total_score: number;
  price?: {
    url?: string;
  };
  price_matrix_link?: string | null;
  logo?: Array<{
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
    };
  }>;
  ethical_consideration?: EthicalConsideration[];
  similar_tools?: Array<{
    id: number;
    documentId?: string;
    name: string;
    total_score?: number;
  }>;
};

const CONSIDERATION_FIELDS: {
  label: string;
  scoreKey: keyof EthicalConsideration;
  descriptionKey: keyof EthicalConsideration;
}[] = [
  {
    label: "Viability",
    scoreKey: "viability",
    descriptionKey: "sustainability_description",
  },
  {
    label: "Bias Mitigation",
    scoreKey: "bias_mitigation_score",
    descriptionKey: "bias_migration_description",
  },
  {
    label: "Transparency",
    scoreKey: "transparency_score",
    descriptionKey: "transparency_description",
  },
  {
    label: "Control & Oversight",
    scoreKey: "control_oversight_score",
    descriptionKey: "control_oversight_description",
  },
  {
    label: "Privacy & Data Ethics",
    scoreKey: "privacy_data_ethics_score",
    descriptionKey: "privacy_data_ethics_description",
  },
  {
    label: "Localization & Accessibility",
    scoreKey: "localization_accessibility_score",
    descriptionKey: "localization_accessibility_description",
  },
  {
    label: "Evidence of Impact",
    scoreKey: "evidence_of_impact_score",
    descriptionKey: "evidence_of_impact_description",
  },
  {
    label: "Low-tech Compatibility",
    scoreKey: "low_tech_compativility_score",
    descriptionKey: "low_tech_compatbability_description",
  },
  {
    label: "Ethical Failsafes",
    scoreKey: "ethical_failsafes_score",
    descriptionKey: "ethical_failsafes_description",
  },
  {
    label: "Accountability & Responsibility",
    scoreKey: "accountability_responsability_score",
    descriptionKey: "accountability_responsability_description",
  },
  {
    label: "Documentation & Support",
    scoreKey: "documentation_support_score",
    descriptionKey: "documentation_support_description",
  },
];

const BOOKMARK_STORAGE_KEY = "gdd-ai-ethics-bookmarked-tools";

function loadBookmarks(): string[] {
  try {
    const raw = window.localStorage.getItem(BOOKMARK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

function getScoreProfile(score: number) {
  if (score >= 45) {
    return {
      stroke: "#187347",
      bar: "from-[#3F673C] to-[#187347]",
      badge: "border-[#94B985] bg-[#EDF4E8] text-[#187347]",
      tier: "Strong Ethical Alignment",
    };
  }
  if (score >= 35) {
    return {
      stroke: "#B59B34",
      bar: "from-[#B59B34] to-[#D6B84E]",
      badge: "border-[#D6CE8A] bg-[#FAF8E4] text-[#6F6057]",
      tier: "Moderate Ethical Alignment",
    };
  }
  return {
    stroke: "#B4463E",
    bar: "from-[#B4463E] to-[#D46B62]",
    badge: "border-[#E2B4B0] bg-[#FDF3F2] text-[#8F2D27]",
    tier: "Elevated Ethical Caution",
  };
}

function EthicalityRadialGauge({ score }: { score: number }) {
  const reduced = useReducedMotion();
  const profile = getScoreProfile(score);
  const clampedPct = Math.max(0, Math.min(100, (score / 50) * 100));
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clampedPct / 100);

  return (
    <div className="flex flex-col items-center rounded-2xl border-[1.5px] border-[#E9E6B2]/85 bg-white p-6 text-center text-[#202B20] shadow-xl">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
        Overall Ethicality Score
      </p>

      <div className="relative mt-4 flex h-36 w-36 items-center justify-center">
        <svg
          className="h-36 w-36 -rotate-90"
          viewBox="0 0 140 140"
          role="img"
          aria-label={`Ethicality score ${score} out of 50`}
        >
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#EDF4E8"
            strokeWidth="12"
          />
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={profile.stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={
              reduced ? { strokeDashoffset: dashOffset } : { strokeDashoffset: circumference }
            }
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.9, ease: EDITORIAL_EASE }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-bold leading-none text-[#202B20]"
            style={EDITORIAL_SERIF_STYLE}
          >
            {score}
          </span>
          <span className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[#596556]">
            / 50
          </span>
        </div>
      </div>

      <span
        className={`mt-4 inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-semibold ${profile.badge}`}
      >
        {profile.tier}
      </span>

      <p className="mt-3 text-xs leading-relaxed text-[#596556]">
        Composite ethical evaluation across viability, bias, privacy,
        transparency, accessibility, and accountability.
      </p>
    </div>
  );
}

export default function AIEthicsTool() {
  const [searchParams] = useSearchParams();
  const toolName = searchParams.get("name");
  const reduced = useReducedMotion();

  const [tools, setTools] = useState<StrapiAITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarks, setBookmarks] = useState<string[]>(() => loadBookmarks());

  useEffect(() => {
    let cancelled = false;

    async function fetchTools() {
      try {
        setLoading(true);
        setError("");

        const data = await getAITools();
        if (!cancelled) {
          setTools(data as StrapiAITool[]);
        }
      } catch (err) {
        console.error("Failed to fetch AI tools:", err);
        if (!cancelled) {
          setError(
            "Unable to load AI tool information. Please try again later.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTools();

    return () => {
      cancelled = true;
    };
  }, []);

  const tool = tools.find((item) => item.name === toolName);

  const toggleBookmark = (name: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name];
      try {
        window.localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="w-full bg-white text-[#202B20]">
        <EditorialPageHero
          compact
          backLink={{
            label: "Back to Tool Directory",
            to: "/ai-ethics-dashboard/tools",
          }}
          badges={[{ label: "AI Ethics Dashboard", tone: "cream" }]}
          title={
            <>
              Loading{" "}
              <em className="font-normal italic text-[#E9E6B2]">Evaluation</em>
            </>
          }
          subtitle="Retrieving live ethical criteria and documentation from Strapi…"
        />
        <EditorialSection tone="white" compact>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl border-[1.5px] border-[#D5E3D9] bg-[#F2F6EF]"
              />
            ))}
          </div>
        </EditorialSection>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="w-full bg-white text-[#202B20]">
        <EditorialPageHero
          compact
          backLink={{
            label: "Back to Tool Directory",
            to: "/ai-ethics-dashboard/tools",
          }}
          badges={[{ label: "AI Ethics Dashboard", tone: "cream" }]}
          title={
            error ? (
              <>
                Unable to{" "}
                <em className="font-normal italic text-[#E9E6B2]">Load Tool</em>
              </>
            ) : (
              <>
                Tool{" "}
                <em className="font-normal italic text-[#E9E6B2]">Not Found</em>
              </>
            )
          }
          subtitle={
            error ||
            "The selected AI tool could not be found in our evaluated directory."
          }
        />

        <EditorialSection tone="white" compact>
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#F2F6EF] p-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#94B985] bg-white text-[#3F673C]">
              <SearchX className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2
              className="mt-4 text-2xl font-semibold text-[#202B20]"
              style={EDITORIAL_SERIF_STYLE}
            >
              Browse Evaluated Platforms
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#596556]">
              Return to the directory to search all evaluated AI tools and
              explore their ethicality score breakdowns.
            </p>
            <Link
              to="/ai-ethics-dashboard/tools"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Return to Directory</span>
            </Link>
          </div>
        </EditorialSection>
      </div>
    );
  }

  const logoUrl = tool.logo?.[0]?.formats?.small?.url || tool.logo?.[0]?.url;
  const pricingUrl = tool.price?.url || tool.price_matrix_link;
  const considerations = tool.ethical_consideration ?? [];

  const availableConsiderations = considerations.flatMap((item) =>
    CONSIDERATION_FIELDS.filter(
      (field) => typeof item[field.scoreKey] === "number",
    ).map((field) => ({
      label: field.label,
      score: item[field.scoreKey] as number,
      description: item[field.descriptionKey] as string | undefined,
    })),
  );

  const additionalDetails = considerations.flatMap((item) =>
    [
      {
        label: "Integration",
        description: item.integration_description,
      },
      {
        label: "Offline Capabilities",
        description: item.offline_capabilties_description,
      },
      {
        label: "Sustainability",
        description: item.sustainability_description,
      },
    ].filter(
      (detail): detail is { label: string; description: string } =>
        Boolean(detail.description),
    ),
  );

  const isBookmarked = bookmarks.includes(tool.name);

  return (
    <div className="w-full bg-white text-[#202B20]">
      {/* Forest Green Hero + Animated Radial Score Gauge */}
      <EditorialPageHero
        titleId="tool-detail-heading"
        backLink={{
          label: "Back to Tool Directory",
          to: "/ai-ethics-dashboard/tools",
        }}
        badges={[
          { label: "AI Ethics Evaluation", tone: "cream" },
          {
            label: `${availableConsiderations.length} Criteria Scored`,
            tone: "sage",
          },
        ]}
        title={
          <span className="inline-flex items-center gap-4">
            {logoUrl && (
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-[1.5px] border-[#E9E6B2] bg-white p-2 shadow-sm sm:h-16 sm:w-16">
                <img
                  src={logoUrl}
                  alt={`${tool.name} logo`}
                  className="h-full w-full object-contain"
                />
              </span>
            )}
            <span>{tool.name}</span>
          </span>
        }
        subtitle={
          tool.about_section ||
          `Ethical evaluation profile for ${tool.name} based on the GDD Toolkit's 50-point ethicality rubric.`
        }
        actions={
          <>
            {pricingUrl && (
              <a
                href={pricingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#E9E6B2] px-6 py-3 text-sm font-semibold text-[#202B20] shadow-xs transition-all hover:bg-[#f2efbf] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C]"
              >
                <span>View Pricing</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}

            <button
              type="button"
              onClick={() => toggleBookmark(tool.name)}
              aria-pressed={isBookmarked}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C] ${
                isBookmarked
                  ? "border-[#E9E6B2] bg-[#254223] text-[#E9E6B2]"
                  : "border-[#9AB887] bg-[#2E502B] text-white hover:bg-[#254223]"
              }`}
            >
              <Bookmark
                className={`h-4 w-4 ${isBookmarked ? "fill-current text-[#E9E6B2]" : ""}`}
                aria-hidden="true"
              />
              <span>{isBookmarked ? "Bookmarked" : "Bookmark Tool"}</span>
            </button>
          </>
        }
        aside={<EthicalityRadialGauge score={tool.total_score} />}
      />

      {/* 01 / Overview & Pricing */}
      <EditorialSection tone="white" ariaLabelledBy="overview-heading">
        <EditorialSectionHeader
          eyebrow="01 / Tool Profile"
          title="About & Pricing"
          titleId="overview-heading"
          description="Summary and pricing details sourced directly from our research CMS."
        />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-6 sm:p-7 lg:col-span-8">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
              About
            </p>
            <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-[#394838]">
              {tool.about_section || "No description available for this tool."}
            </p>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6 lg:col-span-4">
            <div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                Pricing Matrix
              </p>
              <h3
                className="mt-1.5 text-xl font-semibold text-[#202B20]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Pricing Information
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#596556]">
                {pricingUrl
                  ? "Review current plans, academic access, and tier limits directly from the provider."
                  : "No pricing information available."}
              </p>
            </div>

            {pricingUrl && (
              <a
                href={pricingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:brightness-110"
              >
                <span>View Pricing</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </EditorialSection>

      {/* 02 / Ethical Considerations Breakdown */}
      <EditorialSection tone="sage" ariaLabelledBy="considerations-heading">
        <EditorialSectionHeader
          eyebrow="02 / Ethical Considerations"
          title="Criterion-by-Criterion Breakdown"
          titleId="considerations-heading"
          description="Individual evaluation scores and qualitative notes across each ethical rubric criterion."
        />

        {availableConsiderations.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {availableConsiderations.map((item, idx) => {
              const barPct = Math.max(0, Math.min(100, (item.score / 5) * 100));

              return (
                <EditorialReveal
                  key={`${item.label}-${idx}`}
                  delay={Math.min(idx * 0.04, 0.25)}
                >
                  <div className="flex h-full flex-col justify-between rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6 transition-colors hover:border-[#3F673C] hover:bg-[#FAFDF8]">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3
                          className="text-lg font-semibold text-[#202B20]"
                          style={EDITORIAL_SERIF_STYLE}
                        >
                          {item.label}
                        </h3>
                        <span className="shrink-0 rounded-full border border-[#94B985] bg-[#EDF4E8] px-3 py-0.5 font-mono text-xs font-semibold text-[#187347]">
                          {item.score}
                        </span>
                      </div>

                      <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-[#F2F6EF]">
                        <motion.div
                          initial={reduced ? false : { width: 0 }}
                          whileInView={{ width: `${barPct}%` }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.6, ease: EDITORIAL_EASE }}
                          className="h-full rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347]"
                        />
                      </div>

                      {item.description && (
                        <p className="mt-3.5 whitespace-pre-line text-sm leading-relaxed text-[#394838]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </EditorialReveal>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-8 text-center text-sm text-[#596556]">
            No ethical consideration data available.
          </div>
        )}
      </EditorialSection>

      {/* 03 / Additional Information (Integration, Offline Capabilities, Sustainability) */}
      {additionalDetails.length > 0 && (
        <EditorialSection tone="white" ariaLabelledBy="additional-info-heading">
          <EditorialSectionHeader
            eyebrow="03 / Field Deployment Context"
            title="Additional Information"
            titleId="additional-info-heading"
            description="Practical notes on integration workflows, offline compatibility, and environmental sustainability."
          />

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {additionalDetails.map((detail, idx) => (
              <EditorialReveal key={`${detail.label}-${idx}`} delay={idx * 0.05}>
                <div className="h-full rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-6">
                  <div className="flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#187347]">
                    <Info className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{detail.label}</span>
                  </div>
                  <h3
                    className="mt-2 text-xl font-semibold text-[#202B20]"
                    style={EDITORIAL_SERIF_STYLE}
                  >
                    {detail.label}
                  </h3>
                  <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed text-[#394838]">
                    {detail.description}
                  </p>
                </div>
              </EditorialReveal>
            ))}
          </div>
        </EditorialSection>
      )}

      {/* 04 / Similar Tools */}
      {(tool.similar_tools?.length ?? 0) > 0 && (
        <EditorialSection
          tone={additionalDetails.length > 0 ? "sage" : "white"}
          ariaLabelledBy="similar-tools-heading"
        >
          <EditorialSectionHeader
            eyebrow="Compare Alternatives"
            title="Similar Tools"
            titleId="similar-tools-heading"
            description="Explore related platforms to compare ethical tradeoffs and fit for your project."
          />

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tool.similar_tools?.map((similarTool) => (
              <Link
                key={similarTool.documentId || similarTool.id}
                to={`/ai-ethics-dashboard/tool?name=${encodeURIComponent(similarTool.name)}`}
                onClick={() => window.scrollTo(0, 0)}
                className="group flex flex-col justify-between gap-4 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#3F673C] hover:bg-[#FAFDF8]"
              >
                <div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] text-[#3F673C]">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3
                    className="mt-3.5 text-lg font-semibold text-[#202B20] group-hover:text-[#187347]"
                    style={EDITORIAL_SERIF_STYLE}
                  >
                    {similarTool.name}
                  </h3>
                  {typeof similarTool.total_score === "number" && (
                    <p className="mt-1.5 font-mono text-xs text-[#596556]">
                      Ethicality Score: {similarTool.total_score}/50
                    </p>
                  )}
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3F673C] group-hover:text-[#187347]">
                  <span>Inspect tool</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </EditorialSection>
      )}

      {/* Overall Assessment */}
      <EditorialSection
        tone="white"
        compact
        ariaLabelledBy="overall-assessment-heading"
      >
        <div className="rounded-2xl border-[1.5px] border-[#94B985] bg-[#F6F4D8] p-7 sm:p-9">
          <div className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#94B985] bg-white text-[#187347]">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                Summary Synthesis
              </p>
              <h2
                id="overall-assessment-heading"
                className="mt-1 text-2xl font-semibold text-[#202B20]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Overall Assessment
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#394838]">
                {tool.name} received an overall Ethicality Score of{" "}
                <strong className="font-semibold text-[#202B20]">
                  {tool.total_score}/50
                </strong>{" "}
                based on its ethical evaluation. The individual criteria above
                provide more detail about its evaluation.
              </p>
            </div>
          </div>
        </div>
      </EditorialSection>
    </div>
  );
}
