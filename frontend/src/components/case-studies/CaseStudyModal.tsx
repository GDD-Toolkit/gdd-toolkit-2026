/**
 * CaseStudyModal - Elevated editorial reader modal for displaying case study details.
 * Supports keyboard Escape close, background scroll locking, full-page deep link,
 * and structured ethical evaluation rubrics.
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  HeartPulse,
  Key,
  Leaf,
  MapPin,
  Palette,
  Scale,
  ShieldCheck,
  Star,
  Target,
  X,
  Zap,
} from "lucide-react";
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
} from "@/components/editorial/EditorialPagePrimitives";

interface CaseStudyModalProps {
  caseStudy: (CaseStudy & { segment?: CaseStudySegment }) | null;
  isOpen: boolean;
  onClose: () => void;
}

function MetadataCard({
  icon,
  title,
  items,
  pillVariant = "sage",
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  pillVariant?: "sage" | "cream" | "plain";
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-xl border-[1.5px] border-[#B2C9A8] bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EDF4E8] text-[#187347]">
          {icon}
        </span>
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#284B26]">
          {title}
        </h3>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {items.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className={
              pillVariant === "cream"
                ? "inline-flex items-center rounded-full border border-[#D6CE8A] bg-[#FAF8E4] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#5A5026]"
                : pillVariant === "plain"
                  ? "inline-flex items-center rounded-full border border-[#D5E3D9] bg-[#FAFDF8] px-2.5 py-0.5 text-xs text-[#394838]"
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

function ProseSection({
  eyebrow,
  title,
  content,
}: {
  eyebrow?: string;
  title: string;
  content: string;
}) {
  return (
    <section className="space-y-2.5">
      <div>
        {eyebrow && (
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
            {eyebrow}
          </p>
        )}
        <h3
          className="mt-0.5 text-xl font-semibold text-[#202B20]"
          style={EDITORIAL_SERIF_STYLE}
        >
          {title}
        </h3>
      </div>
      <p className="whitespace-pre-wrap text-[15px] leading-[1.75] text-[#394838]">
        {content}
      </p>
    </section>
  );
}

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

export default function CaseStudyModal({
  caseStudy,
  isOpen,
  onClose,
}: CaseStudyModalProps) {
  const reduced = useReducedMotion();
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  // Keyboard Escape handler & background scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const rawImage = caseStudy?.image;
  const hasValidImage =
    typeof rawImage === "string" && rawImage.trim().length > 0;
  const imgUrl = hasValidImage ? s3UriToHttps(rawImage) || rawImage : null;
  const showImage = Boolean(imgUrl && failedImageUrl !== imgUrl);

  const isMaldev = caseStudy?.segment === "maldevelopment";

  const regions = Array.isArray(caseStudy?.regions)
    ? (caseStudy.regions as string[])
    : [];
  const values = Array.isArray(caseStudy?.values)
    ? (caseStudy.values as string[])
    : [];
  const sdgs = Array.isArray(caseStudy?.sdgs)
    ? (caseStudy.sdgs as (string | number)[])
    : [];
  const keywords = Array.isArray(caseStudy?.keywords)
    ? (caseStudy.keywords as string[])
    : [];
  const hasMetadata =
    regions.length > 0 ||
    values.length > 0 ||
    sdgs.length > 0 ||
    keywords.length > 0;

  return (
    <AnimatePresence>
      {isOpen && caseStudy && (
        <motion.div
          key="case-study-modal-backdrop"
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#192419]/70 p-3 backdrop-blur-sm sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-modal-title"
        >
          <motion.div
            key={`case-study-modal-${caseStudy.id}`}
            initial={reduced ? false : { opacity: 0, y: 20, scale: 0.98 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-[1.5px] border-[#94B985] bg-white shadow-2xl"
          >
            {/* Editorial Forest Header */}
            <div className="relative shrink-0 overflow-hidden bg-[#3F673C] px-5 py-5 text-white sm:px-8 sm:py-6">
              <div
                aria-hidden="true"
                className="editorial-grid-texture pointer-events-none absolute inset-0 opacity-60"
              />

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {caseStudy.segment ? (
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
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-[#9AB887] bg-[#2E502B] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#E9E6B2]">
                      Global Case Study
                    </span>
                  )}

                  {regions.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#9AB887]/60 bg-[#355832] px-3 py-1 text-xs font-medium text-[#EDF4E8]">
                      <MapPin
                        className="h-3 w-3 text-[#E9E6B2]"
                        aria-hidden="true"
                      />
                      {regions.join(" · ")}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/case-studies/${caseStudy.id}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#9AB887]/70 bg-[#2E502B] px-3.5 py-1.5 text-xs font-medium text-[#EDF4E8] transition-colors hover:border-[#E9E6B2] hover:bg-[#254223] hover:text-[#E9E6B2]"
                  >
                    <span>Full Article</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>

                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close case study reader"
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#9AB887]/70 bg-[#2E502B] text-white transition-colors hover:border-[#E9E6B2] hover:bg-[#254223] hover:text-[#E9E6B2] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2]"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <h2
                id="case-study-modal-title"
                className="relative z-10 mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl"
                style={EDITORIAL_SERIF_STYLE}
              >
                {caseStudy.name}
              </h2>
            </div>

            {/* Scrollable Editorial Body */}
            <div className="case-studies-scroll flex-1 overflow-y-auto">
              {/* Hero Image Banner */}
              <div className="relative w-full bg-[#202B20]">
                {showImage && imgUrl ? (
                  <div className="relative h-56 w-full overflow-hidden sm:h-72">
                    <img
                      src={imgUrl}
                      alt={caseStudy.name}
                      className="h-full w-full object-cover"
                      onError={() => setFailedImageUrl(imgUrl)}
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#192419]/35 via-transparent to-transparent"
                    />
                  </div>
                ) : (
                  <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#284B26] via-[#3F673C] to-[#187347]">
                    <div
                      aria-hidden="true"
                      className="editorial-grid-texture pointer-events-none absolute inset-0 opacity-70"
                    />
                    <span
                      aria-hidden="true"
                      className="relative z-10 text-5xl font-semibold text-[#E9E6B2]/90"
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
              </div>

              {/* Metadata Band */}
              {hasMetadata && (
                <div className="border-y border-[#B2C9A8] bg-[#F2F6EF] p-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <MetadataCard
                      icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
                      title="Regions"
                      items={regions}
                      pillVariant="plain"
                    />
                    <MetadataCard
                      icon={<Star className="h-4 w-4" aria-hidden="true" />}
                      title="Values of Worthwhile Development"
                      items={values}
                      pillVariant="sage"
                    />
                    <MetadataCard
                      icon={<Target className="h-4 w-4" aria-hidden="true" />}
                      title="UN Sustainable Development Goals"
                      items={sdgs.map((sdg) => `SDG ${sdg}`)}
                      pillVariant="cream"
                    />
                    <MetadataCard
                      icon={<Key className="h-4 w-4" aria-hidden="true" />}
                      title="Keywords"
                      items={keywords}
                      pillVariant="plain"
                    />
                  </div>
                </div>
              )}

              {/* Prose & Evaluation Content */}
              <div className="case-studies-prose space-y-8 p-6 sm:p-8">
                {typeof caseStudy.description === "string" &&
                  caseStudy.description.trim() && (
                    <ProseSection
                      eyebrow="Overview"
                      title="Description"
                      content={caseStudy.description}
                    />
                  )}

                {typeof caseStudy.summary === "string" &&
                  caseStudy.summary.trim() && (
                    <ProseSection
                      eyebrow="Executive Brief"
                      title="Summary"
                      content={caseStudy.summary}
                    />
                  )}

                {typeof caseStudy.introduction === "string" &&
                  caseStudy.introduction.trim() && (
                    <ProseSection
                      eyebrow="Context"
                      title="Introduction"
                      content={caseStudy.introduction}
                    />
                  )}

                {typeof caseStudy.issue === "string" &&
                  caseStudy.issue.trim() && (
                    <ProseSection
                      eyebrow="Core Challenge"
                      title="Issue"
                      content={caseStudy.issue}
                    />
                  )}

                {typeof caseStudy.goal === "string" &&
                  caseStudy.goal.trim() && (
                    <ProseSection
                      eyebrow="Objective"
                      title="Goal"
                      content={caseStudy.goal}
                    />
                  )}

                {typeof caseStudy.methods === "string" &&
                  caseStudy.methods.trim() && (
                    <ProseSection
                      eyebrow="Approach"
                      title="Methods"
                      content={caseStudy.methods}
                    />
                  )}

                {typeof caseStudy.lessons_learned === "string" &&
                  caseStudy.lessons_learned.trim() && (
                    <div className="rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-5 sm:p-6">
                      <ProseSection
                        eyebrow="Key Takeaways"
                        title="Lessons Learned"
                        content={caseStudy.lessons_learned}
                      />
                    </div>
                  )}

                {typeof caseStudy.findings_implications === "string" &&
                  caseStudy.findings_implications.trim() && (
                    <ProseSection
                      eyebrow="Analysis"
                      title="Findings and Implications"
                      content={caseStudy.findings_implications}
                    />
                  )}

                {typeof caseStudy.relation_sdgs_values === "string" &&
                  caseStudy.relation_sdgs_values.trim() && (
                    <ProseSection
                      eyebrow="Ethical Alignment"
                      title="Relation to SDGs and Values"
                      content={caseStudy.relation_sdgs_values}
                    />
                  )}

                {/* Structured Evaluation Object */}
                {caseStudy.evaluation &&
                  typeof caseStudy.evaluation === "object" &&
                  (() => {
                    const entries = Object.entries(
                      caseStudy.evaluation as Record<string, unknown>,
                    )
                      .filter(
                        ([, value]) =>
                          value !== null && typeof value === "object",
                      )
                      .map(([key, value]) => ({ key, value }));

                    if (entries.length === 0) return null;

                    const totalEntries = entries.length;
                    const lastEntry = entries[totalEntries - 1];
                    const isLastSustainability =
                      lastEntry &&
                      lastEntry.key.toLowerCase() === "sustainability";
                    const shouldCenterLast =
                      isLastSustainability && totalEntries % 2 === 1;

                    return (
                      <section className="space-y-4">
                        <div>
                          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                            Values Rubric
                          </p>
                          <h3
                            className="mt-0.5 text-xl font-semibold text-[#202B20]"
                            style={EDITORIAL_SERIF_STYLE}
                          >
                            Ethical Evaluation
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {entries.map(({ key, value }, index) => {
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
                            const isLast = index === entries.length - 1;
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
                                    <h4
                                      className="text-base font-semibold text-[#202B20]"
                                      style={EDITORIAL_SERIF_STYLE}
                                    >
                                      {formatKey(key)}
                                    </h4>
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
                    );
                  })()}

                {/* String Evaluation */}
                {typeof caseStudy.evaluation === "string" &&
                  caseStudy.evaluation.trim() && (
                    <ProseSection
                      eyebrow="Assessment"
                      title="Evaluation"
                      content={caseStudy.evaluation}
                    />
                  )}

                {/* References (Array) */}
                {Array.isArray(caseStudy.references) &&
                  caseStudy.references.length > 0 && (
                    <section className="space-y-3">
                      <div>
                        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                          Sources
                        </p>
                        <h3
                          className="mt-0.5 text-xl font-semibold text-[#202B20]"
                          style={EDITORIAL_SERIF_STYLE}
                        >
                          References
                        </h3>
                      </div>

                      <div className="rounded-xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] px-4 py-2">
                        <Accordion>
                          {(caseStudy.references as string[]).map(
                            (ref, idx) => {
                              const url = extractUrl(ref);
                              const before = url ? ref.split(url)[0] : ref;

                              return (
                                <AccordionItem
                                  key={`ref_${idx}`}
                                  value={`ref_${idx}`}
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
                                        No external link provided for this
                                        citation.
                                      </span>
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            },
                          )}
                        </Accordion>
                      </div>
                    </section>
                  )}

                {/* References (String fallback) */}
                {typeof caseStudy.references === "string" &&
                  caseStudy.references.trim() && (
                    <ProseSection
                      eyebrow="Sources"
                      title="References"
                      content={caseStudy.references}
                    />
                  )}
              </div>
            </div>

            {/* Subtle Modal Footer */}
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#D5E3D9] bg-[#F2F6EF] px-5 py-3.5 sm:px-8">
              <p className="font-mono text-[11px] text-[#596556]">
                Press <kbd className="rounded border border-[#B2C9A8] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#284B26]">ESC</kbd> to return to library
              </p>
              <div className="flex items-center gap-2.5">
                <Link
                  to={`/case-studies/${caseStudy.id}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#B2C9A8] bg-white px-4 py-1.5 text-xs font-semibold text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8]"
                >
                  Open Dedicated Page
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer rounded-full bg-[#3F673C] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#284B26]"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
