import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  ChevronDown,
  GraduationCap,
  Image,
  Layers,
  Microscope,
  Palette,
  PenTool,
  ShieldCheck,
  Sparkles,
  Volume2,
  type LucideIcon,
} from "lucide-react";

import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialReveal,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import DashboardResources from "./DashboardResources";
import ToolSearch from "../../components/ai-ethics-dashboard/ToolSearch";
import SearchResults from "../../components/ai-ethics-dashboard/SearchResults";
import { tools } from "./data/aiTools";
import { searchDashboard, toolGroups } from "./data/searchTools";

const CATEGORY_META: Record<
  string,
  { Icon: LucideIcon; description: string }
> = {
  "General Purpose": {
    Icon: Sparkles,
    description:
      "Versatile conversational assistants and multi-task AI platforms.",
  },
  "Image and Video Generators": {
    Icon: Image,
    description:
      "Visual synthesis tools evaluated for attribution, bias, and misuse risks.",
  },
  "Audio Generators": {
    Icon: Volume2,
    description:
      "Voice, transcription, and audio synthesis tools assessed for consent safeguards.",
  },
  Research: {
    Icon: Microscope,
    description:
      "Literature synthesis, citation verification, and scholarly inquiry tools.",
  },
  "Writing and Text": {
    Icon: PenTool,
    description:
      "Drafting, editing, and translation tools reviewed for transparency.",
  },
  "Another Topic": {
    Icon: Layers,
    description:
      "Emerging domain-specific AI applications across interdisciplinary work.",
  },
  "Data Analysis": {
    Icon: BarChart3,
    description:
      "Quantitative modeling, survey coding, and visual analytics assistants.",
  },
  Education: {
    Icon: GraduationCap,
    description:
      "Tutoring, curriculum design, and accessible student learning tools.",
  },
  "Design and Creativity": {
    Icon: Palette,
    description:
      "Prototyping, layout, and participatory ideation workflows.",
  },
  "Other Tools": {
    Icon: Boxes,
    description:
      "Specialized utilities supporting ethical global development workflows.",
  },
};

const FAQS = [
  {
    question: "What is the AI Ethics Dashboard?",
    answer:
      "The AI Ethics Dashboard helps users discover and explore AI tools for ethical research and project development.",
  },
  {
    question: "How are AI tools evaluated?",
    answer:
      "AI tools are evaluated based on the criteria and methodology developed for this project.",
  },
  {
    question: "What does the Ethicality Score mean?",
    answer:
      "The Ethicality Score provides an overview of how a tool performs according to the ethical criteria used by this dashboard.",
  },
  {
    question: "How can I find a specific AI tool?",
    answer:
      "You can use the search bar and explore the different tool groupings to find AI tools that match your needs.",
  },
  {
    question: "Can I bookmark an AI tool?",
    answer:
      "Yes. The dashboard can allow users to bookmark tools so they can easily return to them later.",
  },
];

