import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckSquare,
  Compass,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import { DIGITAL_PRINCIPLES } from "./principlesData";
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

export default function EthicsOfInnovation() {
  const reduced = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="hci-scope">

      <EditorialPageHero
        titleId="eoi-title"
        backLink={{
          label: "Human Centred Innovation",
          to: "/development-ethics",
        }}
        badges={[
          { label: "03 · Interactive Explorer", tone: "cream" },
          { label: "Principles for Digital Development", tone: "sage" },
        ]}
        title={
          <>
            Ethics of{" "}
            <em className="font-normal italic text-[#E9E6B2]">Innovation</em>
          </>
        }
        subtitle="Master the nine Principles of Digital Design—from designing with users and understanding ecosystems to open standards, privacy, and collaboration."
        footnote="Includes interactive project-review checklists, curated case studies, and a live program manager simulation"
        aside={
          <div className="relative overflow-hidden rounded-2xl border-[1.5px] border-[#E9E6B2]/75 bg-[#2E502B]/90 p-6 shadow-xl">
            <div className="flex items-center gap-5">
              <motion.div
                initial={reduced ? false : { scale: 0.9, rotate: -6 }}
                animate={reduced ? undefined : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: EDITORIAL_EASE }}
                className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#E9E6B2] bg-[#E9E6B2] text-[#202B20] shadow-md"
              >
                <span
                  className="text-5xl font-semibold italic leading-none"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  9
                </span>
              </motion.div>
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#E9E6B2]">
                  Digital Design Framework
                </p>
                <p
                  className="mt-1 text-xl font-semibold text-white"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  Digital Principles
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#EDF4E8]/85">
                  Each principle pairs real-world case studies with an
                  actionable verification checklist.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[#9AB887]/35 pt-4 text-center">
              <div className="rounded-xl border border-[#9AB887]/40 bg-[#355832] px-2.5 py-2">
                <span
                  className="block text-lg font-semibold text-[#E9E6B2]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  9
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#EDF4E8]">
                  Principles
                </span>
              </div>
              <div className="rounded-xl border border-[#9AB887]/40 bg-[#355832] px-2.5 py-2">
                <span
                  className="block text-lg font-semibold text-[#E9E6B2]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  45+
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#EDF4E8]">
                  Checkpoints
                </span>
              </div>
              <div className="rounded-xl border border-[#9AB887]/40 bg-[#355832] px-2.5 py-2">
                <span
                  className="block text-lg font-semibold text-[#E9E6B2]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  1
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#EDF4E8]">
                  Live Sim
                </span>
              </div>
            </div>
          </div>
        }
      />

      {/* Section 1: Flagship Simulation Feature Banner */}
      <EditorialSection tone="white" ariaLabelledBy="eoi-simulation-title">
        <EditorialReveal>
          <div className="grid grid-cols-1 items-center gap-8 rounded-2xl border-[1.5px] border-[#3F673C] bg-[#F2F6EF] p-7 lg:grid-cols-12 lg:p-9">
            <div className="flex flex-col gap-4 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-3.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  01 · Interactive Scenario
                </span>
                <span className="inline-flex items-center rounded-full border border-[#94B985] bg-white px-3 py-1 text-xs font-medium text-[#284B26]">
                  Program Manager Roleplay
                </span>
              </div>

              <h2
                id="eoi-simulation-title"
                className="text-2xl font-semibold tracking-tight text-[#202B20] sm:text-3xl"
                style={EDITORIAL_SERIF_STYLE}
              >
                Ethics of Innovation{" "}
                <em className="font-normal italic text-[#187347]">
                  Simulation
                </em>
              </h2>

              <p className="text-sm leading-relaxed text-[#394838] sm:text-base">
                By utilizing the 9 Principles of Digital Design and
                incorporating ethics of innovation, you can effectively lead a
                project as a program manager in this simulation. In this role,
                you’ll have to decide how best to design your project while
                keeping ethics of innovation in mind. Try it out for yourself.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="https://umdsurvey.umd.edu/jfe/form/SV_6tAE6MSIm6aExU2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#3F673C] focus:ring-offset-2"
                >
                  <span>Launch Simulation</span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
                <span className="font-mono text-[11px] font-medium text-[#284B26]">
                  Opens UMD Interactive Qualtrics Scenario
                </span>
              </div>
            </div>

            {/* Right Scenario Preview Card */}
            <div className="rounded-xl border-[1.5px] border-[#94B985] bg-white p-5 shadow-sm lg:col-span-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                  Simulation Brief · Roleplay
                </p>
                <Compass className="h-4 w-4 text-[#3F673C]" aria-hidden="true" />
              </div>
              <h3
                className="mt-2 text-lg font-semibold text-[#202B20]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Lead an Ethical Digital Rollout
              </h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full border border-[#94B985] bg-[#EDF4E8] px-2.5 py-0.5 text-[11px] font-medium text-[#187347]">
                  9 Principles Applied
                </span>
                <span className="rounded-full border border-[#D6CE8A] bg-[#FAF8E4] px-2.5 py-0.5 text-[11px] font-medium text-[#6F6057]">
                  Branching Tradeoffs
                </span>
              </div>
              <ul className="mt-3.5 space-y-1.5 text-xs leading-relaxed text-[#596556]">
                <li>
                  &bull; Balance speed, budget, privacy, and local ecosystem fit
                </li>
                <li>
                  &bull; Test how stakeholder choices shape long-term
                  sustainability
                </li>
              </ul>
            </div>
          </div>
        </EditorialReveal>
      </EditorialSection>

      {/* Section 2: 9 Principles 3-Column Green-Outlined Grid */}
      <EditorialSection tone="sage" ariaLabelledBy="eoi-principles-title">
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="02 / Digital Design Framework"
            titleId="eoi-principles-title"
            title={
              <>
                9 Principles of{" "}
                <em className="font-normal italic text-[#187347]">
                  Digital Design
                </em>
              </>
            }
            description="Explore each of the nine digital design principles to learn how to incorporate them into your project. Every principle includes an interactive checklist to verify that ethical innovation criteria were met."
          />
        </EditorialReveal>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DIGITAL_PRINCIPLES.map((item, index) => (
            <EditorialReveal key={item.slug} delay={(index % 3) * 0.05}>
              <motion.div
                whileHover={reduced ? undefined : { y: -4 }}
                transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
                className="h-full"
              >
                <Link
                  to={item.path}
                  aria-label={`Explore ${item.title}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border-[1.5px] border-[#B2C9A8] bg-white transition-colors duration-200 hover:border-[#3F673C] hover:bg-[#FAFDF8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C] focus-visible:ring-offset-2"
                >
                  {/* Card Illustration Header */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[#D5E3D9] bg-[#F2F6EF]">
                    <img
                      src={item.img}
                      alt={item.imgAlt}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-3.5 top-3.5 inline-flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-[#E9E6B2] bg-[#2E502B]/95 font-mono text-xs font-semibold text-[#E9E6B2] shadow-sm">
                      {item.number}
                    </span>
                    <span className="absolute right-3.5 top-3.5 inline-flex items-center gap-1 rounded-full border border-[#94B985] bg-white/95 px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#284B26] backdrop-blur-xs">
                      <CheckSquare className="h-3 w-3 text-[#187347]" aria-hidden="true" />
                      {item.checklist.length} checks
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3
                      className="text-xl font-semibold text-[#202B20]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#596556]">
                      {item.cardSummary}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-[#D5E3D9] pt-4 text-sm font-semibold text-[#3F673C] transition-colors group-hover:text-[#187347]">
                      <span>Explore principle</span>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#94B985] bg-[#F2F6EF] text-[#284B26] transition-all duration-200 group-hover:translate-x-1 group-hover:border-[#3F673C] group-hover:bg-[#3F673C] group-hover:text-[#E9E6B2]">
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </EditorialReveal>
          ))}
        </div>
      </EditorialSection>
    </div>
  );
}
