import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  FileText,
  Scale,
  Sparkles,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
} from "@/components/editorial/EditorialPagePrimitives";
import {
  calculateEvaluation,
  evaluationBand,
  evaluationBands,
  evaluationPhases,
  evaluationValues,
  parseEvaluationScore,
  type EvaluationAnswer,
  type EvaluationAnswers,
  type EvaluationPhase,
  type EvaluationWeights,
} from "../tools/evaluationScoring";

const phaseQuestions: Record<EvaluationPhase, string[]> = {
  design: [
    "Who are the key stakeholders, and what genuine needs does the project address?",
    "What outcomes are intended, and what activities and assumptions connect the project to those outcomes?",
    "Which values of worthwhile development are relevant, and how are they incorporated into the design?",
  ],
  implementation: [
    "How does actual delivery compare with the intended goals? Were activities completed and resources used efficiently?",
    "How did implementation respond to community needs, protect rights, and minimize harm?",
    "What negative externalities or unexpected challenges occurred? How significant were they, and did harms outweigh benefits?",
  ],
  outcomes: [
    "Did the project produce lasting institutional or behavioral change?",
    "Will benefits persist without continuing external support, and did unintended harms emerge?",
    "Do outcomes fit the local institutional, cultural, and economic context?",
    "Has the project gained legitimacy among stakeholders and policymakers?",
  ],
};

function bandVisualStyle(band: string | null) {
  switch (band) {
    case "Superior":
      return {
        stroke: "#187347",
        badge: "border-[#94B985] bg-[#EDF4E8] text-[#187347]",
        dot: "bg-[#187347]",
      };
    case "Good":
      return {
        stroke: "#3F673C",
        badge: "border-[#B2C9A8] bg-[#F2F6EF] text-[#284B26]",
        dot: "bg-[#3F673C]",
      };
    case "Developing":
      return {
        stroke: "#B78103",
        badge: "border-[#D6CE8A] bg-[#FAF8E4] text-[#6F5312]",
        dot: "bg-[#C28A0C]",
      };
    case "Poor":
      return {
        stroke: "#B43C3C",
        badge: "border-[#E3B2B2] bg-[#FDF2F2] text-[#8F2828]",
        dot: "bg-[#B43C3C]",
      };
    default:
      return {
        stroke: "#94B985",
        badge: "border-[#B2C9A8] bg-[#F2F6EF] text-[#596556]",
        dot: "bg-[#94B985]",
      };
  }
}

type Props = {
  phase: EvaluationPhase;
  onPhaseChange: (phase: EvaluationPhase) => void;
  answers: EvaluationAnswers;
  onAnswerChange: (phase: EvaluationPhase, answer: EvaluationAnswer) => void;
  weights: EvaluationWeights;
  onWeightChange: (phase: EvaluationPhase, weight: string) => void;
};

