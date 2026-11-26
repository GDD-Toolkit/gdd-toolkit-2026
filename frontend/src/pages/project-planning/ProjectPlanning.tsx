import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./ProjectPlanning.css";
import { getProjectPlanningTools } from "@/api/strapi";
import type { ProjectPlanningTool } from "./ToolModal";

import ToolModal from "./ToolModal";
import PlanningEvaluation from "./PlanningEvaluation";
import {
  calculateEvaluation,
  type EvaluationAnswers,
  type EvaluationPhase,
  type EvaluationWeights,
} from "../tools/evaluationScoring";
import { matchKeywords } from "./keywordMatching";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Checkbox } from "../../components/ui/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../components/ui/hover-card";
import { AspectRatio } from "../../components/ui/aspect-ratio";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialReveal,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import {
  ArrowLeft,
  ArrowRight,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ClipboardList,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Target,
  X,
} from "lucide-react";

const toolsBatchSize = 6;

const wizardSteps = [
  {
    number: "01",
    label: "Framework Intro",
    summary: "Understand the planning lifecycle and core benefits.",
  },
  {
    number: "02",
    label: "Select Tools",
    summary: "Filter methodologies and build your project toolkit.",
  },
  {
    number: "03",
    label: "Evaluation",
    summary: "Score Design, Implementation, and Outcomes ethically.",
  },
] as const;

function ToolCardTrigger(props: React.ComponentProps<"div">) {
  // Radix HoverCard cancels touchstart by default. These cards contain buttons
  // so preserve native taps and page scrolling.
  return <div {...props} onTouchStart={undefined} />;
}

const planningBenefits = [
  {
    number: "01",
    title: "Define Goals",
    icon: Target,
    description:
      "Clarify the problem, who your project serves, and what success looks like. Align your team around shared goals, roles, and milestones.",
  },
  {
    number: "02",
    title: "Measure Impact",
    icon: ChartNoAxesCombined,
    description:
      "Choose indicators to track progress and assess how your project supports well-being, equality, and sustainability.",
  },
  {
    number: "03",
    title: "Iterate",
    icon: RefreshCw,
    description:
      "Use feedback and evidence to revisit your assumptions, refine your plan, and improve your project as you learn.",
  },
];

const typeBadgeStyles: Record<string, string> = {
  "Six Sigma": "border-[#A2B7D8] bg-[#EFF4FA] text-[#2F4868]",
  "Process Mapping": "border-[#D6CE8A] bg-[#FAF8E4] text-[#5C4E22]",
  "Decision Making": "border-[#D9B8C4] bg-[#FDF2F6] text-[#6B2D46]",
  "User-Centric": "border-[#94B985] bg-[#EDF4E8] text-[#187347]",
  "Efficiency/Innovation": "border-[#DFC09C] bg-[#FCF4EC] text-[#7A4419]",
  "Quality Management": "border-[#C4B8DF] bg-[#F4F1FA] text-[#4B367C]",
};

const timeBadgeStyles: Record<string, string> = {
  "Short-term": "border-[#94B985] bg-[#EDF4E8] text-[#284B26]",
  "Long-term": "border-[#D6CE8A] bg-[#F6F4D8] text-[#5E5128]",
};

