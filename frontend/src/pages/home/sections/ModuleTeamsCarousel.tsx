import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Users,
} from "lucide-react";
import { MODULE_TEAMS, type ModuleTeam } from "../data/moduleTeams";

function ModuleToolLink({ team }: { team: ModuleTeam }) {
  const pillClass =
    "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#A07CFF] to-[#6D83F2] px-3.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-white transition-all hover:brightness-110";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const total = MODULE_TEAMS.length;
  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  const activeTeam = MODULE_TEAMS[activeIndex];
  const prevTeam = MODULE_TEAMS[prevIndex];
  const nextTeam = MODULE_TEAMS[nextIndex];

  const goTo = useCallback(
    (index: number) => {
      const normalized = (index + total) % total;
      setDirection(normalized >= activeIndex ? 1 : -1);
      setActiveIndex(normalized);
    },
    [activeIndex, total],
  );

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((curr) => (curr - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((curr) => (curr + 1) % total);
  }, [total]);

  // Allow keyboard navigation when carousel section has focus
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

  return (
    <section
      id="module-teams"
      data-module-teams-carousel
      aria-labelledby="module-teams-heading"
      aria-roledescription="carousel"
      className="w-full border-y border-white/10 bg-[#0D0E14] py-20 text-white md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-[#A07CFF]">
            02 // Module Teams · Peer Research Mentors &amp; Students
          </p>
          <h2
            id="module-teams-heading"
            className="mt-2.5 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            The Student Teams Behind Every Tool
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            Each toolkit module is built by a dedicated UMD FIRE research
            squad—structured around a{" "}
            <span className="font-medium text-slate-200">
              Peer Research Mentor (PRM)
            </span>{" "}
            leading a team of{" "}
            <span className="font-medium text-slate-200">
              undergraduate researching students
            </span>
            .
          </p>
        </div>

        {/* Module Selector Pills */}
        <div
          role="tablist"
          aria-label="Select a module team"
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {MODULE_TEAMS.map((team, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={team.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => goTo(idx)}
                className={
                  isActive
                    ? "cursor-pointer rounded-full bg-gradient-to-r from-[#A07CFF] to-[#6D83F2] px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-[#6D83F2]/25 transition-all"
                    : "cursor-pointer rounded-full border border-[#262A3E] bg-[#151824] px-4 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-[#A07CFF]/45 hover:text-white"
                }
              >
                {team.shortName}
              </button>
            );
          })}
        </div>

        {/* Spotlight Stage: Left Peek + Center Active Card + Right Peek */}
        <div className="mt-9 grid grid-cols-1 items-center gap-5 lg:grid-cols-12">
          {/* Left Dimmed Peek Card */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label={`View previous module team: ${prevTeam.name}`}
            className="hidden h-full cursor-pointer flex-col justify-between rounded-2xl border border-white/10 bg-[#12141E] p-6 text-left opacity-60 transition-all duration-200 hover:border-[#A07CFF]/40 hover:opacity-90 lg:col-span-3 lg:flex"
          >
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#1E2235] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400">
                <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                Prev Module
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">
                {prevTeam.shortName}
              </h3>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-400">
                {prevTeam.purpose}
              </p>
            </div>
            <div className="mt-6 space-y-1 border-t border-white/10 pt-3">
              <p className="text-xs font-semibold text-[#C4B5FD]">
                PRM: {prevTeam.prm.name}
              </p>
              <p className="font-mono text-[11px] text-slate-500">
                {prevTeam.students.length} Researching Students
              </p>
            </div>
          </button>

          {/* Center Featured Spotlight Card */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={activeTeam.id}
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -24 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                aria-live="polite"
                className="rounded-3xl border border-[#A07CFF]/60 bg-[#141726] p-6 shadow-2xl shadow-[#6D83F2]/10 sm:p-8"
              >
                {/* Top Metadata Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <ModuleToolLink team={activeTeam} />
                  <span className="inline-flex items-center rounded-full border border-[#3B3F5C] bg-[#1E2235] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#C4B5FD]">
                    {activeTeam.cohort} · Active Module
                  </span>
                </div>

                {/* Team Name */}
                <h3 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                  {activeTeam.name}
                </h3>

                {/* Purpose Callout */}
                <div className="mt-4 rounded-xl border border-[#6D83F2]/35 bg-[#0B0D14] px-4 py-3.5">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#A07CFF]">
                    Module Purpose
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
                    {activeTeam.purpose}
                  </p>
                </div>

                {/* Structured Hierarchy: PRM Lead + Researching Students */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-12">
                  {/* PRM Leadership Card */}
                  <div className="flex flex-col justify-between rounded-2xl border border-[#A07CFF]/35 bg-[#1B1E32] p-4 sm:col-span-5">
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#2B2450] px-2.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-[#C4B5FD]">
                        <GraduationCap className="h-3 w-3" aria-hidden="true" />
                        PRM · Lead Mentor
                      </span>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A07CFF] to-[#6D83F2] text-xs font-bold text-white">
                          {activeTeam.prm.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {activeTeam.prm.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            Peer Research Mentor
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-400">
                      {activeTeam.prm.focus}
                    </p>
                  </div>

                  {/* Researching Students Roster Card */}
                  <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0F111A] p-4 sm:col-span-7">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        <Users className="h-3.5 w-3.5 text-[#A07CFF]" aria-hidden="true" />
                        Researching Students ({activeTeam.students.length})
                      </span>
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {activeTeam.students.map((student) => (
                        <li
                          key={student}
                          className="rounded-full border border-[#2B3048] bg-[#1A1E2E] px-3 py-1 text-xs font-medium text-slate-200"
                        >
                          {student}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Right Dimmed Peek Card */}
          <button
            type="button"
            onClick={handleNext}
            aria-label={`View next module team: ${nextTeam.name}`}
            className="hidden h-full cursor-pointer flex-col justify-between rounded-2xl border border-white/10 bg-[#12141E] p-6 text-left opacity-60 transition-all duration-200 hover:border-[#A07CFF]/40 hover:opacity-90 lg:col-span-3 lg:flex"
          >
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#1E2235] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Next Module
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">
                {nextTeam.shortName}
              </h3>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-400">
                {nextTeam.purpose}
              </p>
            </div>
            <div className="mt-6 space-y-1 border-t border-white/10 pt-3">
              <p className="text-xs font-semibold text-[#C4B5FD]">
                PRM: {nextTeam.prm.name}
              </p>
              <p className="font-mono text-[11px] text-slate-500">
                {nextTeam.students.length} Researching Students
              </p>
            </div>
          </button>
        </div>

        {/* Bottom Navigation Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={handlePrev}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#2D3148] bg-[#151824] px-5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-[#A07CFF]/50 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Previous Team
          </button>

          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-slate-400">
            <span>
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")} Modules
            </span>
            <span aria-hidden="true">·</span>
            <Link
              to="/acknowledgements"
              className="text-[#A07CFF] underline-offset-4 hover:underline"
            >
              All 6 Cohorts (2020–2025)
            </Link>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#A07CFF] to-[#6D83F2] px-5 py-2 text-xs font-semibold text-white transition-all hover:brightness-110"
          >
            Next Team
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
