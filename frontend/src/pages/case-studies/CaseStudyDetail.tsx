/**
 * CaseStudyDetail - Full editorial article view for a single case study (/case-studies/:id).
 * Matches the Forest & Sage Green-Outline Editorial design language with a two-column
 * reading layout, sticky metadata dossier sidebar, values evaluation rubric, and related cases.
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  HeartPulse,
  Key,
  Leaf,
  MapPin,
  Palette,
  Scale,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { fetchMaldevelopment, fetchWorthwhile } from "@/api/caseStudies";
import type { CaseStudy, CaseStudySegment } from "@/types/caseStudies";
import { s3UriToHttps } from "@/utils/s3";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialReveal,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import "./CaseStudies.css";

type CaseStudyWithSegment = CaseStudy & {
  segment?: CaseStudySegment;
};

function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/\S+/i);
  return match ? match[0] : null;
}

function getScoreBadgeClass(score: string): string {
  switch (score.toUpperCase()) {
    case "A":
      return "border-[#94B985] bg-[#EDF4E8] text-[#187347]";
    case "B":
      return "border-[#B2C9A8] bg-[#F2F6EF] text-[#284B26]";
    case "C":
      return "border-[#D6CE8A] bg-[#FAF8E4] text-[#6F4E37]";
    case "F":
      return "border-[#E3B5AD] bg-[#FDF1EE] text-[#9E3223]";
    default:
      return "border-[#D5E3D9] bg-[#FAFDF8] text-[#596556]";
  }
}

function getValueIcon(key: string): React.ReactNode {
  const iconClass = "h-4 w-4 text-[#187347]";
  switch (key.toLowerCase()) {
    case "empowerment":
      return <Zap className={iconClass} aria-hidden="true" />;
    case "well-being":
    case "wellbeing":
      return <HeartPulse className={iconClass} aria-hidden="true" />;
    case "responsibility":
      return <CheckCircle2 className={iconClass} aria-hidden="true" />;
    case "human rights":
    case "human_rights":
      return <ShieldCheck className={iconClass} aria-hidden="true" />;
    case "cultural freedom":
    case "cultural_freedom":
      return <Palette className={iconClass} aria-hidden="true" />;
    case "equality":
      return <Scale className={iconClass} aria-hidden="true" />;
    case "sustainability":
      return <Leaf className={iconClass} aria-hidden="true" />;
    default:
      return <Star className={iconClass} aria-hidden="true" />;
  }
}

function formatKey(k: string): string {
  return k
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ArticleProseSection({
  id,
  eyebrow,
  title,
  content,
  highlighted = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  content: string;
  highlighted?: boolean;
}) {
  const inner = (
    <section id={id} className="scroll-mt-24 space-y-3">
      <div>
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
          {eyebrow}
        </p>
        <h2
          className="mt-1 text-2xl font-semibold text-[#202B20]"
          style={EDITORIAL_SERIF_STYLE}
        >
          {title}
        </h2>
      </div>
      <p className="whitespace-pre-wrap text-[15.5px] leading-[1.8] text-[#394838]">
        {content}
      </p>
    </section>
  );

  if (highlighted) {
    return (
      <div className="rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-6 sm:p-7">
        {inner}
      </div>
    );
  }

  return inner;
}

function SidebarMetaGroup({
  icon,
  title,
  items,
  variant = "sage",
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  variant?: "sage" | "cream" | "plain";
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="border-t border-[#D5E3D9] pt-4">
      <div className="flex items-center gap-2">
        <span className="text-[#187347]">{icon}</span>
        <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#284B26]">
          {title}
        </h3>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {items.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className={
              variant === "cream"
                ? "inline-flex items-center rounded-full border border-[#D6CE8A] bg-[#FAF8E4] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#5A5026]"
                : variant === "plain"
                  ? "inline-flex items-center rounded-full border border-[#D5E3D9] bg-white px-2.5 py-0.5 text-xs text-[#394838]"
                  : "inline-flex items-center rounded-full border border-[#B2C9A8]/80 bg-[#EDF4E8] px-2.5 py-0.5 text-xs font-medium text-[#284B26]"
            }
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CaseStudyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const [caseStudy, setCaseStudy] = useState<CaseStudyWithSegment | null>(null);
  const [relatedStudies, setRelatedStudies] = useState<CaseStudyWithSegment[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCaseStudy() {
      if (!id) {
        setError("No case study ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [worthwhile, maldevelopment] = await Promise.all([
          fetchWorthwhile().catch(() => []),
          fetchMaldevelopment().catch(() => []),
        ]);

        if (cancelled) return;

        const allCaseStudies: CaseStudyWithSegment[] = [
          ...worthwhile.map((cs) => ({
            ...cs,
            segment: "worthwhile" as const,
          })),
          ...maldevelopment.map((cs) => ({
            ...cs,
            segment: "maldevelopment" as const,
          })),
        ];

        const found = allCaseStudies.find((cs) => String(cs.id) === id);

        if (found) {
          setCaseStudy(found);

          // Rank related studies by overlapping values, regions, or same segment
          const others = allCaseStudies.filter(
            (cs) => String(cs.id) !== String(found.id),
          );
          const scored = others
            .map((candidate) => {
              let score = 0;
              if (candidate.segment === found.segment) score += 2;
              candidate.values?.forEach((v) => {
                if (found.values?.includes(v)) score += 3;
              });
              candidate.regions?.forEach((r) => {
                if (found.regions?.includes(r)) score += 2;
              });
              return { candidate, score };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map((entry) => entry.candidate);

          setRelatedStudies(scored);
        } else {
          setCaseStudy(null);
          setError("Case study not found");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load case study",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCaseStudy();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-[#3F673C] py-14 text-white">
          <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
            <div className="h-7 w-40 animate-pulse rounded-full bg-[#2E502B]" />
            <div className="h-11 w-3/4 max-w-2xl animate-pulse rounded-lg bg-[#2E502B]" />
            <div className="h-5 w-1/2 max-w-md animate-pulse rounded bg-[#355832]" />
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="space-y-6 lg:col-span-8">
            <div className="h-80 w-full animate-pulse rounded-2xl bg-[#EDF4E8]" />
            <div className="space-y-3">
              <div className="h-6 w-48 animate-pulse rounded bg-[#EDF4E8]" />
              <div className="h-4 w-full animate-pulse rounded bg-[#F2F6EF]" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-[#F2F6EF]" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-[#F2F6EF]" />
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="h-80 animate-pulse rounded-2xl border border-[#B2C9A8] bg-[#F2F6EF]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-white text-[#202B20]">
        <EditorialPageHero
          compact
          backLink={{ label: "Back to Case Studies", to: "/case-studies" }}
          badges={[{ label: "03 · Global Case Library", tone: "cream" }]}
          title={
            <>
              Case Study{" "}
              <em className="font-normal italic text-[#E9E6B2]">Not Found</em>
            </>
          }
          subtitle="The requested case study could not be retrieved from the archive."
        />
        <EditorialSection tone="white" compact>
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] px-6 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#B2C9A8] bg-[#EDF4E8] text-[#284B26]">
              <AlertCircle className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2
              className="mt-4 text-2xl font-semibold text-[#202B20]"
              style={EDITORIAL_SERIF_STYLE}
            >
              {error || "Case study not found"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#596556]">
              It may have been moved or the link may be incomplete. Return to
              the library to browse all available case studies.
            </p>
            <button
              type="button"
              onClick={() => navigate("/case-studies")}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#3F673C] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#284B26]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Return to Case Studies
            </button>
          </div>
        </EditorialSection>
      </div>
    );
  }

  const rawImage = caseStudy.image;
  const hasValidImage =
    typeof rawImage === "string" && rawImage.trim().length > 0;
  const imgUrl = hasValidImage ? s3UriToHttps(rawImage) || rawImage : null;
  const showImage = Boolean(imgUrl && failedImageUrl !== imgUrl);

  const isMaldev = caseStudy.segment === "maldevelopment";
  const regions = Array.isArray(caseStudy.regions)
    ? (caseStudy.regions as string[])
    : [];
  const values = Array.isArray(caseStudy.values)
    ? (caseStudy.values as string[])
    : [];
  const sdgs = Array.isArray(caseStudy.sdgs)
    ? (caseStudy.sdgs as (string | number)[])
    : [];
  const keywords = Array.isArray(caseStudy.keywords)
    ? (caseStudy.keywords as string[])
    : [];

  const evaluationEntries =
    caseStudy.evaluation && typeof caseStudy.evaluation === "object"
      ? Object.entries(caseStudy.evaluation as Record<string, unknown>)
          .filter(([, value]) => value !== null && typeof value === "object")
          .map(([key, value]) => ({ key, value }))
      : [];

  // Build quick-jump TOC anchors for sections present on this study
  const sectionLinks: { id: string; label: string }[] = [];
  if (typeof caseStudy.description === "string" && caseStudy.description.trim())
    sectionLinks.push({ id: "section-description", label: "Description" });
  if (typeof caseStudy.summary === "string" && caseStudy.summary.trim())
    sectionLinks.push({ id: "section-summary", label: "Summary" });
  if (
    typeof caseStudy.introduction === "string" &&
    caseStudy.introduction.trim()
  )
    sectionLinks.push({ id: "section-introduction", label: "Introduction" });
  if (typeof caseStudy.issue === "string" && caseStudy.issue.trim())
    sectionLinks.push({ id: "section-issue", label: "Issue" });
  if (typeof caseStudy.goal === "string" && caseStudy.goal.trim())
    sectionLinks.push({ id: "section-goal", label: "Goal" });
  if (typeof caseStudy.methods === "string" && caseStudy.methods.trim())
    sectionLinks.push({ id: "section-methods", label: "Methods" });
  if (
    typeof caseStudy.lessons_learned === "string" &&
    caseStudy.lessons_learned.trim()
  )
    sectionLinks.push({ id: "section-lessons", label: "Lessons Learned" });
  if (
    typeof caseStudy.findings_implications === "string" &&
    caseStudy.findings_implications.trim()
  )
    sectionLinks.push({
      id: "section-findings",
      label: "Findings & Implications",
    });
  if (
    typeof caseStudy.relation_sdgs_values === "string" &&
    caseStudy.relation_sdgs_values.trim()
  )
    sectionLinks.push({
      id: "section-relation",
      label: "Relation to SDGs & Values",
    });
  if (
    evaluationEntries.length > 0 ||
    (typeof caseStudy.evaluation === "string" && caseStudy.evaluation.trim())
  )
    sectionLinks.push({ id: "section-evaluation", label: "Evaluation" });
  if (
    (Array.isArray(caseStudy.references) && caseStudy.references.length > 0) ||
    (typeof caseStudy.references === "string" && caseStudy.references.trim())
  )
    sectionLinks.push({ id: "section-references", label: "References" });

  const totalEntries = evaluationEntries.length;
  const lastEntry = evaluationEntries[totalEntries - 1];
  const isLastSustainability =
    lastEntry && lastEntry.key.toLowerCase() === "sustainability";
  const shouldCenterLast = isLastSustainability && totalEntries % 2 === 1;

  return (
    <div className="min-h-screen bg-white text-[#202B20]">

      {/* Forest Green Editorial Article Hero */}
      <EditorialPageHero
        compact
        titleId="case-study-detail-title"
        backLink={{ label: "Back to Case Studies", to: "/case-studies" }}
        badges={[
          {
            label: isMaldev ? "Maldevelopment" : "Worthwhile Development",
            tone: "cream",
          },
          { label: "03 · Global Case Archive", tone: "sage" },
        ]}
        title={caseStudy.name}
        subtitle={
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#E8F0E5]">
            {regions.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin
                  className="h-4 w-4 text-[#E9E6B2]"
                  aria-hidden="true"
                />
                <span>{regions.join(", ")}</span>
              </span>
            )}
            {values.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Sparkles
                  className="h-4 w-4 text-[#E9E6B2]"
                  aria-hidden="true"
                />
                <span>
                  {values.length}{" "}
                  {values.length === 1 ? "Ethical Value" : "Ethical Values"}
                </span>
              </span>
            )}
            {sdgs.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Target
                  className="h-4 w-4 text-[#E9E6B2]"
                  aria-hidden="true"
                />
                <span>
                  {sdgs.length} {sdgs.length === 1 ? "UN SDG" : "UN SDGs"}
                </span>
              </span>
            )}
          </div>
        }
      />

      {/* Two-Column Editorial Reading Layout */}
      <EditorialSection tone="white" compact>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Primary Reading Column */}
          <article className="case-studies-prose space-y-10 lg:col-span-8">
            {/* Framed Hero Image */}
            <EditorialReveal>
              <figure className="overflow-hidden rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#202B20] shadow-sm">
                {showImage && imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={caseStudy.name}
                    className="h-72 w-full object-cover sm:h-96"
                    onError={() => setFailedImageUrl(imgUrl)}
                  />
                ) : (
                  <div className="relative flex h-64 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#284B26] via-[#3F673C] to-[#187347] sm:h-72">
                    <div
                      aria-hidden="true"
                      className="editorial-grid-texture pointer-events-none absolute inset-0 opacity-70"
                    />
                    <span
                      aria-hidden="true"
                      className="relative z-10 text-6xl font-semibold text-[#E9E6B2]/90"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {caseStudy.name
                        ?.split(/\s+/)
                        .filter(Boolean)
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 3)
                        .toUpperCase() || "CS"}
                    </span>
                  </div>
                )}
              </figure>
            </EditorialReveal>

            {/* Narrative Sections */}
            {typeof caseStudy.description === "string" &&
              caseStudy.description.trim() && (
                <EditorialReveal>
                  <ArticleProseSection
                    id="section-description"
                    eyebrow="Overview"
                    title="Description"
                    content={caseStudy.description}
                  />
                </EditorialReveal>
              )}

            {typeof caseStudy.summary === "string" &&
              caseStudy.summary.trim() && (
                <EditorialReveal>
                  <ArticleProseSection
                    id="section-summary"
                    eyebrow="Executive Brief"
                    title="Summary"
                    content={caseStudy.summary}
                  />
                </EditorialReveal>
              )}

            {typeof caseStudy.introduction === "string" &&
              caseStudy.introduction.trim() && (
                <EditorialReveal>
                  <ArticleProseSection
                    id="section-introduction"
                    eyebrow="Context"
                    title="Introduction"
                    content={caseStudy.introduction}
                  />
                </EditorialReveal>
              )}

            {typeof caseStudy.issue === "string" &&
              caseStudy.issue.trim() && (
                <EditorialReveal>
                  <ArticleProseSection
                    id="section-issue"
                    eyebrow="Core Challenge"
                    title="Issue"
                    content={caseStudy.issue}
                  />
                </EditorialReveal>
              )}

            {typeof caseStudy.goal === "string" && caseStudy.goal.trim() && (
              <EditorialReveal>
                <ArticleProseSection
                  id="section-goal"
                  eyebrow="Objective"
                  title="Goal"
                  content={caseStudy.goal}
                />
              </EditorialReveal>
            )}

            {typeof caseStudy.methods === "string" &&
              caseStudy.methods.trim() && (
                <EditorialReveal>
                  <ArticleProseSection
                    id="section-methods"
                    eyebrow="Approach"
                    title="Methods"
                    content={caseStudy.methods}
                  />
                </EditorialReveal>
              )}

            {typeof caseStudy.lessons_learned === "string" &&
              caseStudy.lessons_learned.trim() && (
                <EditorialReveal>
                  <ArticleProseSection
                    id="section-lessons"
                    eyebrow="Key Takeaways"
                    title="Lessons Learned"
                    content={caseStudy.lessons_learned}
                    highlighted
                  />
                </EditorialReveal>
              )}

            {typeof caseStudy.findings_implications === "string" &&
              caseStudy.findings_implications.trim() && (
                <EditorialReveal>
                  <ArticleProseSection
                    id="section-findings"
                    eyebrow="Analysis"
                    title="Findings and Implications"
                    content={caseStudy.findings_implications}
                  />
                </EditorialReveal>
              )}

            {typeof caseStudy.relation_sdgs_values === "string" &&
              caseStudy.relation_sdgs_values.trim() && (
                <EditorialReveal>
                  <ArticleProseSection
                    id="section-relation"
                    eyebrow="Ethical Alignment"
                    title="Relation to SDGs and Values"
                    content={caseStudy.relation_sdgs_values}
                  />
                </EditorialReveal>
              )}

            {/* Structured Values Evaluation Rubric */}
            {evaluationEntries.length > 0 && (
              <EditorialReveal>
                <section
                  id="section-evaluation"
                  className="scroll-mt-24 space-y-5"
                >
                  <div>
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                      Values Rubric
                    </p>
                    <h2
                      className="mt-1 text-2xl font-semibold text-[#202B20]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      Ethical Evaluation
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {evaluationEntries.map(({ key, value }, index) => {
                      const evaluationItem = value as {
                        summary?: string;
                        score?: string;
                        indicators_checked?: string[];
                      };
                      const score = evaluationItem.score || "N/A";
                      const summary = evaluationItem.summary || "";
                      const indicators = Array.isArray(
                        evaluationItem.indicators_checked,
                      )
                        ? evaluationItem.indicators_checked
                        : [];
                      const isLast = index === evaluationEntries.length - 1;
                      const shouldCenter = shouldCenterLast && isLast;

                      return (
                        <div
                          key={key}
                          className={`rounded-xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-5 transition-colors hover:border-[#3F673C] ${
                            shouldCenter
                              ? "md:col-span-2 md:mx-auto md:w-full md:max-w-2xl"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#B2C9A8]/80 bg-[#EDF4E8]">
                                {getValueIcon(key)}
                              </span>
                              <h3
                                className="text-base font-semibold text-[#202B20]"
                                style={EDITORIAL_SERIF_STYLE}
                              >
                                {formatKey(key)}
                              </h3>
                            </div>
                            <span
                              className={`shrink-0 rounded-full border px-3 py-0.5 font-mono text-xs font-bold ${getScoreBadgeClass(score)}`}
                            >
                              {score}
                            </span>
                          </div>

                          {summary && (
                            <p className="mt-3 text-sm leading-relaxed text-[#394838]">
                              {summary}
                            </p>
                          )}

                          {indicators.length > 0 && (
                            <div className="mt-4 border-t border-[#D5E3D9] pt-3">
                              <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#596556]">
                                Indicators Checked
                              </p>
                              <ul className="space-y-1.5">
                                {indicators.map((indicator, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-xs leading-relaxed text-[#394838]"
                                  >
                                    <span
                                      aria-hidden="true"
                                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#187347]"
                                    />
                                    <span>{indicator}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              </EditorialReveal>
            )}

            {/* String Evaluation */}
            {typeof caseStudy.evaluation === "string" &&
              caseStudy.evaluation.trim() && (
                <EditorialReveal>
                  <ArticleProseSection
                    id="section-evaluation"
                    eyebrow="Assessment"
                    title="Evaluation"
                    content={caseStudy.evaluation}
                  />
                </EditorialReveal>
              )}

            {/* References (Array) */}
            {Array.isArray(caseStudy.references) &&
              caseStudy.references.length > 0 && (
                <EditorialReveal>
                  <section
                    id="section-references"
                    className="scroll-mt-24 space-y-4"
                  >
                    <div>
                      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                        Sources
                      </p>
                      <h2
                        className="mt-1 text-2xl font-semibold text-[#202B20]"
                        style={EDITORIAL_SERIF_STYLE}
                      >
                        References
                      </h2>
                    </div>

                    <div className="rounded-xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] px-5 py-2">
                      <Accordion>
                        {(caseStudy.references as string[]).map((ref, idx) => {
                          const url = extractUrl(ref);
                          const before = url ? ref.split(url)[0] : ref;

                          return (
                            <AccordionItem
                              key={`detail_ref_${idx}`}
                              value={`detail_ref_${idx}`}
                              className="border-[#D5E3D9]"
                            >
                              <AccordionTrigger className="gap-2.5 text-sm font-normal leading-relaxed text-[#394838] hover:text-[#187347]">
                                <span className="flex items-start gap-2 text-left">
                                  <span className="shrink-0 font-mono text-xs font-semibold text-[#187347]">
                                    [{idx + 1}]
                                  </span>
                                  <span>{before.trim() || ref}</span>
                                </span>
                              </AccordionTrigger>
                              <AccordionContent>
                                {url ? (
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 break-all text-xs font-medium text-[#187347] underline underline-offset-4 hover:text-[#105C37]"
                                  >
                                    <span>{url}</span>
                                    <ExternalLink
                                      className="h-3 w-3 shrink-0"
                                      aria-hidden="true"
                                    />
                                  </a>
                                ) : (
                                  <span className="text-xs text-[#596556]">
                                    No external link provided for this citation.
                                  </span>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </div>
                  </section>
                </EditorialReveal>
              )}

            {/* References (String) */}
            {typeof caseStudy.references === "string" &&
              caseStudy.references.trim() && (
                <EditorialReveal>
                  <ArticleProseSection
                    id="section-references"
                    eyebrow="Sources"
                    title="References"
                    content={caseStudy.references}
                  />
                </EditorialReveal>
              )}
          </article>

          {/* Sticky Green-Outlined Metadata Sidebar */}
          <aside className="lg:col-span-4">
            <div className="space-y-5 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-6 lg:sticky lg:top-24">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                  Case Dossier
                </p>
                <div className="mt-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${
                      isMaldev
                        ? "border border-[#D6CE8A] bg-[#FAF8E4] text-[#6F4E37]"
                        : "border border-[#D6CE8A]/70 bg-[#E9E6B2] text-[#202B20]"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${
                        isMaldev ? "bg-[#A86B32]" : "bg-[#187347]"
                      }`}
                    />
                    {isMaldev ? "Maldevelopment" : "Worthwhile Development"}
                  </span>
                </div>
              </div>

              <SidebarMetaGroup
                icon={<MapPin className="h-3.5 w-3.5" aria-hidden="true" />}
                title="Region"
                items={regions}
                variant="plain"
              />

              <SidebarMetaGroup
                icon={<Star className="h-3.5 w-3.5" aria-hidden="true" />}
                title="Values of Worthwhile Development"
                items={values}
                variant="sage"
              />

              <SidebarMetaGroup
                icon={<Target className="h-3.5 w-3.5" aria-hidden="true" />}
                title="Sustainable Development Goals"
                items={sdgs.map((sdg) => `SDG ${sdg}`)}
                variant="cream"
              />

              <SidebarMetaGroup
                icon={<Key className="h-3.5 w-3.5" aria-hidden="true" />}
                title="Keywords"
                items={keywords}
                variant="plain"
              />

              {/* Quick Section Navigation */}
              {sectionLinks.length > 1 && (
                <nav
                  aria-label="Article sections"
                  className="border-t border-[#D5E3D9] pt-4"
                >
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#284B26]">
                    In This Study
                  </p>
                  <ul className="mt-2.5 space-y-1">
                    {sectionLinks.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="block rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#394838] transition-colors hover:bg-[#EDF4E8] hover:text-[#187347]"
                        >
                          {section.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {/* Evaluation Methodology Link */}
              <div className="border-t border-[#D5E3D9] pt-4">
                <a
                  href="/projectevaloldinternal.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#B2C9A8] bg-white px-4 py-2.5 text-xs font-semibold text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8]"
                >
                  <FileText
                    className="h-3.5 w-3.5 text-[#187347]"
                    aria-hidden="true"
                  />
                  <span>Evaluation Methodology (PDF)</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </EditorialSection>

      {/* Related Case Studies & Library Return Band */}
      <EditorialSection tone="sage" compact>
        <EditorialSectionHeader
          eyebrow="Continue Exploring"
          title="Related Case Studies"
          action={
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
            >
              <span>Browse All Case Studies</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        {relatedStudies.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedStudies.map((study) => {
              const relatedIsMaldev = study.segment === "maldevelopment";
              return (
                <motion.div
                  key={study.id}
                  whileHover={reduced ? undefined : { y: -4 }}
                  transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
                  className="h-full"
                >
                  <Link
                    to={`/case-studies/${study.id}`}
                    className="group flex h-full flex-col justify-between rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-5 transition-colors hover:border-[#3F673C]"
                  >
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${
                          relatedIsMaldev
                            ? "border border-[#D6CE8A] bg-[#FAF8E4] text-[#6F4E37]"
                            : "border border-[#D6CE8A]/70 bg-[#E9E6B2] text-[#202B20]"
                        }`}
                      >
                        {relatedIsMaldev
                          ? "Maldevelopment"
                          : "Worthwhile Development"}
                      </span>

                      <h3
                        className="mt-3 line-clamp-2 text-lg font-semibold leading-snug text-[#202B20] transition-colors group-hover:text-[#187347]"
                        style={EDITORIAL_SERIF_STYLE}
                      >
                        {study.name}
                      </h3>

                      {Array.isArray(study.regions) &&
                        study.regions.length > 0 && (
                          <p className="mt-2 inline-flex items-center gap-1 text-xs text-[#596556]">
                            <MapPin
                              className="h-3.5 w-3.5 text-[#187347]"
                              aria-hidden="true"
                            />
                            <span>{study.regions.slice(0, 2).join(", ")}</span>
                          </p>
                        )}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[#D5E3D9] pt-3.5 text-xs font-semibold text-[#187347]">
                      <span>Read Article</span>
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </EditorialSection>
    </div>
  );
}
