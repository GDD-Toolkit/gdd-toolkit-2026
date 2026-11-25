import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import "../development-ethics/humanCentredInnovation.css";

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

const values = [
  {
    title: "Well-Being",
    description:
      "Prioritize physical, mental, and social well-being. Programs should measurably improve quality of life, reduce preventable harm, and expand access to essential services such as healthcare, nutrition, and safe environments.",
    icon: "wellbeing",
  },
  {
    title: "Equality",
    description:
      "Design and evaluate interventions to close gaps in outcomes and opportunity. Address structural barriers that disproportionately affect marginalized groups and track distributional effects—not only averages.",
    icon: "equality",
  },
  {
    title: "Empowerment",
    description:
      "Increase people’s ability to define priorities and influence decisions that affect their lives. Support local leadership, transparent information, and participatory processes rather than external control.",
    icon: "empowerment",
  },
  {
    title: "Human Rights",
    description:
      "Ensure all efforts respect and strengthen internationally recognized rights and dignities. Build safeguards against coercion, discrimination, and abuse, with clear accountability when harms occur.",
    icon: "rights",
  },
  {
    title: "Cultural Freedom",
    description:
      "Protect the ability of communities to sustain, adapt, and express their cultures. Development should never erase identity; it should resource local knowledge, languages, and practices.",
    icon: "culture",
  },
  {
    title: "Responsibility",
    description:
      "Act with integrity, transparency, and stewardship of resources. Establish clear governance, auditability, and feedback loops. Publish decisions and results. Admit and correct mistakes.",
    icon: "responsibility",
  },
  {
    title: "Sustainability",
    description:
      "Deliver benefits that last without degrading environmental or social systems. Plan for maintenance, financing, and local capacity. Reduce emissions and waste. Steward land, water, and biodiversity.",
    icon: "sustainability",
  },
] as const;

function ValueIcon({ name }: { name: (typeof values)[number]["icon"] }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.7,
  };

  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="h-12 w-12 sm:h-14 sm:w-14"
      {...common}
    >
      {name === "wellbeing" && (
        <>
          <path d="M24 38S9 30 9 19c0-6 7-9 11-5l4 4 4-4c4-4 11-1 11 5 0 11-15 19-15 19Z" />
          <path d="M15 25h6l3-6 4 11 3-5h4" />
        </>
      )}
      {name === "equality" && (
        <>
          <path d="M24 9v30M14 13h20M18 13l-7 15M30 13l7 15" />
          <path d="M6 28h10c0 4-2 6-5 6s-5-2-5-6ZM32 28h10c0 4-2 6-5 6s-5-2-5-6ZM16 39h16" />
        </>
      )}
      {name === "empowerment" && (
        <path d="m28 6-16 22h12l-4 14 16-23H25l3-13Z" />
      )}
      {name === "rights" && (
        <>
          <path d="M24 6c5 4 10 5 15 6v10c0 10-6 17-15 21-9-4-15-11-15-21V12c5-1 10-2 15-6Z" />
          <path d="m17 24 5 5 10-11" />
        </>
      )}
      {name === "culture" && (
        <>
          <path d="M24 7a17 17 0 1 0 0 34h3c3 0 4-4 1-6l-1-1c-2-2-1-5 2-6h7c3 0 5-2 5-5A17 17 0 0 0 24 7Z" />
          <circle cx="16" cy="19" r="1.5" />
          <circle cx="22" cy="14" r="1.5" />
          <circle cx="30" cy="16" r="1.5" />
          <circle cx="33" cy="23" r="1.5" />
        </>
      )}
      {name === "responsibility" && (
        <>
          <circle cx="24" cy="24" r="17" />
          <path d="m16 24 5 5 11-12" />
        </>
      )}
      {name === "sustainability" && (
        <>
          <path d="M11 34c2-17 12-23 27-24 0 15-6 25-21 25" />
          <path d="M12 39c5-10 12-16 21-22" />
        </>
      )}
    </svg>
  );
}

