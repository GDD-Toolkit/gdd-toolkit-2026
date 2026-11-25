import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, PlayCircle, RotateCw, Sparkles } from "lucide-react";
import amartyaSen from "@/assets/images/human-centred-innovation/amartya-sen.png";
import marthaNussbaum from "@/assets/images/human-centred-innovation/martha-nussbaum.png";
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

const pioneers = [
  {
    name: "Amartya Sen",
    role: "Economist & Philosopher · Nobel Laureate",
    image: amartyaSen,
    alt: "Portrait of Amartya Sen",
    details: [
      "His research focused on societal inequalities.",
      "He views poverty and underdeveloped communities as a consequence of capability deprivations.",
      "He believed development was too complex for a single path to improve everyone’s lives.",
    ],
  },
  {
    name: "Martha Nussbaum",
    role: "Philosopher & Ethicist · Central Capabilities",
    image: marthaNussbaum,
    alt: "Portrait of Martha Nussbaum",
    details: [
      "Helped form the two major schools of thought in the human development and capabilities field.",
      "Her philosophy is rooted in ten explicitly stated central capabilities needed for development.",
      "She believed that satisfying these central capabilities, which are physical, social, and emotional, can be a way to achieve justice.",
    ],
  },
];

const timelineEvents = [
  {
    year: "1948",
    title: "International Manuscript",
    description:
      "The UN publishes the Universal Declaration of Human Rights — a global standard for equality and dignity. This document was called the “Universal Declaration of Human Rights” and merely outlined standards for human rights from an international perspective.",
  },
  {
    year: "1997",
    title: "Reform",
    description:
      "The UN redefines its development model, shifting from basic needs to a Human Rights–Based Approach (HRBA). This effectively switched the focus of global development from the beneficiaries to the general human population.",
  },
  {
    year: "2003",
    title: "Adopted Globally",
    description:
      "The UN Common Understanding on a Human-Rights-Based Approach (HRBA) to Development Cooperation was adopted. In this document, the UN sets forth elements such as recognition of human rights that ensure proper consideration of human rights when developing a nation.",
  },
  {
    year: "2004",
    title: "HDCA",
    description:
      "The Human Development and Capability Association (HDCA) was established by Nobel laureate Amartya Sen. It was formally launched at a conference in Pavia, Italy, to promote research and discussion on human development and the capability approach.",
  },
];