const ProjectPlanning: React.FC = () => {
  const reduced = useReducedMotion();
  const [tools, setTools] = useState<ProjectPlanningTool[]>([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const [toolsError, setToolsError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoadingTools(true);
    setToolsError(null);
    getProjectPlanningTools(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setTools(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setToolsError(
            "We couldn’t load the planning tools. Please try again.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingTools(false);
      });
    return () => controller.abort();
  }, [loadAttempt]);

  const [step, setStep] = useState(1);
  const [evaluationPhase, setEvaluationPhase] =
    useState<EvaluationPhase>("design");
  const [evaluationAnswers, setEvaluationAnswers] = useState<EvaluationAnswers>(
    {},
  );
  const [evaluationWeights, setEvaluationWeights] = useState<EvaluationWeights>(
    { design: "1", implementation: "1", outcomes: "1" },
  );
  const [previewSide, setPreviewSide] = useState<"left" | "right">("right");
  const [previewTopInset, setPreviewTopInset] = useState(16);

  useEffect(() => {
    const headers = [
      ...document.querySelectorAll<HTMLElement>("[data-site-header]"),
    ];
    const updateHeaderBoundary = () => {
      const bottom = Math.max(
        0,
        ...headers.map((header) => header.getBoundingClientRect().bottom),
      );
      setPreviewTopInset(bottom + 16);
    };
    const observer = new ResizeObserver(updateHeaderBoundary);
    headers.forEach((header) => observer.observe(header));
    const frame = requestAnimationFrame(updateHeaderBoundary);
    window.addEventListener("resize", updateHeaderBoundary);
    window.addEventListener("scroll", updateHeaderBoundary, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderBoundary);
      window.removeEventListener("scroll", updateHeaderBoundary);
    };
  }, []);

  const updatePreviewSide = (card: HTMLDivElement) => {
    const bounds = card.getBoundingClientRect();
    setPreviewSide(
      bounds.left + bounds.width / 2 < window.innerWidth / 2 ? "right" : "left",
    );
  };

  // Keeps chosen tools selected when moving between steps
  const [selectedToolNames, setSelectedToolNames] = useState<string[]>([]);
  const toggleToolSelection = (toolName: string) => {
    setSelectedToolNames((previous) =>
      previous.includes(toolName)
        ? previous.filter((name) => name !== toolName)
        : [...previous, toolName],
    );
  };

  // === Search State ===
  const [search, setSearch] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [keywordFeedback, setKeywordFeedback] = useState("");
  const [visibleCount, setVisibleCount] = useState(toolsBatchSize);
  const [toolColumns, setToolColumns] = useState(1);
  const [toolsGrid, setToolsGrid] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!toolsGrid) return;
    const updateColumns = () => {
      if (!toolsGrid.clientWidth) return;
      const columns = getComputedStyle(toolsGrid)
        .gridTemplateColumns.trim()
        .split(/\s+/).length;
      setToolColumns(Math.max(1, columns));
    };
    updateColumns();
    const observer = new ResizeObserver(updateColumns);
    observer.observe(toolsGrid);
    return () => observer.disconnect();
  }, [toolsGrid]);

  const toolTriggerRef = useRef<HTMLButtonElement | null>(null);
  const keywords = [
    ...new Set(tools.flatMap((tool) => [...tool.type, ...tool.time])),
  ].sort();

  // === Modal State ===
  const [selectedTool, setSelectedTool] = useState<ProjectPlanningTool | null>(
    null,
  );

  const filteredTools = tools.filter((t) => {
    const term = search.trim().toLowerCase();
    return (
      (selectedKeywords.length === 0 ||
        selectedKeywords.some(
          (keyword) => t.type.includes(keyword) || t.time.includes(keyword),
        )) &&
      (t.name.toLowerCase().includes(term) ||
        t.type.some((ty) => ty.toLowerCase().includes(term)) ||
        t.time.some((ti) => ti.toLowerCase().includes(term)))
    );
  });

  // Round up to complete rows at every responsive grid width.
  const fullRowCount = Math.ceil(visibleCount / toolColumns) * toolColumns;
  const visibleTools = filteredTools.slice(0, fullRowCount);

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((previous) =>
      previous.includes(keyword)
        ? previous.filter((value) => value !== keyword)
        : [...previous, keyword],
    );
    setVisibleCount(toolsBatchSize);
  };

  const addTypedKeywords = () => {
    const matches = matchKeywords(search, keywords);
    if (!matches.length) {
      setKeywordFeedback(
        "No matching keywords. Try another term or choose from the list.",
      );
      return;
    }
    const additions = matches.filter(
      (keyword) => !selectedKeywords.includes(keyword),
    );
    setSelectedKeywords((previous) => [...new Set([...previous, ...matches])]);
    setKeywordFeedback(
      additions.length
        ? `Added: ${additions.join(", ")}.`
        : "Those keywords are already selected.",
    );
    setSearch("");
    setVisibleCount(toolsBatchSize);
  };

  const goToStep = (nextStep: number) => {
    setSelectedTool(null);
    setStep(Math.max(1, Math.min(wizardSteps.length, nextStep)));
  };

  const evalSummary = calculateEvaluation(evaluationAnswers, evaluationWeights);
  const scoredPhasesCount = evalSummary.phases.filter(
    (p) => p.score !== null,
  ).length;

  return (
    <div className="planning-page">

      {/* Editorial Forest Hero */}
      <EditorialPageHero
        ariaLabel="Project Planning introduction"
        backLink={{ label: "Back to Toolkit", to: "/" }}
        badges={[
          { label: "06 · PLANNING SUITE", tone: "cream" },
          { label: "3-Step Interactive Workflow", tone: "sage" },
        ]}
        title={
          <>
            Project{" "}
            <em className="font-normal italic text-[#E9E6B2]">Planning</em>
          </>
        }
        subtitle={
          <>
            Project planning is the{" "}
            <strong className="font-semibold text-white">
              organization of people, deadlines, methodology, and objectives
            </strong>{" "}
            to streamline the production of a good, product, or goal. In a
            development context, that means planning to create an{" "}
            <strong className="font-semibold text-white">
              effective, sustainable, and worthwhile project
            </strong>
            , from infrastructure to social services.
          </>
        }
        actions={
          <>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#E9E6B2] px-6 py-3 text-sm font-semibold text-[#202B20] shadow-sm transition-all hover:bg-[#f2efbf] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C]"
            >
              Browse Planning Tools
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#9AB887] bg-[#2E502B] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#254223] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C]"
            >
              Jump to Evaluation
            </button>
          </>
        }
        aside={
          <div className="rounded-2xl border-[1.5px] border-[#E9E6B2]/75 bg-[#284B26]/90 p-5 text-white shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-[#9AB887]/35 pb-3">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#E9E6B2]">
                Interactive Workflow
              </span>
              <span className="rounded-full border border-[#9AB887]/60 bg-[#355832] px-2.5 py-0.5 font-mono text-[10px] text-[#EDF4E8]">
                Step {step} / {wizardSteps.length}
              </span>
            </div>

            <ol className="mt-3.5 space-y-2.5">
              {wizardSteps.map((item, idx) => {
                const stepNum = idx + 1;
                const isActive = step === stepNum;
                const meta =
                  stepNum === 2
                    ? `${selectedToolNames.length} selected`
                    : stepNum === 3
                      ? `${scoredPhasesCount}/3 phases scored`
                      : "Video + 3 pillars";

                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => goToStep(stepNum)}
                      className={`relative flex w-full cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors ${
                        isActive
                          ? "border-[#E9E6B2] bg-[#3F673C] text-white"
                          : "border-[#9AB887]/35 bg-[#203D1F]/55 text-[#E8F0E5] hover:border-[#9AB887] hover:bg-[#2E502B]"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId={
                            reduced ? undefined : "hero-workflow-step-dot"
                          }
                          transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
                          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E9E6B2] font-mono text-[11px] font-bold text-[#202B20]"
                        >
                          {item.number}
                        </motion.span>
                      )}
                      {!isActive && (
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#9AB887]/60 font-mono text-[11px] font-medium text-[#E9E6B2]">
                          {item.number}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span
                            className="text-sm font-semibold"
                            style={EDITORIAL_SERIF_STYLE}
                          >
                            {item.label}
                          </span>
                          <span className="font-mono text-[10px] text-[#E9E6B2]/90">
                            {meta}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs text-[#D5E3D1]">
                          {item.summary}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        }
      />

      {/* Parent state preserves selections, filters, and evaluation across all three panels. */}
      <Tabs
        value={String(step)}
        onValueChange={(value) => goToStep(Number(value))}
        className="w-full gap-0"
      >
        {/* Sage Progress & Stepper Ribbon */}
        <div className="border-b border-[#B2C9A8] bg-[#F2F6EF]">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <p
              className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#187347] sm:hidden"
              aria-live="polite"
            >
              Step {step} of {wizardSteps.length}: {wizardSteps[step - 1].label}
            </p>

            <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between">
              <TabsList
                className="hidden !h-auto w-full grid-cols-3 gap-1.5 rounded-xl border border-[#B2C9A8] bg-white p-1.5 sm:grid md:w-auto"
                aria-label="Project planning steps"
              >
                {wizardSteps.map((item, index) => {
                  const stepNum = index + 1;
                  const active = step === stepNum;
                  return (
                    <TabsTrigger
                      key={item.label}
                      value={String(stepNum)}
                      className="relative min-h-[42px] cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold text-[#394838] transition-colors data-active:bg-transparent data-active:text-white data-active:shadow-none sm:text-sm"
                    >
                      {active && (
                        <motion.span
                          layoutId={
                            reduced ? undefined : "planning-active-step-pill"
                          }
                          transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
                          className="absolute inset-0 rounded-lg bg-[#3F673C] shadow-xs"
                          aria-hidden="true"
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <span
                          className={`font-mono text-[11px] ${
                            active ? "text-[#E9E6B2]" : "text-[#187347]"
                          }`}
                        >
                          {item.number}
                        </span>
                        <span>{item.label}</span>
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <div className="flex items-center justify-between gap-3 md:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={step === 1}
                  onClick={() => goToStep(step - 1)}
                  className="min-h-[40px] cursor-pointer rounded-full border-[1.5px] border-[#B2C9A8] bg-white px-4 text-xs font-semibold text-[#284B26] hover:border-[#3F673C] hover:bg-[#FAFDF8] disabled:opacity-45 sm:text-sm"
                >
                  <ArrowLeft className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  Back
                </Button>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#94B985] bg-white px-3.5 py-1.5 font-mono text-xs font-medium text-[#284B26]">
                  <ClipboardList
                    className="h-3.5 w-3.5 text-[#187347]"
                    aria-hidden="true"
                  />
                  {selectedToolNames.length}{" "}
                  {selectedToolNames.length === 1 ? "tool" : "tools"} selected
                </span>

                <Button
                  type="button"
                  disabled={step === wizardSteps.length}
                  onClick={() => goToStep(step + 1)}
                  className="min-h-[40px] cursor-pointer rounded-full bg-[#3F673C] px-4 text-xs font-semibold text-white hover:bg-[#284B26] disabled:opacity-45 sm:text-sm"
                >
                  Next
                  <ArrowRight
                    className="ml-1 h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </div>

            <div className="mt-3.5">
              <Progress
                value={(step / wizardSteps.length) * 100}
                aria-label="Project planning progress"
                aria-valuenow={step}
                aria-valuemin={1}
                aria-valuemax={wizardSteps.length}
                aria-valuetext={`Step ${step} of ${wizardSteps.length}: ${wizardSteps[step - 1].label}`}
                className="h-1.5 bg-[#DCE7D7] [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-[#3F673C] [&>[data-slot=progress-indicator]]:to-[#187347]"
              />
            </div>
          </div>
        </div>

        {/* --- Step 1: Framework Intro --- */}
        <TabsContent value="1" className="mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key="step-1"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
            >
              <EditorialSection tone="white" compact>
                <EditorialSectionHeader
                  eyebrow="01 / Framework Overview"
                  title="Project Planning Process"
                  description="Structured documentation of timelines, roles, and ethical milestones keeps development work accountable from concept to completion."
                />

                <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                  <div className="space-y-4 lg:col-span-5">
                    <div className="rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-6">
                      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#187347]">
                        Why Structure Matters
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-[#394838] sm:text-base">
                        Effective project planning aims to properly document
                        managerial elements needed for the successful completion
                        of projects. Identifying primary aspects of project
                        planning allows project management to control each stage
                        of the project development and allows for the project
                        timeline, roles, and responsibilities to be effectively
                        designed and implemented.
                      </p>
                      <div className="mt-5 border-t border-[#DCE7D7] pt-4">
                        <button
                          type="button"
                          onClick={() => goToStep(2)}
                          className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#3F673C] transition-colors hover:text-[#187347]"
                        >
                          Continue to Select Tools
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="overflow-hidden rounded-2xl border-[1.5px] border-[#94B985] bg-[#202B20] p-1.5 shadow-lg">
                      <div className="overflow-hidden rounded-xl">
                        <AspectRatio ratio={16 / 9}>
                          <iframe
                            src="https://youtube.com/embed/EiaChYQll-0"
                            title="Project Planning Process Tutorial Video"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="h-full w-full border-0"
                          />
                        </AspectRatio>
                      </div>
                    </div>
                  </div>
                </div>
              </EditorialSection>

              <EditorialSection
                tone="sage"
                compact
                ariaLabelledBy="planning-benefits-title"
              >
                <EditorialSectionHeader
                  eyebrow="02 / Core Benefits"
                  title="Why Project Plan?"
                  titleId="planning-benefits-title"
                  description="Three interconnected disciplines turn ethical values into repeatable operational habits."
                />

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {planningBenefits.map(
                    ({ number, title, icon: Icon, description }, idx) => (
                      <EditorialReveal key={title} delay={idx * 0.08}>
                        <motion.div
                          whileHover={reduced ? undefined : { y: -3 }}
                          transition={{ duration: 0.2 }}
                          className="flex h-full flex-col rounded-xl border-[1.5px] border-[#B2C9A8] bg-white p-6 transition-colors hover:border-[#3F673C] hover:bg-[#FAFDF8]"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-semibold text-[#187347]">
                              {number}
                            </span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDF4E8] text-[#187347]">
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          </div>
                          <h3
                            className="mt-4 text-xl font-semibold text-[#202B20]"
                            style={EDITORIAL_SERIF_STYLE}
                          >
                            {title}
                          </h3>
                          <p className="mt-2.5 text-sm leading-relaxed text-[#596556]">
                            {description}
                          </p>
                        </motion.div>
                      </EditorialReveal>
                    ),
                  )}
                </div>

                <div className="mt-10 flex justify-center">
                  <Button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="min-h-[46px] cursor-pointer rounded-full bg-[#3F673C] px-7 text-sm font-semibold text-white hover:bg-[#284B26]"
                  >
                    Start Selecting Planning Tools
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </EditorialSection>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* --- Step 2: Select Tools --- */}
        <TabsContent value="2" className="mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key="step-2"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
            >
              <EditorialSection tone="white" compact>
                <EditorialSectionHeader
                  eyebrow="02 / Methodology Catalog"
                  title="Project Planning Tools"
                  description="Click any tool title for a free training module, or select multiple tools to assemble your project plan."
                />

                <p className="mt-4 max-w-4xl text-sm leading-relaxed text-[#394838] sm:text-base">
                  These are various types of software, tables, charts,
                  infographics, and method of thought to help our users develop
                  their own projects. They can help you understand how to manage
                  your own enterprises, track your progress, and organize every
                  piece of our business or project development process. Each box
                  is a different tool, and if you click on the name, you’ll be
                  taken to a free training module to teach you to use this tool,
                  and how it can apply to your specific goal or idea.
                </p>

                {/* Editorial Search & Filter Panel */}
                <div className="mt-7 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#F2F6EF] p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <Search
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3F673C]"
                        aria-hidden="true"
                      />
                      <input
                        type="text"
                        placeholder="Search tools or type a keyword..."
                        value={search}
                        aria-label="Search planning tools"
                        aria-describedby="planning-keyword-feedback"
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setKeywordFeedback("");
                          setVisibleCount(toolsBatchSize);
                        }}
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" &&
                            !event.nativeEvent.isComposing
                          ) {
                            event.preventDefault();
                            addTypedKeywords();
                          }
                        }}
                        className="min-h-[46px] w-full rounded-xl border-[1.5px] border-[#B2C9A8] bg-white py-2.5 pl-10 pr-10 text-sm text-[#202B20] placeholder:text-[#6E7E6C] focus:border-[#3F673C] focus:outline-none focus:ring-2 focus:ring-[#3F673C]/20 sm:text-base"
                      />
                      {search && (
                        <button
                          type="button"
                          aria-label="Clear search"
                          onClick={() => {
                            setSearch("");
                            setKeywordFeedback("");
                            setVisibleCount(toolsBatchSize);
                          }}
                          className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#596556] hover:bg-[#EDF4E8] hover:text-[#202B20]"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          type="button"
                          aria-label="Filter tools by keywords"
                          className="min-h-[46px] shrink-0 cursor-pointer justify-between gap-2 rounded-xl border-[1.5px] border-[#B2C9A8] bg-white px-4 text-sm font-semibold text-[#284B26] hover:border-[#3F673C] hover:bg-[#FAFDF8] sm:min-w-[13rem]"
                        >
                          <span className="flex items-center gap-2">
                            <SlidersHorizontal
                              className="h-4 w-4 text-[#187347]"
                              aria-hidden="true"
                            />
                            {selectedKeywords.length
                              ? `${selectedKeywords.length} keywords selected`
                              : "All keywords"}
                          </span>
                          <ChevronDown
                            className="h-4 w-4 text-[#596556]"
                            aria-hidden="true"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="planning-keyword-options w-72 p-3"
                        collisionPadding={16}
                        align="end"
                      >
                        <div className="flex items-center justify-between border-b border-[#DCE7D7] pb-2">
                          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#187347]">
                            Filter by Keyword
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedKeywords([]);
                              setSearch("");
                              setKeywordFeedback("");
                              setVisibleCount(toolsBatchSize);
                            }}
                            className="h-7 cursor-pointer rounded-full border-[#B2C9A8] px-2.5 text-xs text-[#284B26] hover:bg-[#F2F6EF]"
                          >
                            All keywords
                          </Button>
                        </div>
                        <p className="mt-2 text-xs text-[#596556]">
                          Match any selected keyword.
                        </p>
                        <div className="mt-1.5 space-y-0.5">
                          {keywords.map((value) => (
                            <label
                              key={value}
                              className="planning-keyword-option text-sm text-[#202B20]"
                            >
                              <Checkbox
                                checked={selectedKeywords.includes(value)}
                                onCheckedChange={() => toggleKeyword(value)}
                                className="border-[#94B985] data-checked:border-[#3F673C] data-checked:bg-[#3F673C]"
                              />
                              <span>{value}</span>
                            </label>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <p
                    id="planning-keyword-feedback"
                    role="status"
                    className="mt-2.5 text-xs text-[#596556]"
                  >
                    {keywordFeedback ||
                      "Press Enter to add matching keywords. Partial names and minor typos work too."}
                  </p>

                  {/* Active Keyword Filter Chips */}
                  <AnimatePresence>
                    {selectedKeywords.length > 0 && (
                      <motion.ul
                        initial={reduced ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={reduced ? undefined : { opacity: 0, height: 0 }}
                        className="mt-3 flex flex-wrap items-center gap-2 overflow-hidden"
                        aria-label="Selected keywords"
                      >
                        {selectedKeywords.map((value) => (
                          <li
                            key={value}
                            className="inline-flex items-center gap-1 rounded-full border border-[#94B985] bg-white pl-3 pr-1 text-xs font-semibold text-[#284B26]"
                          >
                            <span>{value}</span>
                            <button
                              type="button"
                              aria-label={`Remove ${value} filter`}
                              onClick={() => toggleKeyword(value)}
                              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[#3F673C] transition-colors hover:bg-[#EDF4E8]"
                            >
                              <X className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {/* Selected Tools Summary Bar */}
                <AnimatePresence>
                  {selectedToolNames.length > 0 && (
                    <motion.div
                      initial={reduced ? false : { opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
                      className="mt-5 flex flex-col justify-between gap-3 rounded-2xl border-[1.5px] border-[#3F673C] bg-[#F6F4D8]/85 px-5 py-4 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#284B26]">
                          Your Selected Toolkit ({selectedToolNames.length})
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {selectedToolNames.map((name) => (
                            <span
                              key={name}
                              className="inline-flex items-center gap-1 rounded-full border border-[#94B985] bg-white pl-3 pr-1.5 py-0.5 text-xs font-medium text-[#202B20]"
                            >
                              <span>{name}</span>
                              <button
                                type="button"
                                aria-label={`Remove ${name}`}
                                onClick={() => toggleToolSelection(name)}
                                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-[#596556] hover:bg-[#EDF4E8] hover:text-[#202B20]"
                              >
                                <X className="h-3 w-3" aria-hidden="true" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedToolNames([])}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#B2C9A8] bg-white px-3 py-2 text-xs font-semibold text-[#596556] hover:border-[#3F673C] hover:text-[#202B20]"
                        >
                          <RotateCcw className="h-3 w-3" aria-hidden="true" />
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => goToStep(3)}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#3F673C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#284B26]"
                        >
                          Evaluate Plan
                          <ArrowRight
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tools Grid Viewport */}
                <div
                  className="mt-7"
                  role="region"
                  aria-label="Available planning tools"
                >
                  {loadingTools && (
                    <div className="space-y-4">
                      <p
                        role="status"
                        className="font-mono text-xs uppercase tracking-wider text-[#187347]"
                      >
                        Loading planning tools…
                      </p>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="h-64 animate-pulse rounded-xl border-[1.5px] border-[#DCE7D7] bg-[#F2F6EF]/70 p-5"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {toolsError && (
                    <div
                      role="alert"
                      className="flex flex-col items-center gap-4 rounded-2xl border-[1.5px] border-[#E3B2B2] bg-[#FDF2F2] p-8 text-center"
                    >
                      <p className="text-sm font-medium text-[#8F2828]">
                        {toolsError}
                      </p>
                      <Button
                        type="button"
                        onClick={() => setLoadAttempt((value) => value + 1)}
                        className="cursor-pointer rounded-full bg-[#3F673C] px-5 text-white hover:bg-[#284B26]"
                      >
                        Try again
                      </Button>
                    </div>
                  )}

                  <div
                    id="planning-tools-grid"
                    className="tools-grid"
                    ref={setToolsGrid}
                  >
                    {!loadingTools &&
                      !toolsError &&
                      filteredTools.length === 0 && (
                        <div
                          className="col-span-full rounded-2xl border-[1.5px] border-dashed border-[#B2C9A8] bg-[#F2F6EF]/60 px-6 py-12 text-center"
                          role="status"
                        >
                          <p
                            className="text-lg font-semibold text-[#202B20]"
                            style={EDITORIAL_SERIF_STYLE}
                          >
                            {tools.length
                              ? "No tools match your search."
                              : "No planning tools are available yet."}
                          </p>
                          {(search || selectedKeywords.length > 0) && (
                            <button
                              type="button"
                              onClick={() => {
                                setSearch("");
                                setSelectedKeywords([]);
                                setKeywordFeedback("");
                                setVisibleCount(toolsBatchSize);
                              }}
                              className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] border-[#3F673C] bg-white px-4 py-2 text-xs font-semibold text-[#284B26] hover:bg-[#3F673C] hover:text-white"
                            >
                              Reset filters
                            </button>
                          )}
                        </div>
                      )}

                    {visibleTools.map((tool) => {
                      const isSelected = selectedToolNames.includes(tool.name);
                      return (
                        <HoverCard
                          key={tool.name}
                          openDelay={150}
                          closeDelay={150}
                        >
                          <HoverCardTrigger asChild>
                            <ToolCardTrigger
                              className={`group relative flex min-w-0 flex-col justify-between gap-4 rounded-xl border-[1.5px] p-5 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                                isSelected
                                  ? "border-[#3F673C] bg-[#F2F6EF] shadow-sm ring-1 ring-[#3F673C]/15"
                                  : "border-[#B2C9A8] bg-white hover:border-[#3F673C] hover:bg-[#FAFDF8]"
                              }`}
                              onPointerEnter={(event) =>
                                updatePreviewSide(event.currentTarget)
                              }
                              onFocusCapture={(event) =>
                                updatePreviewSide(event.currentTarget)
                              }
                            >
                              {/* Selected Corner Check Badge */}
                              {isSelected && (
                                <span
                                  aria-hidden="true"
                                  className="pointer-events-none absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#187347] text-white shadow-xs"
                                >
                                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                </span>
                              )}

                              <div>
                                {tool.image && (
                                  <div className="mb-4 overflow-hidden rounded-lg border border-[#DCE7D7] bg-white p-2.5">
                                    <img
                                      src={tool.image}
                                      alt={tool.name}
                                      className="aspect-[16/10] w-full object-contain"
                                    />
                                  </div>
                                )}

                                <h3
                                  className="text-lg font-semibold leading-snug text-[#202B20]"
                                  style={EDITORIAL_SERIF_STYLE}
                                >
                                  <button
                                    className="planning-tool-details-trigger min-h-[44px] w-full text-left transition-colors group-hover:text-[#187347]"
                                    type="button"
                                    aria-label={`View ${tool.name} details`}
                                    aria-haspopup="dialog"
                                    onClick={(event) => {
                                      toolTriggerRef.current =
                                        event.currentTarget;
                                      setSelectedTool(tool);
                                    }}
                                  >
                                    {tool.name}
                                  </button>
                                </h3>

                                <div className="mt-2.5 flex flex-wrap gap-1.5">
                                  {tool.type.map((type) => (
                                    <span
                                      key={type}
                                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                                        typeBadgeStyles[type] ??
                                        "border-[#B2C9A8] bg-[#F2F6EF] text-[#284B26]"
                                      }`}
                                    >
                                      {type}
                                    </span>
                                  ))}
                                  {tool.time.map((time) => (
                                    <span
                                      key={time}
                                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                                        timeBadgeStyles[time] ??
                                        "border-[#D6CE8A] bg-[#F6F4D8] text-[#5E5128]"
                                      }`}
                                    >
                                      {time}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-2 border-t border-[#DCE7D7] pt-3.5">
                                <span className="text-xs font-medium text-[#596556] group-hover:text-[#284B26]">
                                  Open guide &rarr;
                                </span>
                                <Button
                                  className={`planning-tool-select min-h-[36px] cursor-pointer rounded-full px-3.5 text-xs font-semibold transition-colors ${
                                    isSelected
                                      ? "bg-[#187347] text-white hover:bg-[#145e3a]"
                                      : "border-[1.5px] border-[#94B985] bg-white text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8]"
                                  }`}
                                  type="button"
                                  variant={isSelected ? "default" : "outline"}
                                  aria-pressed={isSelected}
                                  aria-label={`Select ${tool.name}`}
                                  onClick={() => toggleToolSelection(tool.name)}
                                >
                                  {isSelected ? (
                                    <span className="inline-flex items-center gap-1">
                                      <Check
                                        className="h-3.5 w-3.5"
                                        aria-hidden="true"
                                      />
                                      Selected
                                    </span>
                                  ) : (
                                    "Select tool"
                                  )}
                                </Button>
                              </div>
                            </ToolCardTrigger>
                          </HoverCardTrigger>

                          <HoverCardContent
                            className="planning-tool-preview"
                            side={previewSide}
                            align="start"
                            sideOffset={12}
                            collisionPadding={{
                              top: previewTopInset,
                              right: 16,
                              bottom: 16,
                              left: 16,
                            }}
                            avoidCollisions
                            sticky="always"
                          >
                            <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                              Quick Preview
                            </p>
                            <p
                              className="mt-1 text-base font-semibold text-[#202B20]"
                              style={EDITORIAL_SERIF_STYLE}
                            >
                              {tool.name}
                            </p>
                            {tool.image && (
                              <img
                                src={tool.image}
                                alt={`${tool.name} diagram`}
                                className="my-2.5 max-h-36 w-full rounded-lg border border-[#DCE7D7] bg-white p-1.5 object-contain"
                              />
                            )}
                            <p className="text-xs leading-relaxed text-[#394838]">
                              {tool.learning_obj[0]?.text ||
                                "Open this tool to explore its process and benefits."}
                            </p>
                            <p className="mt-2.5 border-t border-[#DCE7D7] pt-2 text-[11px] font-semibold text-[#187347]">
                              Click or tap the card for the full guide.
                            </p>
                          </HoverCardContent>
                        </HoverCard>
                      );
                    })}
                  </div>
                </div>

                {/* Pagination / Show More Footer */}
                <div className="mt-8 flex flex-col items-center justify-center gap-3 border-t border-[#DCE7D7] pt-6">
                  <div
                    className="font-mono text-xs font-medium text-[#596556] tabular-nums"
                    role="status"
                    aria-atomic="true"
                  >
                    Showing {visibleTools.length} of {filteredTools.length}{" "}
                    tools
                  </div>
                  {visibleTools.length < filteredTools.length && (
                    <Button
                      type="button"
                      aria-controls="planning-tools-grid"
                      onClick={() =>
                        setVisibleCount(fullRowCount + toolsBatchSize)
                      }
                      className="min-h-[44px] cursor-pointer rounded-full bg-[#3F673C] px-7 text-sm font-semibold text-white hover:bg-[#284B26]"
                    >
                      Show more
                    </Button>
                  )}
                </div>
              </EditorialSection>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* --- Step 3: Evaluation --- */}
        <TabsContent value="3" className="mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key="step-3"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
            >
              <EditorialSection tone="white" compact>
                <EditorialSectionHeader
                  eyebrow="03 / Ethical Assessment"
                  title="Evaluation"
                  description="Judge your project across Design, Implementation, and Outcomes using the 7 Values of Worthwhile Development."
                />

                <div className="mt-8">
                  <PlanningEvaluation
                    phase={evaluationPhase}
                    onPhaseChange={setEvaluationPhase}
                    answers={evaluationAnswers}
                    onAnswerChange={(phaseKey, answer) =>
                      setEvaluationAnswers((previous) => ({
                        ...previous,
                        [phaseKey]: answer,
                      }))
                    }
                    weights={evaluationWeights}
                    onWeightChange={(phaseKey, weight) =>
                      setEvaluationWeights((previous) => ({
                        ...previous,
                        [phaseKey]: weight,
                      }))
                    }
                  />
                </div>

                {/* Selected Tools Summary Card */}
                <div className="mt-8 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#187347]">
                        Toolkit Summary
                      </p>
                      <h3
                        className="mt-1 text-lg font-semibold text-[#202B20]"
                        style={EDITORIAL_SERIF_STYLE}
                      >
                        Selected tools
                      </h3>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => goToStep(2)}
                      className="cursor-pointer rounded-full border-[#94B985] bg-white text-xs font-semibold text-[#284B26] hover:border-[#3F673C] hover:bg-[#F2F6EF]"
                    >
                      {selectedToolNames.length > 0
                        ? "Edit selected tools"
                        : "Browse tools"}
                    </Button>
                  </div>

                  {selectedToolNames.length > 0 ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {selectedToolNames.map((name) => (
                        <li
                          key={name}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#94B985] bg-[#EDF4E8] px-3.5 py-1.5 text-xs font-semibold text-[#284B26]"
                        >
                          <Check
                            className="h-3.5 w-3.5 text-[#187347]"
                            aria-hidden="true"
                          />
                          <span>{name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-[#596556]">
                      No tools selected. Go back to Select Tools to choose
                      tools.
                    </p>
                  )}
                </div>
              </EditorialSection>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* === Modal Component === */}
      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
          onRestoreFocus={() => toolTriggerRef.current?.focus()}
        />
      )}
    </div>
  );
};

export default ProjectPlanning;
