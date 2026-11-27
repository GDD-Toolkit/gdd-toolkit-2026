import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ExternalLink,
  GraduationCap,
  Play,
  Users,
} from "lucide-react";
import { getCohortsWithTeams } from "@/api/strapi";
import {
  FALLBACK_COHORTS,
  normalizeStrapiCohorts,
  type CohortGroup,
  type ModuleTeam,
  type ModuleTeamMember,
} from "../data/moduleTeams";

/** Interval between automatic slide advances while the user has not interacted. */
export const AUTO_ADVANCE_MS = 5000;

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z" />
    </svg>
  );
}

function MemberAvatar({
  member,
  size = "md",
}: {
  member: ModuleTeamMember;
  size?: "xs" | "md" | "lg" | "xl";
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const sizeClass =
    size === "xs"
      ? "h-7 w-7 text-[10px]"
      : size === "lg"
        ? "h-14 w-14 text-sm"
        : size === "xl"
          ? "h-16 w-16 text-base"
          : "h-10 w-10 text-xs";

  const showImage = Boolean(member.headshotUrl) && !imageFailed;

  if (showImage) {
    return (
      <div
        className={`${sizeClass} relative shrink-0 overflow-hidden rounded-full ring-2 ${
          member.isPrm
            ? "ring-[#3F673C]/30 bg-[#EDF4E8]"
            : "ring-[#B2C9A8] bg-[#EDF4E8]"
        }`}
      >
        <img
          src={member.headshotUrl}
          alt={member.headshotAlt ?? `${member.name} headshot`}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full font-semibold ${
        member.isPrm
          ? "bg-gradient-to-br from-[#3F673C] to-[#187347] text-white shadow-xs"
          : "border border-[#B2C9A8] bg-[#EDF4E8] text-[#284B26]"
      }`}
      aria-hidden="true"
    >
      {member.initials}
    </div>
  );
}

function MemberLinkedInLink({
  member,
  variant = "icon",
  onInteract,
}: {
  member: ModuleTeamMember;
  variant?: "icon" | "pill";
  onInteract: () => void;
}) {
  if (!member.linkedinUrl) return null;

  if (variant === "pill") {
    return (
      <a
        href={member.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${member.name} on LinkedIn`}
        onClick={onInteract}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#94B985] bg-white px-2.5 py-1 text-[11px] font-medium text-[#284B26] transition-colors hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
      >
        <LinkedInIcon className="h-3.5 w-3.5" />
        LinkedIn
      </a>
    );
  }

  return (
    <a
      href={member.linkedinUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${member.name} on LinkedIn`}
      title={`View ${member.name} on LinkedIn`}
      onClick={onInteract}
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#B2C9A8] bg-white text-[#284B26] transition-colors hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
    >
      <LinkedInIcon className="h-3.5 w-3.5" />
    </a>
  );
}

function PeekAvatarStack({ team }: { team: ModuleTeam }) {
  const previewMembers = [...team.prms, ...team.students].slice(0, 3);
  if (previewMembers.length === 0) return null;

  return (
    <div className="flex items-center -space-x-2">
      {previewMembers.map((member) => (
        <MemberAvatar
          key={member.headshotUrl ?? member.id}
          member={member}
          size="xs"
        />
      ))}
      {team.totalMembers > 3 && (
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#B2C9A8] bg-[#F2F6EF] font-mono text-[10px] font-semibold text-[#284B26]">
          +{team.totalMembers - 3}
        </span>
      )}
    </div>
  );
}

function ModuleToolBadge({
  team,
  onInteract,
}: {
  team: ModuleTeam;
  onInteract: () => void;
}) {
  const pillClass =
    "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-3.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-white transition-all hover:brightness-110";

  if (team.toolExternal) {
    return (
      <a
        href={team.toolHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onInteract}
        className={pillClass}
      >
        Tool: {team.toolName}
        <ExternalLink className="h-3 w-3" aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link to={team.toolHref} onClick={onInteract} className={pillClass}>
      Tool: {team.toolName}
      <ArrowRight className="h-3 w-3" aria-hidden="true" />
    </Link>
  );
}

function formatTeamCountSummary(team: ModuleTeam): string {
  const parts: string[] = [];
  if (team.prms.length > 0) {
    parts.push(`${team.prms.length} ${team.prms.length === 1 ? "PRM" : "PRMs"}`);
  }
  if (team.students.length > 0) {
    parts.push(
      `${team.students.length} ${team.students.length === 1 ? "Student" : "Students"}`,
    );
  }
  return parts.length > 0 ? parts.join(" · ") : "Cohort Team";
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
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [cmsSynced, setCmsSynced] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Pull live cohorts, module teams, and rich teammate profiles from Strapi CMS.
  useEffect(() => {
    const controller = new AbortController();

    async function loadCohorts() {
      try {
        const raw = await getCohortsWithTeams(controller.signal);
        if (controller.signal.aborted) return;

        const normalized = normalizeStrapiCohorts(raw);
        if (normalized.length > 0) {
          setCohorts(normalized);
          const firstPopulated =
            normalized.find((c) => c.teams.length > 0) ?? normalized[0];
          setSelectedYear((current) => {
            const existing = normalized.find(
              (c) => c.year === current && c.teams.length > 0,
            );
            return existing ? current : firstPopulated.year;
          });
          setActiveIndex(0);
          setCmsSynced(true);
        }
      } catch {
        // Keep the bundled 6-cohort fallback cleanly if Strapi is unreachable or unconfigured.
      }
    }

    void loadCohorts();
    return () => controller.abort();
  }, []);

  const populatedCohorts = useMemo(
    () => cohorts.filter((c) => c.teams.length > 0),
    [cohorts],
  );

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

  const totalAutoScrollableTeams = useMemo(
    () => populatedCohorts.reduce((sum, cohort) => sum + cohort.teams.length, 0),
    [populatedCohorts],
  );

  const isAutoScrolling =
    !userInteracted &&
    !isCardHovered &&
    !reducedMotion &&
    totalAutoScrollableTeams > 1;

  // Auto-scroll smoothly across teams and cohorts until the user interacts.
  useEffect(() => {
    if (!isAutoScrolling) return;

    const timer = window.setTimeout(() => {
      setDirection(1);
      if (total > 1 && safeIndex + 1 < total) {
        setActiveIndex(safeIndex + 1);
        return;
      }

      // Reached end of current cohort: roll into the next populated cohort (or wrap).
      if (populatedCohorts.length > 1) {
        const currentCohortIdx = populatedCohorts.findIndex(
          (c) => c.year === activeCohort?.year,
        );
        const nextCohort =
          populatedCohorts[(currentCohortIdx + 1) % populatedCohorts.length];
        setSelectedYear(nextCohort.year);
        setActiveIndex(0);
        return;
      }

      if (total > 1) {
        setActiveIndex(0);
      }
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [
    isAutoScrolling,
    total,
    safeIndex,
    populatedCohorts,
    activeCohort?.year,
  ]);

  const markInteracted = useCallback(() => {
    setUserInteracted(true);
  }, []);

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

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const startX = touchStartXRef.current;
      touchStartXRef.current = null;
      if (startX === null) return;
      const endX = e.changedTouches[0]?.clientX;
      if (endX === undefined) return;
      const delta = endX - startX;
      if (Math.abs(delta) < 40) return;
      if (delta < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    },
    [handleNext, handlePrev],
  );

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
      className="w-full scroll-mt-16 border-y border-[#B2C9A8] bg-[#F2F6EF] py-20 text-[#202B20] md:py-24"
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

        {/* Descending Cohort Year Selector */}
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

          {userInteracted && totalAutoScrollableTeams > 1 && !reducedMotion && (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setUserInteracted(false)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#94B985] bg-white px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8]"
              >
                <Play className="h-3 w-3 fill-current text-[#187347]" aria-hidden="true" />
                Resume auto-scroll
              </button>
            </div>
          )}
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
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="mt-8 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12"
          >
            {/* Left Dimmed Peek Wing */}
            {prevTeam ? (
              <button
                type="button"
                onClick={handlePrev}
                aria-label={`View previous module team: ${prevTeam.name}`}
                className="hidden h-full cursor-pointer flex-col justify-between rounded-2xl border border-[#B2C9A8] bg-white p-5 text-left opacity-75 transition-all duration-200 hover:border-[#3F673C] hover:opacity-100 lg:col-span-2 lg:flex"
              >
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#B2C9A8] bg-[#EDF4E8] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26]">
                    <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                    Prev
                  </span>
                  <h3
                    className="mt-3.5 text-base font-semibold leading-snug text-[#202B20]"
                    style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
                  >
                    {prevTeam.shortName}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#596556]">
                    {prevTeam.purpose}
                  </p>
                </div>
                <div className="mt-5 space-y-2.5 border-t border-[#E3EBDE] pt-3">
                  <PeekAvatarStack team={prevTeam} />
                  {prevTeam.prms.length > 0 && (
                    <p className="truncate text-[11px] font-semibold text-[#187347]">
                      PRM: {prevTeam.prms.map((p) => p.name).join(", ")}
                    </p>
                  )}
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#596556]">
                    {formatTeamCountSummary(prevTeam)}
                  </p>
                </div>
              </button>
            ) : (
              <div className="hidden lg:col-span-2 lg:block" />
            )}

            {/* Center Featured Spotlight Card */}
            <div
              className="lg:col-span-8"
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={() => setIsCardHovered(false)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={`${activeCohort.year}-${activeTeam.id}`}
                  initial={{ opacity: 0, x: direction * 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -28 }}
                  transition={{ duration: 0.38, ease: "easeInOut" }}
                  aria-live="polite"
                  className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border-2 border-[#3F673C] bg-white p-6 shadow-md sm:p-8"
                >
                  <div>
                    {/* Top Metadata Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <ModuleToolBadge
                        team={activeTeam}
                        onInteract={markInteracted}
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full border border-[#94B985] bg-[#EDF4E8] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26]">
                          Cohort {activeTeam.cohortYear} ·{" "}
                          {formatTeamCountSummary(activeTeam)}
                        </span>
                      </div>
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

                    {/* Adaptive Team Roster Showcase */}
                    {activeTeam.prms.length > 0 &&
                    activeTeam.students.length > 0 ? (
                      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-12">
                        {/* PRM Warm Cream Showcase */}
                        <div className="flex flex-col justify-between rounded-xl border-[1.5px] border-[#94B985] bg-[#F6F4D8] p-4 md:col-span-5">
                          <div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#3F673C] px-2.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-white">
                              <GraduationCap
                                className="h-3 w-3"
                                aria-hidden="true"
                              />
                              {activeTeam.prms.length > 1
                                ? "PRMs · Lead Mentors"
                                : "PRM · Lead Mentor"}
                            </span>

                            <div className="mt-3.5 space-y-3">
                              {activeTeam.prms.map((lead) => (
                                <div
                                  key={lead.id}
                                  className="flex items-center justify-between gap-2.5 rounded-lg border border-[#B2C9A8]/70 bg-white/70 p-2.5"
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    <MemberAvatar
                                      key={lead.headshotUrl ?? lead.id}
                                      member={lead}
                                      size="lg"
                                    />
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold leading-snug text-[#202B20]">
                                        {lead.name}
                                      </p>
                                      <p className="text-xs text-[#394838]">
                                        Peer Research Mentor
                                      </p>
                                    </div>
                                  </div>
                                  <MemberLinkedInLink
                                    member={lead}
                                    onInteract={markInteracted}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <p className="mt-3 text-xs leading-relaxed text-[#394838]">
                            {activeTeam.prms[0]?.focus}
                          </p>
                        </div>

                        {/* Researching Students Roster */}
                        <div className="flex flex-col rounded-xl border border-[#B2C9A8] bg-[#FAFDF8] p-4 md:col-span-7">
                          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                            <Users
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            Researching Students ({activeTeam.students.length})
                          </span>
                          <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                            {activeTeam.students.map((student) => (
                              <li
                                key={student.id}
                                className="flex items-center justify-between gap-2 rounded-xl border border-[#B2C9A8] bg-white px-3 py-2 shadow-2xs transition-colors hover:border-[#3F673C]"
                              >
                                <div className="flex min-w-0 items-center gap-2.5">
                                  <MemberAvatar
                                    key={student.headshotUrl ?? student.id}
                                    member={student}
                                    size="md"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold leading-snug text-[#202B20]">
                                      {student.name}
                                    </p>
                                    <p className="text-[11px] text-[#596556]">
                                      Researcher
                                    </p>
                                  </div>
                                </div>
                                <MemberLinkedInLink
                                  member={student}
                                  onInteract={markInteracted}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : activeTeam.prms.length > 0 ? (
                      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-12">
                        {/* Prominent PRM Showcase when PRM is published ahead of student list */}
                        <div className="flex flex-col justify-between rounded-xl border-[1.5px] border-[#94B985] bg-[#F6F4D8] p-5 md:col-span-7">
                          <div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#3F673C] px-2.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-white">
                              <GraduationCap
                                className="h-3 w-3"
                                aria-hidden="true"
                              />
                              {activeTeam.prms.length > 1
                                ? "PRMs · Lead Mentors"
                                : "PRM · Lead Mentor"}
                            </span>

                            <div className="mt-4 space-y-3">
                              {activeTeam.prms.map((lead) => (
                                <div
                                  key={lead.id}
                                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#B2C9A8]/80 bg-white/80 p-3.5"
                                >
                                  <div className="flex min-w-0 items-center gap-3.5">
                                    <MemberAvatar
                                      key={lead.headshotUrl ?? lead.id}
                                      member={lead}
                                      size="xl"
                                    />
                                    <div className="min-w-0">
                                      <p className="truncate text-base font-semibold text-[#202B20]">
                                        {lead.name}
                                      </p>
                                      <p className="text-xs font-medium text-[#187347]">
                                        Peer Research Mentor
                                      </p>
                                    </div>
                                  </div>
                                  <MemberLinkedInLink
                                    member={lead}
                                    variant="pill"
                                    onInteract={markInteracted}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <p className="mt-3.5 text-xs leading-relaxed text-[#394838]">
                            {activeTeam.prms[0]?.focus}
                          </p>
                        </div>

                        <div className="flex flex-col justify-between rounded-xl border border-[#B2C9A8] bg-[#FAFDF8] p-5 md:col-span-5">
                          <div>
                            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                              <Users
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                              Researching Students
                            </span>
                            <p className="mt-3 text-xs leading-relaxed text-[#596556]">
                              Undergraduate researching student profiles for{" "}
                              {activeTeam.shortName} are synced live as cohort
                              rosters are published.
                            </p>
                          </div>
                          <Link
                            to="/acknowledgements"
                            onClick={markInteracted}
                            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#187347] underline-offset-4 hover:underline"
                          >
                            View cohort directory
                            <ArrowRight
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </Link>
                        </div>
                      </div>
                    ) : activeTeam.students.length > 0 ? (
                      <div className="mt-5 rounded-xl border border-[#B2C9A8] bg-[#FAFDF8] p-4 sm:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                            <Users
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            Researching Students ({activeTeam.students.length})
                          </span>
                          <span className="rounded-full border border-[#B2C9A8] bg-[#EDF4E8] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#284B26]">
                            Cohort {activeTeam.cohortYear} Squad
                          </span>
                        </div>
                        <ul className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                          {activeTeam.students.map((student) => (
                            <li
                              key={student.id}
                              className="flex items-center justify-between gap-2.5 rounded-xl border border-[#B2C9A8] bg-white px-3 py-2.5 shadow-2xs transition-colors hover:border-[#3F673C]"
                            >
                              <div className="flex min-w-0 items-center gap-2.5">
                                <MemberAvatar
                                  key={student.headshotUrl ?? student.id}
                                  member={student}
                                  size="md"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold leading-snug text-[#202B20]">
                                    {student.name}
                                  </p>
                                  <p className="text-[11px] text-[#596556]">
                                    Researcher
                                  </p>
                                </div>
                              </div>
                              <MemberLinkedInLink
                                member={student}
                                onInteract={markInteracted}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="mt-5 rounded-xl border border-[#B2C9A8] bg-[#FAFDF8] p-4 text-xs text-[#596556]">
                        Team roster coming soon in Strapi CMS.
                      </div>
                    )}
                  </div>

                  {/* Subtle Auto-Scroll Progress Hairline */}
                  {isAutoScrolling && (
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

            {/* Right Dimmed Peek Wing */}
            {nextTeam ? (
              <button
                type="button"
                onClick={handleNext}
                aria-label={`View next module team: ${nextTeam.name}`}
                className="hidden h-full cursor-pointer flex-col justify-between rounded-2xl border border-[#B2C9A8] bg-white p-5 text-left opacity-75 transition-all duration-200 hover:border-[#3F673C] hover:opacity-100 lg:col-span-2 lg:flex"
              >
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#B2C9A8] bg-[#EDF4E8] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26]">
                    Next
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <h3
                    className="mt-3.5 text-base font-semibold leading-snug text-[#202B20]"
                    style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
                  >
                    {nextTeam.shortName}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#596556]">
                    {nextTeam.purpose}
                  </p>
                </div>
                <div className="mt-5 space-y-2.5 border-t border-[#E3EBDE] pt-3">
                  <PeekAvatarStack team={nextTeam} />
                  {nextTeam.prms.length > 0 && (
                    <p className="truncate text-[11px] font-semibold text-[#187347]">
                      PRM: {nextTeam.prms.map((p) => p.name).join(", ")}
                    </p>
                  )}
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#596556]">
                    {formatTeamCountSummary(nextTeam)}
                  </p>
                </div>
              </button>
            ) : (
              <div className="hidden lg:col-span-2 lg:block" />
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[#B2C9A8] bg-white p-8 text-center text-sm text-[#596556]">
            No module teams have been published for{" "}
            {activeCohort?.label ?? "this cohort"} yet.
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

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-wider text-[#394838]">
            <span>
              {total > 0 ? String(safeIndex + 1).padStart(2, "0") : "00"} /{" "}
              {String(total).padStart(2, "0")} Modules
            </span>
            <span aria-hidden="true">&middot;</span>
            <Link
              to="/acknowledgements"
              className="font-semibold text-[#187347] underline-offset-4 hover:underline"
            >
              All {cohorts.length} Cohorts ({yearSpanLabel})
            </Link>
            {cmsSynced && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span className="text-[10px] text-[#187347]">
                  Live Strapi Roster
                </span>
              </>
            )}
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
