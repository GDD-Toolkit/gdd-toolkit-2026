import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  Globe2,
  Heart,
  Landmark,
  Leaf,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import "./ProjectEvaluation.css";
import { evaluationBands } from "./evaluationScoring";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialReveal,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";

const BAND_META: Record<
  string,
  {
    widthClass: string;
    segmentBg: string;
    dotBg: string;
    pillClass: string;
    summary: string;
  }
> = {
  Poor: {
    widthClass: "w-[30%]",
    segmentBg: "bg-[#B43C3C]",
    dotBg: "bg-[#E07A7A]",
    pillClass: "border-[#E3B2B2] bg-[#FDF2F2] text-[#8F2828]",
    summary:
      "Significant ethical shortfalls, unmitigated community risks, or misalignment with worthwhile development values.",
  },
  Developing: {
    widthClass: "w-[30%]",
    segmentBg: "bg-[#C28A0C]",
    dotBg: "bg-[#E9C46A]",
    pillClass: "border-[#D6CE8A] bg-[#FAF8E4] text-[#6F5312]",
    summary:
      "Partial alignment with core ethical criteria; notable gaps remain in participation, equity, or lasting safeguards.",
  },
  Good: {
    widthClass: "w-[20%]",
    segmentBg: "bg-[#3F673C]",
    dotBg: "bg-[#94B985]",
    pillClass: "border-[#B2C9A8] bg-[#F2F6EF] text-[#284B26]",
    summary:
      "Strong, well-evidenced alignment across applicable values with meaningful stakeholder inclusion and risk mitigation.",
  },
  Superior: {
    widthClass: "w-[20%]",
    segmentBg: "bg-[#187347]",
    dotBg: "bg-[#E9E6B2]",
    pillClass: "border-[#94B985] bg-[#EDF4E8] text-[#187347]",
    summary:
      "Exemplary, durable advancement of human capabilities, community autonomy, and responsible ethical conduct.",
  },
};

const WORTHWHILE_VALUES = [
  {
    number: "01",
    keyword: "Well-being",
    prefix: "Enhancement of people’s ",
    highlight: "well-being",
    suffix: "",
    icon: Heart,
    detail:
      "Expands real human freedoms and capabilities across health, livelihood, education, and security while avoiding harm.",
  },
  {
    number: "02",
    keyword: "Equity",
    prefix: "",
    highlight: "Equitable",
    suffix: " sharing in benefits of development",
    icon: Scale,
    detail:
      "Ensures marginalized and most-affected groups share fairly in resources, voice, and outcomes rather than reinforcing disparities.",
  },
  {
    number: "03",
    keyword: "Empowerment",
    prefix: "",
    highlight: "Empowerment",
    suffix: " to participate freely in development",
    icon: Users,
    detail:
      "Protects community autonomy, consent, and active decision-making power across every stage of a project.",
  },
  {
    number: "04",
    keyword: "Sustainability",
    prefix: "Environmental ",
    highlight: "sustainability",
    suffix: "",
    icon: Leaf,
    detail:
      "Protects ecosystems, manages climate risks responsibly, and prevents today’s gains from creating tomorrow’s ecological harm.",
  },
  {
    number: "05",
    keyword: "Human Rights",
    prefix: "Promotion of ",
    highlight: "human rights",
    suffix: "",
    icon: ShieldCheck,
    detail:
      "Upholds international rights standards, prevents discrimination, and safeguards vulnerable stakeholders from harm.",
  },
  {
    number: "06",
    keyword: "Cultural Freedom",
    prefix: "Promotion of ",
    highlight: "cultural freedom",
    suffix: ", consistent with human rights",
    icon: Globe2,
    detail:
      "Respects local traditions, languages, and knowledge systems while avoiding external cultural imposition.",
  },
  {
    number: "07",
    keyword: "Responsible Conduct",
    prefix: "",
    highlight: "Responsible conduct",
    suffix: ", including integrity over corruption",
    icon: Landmark,
    detail:
      "Establishes transparency, accountability, anti-corruption safeguards, and fair implementation free from elite capture.",
  },
] as const;

const EVALUATION_STAGES = [
  {
    number: "01",
    stage: "DESIGN",
    subtitle: "Phase 1 · Project Design",
    description:
      "Examine intended goals, genuine stakeholder needs, underlying assumptions, and how ethical safeguards are built in from the start.",
  },
  {
    number: "02",
    stage: "EFFECTIVENESS",
    subtitle: "Phase 2 · Project Implementation",
    description:
      "Assess how actual delivery compares with goals, how community rights are protected in practice, and whether negative externalities arose.",
  },
  {
    number: "03",
    stage: "LONGEVITY",
    subtitle: "Phase 3 · Project Outcomes",
    description:
      "Evaluate lasting institutional or behavioral change, local legitimacy, and whether benefits persist without ongoing external support.",
  },
] as const;