export default function CapabilityApproach() {
  const [flippedPioneers, setFlippedPioneers] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const togglePioneer = (name: string) => {
    setFlippedPioneers((current) =>
      current.includes(name)
        ? current.filter((pioneerName) => pioneerName !== name)
        : [...current, name],
    );
  };

  return (
    <div className="hci-scope">

      <EditorialPageHero
        titleId="ca-title"
        backLink={{
          label: "Human Centred Innovation",
          to: "/development-ethics",
        }}
        badges={[
          { label: "02 · Theoretical Lens", tone: "cream" },
          { label: "Beyond GDP Measures", tone: "sage" },
        ]}
        title={
          <>
            The Capability{" "}
            <em className="font-normal italic text-[#E9E6B2]">Approach</em>
          </>
        }
        subtitle="The Capability Approach to human development was developed in the 1980’s as a way to look at development beyond economic measures."
        footnote="Grounded in Amartya Sen’s freedom-centered economics and Martha Nussbaum’s ten central capabilities"
        aside={
          <div className="rounded-2xl border-[1.5px] border-[#E9E6B2]/75 bg-[#2E502B]/90 p-6 shadow-xl">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#E9E6B2]">
              Paradigm Shift
            </p>
            <h2
              className="mt-2 text-2xl font-semibold text-white"
              style={EDITORIAL_SERIF_STYLE}
            >
              From income growth to real human freedom
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#9AB887]/45 bg-[#355832] p-3.5">
                <Sparkles className="h-4 w-4 text-[#E9E6B2]" aria-hidden="true" />
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#E9E6B2]">
                  Core Focus
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-[#EDF4E8]">
                  What people are genuinely able to do and to be.
                </p>
              </div>
              <div className="rounded-xl border border-[#9AB887]/45 bg-[#355832] p-3.5">
                <BookOpen className="h-4 w-4 text-[#E9E6B2]" aria-hidden="true" />
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#E9E6B2]">
                  Rights Link
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-[#EDF4E8]">
                  Anchors the Human Rights–Based Approach globally.
                </p>
              </div>
            </div>
          </div>
        }
      />

      {/* Video Explainer Section */}
      <EditorialSection tone="white" ariaLabelledBy="ca-explained-title">
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="01 / Training & Knowledge Module Team"
            titleId="ca-explained-title"
            title={
              <>
                Capability Approach{" "}
                <em className="font-normal italic text-[#187347]">Explained</em>
              </>
            }
            description="The following video helps explain the definition of Capability Approach along with examples."
          />
        </EditorialReveal>

        <EditorialReveal delay={0.08} className="mt-10">
          <div className="mx-auto max-w-5xl rounded-2xl border-[1.5px] border-[#94B985] bg-[#F2F6EF] p-3 shadow-sm sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-wider text-[#284B26]">
                <PlayCircle className="h-4 w-4 text-[#187347]" aria-hidden="true" />
                Explainer Video · Capability Approach
              </span>
              <span className="rounded-full border border-[#B2C9A8] bg-white px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#596556]">
                GDD Module Media
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border border-[#3F673C]/30 bg-[#192419] shadow-md">
              <video
                controls
                preload="metadata"
                className="aspect-video w-full bg-[#192419]"
              >
                <source
                  src="/assets/Cabability-approach-video.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video element.
              </video>
            </div>
          </div>
        </EditorialReveal>
      </EditorialSection>

      {/* Pioneer Flip Cards Section */}
      <EditorialSection tone="sage" ariaLabelledBy="ca-pioneers-title">
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="02 / Foundational Thinkers"
            titleId="ca-pioneers-title"
            align="center"
            title={
              <>
                Pioneers of the{" "}
                <em className="font-normal italic text-[#187347]">
                  Capability Approach
                </em>
              </>
            }
            description="Click a card to learn more about each pioneer."
          />
        </EditorialReveal>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {pioneers.map((pioneer, index) => {
            const isFlipped = flippedPioneers.includes(pioneer.name);

            return (
              <EditorialReveal key={pioneer.name} delay={index * 0.08}>
                <button
                  type="button"
                  aria-label={`${isFlipped ? "Hide details about" : "Learn more about"} ${pioneer.name}`}
                  aria-pressed={isFlipped}
                  onClick={() => togglePioneer(pioneer.name)}
                  className="hci-flip-scene group block min-h-[29rem] w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C] focus-visible:ring-offset-4 rounded-2xl"
                >
                  <span
                    className={`hci-flip-inner${isFlipped ? " is-flipped" : ""}`}
                  >
                    {/* Front Face */}
                    <span className="hci-flip-face hci-flip-front flex flex-col justify-between rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6 shadow-sm transition-colors duration-200 group-hover:border-[#3F673C] group-hover:bg-[#FAFDF8] sm:p-7">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                            0{index + 1} · Pioneer
                          </span>
                          <span className="rounded-full border border-[#D5E3D9] bg-[#F2F6EF] px-2.5 py-0.5 text-[11px] font-medium text-[#284B26]">
                            Interactive Card
                          </span>
                        </div>

                        <strong
                          className="mt-2 block text-2xl font-semibold text-[#202B20] sm:text-3xl"
                          style={EDITORIAL_SERIF_STYLE}
                        >
                          {pioneer.name}
                        </strong>
                        <span className="mt-1 block text-xs font-medium text-[#596556]">
                          {pioneer.role}
                        </span>
                      </div>

                      <div className="my-5 flex items-center justify-center overflow-hidden rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-3">
                        <img
                          src={pioneer.image}
                          alt={pioneer.alt}
                          className="h-56 w-auto rounded-lg object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>

                      <span className="inline-flex items-center justify-between border-t border-[#D5E3D9] pt-4 text-xs font-semibold uppercase tracking-wider text-[#3F673C]">
                        <span>Click to learn more</span>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#94B985] bg-[#EDF4E8] text-[#187347] transition-transform duration-300 group-hover:rotate-45">
                          <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      </span>
                    </span>

                    {/* Back Face */}
                    <span className="hci-flip-face hci-flip-back flex flex-col justify-between rounded-2xl border-[1.5px] border-[#E9E6B2] bg-[#3F673C] p-6 text-white shadow-lg sm:p-7">
                      <div>
                        <span className="inline-flex items-center rounded-full border border-[#9AB887] bg-[#2E502B] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#E9E6B2]">
                          Capability Approach pioneer
                        </span>
                        <strong
                          className="mt-3 block text-2xl font-semibold text-white sm:text-3xl"
                          style={EDITORIAL_SERIF_STYLE}
                        >
                          {pioneer.name}
                        </strong>

                        <ul className="mt-5 space-y-3.5">
                          {pioneer.details.map((detail) => (
                            <li
                              key={detail}
                              className="flex items-start gap-3 text-sm leading-relaxed text-[#EDF4E8]"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E9E6B2]"
                              />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <span className="mt-6 inline-flex items-center justify-between border-t border-[#9AB887]/40 pt-4 text-xs font-semibold uppercase tracking-wider text-[#E9E6B2]">
                        <span>Click to return</span>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E9E6B2]/70 bg-[#2E502B] text-[#E9E6B2]">
                          <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      </span>
                    </span>
                  </span>
                </button>
              </EditorialReveal>
            );
          })}
        </div>
      </EditorialSection>

      {/* Human Rights Approach & Timeline Section */}
      <EditorialSection tone="white" ariaLabelledBy="ca-human-rights-title">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <EditorialReveal className="lg:col-span-7">
            <EditorialSectionHeader
              eyebrow="03 / Global Human Rights Lineage"
              titleId="ca-human-rights-title"
              title={
                <>
                  Human Rights{" "}
                  <em className="font-normal italic text-[#187347]">
                    Approach
                  </em>
                </>
              }
            />
            <p className="mt-5 text-base leading-relaxed text-[#394838] sm:text-[1.05rem]">
              This approach to global development, a subset to the Capability
              Approach, aims to ensure that human rights are considered and
              respected when a country undergoes development. Below is a small
              timeline illustrating how this approach came to be.
            </p>
          </EditorialReveal>

          <EditorialReveal delay={0.08} className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border-[1.5px] border-[#94B985] bg-[#F2F6EF] p-2.5 shadow-sm">
              <div className="overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85"
                  alt="Diverse group of people standing together in solidarity"
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
            </div>
          </EditorialReveal>
        </div>

        {/* Animated Historical Timeline */}
        <div className="relative mt-14">
          {/* Desktop Vertical Center Line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 left-4 top-4 w-[2px] bg-gradient-to-b from-[#3F673C] via-[#94B985] to-[#B2C9A8] lg:left-1/2 lg:-translate-x-1/2"
          />

          <ol
            aria-label="Human Rights Approach timeline"
            className="space-y-8"
          >
            {timelineEvents.map((event, index) => {
              const isLeft = index % 2 === 0;
              return (
                <li
                  key={event.year}
                  className="relative grid grid-cols-1 items-center pl-12 lg:grid-cols-2 lg:gap-12 lg:pl-0"
                >
                  {/* Milestone Node */}
                  <span
                    aria-hidden="true"
                    className="absolute left-1.5 top-6 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#3F673C] bg-[#E9E6B2] shadow-xs lg:left-1/2 lg:-translate-x-1/2"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#3F673C]" />
                  </span>

                  <EditorialReveal
                    delay={index * 0.06}
                    className={isLeft ? "lg:col-start-1" : "lg:col-start-2"}
                  >
                    <article className="rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-6 transition-colors duration-200 hover:border-[#3F673C] hover:bg-white sm:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <time
                          className="inline-flex items-center rounded-full border border-[#3F673C] bg-[#3F673C] px-4 py-1 text-base font-semibold text-[#E9E6B2]"
                          style={EDITORIAL_SERIF_STYLE}
                        >
                          {event.year}
                        </time>
                        <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                          Milestone 0{index + 1}
                        </span>
                      </div>

                      <h3
                        className="mt-4 text-xl font-semibold text-[#202B20] sm:text-2xl"
                        style={EDITORIAL_SERIF_STYLE}
                      >
                        {event.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#394838] sm:text-[0.95rem]">
                        {event.description}
                      </p>
                    </article>
                  </EditorialReveal>
                </li>
              );
            })}
          </ol>
        </div>
      </EditorialSection>
    </div>
  );
}
