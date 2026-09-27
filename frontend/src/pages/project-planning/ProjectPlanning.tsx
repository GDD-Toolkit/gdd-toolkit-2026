import { useEffect, useRef, useState } from "react";
import { motion, easeOut } from "framer-motion";
import "./ProjectPlanning.css";

import agileData from "./tools_data/agile.json";
import dmaicData from "./tools_data/dmaic.json";
import leanData from "./tools_data/lean.json";
import waterfallData from "./tools_data/waterfall.json";
import criticalchainData from "./tools_data/criticalchain.json";
import journeymappingData from "./tools_data/journeymapping.json";
import personaData from "./tools_data/persona.json";
import sipocData from "./tools_data/sipoc.json";
import garvin8Data from "./tools_data/garvin8.json";
import dmadvData from "./tools_data/dmadv.json";
import dmediData from "./tools_data/dmedi.json";
import strategycanvasData from "./tools_data/strategycanvas.json";
import gapanalysisData from "./tools_data/gapanalysis.json";
import pughchartData from "./tools_data/pughchart.json";
import montecarloData from "./tools_data/montecarlo.json";
import forceanalysisData from "./tools_data/forceanalysis.json";
import type { ProjectPlanningTool } from "./ToolModal";

import ToolModal from "./ToolModal";
import PlanningEvaluation from "./PlanningEvaluation";
import type { EvaluationAnswers, EvaluationPhase, EvaluationWeights } from "../tools/evaluationScoring";
import { matchKeywords } from "./keywordMatching";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Checkbox } from "../../components/ui/checkbox";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../components/ui/hover-card";
import { AspectRatio } from "../../components/ui/aspect-ratio";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Target, ChartNoAxesCombined, RefreshCw, X, ChevronDown } from "lucide-react";

const wizardSteps = ["Framework Intro", "Select Tools", "Evaluation"];

function ToolCardTrigger(props: React.ComponentProps<"div">) {
    // Radix HoverCard cancels touchstart by default. These cards contain buttons
    // and a scrollable parent, so preserve native taps and swipe scrolling.
    return <div {...props} onTouchStart={undefined} />;
}

const planningBenefits = [
    {
        title: "Define Goals",
        icon: Target,
        description: "Clarify the problem, who your project serves, and what success looks like. Align your team around shared goals, roles, and milestones.",
    },
    {
        title: "Measure Impact",
        icon: ChartNoAxesCombined,
        description: "Choose indicators to track progress and assess how your project supports well-being, equality, and sustainability.",
    },
    {
        title: "Iterate",
        icon: RefreshCw,
        description: "Use feedback and evidence to revisit your assumptions, refine your plan, and improve your project as you learn.",
    },
];

