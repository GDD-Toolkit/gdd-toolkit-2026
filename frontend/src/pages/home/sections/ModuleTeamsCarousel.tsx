import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ExternalLink,
  GraduationCap,
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

/** Continuous right-to-left glide speed in CSS pixels per second. */
export const AUTO_SCROLL_PX_PER_SEC = 48;

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
  size?: "sm" | "md" | "lg";
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const sizeClass =
    size === "sm"
      ? "h-9 w-9 text-[11px]"
      : size === "lg"
        ? "h-14 w-14 text-sm"
        : "h-11 w-11 text-xs";

  const showImage = Boolean(member.headshotUrl) && !imageFailed;

  if (showImage) {
    return (
      <div
        className={`${sizeClass} relative shrink-0 overflow-hidden rounded-full ring-2 ${
          member.isPrm
            ? "bg-[#EDF4E8] ring-[#3F673C]/30"
            : "bg-[#EDF4E8] ring-[#B2C9A8]"
        }`}
      >
        <img
          src={member.headshotUrl}
          alt={member.headshotAlt ?? `${member.name} headshot`}
          decoding="async"
          draggable={false}
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
  isClone = false,
  onInteract,
}: {
  member: ModuleTeamMember;
  variant?: "icon" | "pill";
  isClone?: boolean;
  onInteract: () => void;
}) {
  if (!member.linkedinUrl) return null;

  if (variant === "pill") {
    return (
      <a
        href={member.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={isClone ? -1 : undefined}
        aria-label={`View ${member.name} on LinkedIn`}
        onClick={(e) => {
          e.stopPropagation();
          onInteract();
        }}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#94B985] bg-white px-2.5 py-1 text-[11px] font-medium text-[#284B26] transition-colors hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
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
      tabIndex={isClone ? -1 : undefined}
      aria-label={`View ${member.name} on LinkedIn`}
      title={`View ${member.name} on LinkedIn`}
      onClick={(e) => {
        e.stopPropagation();
        onInteract();
      }}
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#B2C9A8] bg-white text-[#284B26] transition-colors hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
    >
      <LinkedInIcon className="h-3.5 w-3.5" />
    </a>
  );
}

function ModuleToolBadge({
  team,
  isClone = false,
  onInteract,
}: {
  team: ModuleTeam;
  isClone?: boolean;
  onInteract: () => void;
}) {
  const pillClass =
    "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-white transition-all hover:brightness-110";

  if (team.toolExternal) {
    return (
      <a
        href={team.toolHref}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={isClone ? -1 : undefined}
        onClick={(e) => {
          e.stopPropagation();
          onInteract();
        }}
        className={pillClass}
      >
        Tool: {team.toolName}
        <ExternalLink className="h-3 w-3" aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link
      to={team.toolHref}
      tabIndex={isClone ? -1 : undefined}
      onClick={(e) => {
        e.stopPropagation();
        onInteract();
      }}
      className={pillClass}
    >
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

function TeamCard({
  team,
  isActive,
  isClone = false,
  onSelect,
  onInteract,
}: {
  team: ModuleTeam;
  isActive: boolean;
  isClone?: boolean;
  onSelect: () => void;
  onInteract: () => void;
}) {
  return (
    <article
      data-team-card-id={isClone ? undefined : team.id}
      onClick={onSelect}
      className={`flex w-[86vw] max-w-[540px] shrink-0 cursor-pointer flex-col justify-between rounded-2xl bg-white p-5 transition-all duration-200 sm:w-[490px] sm:p-6 lg:w-[540px] ${
        isActive
          ? "border-2 border-[#3F673C] shadow-md"
          : "border border-[#94B985] shadow-xs hover:border-[#3F673C] hover:shadow-md"
      }`}
    >
      <div>
        {/* Top Metadata Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ModuleToolBadge
            team={team}
            isClone={isClone}
            onInteract={onInteract}
          />
          <span className="inline-flex items-center rounded-full border border-[#94B985] bg-[#EDF4E8] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26]">
            Cohort {team.cohortYear} · {formatTeamCountSummary(team)}
          </span>
        </div>

        {/* Team Title */}
        <h3
          className="mt-3.5 text-xl font-semibold tracking-tight text-[#202B20] sm:text-2xl"
          style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
        >
          {team.name}
        </h3>

        {/* Module Purpose */}
        <div className="mt-3 rounded-xl border border-[#B2C9A8] bg-[#F2F6EF] px-3.5 py-3">
          <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
            Module Purpose
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#202B20] sm:text-sm">
            {team.purpose}
          </p>
        </div>

        {/* PRM Section (when present) */}
        {team.prms.length > 0 && (
          <div className="mt-4 rounded-xl border-[1.5px] border-[#94B985] bg-[#F6F4D8] p-3.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#3F673C] px-2.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-white">
              <GraduationCap className="h-3 w-3" aria-hidden="true" />
              {team.prms.length > 1 ? "PRMs · Lead Mentors" : "PRM · Lead Mentor"}
            </span>
            <div className="mt-2.5 space-y-2">
              {team.prms.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between gap-2.5 rounded-lg border border-[#B2C9A8]/80 bg-white/80 p-2.5"
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
                      <p className="text-xs font-medium text-[#187347]">
                        Peer Research Mentor
                      </p>
                    </div>
                  </div>
                  <MemberLinkedInLink
                    member={lead}
                    variant="pill"
                    isClone={isClone}
                    onInteract={onInteract}
                  />
                </div>
              ))}
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-[#394838]">
              {team.prms[0]?.focus}
            </p>
          </div>
        )}

        {/* Researching Students Roster */}
        {team.students.length > 0 ? (
          <div className="mt-4 rounded-xl border border-[#B2C9A8] bg-[#FAFDF8] p-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                Researching Students ({team.students.length})
              </span>
              {team.prms.length === 0 && (
                <span className="rounded-full border border-[#B2C9A8] bg-[#EDF4E8] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#284B26]">
                  Cohort {team.cohortYear} Squad
                </span>
              )}
            </div>
            <ul className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {team.students.map((student) => (
                <li
                  key={student.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[#B2C9A8] bg-white px-2.5 py-2 shadow-2xs transition-colors hover:border-[#3F673C]"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <MemberAvatar
                      key={student.headshotUrl ?? student.id}
                      member={student}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-snug text-[#202B20]">
                        {student.name}
                      </p>
                      <p className="text-[11px] text-[#596556]">Researcher</p>
                    </div>
                  </div>
                  <MemberLinkedInLink
                    member={student}
                    isClone={isClone}
                    onInteract={onInteract}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-[#B2C9A8] bg-[#FAFDF8] p-3.5">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              Researching Students
            </span>
            <p className="mt-1.5 text-xs leading-relaxed text-[#596556]">
              Undergraduate researching student profiles for {team.shortName}{" "}
              sync live as cohort rosters are published.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

export default function ModuleTeamsCarousel() {
  const reducedMotion = useReducedMotion();

  const [cohorts, setCohorts] = useState<CohortGroup[]>(FALLBACK_COHORTS);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isTrackHovered, setIsTrackHovered] = useState(false);
  const [cmsSynced, setCmsSynced] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const primaryGroupRef = useRef<HTMLDivElement | null>(null);
  const exactScrollRef = useRef(0);
  const isProgrammaticScrollRef = useRef(false);
  const prevShowCloneRef = useRef(false);

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
          setSelectedYear((current) => {
            if (current === null) return null;
            const existing = normalized.find(
              (c) => c.year === current && c.teams.length > 0,
            );
            return existing ? current : null;
          });
          setActiveIndex(0);
          exactScrollRef.current = 0;
          if (trackRef.current) trackRef.current.scrollLeft = 0;
          setCmsSynced(true);
        }
      } catch {
        // Keep the bundled 6-cohort fallback cleanly if Strapi is unreachable or unconfigured.
      }
    }

    void loadCohorts();
    return () => controller.abort();
  }, []);

  const activeCohort = useMemo(() => {
    if (selectedYear !== null) {
      const picked = cohorts.find((c) => c.year === selectedYear);
      if (picked) return picked;
    }
    return cohorts.find((c) => c.teams.length > 0) ?? cohorts[0];
  }, [cohorts, selectedYear]);
  const teams = useMemo(() => activeCohort?.teams ?? [], [activeCohort]);
  const total = teams.length;
  const safeIndex = total > 0 ? activeIndex % total : 0;

  const canAutoScroll = !reducedMotion && total > 1;
  const showSeamlessClone = !userInteracted && canAutoScroll;
  const isAutoScrolling = showSeamlessClone && !isTrackHovered;

  // When transitioning out of seamless clone mode (user interacted), normalize scrollLeft
  // modulo one full loop width so the cards stay frozen in place with zero visual jump.
  useLayoutEffect(() => {
    const wasShowingClone = prevShowCloneRef.current;
    prevShowCloneRef.current = showSeamlessClone;

    if (wasShowingClone && !showSeamlessClone) {
      const track = trackRef.current;
      const primary = primaryGroupRef.current;
      if (track && primary && primary.offsetWidth > 0) {
        const loopWidth = primary.offsetWidth;
        const normalized =
          ((track.scrollLeft % loopWidth) + loopWidth) % loopWidth;
        isProgrammaticScrollRef.current = true;
        track.scrollLeft = normalized;
        exactScrollRef.current = normalized;
        window.requestAnimationFrame(() => {
          isProgrammaticScrollRef.current = false;
        });
      }
    }
  }, [showSeamlessClone]);

  const syncActiveIndexFromScroll = useCallback(() => {
    const track = trackRef.current;
    const primary = primaryGroupRef.current;
    if (!track || !primary || total <= 1) return;

    const loopWidth = primary.offsetWidth;
    if (loopWidth <= 0) return;

    const cardStep = loopWidth / total;
    if (cardStep <= 0) return;

    const viewportCenter = track.scrollLeft + track.clientWidth / 2;
    const wrappedCenter = ((viewportCenter % loopWidth) + loopWidth) % loopWidth;
    const idx = Math.floor(wrappedCenter / cardStep) % total;
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  }, [total]);

  // Continuous right-to-left scrolling via requestAnimationFrame until interacted with.
  useEffect(() => {
    if (!isAutoScrolling) return;

    const track = trackRef.current;
    if (track) {
      exactScrollRef.current = track.scrollLeft;
    }

    let rafId = 0;
    let lastTimestamp: number | null = null;
    let frameCount = 0;

    const tick = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }
      const dtSeconds = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
      lastTimestamp = timestamp;

      const currentTrack = trackRef.current;
      const primary = primaryGroupRef.current;

      if (currentTrack && primary) {
        const loopWidth = primary.offsetWidth;
        exactScrollRef.current += AUTO_SCROLL_PX_PER_SEC * dtSeconds;
        if (loopWidth > 0 && exactScrollRef.current >= loopWidth) {
          exactScrollRef.current -= loopWidth;
        }
        isProgrammaticScrollRef.current = true;
        currentTrack.scrollLeft = exactScrollRef.current;
        isProgrammaticScrollRef.current = false;

        frameCount += 1;
        if (frameCount % 10 === 0) {
          syncActiveIndexFromScroll();
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [isAutoScrolling, syncActiveIndexFromScroll]);

  const scrollToCard = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      const primary = primaryGroupRef.current;
      if (!track || !primary) return;

      const cards = primary.querySelectorAll<HTMLElement>("[data-team-card-id]");
      const target = cards[index];
      if (!target) return;

      const desiredLeft = Math.max(
        0,
        target.offsetLeft - Math.max(0, (track.clientWidth - target.offsetWidth) / 2),
      );
      exactScrollRef.current = desiredLeft;
      isProgrammaticScrollRef.current = true;
      if (typeof track.scrollTo === "function") {
        track.scrollTo({ left: desiredLeft, behavior });
      } else {
        track.scrollLeft = desiredLeft;
      }
      window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 450);
    },
    [],
  );

  const markInteracted = useCallback(() => {
    setUserInteracted(true);
  }, []);

  const handleSelectYear = useCallback((year: number) => {
    setUserInteracted(true);
    setSelectedYear(year);
    setActiveIndex(0);
    exactScrollRef.current = 0;
    if (trackRef.current) {
      isProgrammaticScrollRef.current = true;
      trackRef.current.scrollLeft = 0;
      window.requestAnimationFrame(() => {
        isProgrammaticScrollRef.current = false;
      });
    }
  }, []);

  const handleGoTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      const normalized = (index + total) % total;
      setUserInteracted(true);
      setActiveIndex(normalized);
      // Wait a micro-frame if clone is unmounting so layout normalizes cleanly first
      window.requestAnimationFrame(() => {
        scrollToCard(normalized, "smooth");
      });
    },
    [scrollToCard, total],
  );

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    handleGoTo(safeIndex - 1);
  }, [handleGoTo, safeIndex, total]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    handleGoTo(safeIndex + 1);
  }, [handleGoTo, safeIndex, total]);

  // Any manual horizontal wheel/touch/scroll immediately halts auto-scroll.
  const handleTrackWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) > 3 || e.shiftKey) {
      setUserInteracted(true);
    }
  }, []);

  const handleTrackTouchStart = useCallback(() => {
    setUserInteracted(true);
  }, []);

  const handleTrackPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "mouse" || e.button === 0) {
        setUserInteracted(true);
      }
    },
    [],
  );

  const handleTrackScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    if (trackRef.current) {
      exactScrollRef.current = trackRef.current.scrollLeft;
    }
    if (userInteracted) {
      syncActiveIndexFromScroll();
    }
  }, [syncActiveIndexFromScroll, userInteracted]);

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
      className="w-full scroll-mt-16 overflow-x-clip border-y border-[#B2C9A8] bg-[#F2F6EF] py-20 text-[#202B20] md:py-24"
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
              <Calendar
                className="h-3.5 w-3.5 text-[#187347]"
                aria-hidden="true"
              />
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
      </div>

      {/* Full-Width Continuous Right-to-Left Scrolling Track */}
      {total > 0 ? (
        <div
          className="relative mx-auto mt-8 max-w-[1560px]"
          onMouseEnter={() => setIsTrackHovered(true)}
          onMouseLeave={() => setIsTrackHovered(false)}
        >
          {/* Soft Edge Gradients on Larger Viewports */}
          {total > 1 && (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-[#F2F6EF] to-transparent md:block lg:w-20"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-[#F2F6EF] to-transparent md:block lg:w-20"
              />
            </>
          )}

          <div
            ref={trackRef}
            data-continuous-marquee-track
            data-auto-scrolling={isAutoScrolling ? "true" : "false"}
            data-scroll-direction="right-to-left"
            onWheel={handleTrackWheel}
            onTouchStart={handleTrackTouchStart}
            onPointerDown={handleTrackPointerDown}
            onScroll={handleTrackScroll}
            className={`flex overflow-x-auto px-4 pb-3 pt-1 [scrollbar-width:none] sm:px-8 lg:px-14 [&::-webkit-scrollbar]:hidden ${
              total === 1 ? "justify-center" : ""
            }`}
          >
            {/* Primary Team Cards Set */}
            <div
              ref={primaryGroupRef}
              data-marquee-primary
              className="flex shrink-0 items-stretch gap-5 pr-5"
            >
              {teams.map((team, idx) => (
                <TeamCard
                  key={`${activeCohort.year}-${team.id}`}
                  team={team}
                  isActive={idx === safeIndex}
                  onSelect={() => handleGoTo(idx)}
                  onInteract={markInteracted}
                />
              ))}
            </div>

            {/* Seamless Cloned Set for Continuous Infinite Right-to-Left Glide */}
            {showSeamlessClone && (
              <div
                aria-hidden="true"
                data-marquee-clone
                className="flex shrink-0 items-stretch gap-5 pr-5"
              >
                {teams.map((team, idx) => (
                  <TeamCard
                    key={`clone-${activeCohort.year}-${team.id}`}
                    team={team}
                    isActive={false}
                    isClone
                    onSelect={() => handleGoTo(idx)}
                    onInteract={markInteracted}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#B2C9A8] bg-white p-8 text-center text-sm text-[#596556]">
            No module teams have been published for{" "}
            {activeCohort?.label ?? "this cohort"} yet.
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mx-auto mt-7 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4">
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
