import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ExternalLink,
  GraduationCap,
  Pause,
  Play,
  Users,
} from "lucide-react";
import { getCohortsWithTeams } from "@/api/strapi";
import {
  FALLBACK_COHORTS,
  normalizeStrapiCohorts,
  type CohortGroup,
  type ModuleTeam,
} from "../data/moduleTeams";

/** Interval between automatic slide advances while the user has not interacted. */
export const AUTO_ADVANCE_MS = 5500;

function ModuleToolBadge({ team }: { team: ModuleTeam }) {
  const pillClass =
    "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-3.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-white transition-all hover:brightness-110";

  if (team.toolExternal) {
    return (
      <a
        href={team.toolHref}
        target="_blank"
        rel="noopener noreferrer"
        className={pillClass}
      >
        Tool: {team.toolName}
        <ExternalLink className="h-3 w-3" aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link to={team.toolHref} className={pillClass}>
      Tool: {team.toolName}
      <ArrowRight className="h-3 w-3" aria-hidden="true" />
    </Link>
  );
}

export default function ModuleTeamsCarousel() {
  const reducedMotion = useReducedMotion();

  const [cohorts, setCohorts] = useState<CohortGroup[]>(FALLBACK_COHORTS);
  const [selectedYear, setSelectedYear] = useState<number>(
    FALLBACK_COHORTS[0]?.year ?? 2025,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cmsSynced, setCmsSynced] = useState(false);

  // Pull live cohorts, module teams, and teammates from Strapi CMS (descending by year).
  useEffect(() => {
    const controller = new AbortController();

    async function loadCohorts() {
      try {
        const raw = await getCohortsWithTeams(controller.signal);
        if (controller.signal.aborted) return;

        const normalized = normalizeStrapiCohorts(raw);
        if (normalized.length > 0) {
          setCohorts(normalized);
          setSelectedYear((current) =>
            normalized.some((c) => c.year === current)
              ? current
              : normalized[0].year,
          );
          setCmsSynced(true);
        }
      } catch {
        // Keep the bundled 6-cohort fallback cleanly if Strapi is unreachable or unconfigured.
      }
    }

    void loadCohorts();
    return () => controller.abort();
  }, []);

  const activeCohort =
    cohorts.find((c) => c.year === selectedYear) ?? cohorts[0];
  const teams = activeCohort?.teams ?? [];
  const total = teams.length;
  const safeIndex = total > 0 ? activeIndex % total : 0;

  const activeTeam = total > 0 ? teams[safeIndex] : null;
  const prevTeam =
    total > 1 ? teams[(safeIndex - 1 + total) % total] : null;
  const nextTeam =
    total > 1 ? teams[(safeIndex + 1) % total] : null;

  const isAutoPlaying =
    !userInteracted && !isHovered && !reducedMotion && total > 1;

  // Slowly auto-advance until the user interacts to inspect a specific cohort or team.
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((curr) => (curr + 1) % total);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [isAutoPlaying, total]);

  const handleSelectYear = useCallback((year: number) => {
    setUserInteracted(true);
    setSelectedYear(year);
    setDirection(1);
    setActiveIndex(0);
  }, []);

  const handleGoTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      const normalized = (index + total) % total;
      setUserInteracted(true);
      setDirection(normalized >= safeIndex ? 1 : -1);
      setActiveIndex(normalized);
    },
    [safeIndex, total],
  );

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setUserInteracted(true);
    setDirection(-1);
    setActiveIndex((curr) => (curr - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setUserInteracted(true);
    setDirection(1);
    setActiveIndex((curr) => (curr + 1) % total);
  }, [total]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-module-teams-carousel]")) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlePrev, handleNext]);

  const yearSpanLabel =
    cohorts.length > 1
      ? `${cohorts[cohorts.length - 1].year}–${cohorts[0].year}`
      : String(activeCohort?.year ?? "");

  return (
    <section
      id="module-teams"
      data-module-teams-carousel
      aria-labelledby="module-teams-heading"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full border-y border-[#B2C9A8] bg-[#F2F6EF] py-20 text-[#202B20] md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#187347]">
            02 / Module Teams · Peer Research Mentors &amp; Students
          </p>
          <h2
            id="module-teams-heading"
            className="mt-2.5 text-3xl font-semibold tracking-tight text-[#202B20] sm:text-4xl"
            style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
          >
            The Student Teams Behind Every Tool
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#596556] sm:text-base">
            Each toolkit module is built by a dedicated UMD FIRE research
            squad, structured around a{" "}
            <span className="font-semibold text-[#284B26]">
              Peer Research Mentor (PRM)
            </span>{" "}
            leading a team of{" "}
            <span className="font-semibold text-[#284B26]">
              undergraduate researching students
            </span>
            .
          </p>
        </div>

        {/* Descending Cohort Year Selector + Auto-Play Status */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26]">
              <Calendar className="h-3.5 w-3.5 text-[#187347]" aria-hidden="true" />
              Cohort Year:
            </span>
            <div
              role="group"
              aria-label="Select cohort year"
              className="flex flex-wrap items-center justify-center gap-1.5"
            >
              {cohorts.map((cohort) => {
                const selected = cohort.year === activeCohort?.year;
                return (
                  <button
                    key={cohort.year}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => handleSelectYear(cohort.year)}
                    className={
                      selected
                        ? "cursor-pointer rounded-full bg-[#202B20] px-3.5 py-1 font-mono text-xs font-semibold text-[#E9E6B2] shadow-xs transition-all"
                        : "cursor-pointer rounded-full border border-[#94B985] bg-white px-3.5 py-1 font-mono text-xs font-medium text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8]"
                    }
                  >
                    {cohort.year}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Carousel Motion Status */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-[#596556]">
            {!userInteracted && !reducedMotion && total > 1 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B2C9A8] bg-white/80 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#284B26]">
                <span
                  className={
                    isHovered
                      ? "h-2 w-2 rounded-full bg-amber-500"
                      : "h-2 w-2 animate-pulse rounded-full bg-[#187347]"
                  }
                  aria-hidden="true"
                />
                {isHovered
                  ? "Paused on hover"
                  : "Auto-cycling · click any year or team to explore"}
              </span>
            ) : (
              total > 1 &&
              !reducedMotion && (
                <button
                  type="button"
                  onClick={() => setUserInteracted(false)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#94B985] bg-white px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8]"
                >
                  <Play className="h-3 w-3 fill-current text-[#187347]" aria-hidden="true" />
                  Resume auto-scroll
                </button>
              )
            )}
            {cmsSynced && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#187347]">
                &middot; Synced with Strapi CMS
              </span>
            )}
          </div>
        </div>

        {/* Module Selector Tabs for Active Cohort */}
        {total > 0 && (
          <div
            role="tablist"
            aria-label={`Select a module team from ${activeCohort.label}`}
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
          >
            {teams.map((team, idx) => {
              const isActive = idx === safeIndex;
              return (
                <button
                  key={team.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleGoTo(idx)}
                  className={
                    isActive
                      ? "cursor-pointer rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all"
                      : "cursor-pointer rounded-full border border-[#94B985] bg-white px-4 py-1.5 text-xs font-medium text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8]"
                  }
                >
                  {team.shortName}
                </button>
              );
            })}
          </div>
        )}

        {/* Spotlight Stage */}
        {activeTeam ? (
          <div className="mt-8 grid grid-cols-1 items-center gap-5 lg:grid-cols-12">
            {/* Left Dimmed Peek Card */}
            {prevTeam ? (
              <button
                type="button"
                onClick={handlePrev}
                aria-label={`View previous module team: ${prevTeam.name}`}
                className="hidden h-full cursor-pointer flex-col justify-between rounded-2xl border border-[#B2C9A8] bg-white p-6 text-left opacity-70 transition-all duration-200 hover:border-[#3F673C] hover:opacity-100 lg:col-span-3 lg:flex"
              >
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#B2C9A8] bg-[#EDF4E8] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26]">
                    <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                    Prev Module
                  </span>
                  <h3
                    className="mt-4 text-lg font-semibold text-[#202B20]"
                    style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
                  >
                    {prevTeam.shortName}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#596556]">
                    {prevTeam.purpose}
                  </p>
                </div>
                <div className="mt-6 space-y-1 border-t border-[#E3EBDE] pt-3">
                  {prevTeam.prms.length > 0 && (
                    <p className="text-xs font-semibold text-[#187347]">
                      PRM: {prevTeam.prms.map((p) => p.name).join(", ")}
                    </p>
                  )}
                  <p className="font-mono text-[11px] text-[#596556]">
                    {prevTeam.students.length} Researching Students
                  </p>
                </div>
              </button>
            ) : (
              <div className="hidden lg:col-span-3 lg:block" />
            )}

            {/* Center Featured Spotlight Card */}
            <div className="lg:col-span-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={`${activeCohort.year}-${activeTeam.id}`}
                  initial={{ opacity: 0, x: direction * 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -28 }}
                  transition={{ duration: 0.38, ease: "easeInOut" }}
                  aria-live="polite"
                  className="relative overflow-hidden rounded-2xl border-2 border-[#3F673C] bg-white p-6 shadow-md sm:p-8"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <ModuleToolBadge team={activeTeam} />
                    <span className="inline-flex items-center rounded-full border border-[#94B985] bg-[#EDF4E8] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26]">
                      Cohort {activeTeam.cohortYear} · Active Module
                    </span>
                  </div>

                  <h3
                    className="mt-4 text-2xl font-semibold tracking-tight text-[#202B20] sm:text-[28px]"
                    style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
                  >
                    {activeTeam.name}
                  </h3>

                  {/* Purpose Callout */}
                  <div className="mt-4 rounded-xl border border-[#B2C9A8] bg-[#F2F6EF] px-4 py-3.5">
                    <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                      Module Purpose
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#202B20]">
                      {activeTeam.purpose}
                    </p>
                  </div>

                  {/* PRM Warm Cream Card + Researching Students Roster */}
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-12">
                    <div className="flex flex-col justify-between rounded-xl border-[1.5px] border-[#94B985] bg-[#F6F4D8] p-4 sm:col-span-5">
                      <div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#3F673C] px-2.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-white">
                          <GraduationCap className="h-3 w-3" aria-hidden="true" />
                          {activeTeam.prms.length > 1
                            ? "PRMs · Lead Mentors"
                            : "PRM · Lead Mentor"}
                        </span>

                        {activeTeam.prms.length > 0 ? (
                          <div className="mt-3 space-y-2.5">
                            {activeTeam.prms.map((lead) => (
                              <div
                                key={lead.name}
                                className="flex items-center gap-3"
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3F673C] to-[#187347] text-xs font-bold text-white">
                                  {lead.initials}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-[#202B20]">
                                    {lead.name}
                                  </p>
                                  <p className="text-xs text-[#596556]">
                                    Peer Research Mentor
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-3 text-sm font-semibold text-[#202B20]">
                            Founding Cohort Team
                          </p>
                        )}
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-[#394838]">
                        {activeTeam.prms[0]?.focus ??
                          "Collaborated directly with UMD FIRE faculty mentors to establish this research module."}
                      </p>
                    </div>

                    <div className="flex flex-col rounded-xl border border-[#B2C9A8] bg-[#FAFDF8] p-4 sm:col-span-7">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                        <Users className="h-3.5 w-3.5" aria-hidden="true" />
                        Researching Students ({activeTeam.students.length})
                      </span>
                      {activeTeam.students.length > 0 ? (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {activeTeam.students.map((student) => (
                            <li
                              key={student}
                              className="rounded-full border border-[#B2C9A8] bg-white px-3 py-1 text-xs font-medium text-[#202B20]"
                            >
                              {student}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-3 text-xs text-[#596556]">
                          Team roster coming soon in Strapi CMS.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subtle Auto-Advance Progress Hairline */}
                  {isAutoPlaying && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-1 bg-[#EDF4E8]"
                    >
                      <motion.div
                        key={`progress-${activeCohort.year}-${activeTeam.id}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: AUTO_ADVANCE_MS / 1000,
                          ease: "linear",
                        }}
                        style={{ transformOrigin: "left" }}
                        className="h-full bg-gradient-to-r from-[#3F673C] to-[#187347]"
                      />
                    </div>
                  )}
                </motion.article>
              </AnimatePresence>
            </div>

            {/* Right Dimmed Peek Card */}
            {nextTeam ? (
              <button
                type="button"
                onClick={handleNext}
                aria-label={`View next module team: ${nextTeam.name}`}
                className="hidden h-full cursor-pointer flex-col justify-between rounded-2xl border border-[#B2C9A8] bg-white p-6 text-left opacity-70 transition-all duration-200 hover:border-[#3F673C] hover:opacity-100 lg:col-span-3 lg:flex"
              >
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#B2C9A8] bg-[#EDF4E8] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26]">
                    Next Module
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <h3
                    className="mt-4 text-lg font-semibold text-[#202B20]"
                    style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
                  >
                    {nextTeam.shortName}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#596556]">
                    {nextTeam.purpose}
                  </p>
                </div>
                <div className="mt-6 space-y-1 border-t border-[#E3EBDE] pt-3">
                  {nextTeam.prms.length > 0 && (
                    <p className="text-xs font-semibold text-[#187347]">
                      PRM: {nextTeam.prms.map((p) => p.name).join(", ")}
                    </p>
                  )}
                  <p className="font-mono text-[11px] text-[#596556]">
                    {nextTeam.students.length} Researching Students
                  </p>
                </div>
              </button>
            ) : (
              <div className="hidden lg:col-span-3 lg:block" />
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[#B2C9A8] bg-white p-8 text-center text-sm text-[#596556]">
            No module teams have been published for {activeCohort?.label ?? "this cohort"} yet.
          </div>
        )}

        {/* Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            disabled={total <= 1}
            onClick={handlePrev}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#94B985] bg-white px-5 py-2 text-xs font-medium text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Previous Team
          </button>

          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-[#394838]">
            <span>
              {total > 0 ? String(safeIndex + 1).padStart(2, "0") : "00"} /{" "}
              {String(total).padStart(2, "0")} Modules
            </span>
            <span aria-hidden="true">&middot;</span>
            {!userInteracted && !reducedMotion && total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setUserInteracted(true)}
                  className="inline-flex cursor-pointer items-center gap-1 font-medium text-[#284B26] hover:text-[#187347]"
                  aria-label="Pause auto-scroll"
                >
                  <Pause className="h-3 w-3" aria-hidden="true" />
                  Pause
                </button>
                <span aria-hidden="true">&middot;</span>
              </>
            )}
            <Link
              to="/acknowledgements"
              className="font-semibold text-[#187347] underline-offset-4 hover:underline"
            >
              All {cohorts.length} Cohorts ({yearSpanLabel})
            </Link>
          </div>

          <button
            type="button"
            disabled={total <= 1}
            onClick={handleNext}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-5 py-2 text-xs font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next Team
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