const ProjectEvaluation: React.FC = () => {
  const reduced = useReducedMotion();
  const [activeBand, setActiveBand] = useState<string | null>(null);

  return (
    <div className="project-evaluation-page">

      {/* Forest Green Editorial Hero */}
      <EditorialPageHero
        ariaLabel="Project Evaluation introduction"
        backLink={{ label: "Back to Toolkit", to: "/" }}
        badges={[
          { label: "07 · IMPACT RUBRIC", tone: "cream" },
          { label: "7 Values Framework", tone: "sage" },
        ]}
        title={
          <>
            Project{" "}
            <em className="font-normal italic text-[#E9E6B2]">Evaluation</em>
          </>
        }
        subtitle="Assess the ethicality of development projects, programs, and policies using Jay Drydyk’s 7 Values of Worthwhile Development, grounded in a normative, percent-scale rubric."
        actions={
          <>
            <a
              href="/projectevalnewexternal.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#E9E6B2] px-6 py-3 text-sm font-semibold text-[#202B20] shadow-sm transition-all hover:bg-[#f2efbf] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C]"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Read Methodology PDF
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <a
              href="#evaluation-simulation"
              className="inline-flex items-center gap-2 rounded-full border border-[#9AB887] bg-[#2E502B] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#254223] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C]"
            >
              Open Simulation
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </>
        }
        footnote="Grounded in the Routledge Handbook of Development Ethics (Jay Drydyk) · Graded 0–100% across Design, Effectiveness, and Longevity"
        aside={
          <div className="rounded-2xl border-[1.5px] border-[#E9E6B2]/75 bg-[#284B26]/90 p-5 text-white shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-[#9AB887]/35 pb-3">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#E9E6B2]">
                Score Band Legend
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#9AB887]/60 bg-[#355832] px-2.5 py-0.5 font-mono text-[10px] text-[#EDF4E8]">
                <Award className="h-3 w-3 text-[#E9E6B2]" aria-hidden="true" />
                0 – 100%
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {evaluationBands.map((band) => {
                const meta = BAND_META[band.label];
                return (
                  <div
                    key={band.label}
                    className="flex items-center justify-between rounded-xl border border-[#9AB887]/35 bg-[#203D1F]/60 px-3.5 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${meta?.dotBg ?? "bg-[#E9E6B2]"}`}
                        aria-hidden="true"
                      />
                      <span
                        className="text-sm font-semibold text-white"
                        style={EDITORIAL_SERIF_STYLE}
                      >
                        {band.label}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-medium text-[#E9E6B2]">
                      {band.range}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-[#1C331B]">
              {evaluationBands.map((band) => (
                <div
                  key={band.label}
                  className={`${BAND_META[band.label]?.widthClass ?? "w-1/4"} ${BAND_META[band.label]?.segmentBg ?? "bg-[#3F673C]"}`}
                  title={`${band.label}: ${band.range}`}
                />
              ))}
            </div>
          </div>
        }
      />

      {/* Section 1: Scoring Methodology */}
      <EditorialSection tone="white" ariaLabelledBy="scoring-methodology-heading">
        <EditorialSectionHeader
          eyebrow="01 / Scoring Methodology"
          title="What is the Evaluation Tool?"
          titleId="scoring-methodology-heading"
          description="Projects, programs, and policies are evaluated on a 0–100% scale, where 100% represents full alignment with worthwhile development."
        />

        <EditorialReveal className="mt-6">
          <div className="rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-6 sm:p-7">
            <p className="text-sm leading-relaxed text-[#394838] sm:text-base">
              The Project Evaluation Tool aims to assist in assessing the
              ethicality of development projects, programs, and/or policies
              based on the 7 values of worthwhile development (listed below)
              created by Jay Drydyk in the{" "}
              <em>Routledge Handbook of Development Ethics</em>.
            </p>
            <p className="mt-4 text-sm font-semibold leading-relaxed text-[#202B20] sm:text-base">
              The development project, program, and/or policy will be graded on
              a percent scale, with a score of 100% indicating a perfect
              project, program, and/or policy. Below are interpretations of
              select score ranges:
            </p>

            {/* Segmented Horizontal Score Spectrum Bar */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between font-mono text-[11px] font-medium text-[#596556]">
                <span>0%</span>
                <span>30%</span>
                <span>60%</span>
                <span>80%</span>
                <span>100%</span>
              </div>
              <motion.div
                initial={reduced ? false : { scaleX: 0 }}
                whileInView={reduced ? undefined : { scaleX: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: EDITORIAL_EASE }}
                className="flex h-9 w-full origin-left overflow-hidden rounded-xl border border-[#B2C9A8] shadow-xs"
                role="img"
                aria-label="Evaluation score spectrum from 0% Poor to 100% Superior"
              >
                {evaluationBands.map((band) => {
                  const meta = BAND_META[band.label];
                  const isActive = activeBand === band.label;
                  return (
                    <button
                      key={band.label}
                      type="button"
                      onMouseEnter={() => setActiveBand(band.label)}
                      onMouseLeave={() => setActiveBand(null)}
                      onFocus={() => setActiveBand(band.label)}
                      onBlur={() => setActiveBand(null)}
                      className={`${meta.widthClass} ${meta.segmentBg} flex cursor-pointer items-center justify-center px-1 text-[11px] font-semibold text-white transition-all ${
                        isActive
                          ? "brightness-110 ring-2 ring-inset ring-white/80"
                          : "hover:brightness-105"
                      }`}
                    >
                      <span className="truncate">{band.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </EditorialReveal>

        {/* Band Interpretation Cards */}
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {evaluationBands.map((band, index) => {
            const meta = BAND_META[band.label];
            const isHighlighted = activeBand === band.label;
            return (
              <EditorialReveal key={band.label} delay={index * 0.06}>
                <li
                  onMouseEnter={() => setActiveBand(band.label)}
                  onMouseLeave={() => setActiveBand(null)}
                  className={`flex h-full flex-col justify-between rounded-xl border-[1.5px] p-5 transition-all duration-200 ${
                    isHighlighted
                      ? "border-[#3F673C] bg-[#F2F6EF] -translate-y-0.5 shadow-sm"
                      : "border-[#B2C9A8] bg-white hover:border-[#3F673C] hover:bg-[#FAFDF8]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${meta.pillClass}`}
                      >
                        {band.range}
                      </span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${meta.segmentBg}`}
                        aria-hidden="true"
                      />
                    </div>
                    <h3
                      className="mt-3 text-xl font-semibold text-[#202B20]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {band.label}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#596556]">
                      {meta.summary}
                    </p>
                  </div>
                </li>
              </EditorialReveal>
            );
          })}
        </ul>
      </EditorialSection>

      {/* Section 2: 7 Values of Worthwhile Development */}
      <EditorialSection tone="sage" ariaLabelledBy="seven-values-heading">
        <EditorialSectionHeader
          eyebrow="02 / Worthwhile Development"
          title="7 Values of Worthwhile Development"
          titleId="seven-values-heading"
          description="Jay Drydyk’s foundational ethical dimensions for judging whether development genuinely advances human flourishing."
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {WORTHWHILE_VALUES.map(
            (
              { number, prefix, highlight, suffix, icon: Icon, detail },
              idx,
            ) => (
              <EditorialReveal
                key={number}
                delay={idx * 0.05}
                className={idx === 6 ? "md:col-span-2 lg:col-span-3" : ""}
              >
                <motion.li
                  whileHover={reduced ? undefined : { y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-full flex-col justify-between rounded-xl border-[1.5px] border-[#B2C9A8] bg-white p-6 transition-colors hover:border-[#3F673C] hover:bg-[#FAFDF8]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold tracking-wider text-[#187347]">
                        VALUE {number}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF4E8] text-[#187347]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                    <h3
                      className="mt-3.5 text-lg font-semibold leading-snug text-[#202B20]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {prefix}
                      <span className="underline decoration-[#94B985] decoration-2 underline-offset-4">
                        {highlight}
                      </span>
                      {suffix}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#596556]">
                      {detail}
                    </p>
                  </div>
                </motion.li>
              </EditorialReveal>
            ),
          )}
        </ol>
      </EditorialSection>

      {/* Section 3: Normative Approach & Stages */}
      <EditorialSection tone="white" ariaLabelledBy="normative-approach-heading">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Normative Approach */}
          <EditorialReveal className="lg:col-span-7">
            <div className="flex h-full flex-col justify-between rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6 sm:p-8">
              <div>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#187347]">
                  03 / Normative Approach
                </p>
                <h2
                  id="normative-approach-heading"
                  className="mt-2 text-2xl font-semibold tracking-tight text-[#202B20] sm:text-3xl"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  A Normative Approach
                </h2>

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#394838] sm:text-base">
                  <p>
                    The GDD Evaluation Tool is based on a normative approach of
                    evaluation. When scoring your development projects,
                    programs, and/or policies, you will be using your own
                    judgment on how well it achieved the goals associated with
                    the Value(s) of Worthwhile Development applicable to your
                    projects, programs, and/or policies.
                  </p>
                  <p>
                    To guide your evaluation, the Evaluation Tool provides an
                    interactive guideline to help you through each step of the
                    evaluation process. Each step of the evaluation process will
                    have you determine the effectiveness of your development
                    project, program, and/or policy and how well it created
                    outcomes aligned to the Value(s) of Worthwhile Development
                    applicable to your case study.
                  </p>
                  <p>
                    At the end, you will score your development project,
                    program, and/or policy based on the benchmarks the GDD
                    toolkit has established.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#D6CE8A] bg-[#F6F4D8]/80 px-4 py-3.5">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#284B26]">
                  <Sparkles
                    className="h-4 w-4 text-[#187347]"
                    aria-hidden="true"
                  />
                  Ready to calculate weighted phase scores live?
                </span>
                <Link
                  to="/project-planning"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3F673C] underline underline-offset-4 hover:text-[#187347]"
                >
                  Open Interactive Evaluator
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </EditorialReveal>

          {/* Right: Stages of Project Evaluation */}
          <EditorialReveal delay={0.08} className="lg:col-span-5">
            <div className="flex h-full flex-col rounded-2xl border-[1.5px] border-[#94B985] bg-[#F2F6EF] p-6 sm:p-8">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#187347]">
                04 / Evaluation Lifecycle
              </p>
              <h2
                className="mt-2 text-2xl font-semibold tracking-tight text-[#202B20] sm:text-3xl"
                style={EDITORIAL_SERIF_STYLE}
              >
                Stages of Project Evaluation
              </h2>

              <ol className="mt-6 flex-1 space-y-4">
                {EVALUATION_STAGES.map(
                  ({ number, stage, subtitle, description }) => (
                    <li
                      key={stage}
                      className="rounded-xl border-[1.5px] border-[#B2C9A8] bg-white p-4 transition-colors hover:border-[#3F673C]"
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3F673C] font-mono text-xs font-bold text-[#E9E6B2]">
                          {number}
                        </span>
                        <div>
                          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#187347]">
                            {subtitle}
                          </p>
                          <h3
                            className="mt-0.5 text-base font-semibold text-[#202B20]"
                            style={EDITORIAL_SERIF_STYLE}
                          >
                            Evaluation of <strong>{stage}</strong>
                          </h3>
                          <p className="mt-1.5 text-xs leading-relaxed text-[#596556]">
                            {description}
                          </p>
                        </div>
                      </div>
                    </li>
                  ),
                )}
              </ol>
            </div>
          </EditorialReveal>
        </div>
      </EditorialSection>

      {/* Section 4: Evaluation Instrument & Embedded Simulation */}
      <EditorialSection
        id="evaluation-simulation"
        tone="sage"
        ariaLabelledBy="evaluation-simulation-heading"
      >
        <EditorialSectionHeader
          eyebrow="05 / Evaluation Instrument & Guidance"
          title="Project Evaluation Simulation"
          titleId="evaluation-simulation-heading"
          description="Walk through the three-phase guided simulation covering project design, implementation, and outcomes."
          action={
            <a
              href="/projectevalnewexternal.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#3F673C] bg-white px-5 py-2.5 text-xs font-semibold text-[#284B26] transition-colors hover:bg-[#3F673C] hover:text-white"
            >
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              Download Methodology PDF
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          }
        />

        <EditorialReveal className="mt-6">
          <div className="rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-4 border-b border-[#DCE7D7] pb-5 md:flex-row md:items-center md:justify-between">
              <p className="max-w-3xl text-sm leading-relaxed text-[#394838] sm:text-base">
                Walk through the Project Evaluation simulation. It will ask you
                a series of questions in three phases: 1) the project design
                phase, 2) the project implementation phase, and 3) the project
                outcomes phase. See the{" "}
                <a
                  href="/projectevalnewexternal.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#187347] underline underline-offset-4 transition-colors hover:text-[#284B26]"
                >
                  project evaluation methodology
                </a>{" "}
                for more details.
              </p>

              <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#94B985] bg-[#EDF4E8] px-3.5 py-1.5 text-xs font-medium text-[#284B26]">
                <CheckCircle2
                  className="h-3.5 w-3.5 text-[#187347]"
                  aria-hidden="true"
                />
                <span>Interactive Slide Deck</span>
              </div>
            </div>

            {/* Embedded Canva presentation */}
            <div className="mt-6 overflow-hidden rounded-xl border-[1.5px] border-[#94B985] bg-[#FAFDF8] p-2 sm:p-3">
              <iframe
                src="https://www.canva.com/design/DAGlZMBzaxs/kfHOiechitv_JGXKeMXwCA/view?embed"
                className="h-[420px] w-full rounded-lg border-0 sm:h-[520px]"
                allowFullScreen
                title="Project Evaluation Simulation"
              />
            </div>
          </div>
        </EditorialReveal>
      </EditorialSection>
    </div>
  );
};

export default ProjectEvaluation;