export default function Worthwhile() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const reduced = useReducedMotion();
  const activeValue = values[activeIndex];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const move = (step: number) => {
    setDirection(step >= 0 ? 1 : -1);
    setActiveIndex(
      (current) => (current + step + values.length) % values.length,
    );
  };

  const jumpTo = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  return (
    <div className="hci-scope">

      <EditorialPageHero
        titleId="wd-title"
        backLink={{
          label: "Human Centred Innovation",
          to: "/development-ethics",
        }}
        badges={[
          { label: "01 · Core Framework", tone: "cream" },
          { label: "7 Ethical Values", tone: "sage" },
        ]}
        title={
          <>
            Worthwhile{" "}
            <em className="font-normal italic text-[#E9E6B2]">Development</em>
          </>
        }
        subtitle="A people-centered approach to development that avoids disempowerment, reduces inequality, and strengthens communities — guided by seven key values."
        footnote="Drawn from the Routledge Handbook of Development Ethics · Integrated across all seven GDD Toolkit instruments"
        aside={
          <div className="relative overflow-hidden rounded-2xl border-[1.5px] border-[#E9E6B2]/75 bg-[#2E502B]/90 p-6 shadow-xl">
            <div className="flex items-center gap-5">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#E9E6B2] bg-[#E9E6B2] text-[#202B20] shadow-md">
                <span
                  className="text-5xl font-semibold italic leading-none"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  7
                </span>
              </div>
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#E9E6B2]">
                  Ethical Compass
                </p>
                <p
                  className="mt-1 text-xl font-semibold text-white"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  Core Values
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#EDF4E8]/85">
                  Checkpoints to prevent maldevelopment and keep communities at
                  the center.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5 border-t border-[#9AB887]/35 pt-4">
              {values.map((val, idx) => (
                <span
                  key={val.title}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] transition-colors ${
                    idx === activeIndex
                      ? "bg-[#E9E6B2] font-semibold text-[#202B20]"
                      : "border border-[#9AB887]/50 bg-[#355832] text-[#EDF4E8]"
                  }`}
                >
                  {String(idx + 1).padStart(2, "0")} {val.title}
                </span>
              ))}
            </div>
          </div>
        }
      />

      {/* Introduction Section */}
      <EditorialSection tone="white" ariaLabel="About Worthwhile Development">
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="01 / Ethical Foundation"
            title={
              <>
                Values That Guard Against{" "}
                <em className="font-normal italic text-[#187347]">
                  Maldevelopment
                </em>
              </>
            }
          />
        </EditorialReveal>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <EditorialReveal className="space-y-5 lg:col-span-7">
            <p className="text-base leading-relaxed text-[#394838] sm:text-[1.05rem]">
              At the heart of the Development Ethics Toolkit are seven core
              values of worthwhile development, drawn from the Routledge
              Handbook of Development Ethics. These values guide every tool,
              evaluation framework, and recommendation within this platform,
              ensuring that development efforts are not only effective but also
              equitable, human-centred, and ethically grounded.
            </p>
            <p className="text-base leading-relaxed text-[#394838] sm:text-[1.05rem]">
              By centralizing these values, the Development Ethics Toolkit helps
              development practitioners, policymakers, and scholars navigate
              towards thoughtful decisions that prioritize human well-being and
              guard against the pitfalls of maldevelopment.
            </p>
          </EditorialReveal>

          <EditorialReveal delay={0.08} className="lg:col-span-5">
            <div className="flex h-full flex-col justify-between rounded-2xl border-[1.5px] border-[#94B985] bg-[#F6F4D8] p-6 sm:p-7">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#94B985] bg-white px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Practitioner Checkpoint
                </div>
                <p
                  className="mt-4 text-lg font-medium leading-relaxed text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  When planning or evaluating development work, use these goals
                  as checkpoints. Each initiative should contribute measurably
                  to at least one goal while avoiding tradeoffs that undermine
                  others.
                </p>
              </div>
              <p className="mt-5 border-t border-[#D6CE8A] pt-3 font-mono text-[11px] uppercase tracking-wider text-[#596556]">
                7 Values · Zero Unexamined Tradeoffs
              </p>
            </div>
          </EditorialReveal>
        </div>
      </EditorialSection>

      {/* Interactive 7 Values Carousel Section */}
      <EditorialSection tone="sage" ariaLabelledBy="values-title">
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="02 / Interactive Explorer"
            titleId="values-title"
            align="center"
            title={
              <>
                The Seven{" "}
                <em className="font-normal italic text-[#187347]">Values</em>
              </>
            }
            description="Select any value tab below, click the arrows, or use your keyboard arrow keys to explore all seven checkpoints."
          />
        </EditorialReveal>

        {/* Pill Selector Strip (role="tablist" so dot pagination buttons keep unique accessible names) */}
        <div
          role="tablist"
          aria-label="Worthwhile development value index"
          className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-2"
        >
          {values.map((value, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={value.title}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => jumpTo(index)}
                className={`relative inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] px-4 py-2 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#3F673C] focus:ring-offset-2 ${
                  isActive
                    ? "border-[#3F673C] bg-[#3F673C] text-white shadow-sm"
                    : "border-[#B2C9A8] bg-white text-[#284B26] hover:border-[#3F673C] hover:bg-[#FAFDF8]"
                }`}
              >
                <span
                  className={`font-mono text-[10px] ${
                    isActive ? "text-[#E9E6B2]" : "text-[#187347]"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{value.title}</span>
              </button>
            );
          })}
        </div>

        {/* Accessible Carousel Region */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Seven values of worthwhile development"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              move(-1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              move(1);
            }
          }}
          className="mx-auto mt-8 grid max-w-5xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C] focus-visible:ring-offset-4 sm:gap-5"
        >
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Show previous value"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-[#3F673C] bg-[#3F673C] text-[#E9E6B2] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#187347] hover:border-[#187347] focus:outline-none focus:ring-2 focus:ring-[#3F673C] focus:ring-offset-2 sm:h-13 sm:w-13"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="relative overflow-hidden rounded-2xl border-[1.5px] border-[#3F673C] bg-white shadow-md">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.article
                key={activeValue.title}
                custom={direction}
                aria-live="polite"
                initial={
                  reduced
                    ? false
                    : { opacity: 0, x: direction * 36 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  reduced
                    ? undefined
                    : { opacity: 0, x: direction * -36 }
                }
                transition={{ duration: 0.32, ease: EDITORIAL_EASE }}
                className="relative grid min-h-[19rem] grid-cols-1 items-center gap-7 p-7 sm:p-10 md:grid-cols-[auto_minmax(0,1fr)]"
              >
                {/* Subtle Watermark Numeral */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-6 right-5 select-none text-[8rem] font-semibold italic leading-none text-[#3F673C]/[0.06] sm:text-[10rem]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>

                {/* Medallion Icon */}
                <div className="relative z-10 mx-auto flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-2 border-[#E9E6B2] bg-[#3F673C] text-[#E9E6B2] shadow-md sm:h-32 sm:w-32 md:mx-0">
                  <ValueIcon name={activeValue.icon} />
                </div>

                {/* Copy */}
                <div className="relative z-10 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#B2C9A8] bg-[#F2F6EF] px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-[#187347]">
                    <span>
                      {activeIndex + 1} of {values.length}
                    </span>
                  </div>
                  <h3
                    className="mt-4 text-3xl font-semibold tracking-tight text-[#202B20] sm:text-4xl"
                    style={EDITORIAL_SERIF_STYLE}
                  >
                    {activeValue.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-[#394838]">
                    {activeValue.description}
                  </p>
                </div>
              </motion.article>
            </AnimatePresence>

            {/* Bottom Progress Strip */}
            <div className="grid grid-cols-7 gap-1 border-t border-[#D5E3D9] bg-[#FAFDF8] px-4 py-2.5">
              {values.map((val, idx) => (
                <div
                  key={val.title}
                  className={`h-1.5 rounded-full transition-colors duration-300 ${
                    idx <= activeIndex ? "bg-[#187347]" : "bg-[#D5E3D9]"
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Show next value"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-[#3F673C] bg-[#3F673C] text-[#E9E6B2] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#187347] hover:border-[#187347] focus:outline-none focus:ring-2 focus:ring-[#3F673C] focus:ring-offset-2 sm:h-13 sm:w-13"
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Dot Pagination */}
        <div
          className="mt-7 flex items-center justify-center gap-2.5"
          aria-label="Choose a value"
        >
          {values.map((value, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                type="button"
                key={value.title}
                onClick={() => jumpTo(index)}
                aria-label={`Show ${value.title}`}
                aria-current={isActive ? "true" : undefined}
                className={`h-3 cursor-pointer rounded-full border-[1.5px] border-[#3F673C] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3F673C] focus:ring-offset-2 ${
                  isActive
                    ? "w-8 bg-[#3F673C]"
                    : "w-3 bg-white hover:bg-[#94B985]"
                }`}
              />
            );
          })}
        </div>

        <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-wider text-[#596556]">
          Tip: Focus the carousel and press &larr; / &rarr; arrow keys to step
          through values
        </p>
      </EditorialSection>
    </div>
  );
}
