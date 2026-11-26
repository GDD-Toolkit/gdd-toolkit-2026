import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  Compass,
  GraduationCap,
  HelpCircle,
  Image as ImageIcon,
  Microscope,
  Palette,
  PenTool,
  ShieldCheck,
  Sparkles,
  Volume2,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
import {
  searchDashboard,
  toolGroups,
  type SearchableAITool,
} from "./data/searchTools";
import { getAITools } from "../../api/strapi";

type CategoryMeta = {
  Icon: LucideIcon;
  summary: string;
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  "General Purpose": {
    Icon: Sparkles,
    summary: "Conversational assistants, reasoning models, and everyday AI.",
  },
  "Image and Video Generators": {
    Icon: ImageIcon,
    summary: "Visual synthesis tools evaluated for attribution and safety.",
  },
  "Audio Generators": {
    Icon: Volume2,
    summary: "Voice synthesis, transcription, and multilingual audio workflows.",
  },
  Research: {
    Icon: Microscope,
    summary: "Literature search, citation synthesis, and academic analysis.",
  },
  "Writing and Text": {
    Icon: PenTool,
    summary: "Drafting, editing, and structured communication assistants.",
  },
  "Another Topic": {
    Icon: Compass,
    summary: "Emerging specialized workflows and cross-disciplinary tools.",
  },
  "Data Analysis": {
    Icon: BarChart3,
    summary: "Quantitative insight, visualization, and dataset exploration.",
  },
  Education: {
    Icon: GraduationCap,
    summary: "Learning companions and equitable classroom support tools.",
  },
  "Design and Creativity": {
    Icon: Palette,
    summary: "Ideation, prototyping, and accessible creative production.",
  },
  "Other Tools": {
    Icon: Wrench,
    summary: "Additional platforms reviewed under the GDD ethics rubric.",
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

  const [tools, setTools] = useState<SearchableAITool[]>([]);
  const [toolsLoading, setToolsLoading] = useState(true);
  const [toolsError, setToolsError] = useState("");

  const categoryRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTools() {
      try {
        const data = await getAITools();

        if (!cancelled) {
          setTools(data as SearchableAITool[]);
        }
      } catch (err) {
        console.error("Failed to load AI tools:", err);

        if (!cancelled) {
          setToolsError("Unable to load AI tools.");
        }
      } finally {
        if (!cancelled) {
          setToolsLoading(false);
        }
      }
    }

    loadTools();

    return () => {
      cancelled = true;
    };
  }, []);

  const searchResult = searchDashboard(search, tools);

  const averageScore =
    tools.length > 0
      ? Math.round(
          (tools.reduce((sum, tool) => sum + tool.total_score, 0) /
            tools.length) *
            10,
        ) / 10
      : null;

  const highEthicsCount = tools.filter((t) => t.total_score >= 45).length;
  const moderateEthicsCount = tools.filter(
    (t) => t.total_score >= 35 && t.total_score < 45,
  ).length;
  const lowEthicsCount = tools.filter((t) => t.total_score < 35).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!highlightedCategory) {
      return;
    }

    const timer = window.setTimeout(() => {
      setHighlightedCategory(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [highlightedCategory]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setShowSearchResults(value.trim().length > 0);
    setHighlightedCategory(null);
  };

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
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleToolClick = (tool: { name: string }) => {
    setShowSearchResults(false);
    navigate(`/ai-ethics-dashboard/tool?name=${encodeURIComponent(tool.name)}`);
  };

  const handleViewAll = () => {
    const query = search.trim();
    setShowSearchResults(false);

    if (!query) {
      navigate("/ai-ethics-dashboard/tools");
      return;
    }

    navigate(`/ai-ethics-dashboard/tools?search=${encodeURIComponent(query)}`);
  };

  const scrollToCategories = () => {
    const el = document.getElementById("tool-categories");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-white text-[#202B20]">
      {/* Forest Green Editorial Hero */}
      <EditorialPageHero
        titleId="ai-ethics-hero-title"
        className="overflow-visible overflow-x-clip"
        badges={[
          { label: "02 · Educational Tool", tone: "cream" },
          { label: "50-Point Ethicality Rubric", tone: "sage" },
        ]}
        title={
          <>
            AI Ethics{" "}
            <em className="font-normal italic text-[#E9E6B2]">Dashboard</em>
          </>
        }
        subtitle="Discover and explore AI tools for ethical research and project development, evaluated live across viability, bias mitigation, privacy, transparency, and low-tech readiness."
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

              {toolsLoading && (
                <p className="mt-2 font-mono text-[11px] text-[#E9E6B2]/90">
                  Loading AI tools from CMS…
                </p>
              )}

              {!toolsLoading && toolsError && (
                <p
                  role="alert"
                  className="mt-2 rounded-lg border border-[#E2B4B0]/50 bg-[#2E502B] px-3 py-1.5 text-xs text-[#FADBD8]"
                >
                  {toolsError}
                </p>
              )}

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
        footnote="Live Strapi CMS evaluation data · 11 ethical criteria scored out of 50"
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

            <div className="mt-4 grid grid-cols-2 gap-3.5">
              <div className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-3.5">
                <span
                  className="text-2xl font-bold text-[#187347]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {toolsLoading ? "—" : tools.length}
                </span>
                <p className="mt-0.5 text-xs font-medium text-[#394838]">
                  Evaluated Tools
                </p>
              </div>

              <div className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-3.5">
                <span
                  className="text-2xl font-bold text-[#187347]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {toolGroups.length}
                </span>
                <p className="mt-0.5 text-xs font-medium text-[#394838]">
                  Tool Categories
                </p>
              </div>

              <div className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-3.5">
                <span
                  className="text-2xl font-bold text-[#187347]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  11
                </span>
                <p className="mt-0.5 text-xs font-medium text-[#394838]">
                  Ethical Criteria
                </p>
              </div>

              <div className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-3.5">
                <span
                  className="text-2xl font-bold text-[#187347]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {averageScore !== null ? `${averageScore}/50` : "—"}
                </span>
                <p className="mt-0.5 text-xs font-medium text-[#394838]">
                  Avg. Ethicality Score
                </p>
              </div>
            </div>

            {/* Score Distribution Mini Bar */}
            <div className="mt-5 border-t border-[#D5E3D9] pt-4">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#596556]">
                <span>Score Distribution</span>
                <span>{tools.length} tools</span>
              </div>
              <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-[#EDF4E8]">
                {tools.length > 0 && (
                  <>
                    <div
                      className="h-full bg-[#187347]"
                      style={{
                        width: `${(highEthicsCount / tools.length) * 100}%`,
                      }}
                      title={`45–50: ${highEthicsCount} tools`}
                    />
                    <div
                      className="h-full bg-[#C8B24E]"
                      style={{
                        width: `${(moderateEthicsCount / tools.length) * 100}%`,
                      }}
                      title={`35–44: ${moderateEthicsCount} tools`}
                    />
                    <div
                      className="h-full bg-[#C96B63]"
                      style={{
                        width: `${(lowEthicsCount / tools.length) * 100}%`,
                      }}
                      title={`Below 35: ${lowEthicsCount} tools`}
                    />
                  </>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-[#596556]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#187347]" />
                  45–50 ({highEthicsCount})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#C8B24E]" />
                  35–44 ({moderateEthicsCount})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#C96B63]" />
                  &lt;35 ({lowEthicsCount})
                </span>
              </div>
            </div>
          </div>
        }
      />

      {/* 01 / Tool Categories */}
      <EditorialSection
        id="tool-categories"
        tone="white"
        ariaLabelledBy="categories-heading"
      >
        <EditorialSectionHeader
          eyebrow="01 / Tool Categories"
          title="Explore AI Tools by Domain"
          titleId="categories-heading"
          description="Browse curated tool groupings by workflow, or select a category match in the search bar to locate and spotlight it below."
          action={
            <Link
              to="/ai-ethics-dashboard/tools"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#3F673C] bg-white px-5 py-2.5 text-sm font-semibold text-[#284B26] transition-colors hover:bg-[#EDF4E8]"
            >
              <span>View Full Directory</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {toolGroups.map((group, idx) => {
            const meta = CATEGORY_META[group] ?? {
              Icon: Sparkles,
              summary: "Explore evaluated AI tools in this category.",
            };
            const Icon = meta.Icon;
            const isHighlighted = highlightedCategory === group;

            return (
              <EditorialReveal
                key={group}
                delay={Math.min(idx * 0.04, 0.25)}
                className="relative"
              >
                {isHighlighted && !reduced && (
                  <motion.div
                    aria-hidden="true"
                    initial={{ opacity: 0.9, scale: 0.98 }}
                    animate={{
                      opacity: [0.9, 0.35, 0.9],
                      scale: [0.99, 1.03, 0.99],
                    }}
                    transition={{
                      duration: 1.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="pointer-events-none absolute -inset-1.5 rounded-[20px] border-2 border-[#187347] bg-[#187347]/10"
                  />
                )}

                <motion.div
                  whileHover={reduced ? undefined : { y: -3 }}
                  transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
                  className="h-full"
                >
                  <Link
                    ref={(el) => {
                      categoryRefs.current[group] = el;
                    }}
                    to={`/ai-ethics-dashboard/tools?category=${encodeURIComponent(group)}`}
                    className={`group relative flex h-full flex-col justify-between gap-4 rounded-2xl border-[1.5px] p-6 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3F673C] ${
                      isHighlighted
                        ? "border-[#187347] bg-[#EDF4E8] shadow-lg ring-4 ring-[#187347]/25"
                        : "border-[#B2C9A8] bg-white hover:border-[#3F673C] hover:bg-[#FAFDF8]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                            isHighlighted
                              ? "border-[#187347] bg-[#187347] text-white"
                              : "border-[#D5E3D9] bg-[#F2F6EF] text-[#3F673C] group-hover:border-[#3F673C] group-hover:bg-[#3F673C] group-hover:text-white"
                          }`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>

                        {isHighlighted && (
                          <span className="rounded-full bg-[#187347] px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
                            Search Match
                          </span>
                        )}
                      </div>

                      <h3
                        className="mt-4 text-xl font-semibold leading-snug text-[#202B20] group-hover:text-[#187347]"
                        style={EDITORIAL_SERIF_STYLE}
                      >
                        {group}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-[#596556]">
                        {meta.summary}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3F673C] group-hover:text-[#187347]">
                      <span>Browse category</span>
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </motion.div>
              </EditorialReveal>
            );
          })}
        </div>
      </EditorialSection>

      {/* 02 / Research & Methodology */}
      <EditorialSection tone="sage" ariaLabelledBy="resources-heading">
        <EditorialSectionHeader
          eyebrow="02 / Research & Methodology"
          title="How Ethicality Scores Are Built"
          titleId="resources-heading"
          description="Every rating is grounded in the GDD Toolkit's student-led research rubric, openly documented for educators, researchers, and field practitioners."
        />

        <div className="mt-10">
          <DashboardResources variant="cards" />
        </div>
      </EditorialSection>

      {/* 03 / Frequently Asked Questions */}
      <EditorialSection tone="white" ariaLabelledBy="faq-heading">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <EditorialSectionHeader
            eyebrow="03 / Frequently Asked Questions"
            title="Using the AI Ethics Dashboard"
            titleId="faq-heading"
            description="Quick answers on our evaluation criteria, scoring methodology, search tools, and saved bookmarks."
          />

          <button
            type="button"
            onClick={() => setShowFaq((prev) => !prev)}
            aria-expanded={showFaq}
            className="inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-[#94B985] bg-[#F2F6EF] px-5 py-2.5 text-sm font-semibold text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8] focus:outline-none focus:ring-2 focus:ring-[#3F673C]"
          >
            <HelpCircle className="h-4 w-4 text-[#187347]" aria-hidden="true" />
            <span>{showFaq ? "Hide FAQ" : "Show FAQ"}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showFaq ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {showFaq && (
            <motion.div
              initial={reduced ? false : { opacity: 0, height: 0 }}
              animate={reduced ? undefined : { opacity: 1, height: "auto" }}
              exit={reduced ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
              className="overflow-hidden"
            >
              <div className="mt-8 space-y-3.5">
                {FAQS.map((faq, index) => {
                  const isOpen = openFaq === index;

                  return (
                    <div
                      key={faq.question}
                      className={`overflow-hidden rounded-2xl border-[1.5px] transition-colors duration-200 ${
                        isOpen
                          ? "border-[#3F673C] bg-[#FAFDF8]"
                          : "border-[#B2C9A8] bg-white hover:border-[#3F673C]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C]"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="font-mono text-xs font-medium text-[#187347]">
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
                              : "border-[#B2C9A8] bg-[#F2F6EF] text-[#284B26]"
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
                            initial={reduced ? false : { opacity: 0, height: 0 }}
                            animate={
                              reduced
                                ? undefined
                                : { opacity: 1, height: "auto" }
                            }
                            exit={reduced ? undefined : { opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-[#D5E3D9] px-6 py-4 pl-14 text-sm leading-relaxed text-[#394838] sm:text-base">
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

        {/* Bottom CTA Strip */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border-[1.5px] border-[#94B985] bg-[#F2F6EF] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#94B985] bg-white text-[#187347]">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3
                className="text-xl font-semibold text-[#202B20]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Ready to compare tools side by side?
              </h3>
              <p className="mt-1 text-sm text-[#596556]">
                Filter evaluated platforms by ethicality score tier or keyword
                in the interactive directory.
              </p>
            </div>
          </div>

          <Link
            to="/ai-ethics-dashboard/tools"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            <span>Open Tool Directory</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </EditorialSection>
    </div>
  );
}