export default function AIEthicsDashboard() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showFaq, setShowFaq] = useState(true);

  const [search, setSearch] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(
    null,
  );

  const categoryRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const searchResult = searchDashboard(search);

  const dashboardStats = useMemo(() => {
    const totalTools = tools.length;
    const avgScore =
      totalTools > 0
        ? Math.round(
            tools.reduce((sum, item) => sum + item.score, 0) / totalTools,
          )
        : 0;
    const highCount = tools.filter((t) => t.score >= 90).length;
    const moderateCount = tools.filter(
      (t) => t.score >= 70 && t.score <= 89,
    ).length;
    const cautionCount = tools.filter((t) => t.score < 70).length;

    const countsByCategory: Record<string, number> = {};
    for (const group of toolGroups) {
      countsByCategory[group] = tools.filter(
        (t) => t.category.trim().toLowerCase() === group.trim().toLowerCase(),
      ).length;
    }

    return {
      totalTools,
      avgScore,
      highCount,
      moderateCount,
      cautionCount,
      countsByCategory,
    };
  }, []);

  /*
   * Close the search preview when the user clicks outside it or presses Escape.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /*
   * Highlight a dashboard section for a few seconds.
   */
  useEffect(() => {
    if (!highlightedCategory) {
      return;
    }

    const timer = window.setTimeout(() => {
      setHighlightedCategory(null);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [highlightedCategory]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setShowSearchResults(value.trim().length > 0);
    setHighlightedCategory(null);
  };

  /*
   * User clicks a matching dashboard section.
   */
  const handleCategoryClick = () => {
    if (!searchResult.category) {
      return;
    }

    const category = searchResult.category;

    setShowSearchResults(false);
    setHighlightedCategory(category);

    const element = categoryRefs.current[category];

    if (element) {
      element.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "center",
      });
    }
  };

  /*
   * User clicks an individual tool in the preview.
   */
  const handleToolClick = (tool: { name: string }) => {
    setShowSearchResults(false);
    navigate(`/ai-ethics-dashboard/tool?name=${encodeURIComponent(tool.name)}`);
  };

  /*
   * User wants to see all matching tools.
   */
  const handleViewAll = () => {
    const query = search.trim();

    if (!query) {
      return;
    }

    setShowSearchResults(false);
    navigate(`/ai-ethics-dashboard/tools?search=${encodeURIComponent(query)}`);
  };

  const scrollToCategories = () => {
    const el = document.getElementById("tool-categories");
    if (el) {
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }
  };

  return (
    <main className="min-h-screen w-full bg-white text-[#202B20]">

      {/* Forest Green Editorial Hero with Integrated Search & Summary KPI Card */}
      <EditorialPageHero
        ariaLabel="AI Ethics Dashboard overview"
        className="z-20 overflow-visible overflow-x-clip"
        badges={[
          { label: "02 · Educational Tool", tone: "cream" },
          { label: "Worthwhile Development Rubric", tone: "sage" },
        ]}
        title={
          <>
            AI Ethics{" "}
            <em className="font-normal italic text-[#E9E6B2]">Dashboard</em>
          </>
        }
        subtitle="Discover and explore AI tools for ethical research and project development—evaluated across bias mitigation, privacy, transparency, and low-tech readiness."
        actions={
          <div className="flex w-full max-w-2xl flex-col gap-4">
            {/* Live Search Bar + Animated Dropdown */}
            <div ref={searchContainerRef} className="relative w-full">
              <ToolSearch
                variant="hero"
                value={search}
                onChange={handleSearchChange}
                onSearch={() => setShowSearchResults(true)}
                onFocus={() => {
                  if (search.trim()) {
                    setShowSearchResults(true);
                  }
                }}
                onClear={() => handleSearchChange("")}
              />

              <AnimatePresence>
                {showSearchResults && search.trim() && (
                  <div className="absolute left-0 right-0 top-full z-40">
                    <SearchResults
                      query={search}
                      category={searchResult.category}
                      tools={searchResult.tools}
                      onCategoryClick={handleCategoryClick}
                      onToolClick={handleToolClick}
                      onViewAll={handleViewAll}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Primary & Secondary Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/ai-ethics-dashboard/tools"
                className="inline-flex items-center gap-2 rounded-full bg-[#E9E6B2] px-6 py-3 text-sm font-semibold text-[#202B20] shadow-xs transition-all duration-200 hover:bg-[#f2efbf] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C]"
              >
                <span>View All Tools</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <button
                type="button"
                onClick={scrollToCategories}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#9AB887] bg-[#2E502B] px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#254223] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C]"
              >
                <span>Explore Categories</span>
              </button>
            </div>
          </div>
        }
        footnote="Evaluated across 8 ethical dimensions · Search by tool name, domain, pricing tier, or ethicality score"
        aside={
          <div className="rounded-2xl border-[1.5px] border-[#E9E6B2]/85 bg-white p-6 text-[#202B20] shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-[#D5E3D9] pb-4">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                  Dashboard Snapshot
                </p>
                <p
                  className="mt-1 text-lg font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  Ethical Evaluation Index
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#B2C9A8] bg-[#EDF4E8] text-[#187347]">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3.5">
              {[
                {
                  value: String(dashboardStats.totalTools),
                  label: "Evaluated Tools",
                },
                {
                  value: String(toolGroups.length),
                  label: "Tool Categories",
                },
                {
                  value: "8",
                  label: "Ethical Dimensions",
                },
                {
                  value: `${dashboardStats.avgScore}`,
                  label: "Avg. Ethicality Score",
                },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] px-4 py-3.5"
                >
                  <p
                    className="text-2xl font-bold leading-tight text-[#187347]"
                    style={EDITORIAL_SERIF_STYLE}
                  >
                    {kpi.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-[#394838]">
                    {kpi.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Score Distribution Bar */}
            <div className="mt-5 border-t border-[#D5E3D9] pt-4">
              <div className="flex items-center justify-between text-[11px] font-medium text-[#596556]">
                <span className="font-mono uppercase tracking-wider text-[#284B26]">
                  Score Distribution
                </span>
                <span>{dashboardStats.totalTools} tools</span>
              </div>

              <div
                className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full bg-[#EDF4E8]"
                aria-label="Ethicality score distribution"
              >
                <div
                  style={{
                    width: `${(dashboardStats.highCount / dashboardStats.totalTools) * 100}%`,
                  }}
                  className="bg-[#187347]"
                  title={`90–100: ${dashboardStats.highCount} tools`}
                />
                <div
                  style={{
                    width: `${(dashboardStats.moderateCount / dashboardStats.totalTools) * 100}%`,
                  }}
                  className="bg-[#C9B349]"
                  title={`70–89: ${dashboardStats.moderateCount} tools`}
                />
                <div
                  style={{
                    width: `${(dashboardStats.cautionCount / dashboardStats.totalTools) * 100}%`,
                  }}
                  className="bg-[#C96B5E]"
                  title={`Below 70: ${dashboardStats.cautionCount} tools`}
                />
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-[#394838]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#187347]" />
                  90–100 ({dashboardStats.highCount})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#C9B349]" />
                  70–89 ({dashboardStats.moderateCount})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#C96B5E]" />
                  &lt;70 ({dashboardStats.cautionCount})
                </span>
              </div>
            </div>
          </div>
        }
      />

      {/* Section 01: Tool Categories */}
      <EditorialSection
        id="tool-categories"
        tone="white"
        ariaLabelledBy="tool-categories-heading"
        className="relative z-10"
      >
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="01 / Tool Categories"
            titleId="tool-categories-heading"
            title="Explore AI Tools by Domain"
            description="Browse curated tool groupings by workflow, or select a category match in the search bar to locate and spotlight it below."
            action={
              <Link
                to="/ai-ethics-dashboard/tools"
                className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#B2C9A8] bg-white px-5 py-2.5 text-sm font-semibold text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#FAFDF8]"
              >
                <span>View Full Directory</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
        </EditorialReveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {toolGroups.map((group, index) => {
            const isHighlighted = highlightedCategory === group;
            const meta = CATEGORY_META[group] ?? {
              Icon: Boxes,
              description: "Explore evaluated AI tools within this category.",
            };
            const Icon = meta.Icon;
            const toolCount = dashboardStats.countsByCategory[group] ?? 0;

            return (
              <EditorialReveal
                key={group}
                delay={Math.min(index * 0.04, 0.28)}
                className="h-full"
              >
                <motion.div
                  whileHover={reduced ? undefined : { y: -4 }}
                  animate={
                    isHighlighted && !reduced ? { scale: 1.02 } : { scale: 1 }
                  }
                  transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
                  className="relative h-full"
                >
                  {/* Animated Emerald Pulse Ring on Search Match */}
                  <AnimatePresence>
                    {isHighlighted && (
                      <motion.span
                        aria-hidden="true"
                        initial={
                          reduced
                            ? { opacity: 0.7 }
                            : { opacity: 0.9, scale: 0.98 }
                        }
                        animate={
                          reduced
                            ? { opacity: 0.7 }
                            : {
                                opacity: [0.95, 0.25, 0.95],
                                scale: [1, 1.04, 1],
                              }
                        }
                        exit={{ opacity: 0 }}
                        transition={
                          reduced
                            ? { duration: 0.2 }
                            : {
                                duration: 1.15,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }
                        }
                        className="pointer-events-none absolute -inset-1.5 rounded-[1.2rem] border-2 border-[#187347] shadow-[0_0_0_4px_rgba(24,115,71,0.16)]"
                      />
                    )}
                  </AnimatePresence>

                  <Link
                    ref={(element) => {
                      categoryRefs.current[group] = element;
                    }}
                    to={`/ai-ethics-dashboard/tools?category=${encodeURIComponent(
                      group,
                    )}`}
                    className={`group relative flex h-full min-h-[210px] flex-col justify-between rounded-2xl border-[1.5px] p-6 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3F673C] focus:ring-offset-2 ${
                      isHighlighted
                        ? "border-[#187347] bg-[#EDF4E8] shadow-md"
                        : "border-[#B2C9A8] bg-white hover:border-[#3F673C] hover:bg-[#FAFDF8] hover:shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                            isHighlighted
                              ? "border-[#187347] bg-[#187347] text-white"
                              : "border-[#D5E3D9] bg-[#F2F6EF] text-[#3F673C] group-hover:border-[#94B985] group-hover:bg-[#EDF4E8]"
                          }`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>

                        {isHighlighted ? (
                          <span className="inline-flex items-center rounded-full bg-[#187347] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white shadow-xs">
                            Search Match
                          </span>
                        ) : (
                          <span className="rounded-full border border-[#D5E3D9] bg-[#F2F6EF] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#284B26]">
                            {toolCount === 0
                              ? "Explore"
                              : `${toolCount} ${toolCount === 1 ? "tool" : "tools"}`}
                          </span>
                        )}
                      </div>

                      <h3
                        className="mt-4 text-lg font-semibold leading-snug text-[#202B20]"
                        style={EDITORIAL_SERIF_STYLE}
                      >
                        {group}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-[#596556]">
                        {meta.description}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[#D5E3D9]/80 pt-3.5 text-xs font-semibold text-[#3F673C] transition-colors group-hover:text-[#187347]">
                      <span>Explore category</span>
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                </motion.div>
              </EditorialReveal>
            );
          })}
        </div>
      </EditorialSection>

      {/* Section 02: Research & Methodology */}
      <EditorialSection
        id="methodology"
        tone="sage"
        ariaLabelledBy="methodology-heading"
      >
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="02 / Research & Methodology"
            titleId="methodology-heading"
            title="Methodology & Community Resources"
            description="Understand the ethical evaluation framework behind every score and access practitioner-ready visual guides."
          />
        </EditorialReveal>

        <EditorialReveal delay={0.08} className="mt-10">
          <DashboardResources variant="cards" />
        </EditorialReveal>
      </EditorialSection>

      {/* Section 03: Frequently Asked Questions */}
      <EditorialSection id="faq" tone="white" ariaLabelledBy="faq-heading">
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="03 / Frequently Asked Questions"
            titleId="faq-heading"
            title="Understanding the Dashboard"
            description="Answers to common questions about ethicality scores, evaluation methodology, searching, and bookmarking tools."
            action={
              <button
                type="button"
                onClick={() => setShowFaq((prev) => !prev)}
                aria-expanded={showFaq}
                aria-controls="dashboard-faq-panel"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-[#B2C9A8] bg-white px-5 py-2.5 text-sm font-semibold text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#FAFDF8] focus:outline-none focus:ring-2 focus:ring-[#3F673C]"
              >
                <span>{showFaq ? "Hide FAQ" : "Show FAQ"}</span>
                <ChevronDown
                  className={`h-4 w-4 text-[#187347] transition-transform duration-200 ${
                    showFaq ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
            }
          />
        </EditorialReveal>

        <AnimatePresence initial={false}>
          {showFaq && (
            <motion.div
              id="dashboard-faq-panel"
              initial={reduced ? false : { opacity: 0, height: 0 }}
              animate={reduced ? undefined : { opacity: 1, height: "auto" }}
              exit={reduced ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
              className="overflow-hidden"
            >
              <div className="mx-auto mt-10 max-w-4xl space-y-3.5">
                {FAQS.map((faq, index) => {
                  const isOpen = openFaq === index;
                  const answerId = `faq-answer-${index}`;

                  return (
                    <div
                      key={faq.question}
                      className={`overflow-hidden rounded-2xl border-[1.5px] transition-colors duration-200 ${
                        isOpen
                          ? "border-[#3F673C] bg-[#FAFDF8]"
                          : "border-[#B2C9A8] bg-white hover:border-[#94B985]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#3F673C] sm:px-6 sm:py-5"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="font-mono text-xs font-semibold text-[#187347]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span
                            className="text-base font-semibold text-[#202B20] sm:text-lg"
                            style={EDITORIAL_SERIF_STYLE}
                          >
                            {faq.question}
                          </span>
                        </div>

                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            isOpen
                              ? "border-[#3F673C] bg-[#3F673C] text-white"
                              : "border-[#D5E3D9] bg-[#F2F6EF] text-[#3F673C]"
                          }`}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden="true"
                          />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={answerId}
                            initial={reduced ? false : { opacity: 0, height: 0 }}
                            animate={
                              reduced
                                ? undefined
                                : { opacity: 1, height: "auto" }
                            }
                            exit={reduced ? undefined : { opacity: 0, height: 0 }}
                            transition={{
                              duration: 0.22,
                              ease: EDITORIAL_EASE,
                            }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-[#D5E3D9] px-5 py-4 text-sm leading-relaxed text-[#394838] sm:px-6 sm:pl-14 sm:text-base">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </EditorialSection>
    </main>
  );
}
