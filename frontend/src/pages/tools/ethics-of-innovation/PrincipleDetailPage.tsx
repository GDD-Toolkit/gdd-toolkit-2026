import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import {
  DIGITAL_PRINCIPLES,
  getPrincipleBySlug,
  type DigitalPrincipleDetail,
} from "./principlesData";
import "../../development-ethics/humanCentredInnovation.css";

function EditorialReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced || typeof IntersectionObserver === "undefined") {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, delay, ease: EDITORIAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function PrincipleDetailPage({
  slug,
}: {
  slug: DigitalPrincipleDetail["slug"];
}) {
  const principle = getPrincipleBySlug(slug);
  const currentIndex = DIGITAL_PRINCIPLES.findIndex(
    (item) => item.slug === slug,
  );
  const previousPrinciple =
    currentIndex > 0 ? DIGITAL_PRINCIPLES[currentIndex - 1] : null;
  const nextPrinciple =
    currentIndex < DIGITAL_PRINCIPLES.length - 1
      ? DIGITAL_PRINCIPLES[currentIndex + 1]
      : null;

  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
    setCheckedItems([]);
  }, [slug]);

  const toggleItem = (index: number) => {
    setCheckedItems((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  };

  const progressPercent =
    principle.checklist.length > 0
      ? Math.round((checkedItems.length / principle.checklist.length) * 100)
      : 0;
  const allChecked =
    principle.checklist.length > 0 &&
    checkedItems.length === principle.checklist.length;

  return (
    <div className="hci-scope">

      <EditorialPageHero
        titleId="eoi-detail-title"
        backLink={{
          label: "Ethics of Innovation",
          to: "/ethics-of-innovation",
        }}
        badges={[
          {
            label: `Principle ${principle.number} of ${String(DIGITAL_PRINCIPLES.length).padStart(2, "0")}`,
            tone: "cream",
          },
          {
            label: `${principle.checklist.length} Review Questions`,
            tone: "sage",
          },
        ]}
        title={
          <>
            {principle.heroPrimary}{" "}
            <em className="font-normal italic text-[#E9E6B2]">
              {principle.heroEmphasis}
            </em>
          </>
        }
        subtitle={principle.cardSummary}
        aside={
          <div className="rounded-2xl border-[1.5px] border-[#E9E6B2]/75 bg-[#2E502B]/90 p-6 shadow-xl">
            <div className="flex items-center gap-5">
              <motion.div
                key={principle.number}
                initial={reduced ? false : { scale: 0.9, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: EDITORIAL_EASE }}
                className="flex h-22 w-22 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#E9E6B2] bg-[#E9E6B2] text-[#202B20] shadow-md"
              >
                <span
                  className="text-4xl font-semibold italic leading-none"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {principle.number}
                </span>
              </motion.div>
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#E9E6B2]">
                  Digital Design Sequence
                </p>
                <p
                  className="mt-1 text-lg font-semibold text-white"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {principle.title}
                </p>
                <p className="mt-1 font-mono text-[11px] text-[#EDF4E8]/85">
                  of 09 Principles
                </p>
              </div>
            </div>

            {/* 9-Principle Position Indicator */}
            <div
              className="mt-5 grid grid-cols-9 gap-1.5 border-t border-[#9AB887]/35 pt-4"
              aria-hidden="true"
            >
              {DIGITAL_PRINCIPLES.map((item, idx) => (
                <span
                  key={item.slug}
                  className={`h-2 rounded-full transition-colors ${
                    idx === currentIndex
                      ? "bg-[#E9E6B2]"
                      : idx < currentIndex
                        ? "bg-[#9AB887]"
                        : "bg-[#355832]"
                  }`}
                />
              ))}
            </div>
          </div>
        }
      />

      {/* Section 1: Summary */}
      <EditorialSection tone="white" ariaLabelledBy="eoi-summary-title">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <EditorialReveal className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border-[1.5px] border-[#94B985] bg-[#F2F6EF] p-3 shadow-sm">
              <div className="overflow-hidden rounded-xl bg-white">
                <img
                  src={principle.img}
                  alt={principle.imgAlt}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>
          </EditorialReveal>

          <EditorialReveal delay={0.08} className="lg:col-span-7">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#187347]">
              01 / Principle overview
            </p>
            <h2
              id="eoi-summary-title"
              className="mt-2 text-3xl font-semibold tracking-tight text-[#202B20] sm:text-4xl"
              style={EDITORIAL_SERIF_STYLE}
            >
              <em className="font-normal italic text-[#187347]">Summary</em>
            </h2>
            <p className="mt-5 border-t-[1.5px] border-[#3F673C] pt-5 text-base leading-relaxed text-[#394838] sm:text-[1.05rem]">
              {principle.summary}
            </p>
          </EditorialReveal>
        </div>
      </EditorialSection>

      {/* Section 2: Interactive Project Review Checklist */}
      <EditorialSection tone="sage" ariaLabelledBy="eoi-checklist-title">
        <div className="mx-auto max-w-4xl rounded-2xl border-[1.5px] border-[#3F673C] bg-white p-6 shadow-md sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#187347]">
                02 / Project review checkpoint
              </p>
              <h2
                id="eoi-checklist-title"
                className="mt-2 text-2xl font-semibold tracking-tight text-[#202B20] sm:text-3xl"
                style={EDITORIAL_SERIF_STYLE}
              >
                Checklist{" "}
                <em className="font-normal italic text-[#187347]">Questions</em>
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <span
                aria-live="polite"
                className="inline-flex items-center rounded-full border border-[#94B985] bg-[#EDF4E8] px-3.5 py-1.5 font-mono text-xs font-semibold text-[#187347]"
              >
                {checkedItems.length} / {principle.checklist.length} checked
              </span>
              {checkedItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCheckedItems([])}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#B2C9A8] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#FAFDF8]"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Animated Checklist Progress Bar */}
          <div className="mt-5">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EDF4E8]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347]"
                initial={false}
                animate={{ width: `${progressPercent}%` }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 0.35, ease: EDITORIAL_EASE }
                }
              />
            </div>
          </div>

          {allChecked && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2.5 rounded-xl border border-[#94B985] bg-[#F6F4D8] px-4 py-3 text-sm font-medium text-[#202B20]"
            >
              <CheckCircle2
                className="h-4 w-4 shrink-0 text-[#187347]"
                aria-hidden="true"
              />
              <span>
                All checklist criteria reviewed for {principle.title}.
              </span>
            </motion.div>
          )}

          <ul className="mt-6 space-y-3">
            {principle.checklist.map((item, index) => {
              const isChecked = checkedItems.includes(index);
              return (
                <li key={item.question}>
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    aria-pressed={isChecked}
                    className={`flex w-full cursor-pointer items-start gap-4 rounded-xl border-[1.5px] p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C] focus-visible:ring-offset-2 ${
                      isChecked
                        ? "border-[#187347] bg-[#EDF4E8]"
                        : "border-[#B2C9A8] bg-[#FAFDF8] hover:border-[#3F673C] hover:bg-white"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-[1.5px] transition-colors ${
                        isChecked
                          ? "border-[#187347] bg-[#187347] text-white"
                          : "border-[#94B985] bg-white"
                      }`}
                    >
                      {isChecked && (
                        <motion.span
                          initial={reduced ? false : { scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 460,
                            damping: 22,
                          }}
                          className="flex items-center justify-center"
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={2.75} />
                        </motion.span>
                      )}
                    </span>
                    <span className="text-sm leading-relaxed text-[#202B20] sm:text-[0.95rem]">
                      {item.label && (
                        <strong className="font-semibold text-[#284B26]">
                          {item.label}:{" "}
                        </strong>
                      )}
                      {item.question}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </EditorialSection>

      {/* Section 3: Additional Resources */}
      <EditorialSection tone="white" ariaLabelledBy="eoi-resources-title">
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="03 / Further reading"
            titleId="eoi-resources-title"
            title={
              <>
                Additional{" "}
                <em className="font-normal italic text-[#187347]">Resources</em>
              </>
            }
          />
        </EditorialReveal>

        <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {principle.resources.map((resource, idx) => (
            <EditorialReveal key={resource.href} delay={idx * 0.05}>
              <li className="flex h-full flex-col justify-between rounded-xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-5 transition-colors hover:border-[#3F673C] hover:bg-white sm:p-6">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    Reference 0{idx + 1}
                  </div>
                  {resource.citationPrefix && (
                    <p className="mt-2.5 text-xs leading-relaxed text-[#596556]">
                      {resource.citationPrefix}
                    </p>
                  )}
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-3 flex items-start justify-between gap-3 text-base font-semibold text-[#202B20] transition-colors hover:text-[#187347]"
                  >
                    <span
                      className="break-words leading-snug"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {resource.title}
                    </span>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#94B985] bg-white text-[#284B26] transition-all group-hover:border-[#3F673C] group-hover:bg-[#3F673C] group-hover:text-[#E9E6B2]">
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </a>
                  {resource.description && (
                    <p className="mt-3 text-sm leading-relaxed text-[#394838]">
                      {resource.description}
                    </p>
                  )}
                </div>
              </li>
            </EditorialReveal>
          ))}
        </ul>
      </EditorialSection>

      {/* Section 4: Case Studies & Guides */}
      {principle.caseStudies && principle.caseStudies.length > 0 && (
        <EditorialSection tone="sage" ariaLabelledBy="eoi-cases-title">
          <EditorialReveal>
            <EditorialSectionHeader
              eyebrow="04 / In practice"
              titleId="eoi-cases-title"
              title={
                <>
                  Case Studies &amp;{" "}
                  <em className="font-normal italic text-[#187347]">Guides</em>
                </>
              }
            />
          </EditorialReveal>

          <div className="mt-8 space-y-6">
            {principle.caseStudies.map((study, idx) => (
              <EditorialReveal key={study.heading} delay={idx * 0.06}>
                <article
                  className={`grid grid-cols-1 items-center gap-6 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6 shadow-xs sm:p-7 ${
                    study.embedUrl ? "lg:grid-cols-12" : ""
                  }`}
                >
                  <div className={study.embedUrl ? "lg:col-span-6" : ""}>
                    {study.eyebrow && (
                      <span className="inline-flex items-center rounded-full border border-[#94B985] bg-[#EDF4E8] px-3 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                        {study.eyebrow}
                      </span>
                    )}
                    <h3
                      className="mt-3 text-2xl font-semibold text-[#202B20]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {study.heading}
                    </h3>
                    {study.linkHref && study.linkLabel && (
                      <p className="mt-2.5 text-xs leading-relaxed text-[#596556]">
                        {study.citationPrefix}
                        <a
                          href={study.linkHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#187347] underline decoration-[#94B985] underline-offset-2 transition-colors hover:text-[#105C37]"
                        >
                          {study.linkLabel}
                        </a>
                        {study.citationSuffix}
                      </p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-[#394838] sm:text-[0.95rem]">
                      {study.description}
                    </p>
                  </div>

                  {study.embedUrl && (
                    <div className="lg:col-span-6">
                      <div className="overflow-hidden rounded-xl border-[1.5px] border-[#94B985] bg-[#192419] shadow-sm">
                        <iframe
                          src={study.embedUrl}
                          title={study.embedTitle ?? study.heading}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="aspect-video w-full border-0"
                        />
                      </div>
                    </div>
                  )}
                </article>
              </EditorialReveal>
            ))}
          </div>
        </EditorialSection>
      )}

      {/* Prev / Next Principle Pagination */}
      <nav
        aria-label="Principle pagination"
        className="w-full border-t border-[#B2C9A8] bg-white py-10"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
          {previousPrinciple ? (
            <Link
              to={previousPrinciple.path}
              className="group flex items-center gap-4 rounded-xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-5 transition-colors hover:border-[#3F673C] hover:bg-white"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#94B985] bg-white text-[#284B26] transition-all group-hover:-translate-x-0.5 group-hover:border-[#3F673C] group-hover:bg-[#3F673C] group-hover:text-[#E9E6B2]">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <small className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                  Previous · {previousPrinciple.number}
                </small>
                <strong
                  className="mt-0.5 text-base font-semibold text-[#202B20] sm:text-lg"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {previousPrinciple.title}
                </strong>
              </span>
            </Link>
          ) : (
            <Link
              to="/ethics-of-innovation"
              className="group flex items-center gap-4 rounded-xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-5 transition-colors hover:border-[#3F673C] hover:bg-white"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#94B985] bg-white text-[#284B26] transition-all group-hover:-translate-x-0.5 group-hover:border-[#3F673C] group-hover:bg-[#3F673C] group-hover:text-[#E9E6B2]">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <small className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                  Overview
                </small>
                <strong
                  className="mt-0.5 text-base font-semibold text-[#202B20] sm:text-lg"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  All 9 Principles
                </strong>
              </span>
            </Link>
          )}

          {nextPrinciple ? (
            <Link
              to={nextPrinciple.path}
              className="group flex items-center justify-end gap-4 rounded-xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-5 text-right transition-colors hover:border-[#3F673C] hover:bg-white"
            >
              <span className="flex flex-col">
                <small className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                  Next · {nextPrinciple.number}
                </small>
                <strong
                  className="mt-0.5 text-base font-semibold text-[#202B20] sm:text-lg"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {nextPrinciple.title}
                </strong>
              </span>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#94B985] bg-white text-[#284B26] transition-all group-hover:translate-x-0.5 group-hover:border-[#3F673C] group-hover:bg-[#3F673C] group-hover:text-[#E9E6B2]">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          ) : (
            <Link
              to="/ethics-of-innovation"
              className="group flex items-center justify-end gap-4 rounded-xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-5 text-right transition-colors hover:border-[#3F673C] hover:bg-white"
            >
              <span className="flex flex-col">
                <small className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                  Back to overview
                </small>
                <strong
                  className="mt-0.5 text-base font-semibold text-[#202B20] sm:text-lg"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  All 9 Principles
                </strong>
              </span>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#94B985] bg-white text-[#284B26] transition-all group-hover:translate-x-0.5 group-hover:border-[#3F673C] group-hover:bg-[#3F673C] group-hover:text-[#E9E6B2]">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