const ProjectPlanning: React.FC = () => {
    const [step, setStep] = useState(1);
    const [evaluationPhase, setEvaluationPhase] = useState<EvaluationPhase>("design");
    const [evaluationAnswers, setEvaluationAnswers] = useState<EvaluationAnswers>({});
    const [evaluationWeights, setEvaluationWeights] = useState<EvaluationWeights>({ design: "1", implementation: "1", outcomes: "1" });
    const [viewportRatio, setViewportRatio] = useState(() => window.innerWidth / window.innerHeight);
    const [previewSide, setPreviewSide] = useState<"left" | "right">("right");
    const [previewTopInset, setPreviewTopInset] = useState(16);

    useEffect(() => {
        const headers = [...document.querySelectorAll<HTMLElement>("[data-site-header]")];
        const updateHeaderBoundary = () => {
            const bottom = Math.max(0, ...headers.map((header) => header.getBoundingClientRect().bottom));
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
        setPreviewSide(bounds.left + bounds.width / 2 < window.innerWidth / 2 ? "right" : "left");
    };

    useEffect(() => {
        const updateViewportRatio = () => setViewportRatio(window.innerWidth / window.innerHeight);
        window.addEventListener("resize", updateViewportRatio);
        return () => window.removeEventListener("resize", updateViewportRatio);
    }, []);
    // Keeps chosen tools selected when moving between steps
    const [selectedToolNames, setSelectedToolNames] = useState<string[]>([]);
    // Adds a tool to the selection, or removes it if already selected
    const toggleToolSelection = (toolName: string) => {
        setSelectedToolNames((previous) =>
            previous.includes(toolName)
                ? previous.filter((name) => name !== toolName)
                : [...previous, toolName]
        );
    };
    const bannerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
    };

    const simulationRef = useRef<HTMLHeadingElement>(null);

    const tools: ProjectPlanningTool[] = [agileData, dmaicData, leanData, waterfallData, criticalchainData, journeymappingData, personaData, sipocData, garvin8Data, dmadvData, dmediData, strategycanvasData, gapanalysisData, pughchartData, montecarloData, forceanalysisData];

    // === Search State ===
    const [search, setSearch] = useState("");
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [keywordFeedback, setKeywordFeedback] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [toolsViewport, setToolsViewport] = useState<HTMLDivElement | null>(null);
    useEffect(() => {
        const viewport = toolsViewport;
        const grid = viewport?.querySelector<HTMLElement>(".tools-grid");
        if (step !== 2 || !viewport || !grid) return;

        let measuredWidth = 0;
        let tallestCard = 0;
        const updateCapacity = () => {
            const cards = [...grid.querySelectorAll<HTMLElement>(".tool-card")];
            if (!cards.length) return;
            // Retain the tallest measured card at this width to avoid page-size
            // oscillation when pages contain cards with different text lengths.
            if (measuredWidth !== grid.clientWidth) {
                measuredWidth = grid.clientWidth;
                tallestCard = 0;
            }
            tallestCard = Math.max(tallestCard, ...cards.map((card) => card.offsetHeight));
            const gridStyle = getComputedStyle(grid);
            const viewportStyle = getComputedStyle(viewport);
            const columns = gridStyle.gridTemplateColumns.split(" ").length;
            const gap = parseFloat(gridStyle.rowGap) || 0;
            const height = viewport.clientHeight - parseFloat(viewportStyle.paddingTop) - parseFloat(viewportStyle.paddingBottom);
            // Fill whole rows, including the rows needed for the six-tool minimum.
            const rows = Math.max(Math.ceil(6 / columns), Math.floor((height + gap) / (tallestCard + gap)));
            setPageSize(columns * rows);
        };
        const observer = new ResizeObserver(updateCapacity);
        observer.observe(viewport);
        observer.observe(grid);
        return () => observer.disconnect();
    }, [step, toolsViewport]);
    const toolTriggerRef = useRef<HTMLButtonElement | null>(null);
    const keywords = [...new Set(tools.flatMap((tool) => [...tool.type, ...tool.time]))].sort();
    // === Modal State ===
    const [selectedTool, setSelectedTool] = useState<ProjectPlanningTool | null>(null);

    const filteredTools = tools.filter((t) => {
        const term = search.trim().toLowerCase();
        return (
            (selectedKeywords.length === 0 || selectedKeywords.some((keyword) => t.type.includes(keyword) || t.time.includes(keyword))) && (
            t.name.toLowerCase().includes(term) ||
            t.type.some((ty) => ty.toLowerCase().includes(term)) ||
            t.time.some((ti) => ti.toLowerCase().includes(term)))
        );
    });
    const pageCount = Math.max(1, Math.ceil(filteredTools.length / pageSize));
    const currentPage = Math.min(page, pageCount);
    const visibleTools = filteredTools.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const changePage = (nextPage: number) => {
        setPage(nextPage);
        toolsViewport?.scrollTo({ top: 0 });
    };
    const toggleKeyword = (keyword: string) => {
        setSelectedKeywords((previous) => previous.includes(keyword)
            ? previous.filter((value) => value !== keyword)
            : [...previous, keyword]);
        changePage(1);
    };
    const addTypedKeywords = () => {
        const matches = matchKeywords(search, keywords);
        if (!matches.length) {
            setKeywordFeedback("No matching keywords. Try another term or choose from the list.");
            return;
        }
        const additions = matches.filter((keyword) => !selectedKeywords.includes(keyword));
        setSelectedKeywords((previous) => [...new Set([...previous, ...matches])]);
        setKeywordFeedback(additions.length ? `Added: ${additions.join(", ")}.` : "Those keywords are already selected.");
        setSearch("");
        changePage(1);
    };

    // === Badge Colors ===
    const typeColors: Record<string, string> = {
        "Six Sigma": "#dbeafe",          // light blue
        "Process Mapping": "#fef3c7",    // light yellow
        "Decision Making": "#fce7f3",    // light pink
        "User-Centric": "#d1fae5",       // light green
        "Efficiency/Innovation": "#fff7ed", // light orange
        "Quality Management": "#ede9fe"  // light purple
    };

    const timeColors: Record<string, string> = {
        "Short-term": "#dcfce7",
        "Long-term": "#fee2e2",
    };

    return (
        <div className="page-container planning-page">
            <header className="mission-banner">
                <motion.h1
                    className="mission-title"
                    initial="hidden"
                    animate="visible"
                    variants={bannerVariants}
                >
                    Project Planning
                </motion.h1>
                <br></br>
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={bannerVariants}
                >
                    Project planning is the <b>organization of people, deadlines, methodology, and objectives</b> to streamline the production
                    of a good, product, or goal. In a development context, that means planning to create an <b>effective, sustainable, and
                    worthwhile project</b>, from infrastructure to social services.
                </motion.p>
            </header>

            {/* Parent state preserves selections and search across all three panels. */}
            <Tabs value={String(step)} onValueChange={(value) => {
                setSelectedTool(null);
                setStep(Number(value));
            }} className="planning-wizard">
                <div className="planning-stepper">
                    <p className="planning-mobile-step" aria-live="polite">
                        Step {step} of {wizardSteps.length}: {wizardSteps[step - 1]}
                    </p>
                    <TabsList className="planning-step-tabs" aria-label="Project planning steps">
                        {wizardSteps.map((label, index) => (
                            <TabsTrigger key={label} value={String(index + 1)}>
                                {index + 1}. {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <Progress
                        value={(step / wizardSteps.length) * 100}
                        aria-label="Project planning progress"
                        aria-valuenow={step}
                        aria-valuemin={1}
                        aria-valuemax={wizardSteps.length}
                        aria-valuetext={`Step ${step} of ${wizardSteps.length}: ${wizardSteps[step - 1]}`}
                    />
                    <div className="planning-step-actions">
                        <Button type="button" variant="outline" disabled={step === 1}
                            onClick={() => { setSelectedTool(null); setStep((current) => Math.max(1, current - 1)); }}>
                            Back
                        </Button>
                        <span>{selectedToolNames.length} tools selected</span>
                        <Button type="button" disabled={step === wizardSteps.length}
                            onClick={() => { setSelectedTool(null); setStep((current) => Math.min(wizardSteps.length, current + 1)); }}>
                            Next
                        </Button>
                    </div>
                </div>

            {/* --- Section 1: Project Plannng Process --- */}
            <TabsContent value="1" className="planning-step-panel">
                <section className="content-section">
                    <div className="content-card">
                        <h2 ref={simulationRef} className="simulation-title">
                            Project Planning Process
                        </h2>
                        <motion.p
                            className="simulation-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, ease: easeOut }}
                        >
                            Effective project planning aims to properly document managerial elements needed for the successful completion of projects. Identifying primary aspects of project planning allows project management to control each stage of the project development and allows for the project timeline, roles, and responsibilities to be effectively designed and implemented.
                        </motion.p>
                        <div className="planning-intro-video">
                            <AspectRatio ratio={16 / 9}>
                            <iframe
                                src="https://youtube.com/embed/EiaChYQll-0"
                                title="Project Planning Process Tutorial Video"
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                            </AspectRatio>
                        </div>
                    </div>
                </section>
                <section className="content-section planning-benefits" aria-labelledby="planning-benefits-title">
                    <h2 id="planning-benefits-title" className="simulation-title">Why Project Plan?</h2>
                    <div className="planning-benefits-grid">
                        {planningBenefits.map(({ title, icon: Icon, description }) => (
                            <Card key={title} className="planning-benefit-card">
                                <CardHeader>
                                    <Icon className="planning-benefit-icon" size={28} aria-hidden="true" />
                                    <h3>{title}</h3>
                                </CardHeader>
                                <CardContent><p>{description}</p></CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </TabsContent>

            {/* --- Section 2: Project Planning Tools Intro --- */}
            <TabsContent value="2" className="planning-step-panel">
                <section className="content-section">
                    <div className="content-card">
                        <h2 className="simulation-title">
                            Project Planning Tools
                        </h2>
                        <motion.p
                            className="simulation-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, ease: easeOut }}
                        >
                        These are various types of software, tables, charts, infographics, and method of thought to help
                        our users develop their own projects. They can help you understand how to manage your own
                        enterprises, track your progress, and organize every piece of our business or project
                        development process. Each box is a different tool, and if you click on the name, you’ll be taken to
                        a free training module to teach you to use this tool, and how it can apply to your specific goal or
                        idea.
                        </motion.p>

                        {/* SEARCH BAR */}
                        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                            <input
                                type="text"
                                placeholder="Search tools or type a keyword..."
                                value={search}
                                aria-label="Search planning tools"
                                aria-describedby="planning-keyword-feedback"
                                onChange={(e) => { setSearch(e.target.value); setKeywordFeedback(""); changePage(1); }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                                        event.preventDefault();
                                        addTypedKeywords();
                                    }
                                }}
                                className="planning-search-bar"
                            />
                            <p id="planning-keyword-feedback" role="status" className="mt-2 text-sm text-slate-600">
                                {keywordFeedback || "Press Enter to add matching keywords. Partial names and minor typos work too."}
                            </p>
                            <div className="planning-keyword-filter">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" type="button" aria-label="Filter tools by keywords">
                                            {selectedKeywords.length ? `${selectedKeywords.length} keywords selected` : "All keywords"}
                                            <ChevronDown size={16} aria-hidden="true" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="planning-keyword-options" collisionPadding={16}>
                                        <Button type="button" variant="outline" onClick={() => { setSelectedKeywords([]); setSearch(""); setKeywordFeedback(""); changePage(1); }}>
                                            All keywords
                                        </Button>
                                        <p>Match any selected keyword.</p>
                                        {keywords.map((value) => (
                                            <label key={value} className="planning-keyword-option">
                                                <Checkbox checked={selectedKeywords.includes(value)} onCheckedChange={() => toggleKeyword(value)} />
                                                <span>{value}</span>
                                            </label>
                                        ))}
                                    </PopoverContent>
                                </Popover>
                                {selectedKeywords.length > 0 && (
                                    <ul className="planning-keyword-chips" aria-label="Selected keywords">
                                        {selectedKeywords.map((value) => (
                                            <li key={value}>
                                                <span>{value}</span>
                                                <button type="button" aria-label={`Remove ${value} filter`} onClick={() => toggleKeyword(value)}>
                                                    <X size={16} aria-hidden="true" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
                {/* Tool cards shown in step 2 */}
                <div
                    className="planning-tools-viewport"
                    ref={setToolsViewport}
                    style={{ aspectRatio: viewportRatio }}
                    role="region"
                    aria-label="Available planning tools"
                    tabIndex={0}
                >
                <div className="tools-grid">
                    {filteredTools.length === 0 && (
                        <p className="planning-tools-empty" role="status">No tools match your search.</p>
                    )}
                    {visibleTools.map((tool) => (
                        <HoverCard key={tool.name} openDelay={150} closeDelay={150}>
                        <HoverCardTrigger asChild>
                        <ToolCardTrigger
                            className="tool-card"
                            onPointerEnter={(event) => updatePreviewSide(event.currentTarget)}
                            onFocusCapture={(event) => updatePreviewSide(event.currentTarget)}
                        >
                            {tool.image && <img
                                src={tool.image}
                                alt={tool.name}
                                className="tool-image"
                            />}

                            <h3 className="tool-name">
                                <button className="planning-tool-details-trigger" type="button" aria-label={`View ${tool.name} details`} aria-haspopup="dialog" onClick={(event) => { toolTriggerRef.current = event.currentTarget; setSelectedTool(tool); }}>
                                    {tool.name}
                                </button>

                            </h3>
                            <Button
                                className="planning-tool-select"
                                type="button"
                                variant={selectedToolNames.includes(tool.name) ? "default" : "outline"}
                                aria-pressed={selectedToolNames.includes(tool.name)}
                                aria-label={`Select ${tool.name}`}
                                onClick={() => toggleToolSelection(tool.name)}
                            >
                                {selectedToolNames.includes(tool.name) ? "Selected" : "Select tool"}
                            </Button>

                            <div className="tool-badges">
                                {tool.type.map((type) => (
                                    <span
                                        key={type}
                                        className="tool-badge"
                                        style={{ backgroundColor: typeColors[type] }}
                                    >
                                        {type}
                                    </span>
                    ))}

                                {tool.time.map((time) => (
                                    <span
                                        key={time}
                                        className="tool-badge"
                                        style={{ backgroundColor: timeColors[time] }}
                                    >
                                        {time}
                                    </span>
                                ))}
                            </div>
                        </ToolCardTrigger>
                                    </HoverCardTrigger>
                                <HoverCardContent
                                    className="planning-tool-preview"
                                    side={previewSide}
                                    align="start"
                                    sideOffset={12}
                                    collisionPadding={{ top: previewTopInset, right: 16, bottom: 16, left: 16 }}
                                    avoidCollisions
                                    sticky="always"
                                >
                                    <p className="font-semibold">{tool.name}</p>
                                    {tool.image && <img src={tool.image} alt={`${tool.name} diagram`} className="my-2 w-full max-h-40 object-contain" />}
                                    <p className="text-sm">{tool.learning_obj[0]?.text || "Open this tool to explore its process and benefits."}</p>
                                    <p className="mt-2 text-sm">Click or tap the card for the full guide.</p>
                                </HoverCardContent>

                        </HoverCard>
                    ))}
                </div>
                </div>
                <nav className="planning-pagination" aria-label="Tool results pages">
                    <Button variant="outline" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>Previous</Button>
                    <div className="planning-pagination-status" role="status" aria-atomic="true">
                        <span className="planning-pagination-count">{filteredTools.length} tools</span>
                        <span className="planning-pagination-page">Page <strong>{currentPage}</strong> of <strong>{pageCount}</strong></span>
                    </div>
                    <Button className="planning-pagination-next" disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)}>Next</Button>
                </nav>
            </TabsContent>

            {/* --- Section 3: Project evaluation tool --- */}
            <TabsContent value="3" className="planning-step-panel">
                <section className="content-section">
                    <div className="content-card">
                        <h2 className="simulation-title">Evaluation</h2>
                        <PlanningEvaluation
                            phase={evaluationPhase}
                            onPhaseChange={setEvaluationPhase}
                            answers={evaluationAnswers}
                            onAnswerChange={(phase, answer) => setEvaluationAnswers((previous) => ({
                                ...previous, [phase]: answer,
                            }))}
                            weights={evaluationWeights}
                            onWeightChange={(phase, weight) => setEvaluationWeights((previous) => ({ ...previous, [phase]: weight }))}
                        />
                        <h3>Selected tools</h3>
                        {selectedToolNames.length > 0 ? (
                            <ul>{selectedToolNames.map((name) => <li key={name}>{name}</li>)}</ul>
                        ) : (
                            <p>No tools selected. Go back to Select Tools to choose tools.</p>
                        )}
                    </div>
                </section>
            </TabsContent>
            </Tabs>

            {/* === Modal Component === */}
            {selectedTool && (
                <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} onRestoreFocus={() => toolTriggerRef.current?.focus()} />
            )}
            <br></br>
        </div>
    );
};

export default ProjectPlanning;