export default function PlanningEvaluation({
  phase,
  onPhaseChange,
  answers,
  onAnswerChange,
  weights,
  onWeightChange,
}: Props) {
  const reduced = useReducedMotion();
  const results = calculateEvaluation(answers, weights);
  const phaseIndex = evaluationPhases.findIndex((item) => item.id === phase);
  const currentPhase = evaluationPhases[phaseIndex];
  const answer = answers[phase] ?? {};
  const score = parseEvaluationScore(answer.score);
  const invalidScore = !!answer.score?.trim() && score === null;
  const currentBand = score !== null ? evaluationBand(score) : null;
  const totalBand =
    results.validWeights && results.total !== null
      ? evaluationBand(results.total)
      : null;

  const updateAnswer = (patch: Partial<EvaluationAnswer>) =>
    onAnswerChange(phase, { ...answer, ...patch });

  // SVG circular score gauge math
  const gaugeRadius = 64;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugePercent =
    results.validWeights && results.total !== null
      ? Math.max(0, Math.min(100, results.total))
      : 0;
  const gaugeOffset =
    gaugeCircumference - (gaugePercent / 100) * gaugeCircumference;
  const totalVisual = bandVisualStyle(totalBand);

  return (
    <div className="planning-evaluation space-y-8 text-[#202B20]">
      {/* Intro & Methodology Link */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border-[1.5px] border-[#B2C9A8] bg-[#F2F6EF] p-5 sm:flex-row sm:items-center">
        <p className="max-w-2xl text-sm leading-relaxed text-[#394838] sm:text-[15px]">
          Work through <strong>Design</strong>, <strong>Implementation</strong>,
          and <strong>Outcomes</strong> in order. Use the guiding questions and
          evidence to judge each phase, then assign one phase score.
        </p>
        <a
          href="/projectevalnewexternal.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border-[1.5px] border-[#3F673C] bg-white px-4 py-2 text-xs font-semibold text-[#284B26] transition-colors hover:bg-[#3F673C] hover:text-white"
        >
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Evaluation Methodology PDF</span>
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>

      {/* Phase Selector Cards */}
      <RadioGroup
        value={phase}
        onValueChange={(value) => onPhaseChange(value as EvaluationPhase)}
        aria-label="Evaluation phase"
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {evaluationPhases.map((item, index) => {
          const isSelected = phase === item.id;
          const phaseScore = parseEvaluationScore(answers[item.id]?.score);
          const phaseBand =
            phaseScore !== null ? evaluationBand(phaseScore) : null;
          const badgeStyle = bandVisualStyle(phaseBand);

          return (
            <div
              key={item.id}
              data-selected={isSelected}
              className={`relative overflow-hidden rounded-xl border-[1.5px] transition-all ${
                isSelected
                  ? "border-[#3F673C] bg-[#F2F6EF] shadow-sm"
                  : "border-[#B2C9A8] bg-white hover:border-[#3F673C] hover:bg-[#FAFDF8]"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId={reduced ? undefined : "eval-phase-accent"}
                  transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
                  className="absolute inset-x-0 top-0 h-1 bg-[#3F673C]"
                  aria-hidden="true"
                />
              )}
              <label className="flex h-full cursor-pointer items-start gap-3 p-4 sm:p-5">
                <RadioGroupItem
                  value={item.id}
                  className="mt-1 border-[#3F673C] text-[#3F673C] data-checked:border-[#3F673C] data-checked:bg-[#3F673C]"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <strong
                      className="text-base font-semibold text-[#202B20]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      0{index + 1}. {item.label}
                    </strong>
                    {phaseScore !== null ? (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${badgeStyle.badge}`}
                      >
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        {phaseScore.toFixed(0)}% · {phaseBand}
                      </span>
                    ) : (
                      <span className="rounded-full border border-[#DCE7D7] bg-white px-2 py-0.5 font-mono text-[10px] text-[#596556]">
                        Not scored
                      </span>
                    )}
                  </span>
                  <span className="text-xs leading-relaxed text-[#596556]">
                    {item.description}
                  </span>
                </span>
              </label>
            </div>
          );
        })}
      </RadioGroup>

      {/* Active Phase Workspace */}
      <motion.div
        key={phase}
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
        className="space-y-6"
      >
        {/* Phase Findings & Evidence */}
        <section
          aria-labelledby="evaluation-phase-heading"
          className="rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-5 sm:p-6"
        >
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#187347]">
            Phase 0{phaseIndex + 1} · Evidence Review
          </p>
          <h3
            id="evaluation-phase-heading"
            className="mt-1 text-xl font-semibold text-[#202B20] sm:text-2xl"
            style={EDITORIAL_SERIF_STYLE}
          >
            {currentPhase.label}: review the evidence
          </h3>

          <ul className="mt-4 space-y-2.5 rounded-xl border border-[#DCE7D7] bg-[#FAFDF8] p-4 text-sm leading-relaxed text-[#394838]">
            {phaseQuestions[phase].map((question) => (
              <li key={question} className="flex items-start gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#187347]"
                  aria-hidden="true"
                />
                <span>{question}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5">
            <label
              htmlFor={`phase-notes-${phase}`}
              className="block text-sm font-semibold text-[#284B26]"
            >
              Phase findings and evidence
            </label>
            <textarea
              id={`phase-notes-${phase}`}
              rows={5}
              value={answer.notes ?? ""}
              placeholder="Record your findings, evidence sources, benefits, harms, and uncertainties."
              onChange={(event) => updateAnswer({ notes: event.target.value })}
              className="mt-2 block w-full resize-y rounded-xl border-[1.5px] border-[#B2C9A8] bg-white px-4 py-3 text-sm leading-relaxed text-[#202B20] placeholder:text-[#7A8A77] focus:border-[#3F673C] focus:outline-none focus:ring-2 focus:ring-[#3F673C]/20"
            />
          </div>
        </section>

        {/* Seven Values Guiding Questions */}
        <section
          aria-labelledby="evaluation-values-heading"
          className="rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-5 sm:p-6"
        >
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#187347]">
            Ethical Criteria · 7 Values Rubric
          </p>
          <h3
            id="evaluation-values-heading"
            className="mt-1 text-xl font-semibold text-[#202B20] sm:text-2xl"
            style={EDITORIAL_SERIF_STYLE}
          >
            Seven values: guiding questions
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#596556]">
            Review the values relevant to this phase. Open each guide to record
            evidence, or explain why a value is not relevant. These notes inform
            your judgment; they are not automatically scored.
          </p>

          <div className="mt-5 space-y-3">
            {evaluationValues.map((value, idx) => {
              const hasNotes = Boolean(answer.valueNotes?.[value.id]?.trim());
              return (
                <details
                  key={`${phase}-${value.id}`}
                  className="planning-evaluation-guide group rounded-xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] transition-colors open:border-[#3F673C] open:bg-white"
                >
                  <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-[#202B20] sm:px-5">
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-[#187347]">
                        0{idx + 1}
                      </span>
                      <span style={EDITORIAL_SERIF_STYLE}>{value.label}</span>
                      {hasNotes && (
                        <span className="rounded-full border border-[#94B985] bg-[#EDF4E8] px-2 py-0.5 font-mono text-[10px] font-medium text-[#187347]">
                          Notes saved
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      className="planning-guide-chevron h-4 w-4 shrink-0 text-[#3F673C] transition-transform duration-200"
                      aria-hidden="true"
                    />
                  </summary>

                  <div className="space-y-4 border-t border-[#DCE7D7] px-4 py-4 sm:px-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {value.groups.map((group) => (
                        <div
                          key={group.title}
                          className="rounded-lg border border-[#DCE7D7] bg-[#F2F6EF]/60 p-3.5"
                        >
                          <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#284B26]">
                            {group.title}
                          </h4>
                          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[#394838]">
                            {group.questions.map((question) => (
                              <li
                                key={question}
                                className="flex items-start gap-2"
                              >
                                <span
                                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#187347]"
                                  aria-hidden="true"
                                />
                                <span>{question}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label
                        htmlFor={`notes-${phase}-${value.id}`}
                        className="block text-xs font-semibold uppercase tracking-wide text-[#284B26]"
                      >
                        {value.label}: evidence and observations
                      </label>
                      <textarea
                        id={`notes-${phase}-${value.id}`}
                        rows={3}
                        value={answer.valueNotes?.[value.id] ?? ""}
                        placeholder={`Record observations or note why ${value.label.toLowerCase()} is or isn’t applicable...`}
                        onChange={(event) =>
                          updateAnswer({
                            valueNotes: {
                              ...answer.valueNotes,
                              [value.id]: event.target.value,
                            },
                          })
                        }
                        className="mt-1.5 block w-full resize-y rounded-lg border-[1.5px] border-[#B2C9A8] bg-white px-3.5 py-2.5 text-sm text-[#202B20] placeholder:text-[#7A8A77] focus:border-[#3F673C] focus:outline-none focus:ring-2 focus:ring-[#3F673C]/20"
                      />
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        {/* Assign Phase Score */}
        <section className="rounded-2xl border-[1.5px] border-[#94B985] bg-[#FAFDF8] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#187347]">
                Phase Judgment
              </p>
              <h3
                className="mt-1 text-xl font-semibold text-[#202B20] sm:text-2xl"
                style={EDITORIAL_SERIF_STYLE}
              >
                Assign the {currentPhase.label.toLowerCase()} phase score
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#596556]">
                Using the evidence above, judge how well this phase met the
                ethical criteria. 0% represents complete failure and 100%
                complete success.
              </p>
            </div>
            {currentBand && (
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                  bandVisualStyle(currentBand).badge
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    bandVisualStyle(currentBand).dot
                  }`}
                  aria-hidden="true"
                />
                {currentBand}
              </span>
            )}
          </div>

          {/* 4-Band Reference Strip */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {evaluationBands.map((band) => {
              const active = currentBand === band.label;
              return (
                <div
                  key={band.label}
                  className={`rounded-lg border px-3 py-2 text-xs transition-colors ${
                    active
                      ? "border-[#3F673C] bg-[#EDF4E8] text-[#202B20] shadow-xs"
                      : "border-[#DCE7D7] bg-white text-[#596556]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 font-semibold">
                    <span>{band.label}</span>
                    <span className="font-mono text-[11px] text-[#187347]">
                      {band.range}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-12">
            <div className="md:col-span-4">
              <label
                htmlFor={`phase-score-${phase}`}
                className="block text-sm font-semibold text-[#284B26]"
              >
                {currentPhase.label} score (%)
              </label>
              <Input
                id={`phase-score-${phase}`}
                type="number"
                min={0}
                max={100}
                step="any"
                inputMode="decimal"
                placeholder="0 – 100"
                value={answer.score ?? ""}
                onChange={(event) =>
                  updateAnswer({ score: event.target.value })
                }
                aria-invalid={invalidScore}
                aria-describedby="phase-score-feedback"
                className="mt-2 h-11 rounded-xl border-[1.5px] border-[#B2C9A8] bg-white px-3.5 text-base font-semibold text-[#202B20] focus-visible:border-[#3F673C] focus-visible:ring-[#3F673C]/20"
              />
              <p
                id="phase-score-feedback"
                role="status"
                className={`mt-2 text-xs font-medium ${
                  invalidScore ? "text-[#B43C3C]" : "text-[#284B26]"
                }`}
              >
                {invalidScore
                  ? "Enter a score between 0 and 100."
                  : score === null
                    ? "Not scored yet"
                    : `Classification: ${evaluationBand(score)}`}
              </p>
            </div>

            <div className="md:col-span-8">
              <label
                htmlFor={`phase-rationale-${phase}`}
                className="block text-sm font-semibold text-[#284B26]"
              >
                Reason for this score
              </label>
              <textarea
                id={`phase-rationale-${phase}`}
                rows={4}
                value={answer.rationale ?? ""}
                placeholder="Explain how your evidence supports this score and classification."
                onChange={(event) =>
                  updateAnswer({ rationale: event.target.value })
                }
                className="mt-2 block w-full resize-y rounded-xl border-[1.5px] border-[#B2C9A8] bg-white px-4 py-3 text-sm leading-relaxed text-[#202B20] placeholder:text-[#7A8A77] focus:border-[#3F673C] focus:outline-none focus:ring-2 focus:ring-[#3F673C]/20"
              />
            </div>
          </div>
        </section>

        {/* Phase Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={phaseIndex === 0}
            onClick={() =>
              onPhaseChange(evaluationPhases[phaseIndex - 1].id)
            }
            className="min-h-[44px] cursor-pointer rounded-full border-[1.5px] border-[#B2C9A8] bg-white px-5 text-sm font-semibold text-[#284B26] hover:border-[#3F673C] hover:bg-[#F2F6EF]"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Previous phase
          </Button>
          {phaseIndex < evaluationPhases.length - 1 && (
            <Button
              type="button"
              disabled={score === null}
              onClick={() =>
                onPhaseChange(evaluationPhases[phaseIndex + 1].id)
              }
              className="min-h-[44px] cursor-pointer rounded-full bg-[#3F673C] px-6 text-sm font-semibold text-white hover:bg-[#284B26] disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next phase
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </motion.div>

      {/* Weighted Results & Animated SVG Score Gauge */}
      <section
        className="rounded-2xl border-[1.5px] border-[#3F673C] bg-[#F2F6EF] p-5 sm:p-7"
        aria-labelledby="evaluation-results-title"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3F673C] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#E9E6B2]">
            <Scale className="h-3 w-3" aria-hidden="true" />
            Weighted Composite Score
          </span>
        </div>

        <h3
          id="evaluation-results-title"
          className="mt-2.5 text-2xl font-semibold text-[#202B20]"
          style={EDITORIAL_SERIF_STYLE}
        >
          Combine the three phase scores
        </h3>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[#394838]">
          The overall score combines your three phase judgments. Equal weights
          of 1 give their average. You may give a phase more weight to reflect
          your project&apos;s goals; weights are relative and do not need to
          total 100.
        </p>

        <div className="mt-6 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          {/* Phase Weight Inputs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-8">
            {results.phases.map((item) => {
              const itemBand =
                item.score !== null ? evaluationBand(item.score) : null;
              const style = bandVisualStyle(itemBand);

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border-[1.5px] border-[#B2C9A8] bg-white p-4"
                >
                  <div>
                    <h4
                      className="text-base font-semibold text-[#202B20]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {item.label}
                    </h4>
                    <p className="mt-1 text-xs font-medium text-[#596556]">
                      {item.score === null ? (
                        "Not scored"
                      ) : (
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${style.badge}`}
                        >
                          {item.score.toFixed(1)}% – {itemBand}
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor={`weight-${item.id}`}
                      className="block text-xs font-semibold text-[#284B26]"
                    >
                      {item.label} weight
                    </label>
                    <Input
                      id={`weight-${item.id}`}
                      type="number"
                      min={0}
                      step="any"
                      inputMode="decimal"
                      value={weights[item.id]}
                      onChange={(event) =>
                        onWeightChange(item.id, event.target.value)
                      }
                      className="mt-1.5 h-10 rounded-lg border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] font-mono text-sm font-semibold text-[#202B20] focus-visible:border-[#3F673C]"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Animated SVG Circular Gauge Card */}
          <div className="flex flex-col items-center justify-center rounded-2xl border-[1.5px] border-[#94B985] bg-white p-6 text-center shadow-xs lg:col-span-4">
            <div className="relative flex h-40 w-40 items-center justify-center">
              <svg
                viewBox="0 0 160 160"
                className="h-full w-full -rotate-90"
                aria-hidden="true"
              >
                <circle
                  cx="80"
                  cy="80"
                  r={gaugeRadius}
                  fill="none"
                  stroke="#DCE7D7"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r={gaugeRadius}
                  fill="none"
                  stroke={totalVisual.stroke}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={gaugeCircumference}
                  initial={false}
                  animate={{ strokeDashoffset: gaugeOffset }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 0.7, ease: EDITORIAL_EASE }
                  }
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-3xl font-bold tracking-tight text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {results.validWeights && results.total !== null
                    ? `${results.total.toFixed(1)}%`
                    : "—%"}
                </span>
                <span className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#596556]">
                  Overall Score
                </span>
              </div>
            </div>

            {totalBand ? (
              <span
                className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold ${totalVisual.badge}`}
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {totalBand} Rating
              </span>
            ) : (
              <span className="mt-3 rounded-full border border-[#DCE7D7] bg-[#F2F6EF] px-3 py-1 text-xs font-medium text-[#596556]">
                Awaiting all 3 phase scores
              </span>
            )}
          </div>
        </div>

        {/* Accessible Status Bar */}
        <p
          role="status"
          className={`mt-5 rounded-xl border-[1.5px] px-4 py-3 text-sm font-semibold ${
            !results.validWeights
              ? "border-[#E3B2B2] bg-[#FDF2F2] text-[#8F2828]"
              : results.total === null
                ? "border-[#B2C9A8] bg-white text-[#394838]"
                : "border-[#3F673C] bg-[#3F673C] text-white"
          }`}
        >
          {!results.validWeights
            ? "Use non-negative weights, with at least one greater than zero."
            : results.total === null
              ? "Assign a valid score to all three phases to calculate the overall score."
              : `Overall score: ${results.total.toFixed(1)}% - ${evaluationBand(
                  results.total,
                )}`}
        </p>
      </section>
    </div>
  );
}
