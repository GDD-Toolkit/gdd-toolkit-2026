import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  RotateCcw,
  SearchX,
  Sparkles,
} from "lucide-react";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialSection,
} from "@/components/editorial/EditorialPagePrimitives";
import DashboardResources from "../DashboardResources";
import ToolSearch from "../../../components/ai-ethics-dashboard/ToolSearch";
import ToolFilters, {
  type ToolFilterValues,
} from "../../../components/ai-ethics-dashboard/ToolFilters";
import { getAITools } from "../../../api/strapi";
import {
  getToolCategory,
  groupToolsByCategory,
  TOOL_CATEGORIES,
} from "../data/toolCategories";

type StrapiAITool = {
  id: number;
  documentId?: string;
  name: string;
  about_section?: string;
  category?: string | null;
  total_score: number;
  logo?: Array<{
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
    };
  }>;
};

const EMPTY_FILTERS: ToolFilterValues = {
  type: null,
  research: null,
  projectDevelopment: null,
  price: null,
  score: null,
};

const BOOKMARK_STORAGE_KEY = "gdd-ai-ethics-bookmarked-tools";

function loadBookmarks(): string[] {
  try {
    const raw = window.localStorage.getItem(BOOKMARK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

function getScoreTheme(score: number) {
  if (score >= 45) {
    return {
      badge: "border-[#94B985] bg-[#EDF4E8] text-[#187347]",
      bar: "from-[#3F673C] to-[#187347]",
      label: "High Alignment",
    };
  }
  if (score >= 35) {
    return {
      badge: "border-[#D6CE8A] bg-[#FAF8E4] text-[#6F6057]",
      bar: "from-[#B59B34] to-[#D6B84E]",
      label: "Moderate Alignment",
    };
  }
  return {
    badge: "border-[#E2B4B0] bg-[#FDF3F2] text-[#8F2D27]",
    bar: "from-[#B4463E] to-[#D46B62]",
    label: "Use with Caution",
  };
}

export default function AIEthicsTools() {
  const [searchParams, setSearchParams] = useSearchParams();
  const reduced = useReducedMotion();

  const category = searchParams.get("category");
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState<ToolFilterValues>(EMPTY_FILTERS);
  const [bookmarks, setBookmarks] = useState<string[]>(() => loadBookmarks());
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [tools, setTools] = useState<StrapiAITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    let cancelled = false;

    async function loadTools() {
      try {
        setLoading(true);
        setError("");

        const data = await getAITools();

        if (!cancelled) {
          setTools(data as StrapiAITool[]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load AI tools.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTools();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleBookmark = (toolName: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(toolName)
        ? prev.filter((name) => name !== toolName)
        : [...prev, toolName];
      try {
        window.localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota / privacy mode errors
      }
      return next;
    });
  };

  const toolsByCategory = groupToolsByCategory(tools);

  const handleSelectCategory = (nextCategory: string | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (nextCategory) {
      nextParams.set("category", nextCategory);
    } else {
      nextParams.delete("category");
    }
    setSearchParams(nextParams);
  };

  /**
   * Filters live Strapi tools by category (native Strapi `category` when
   * present, or mapped/inferred via `getToolCategory`), search query,
   * ethicality score tier, and saved bookmarks.
   */
  const filteredTools = tools.filter((tool) => {
    const toolCategory = getToolCategory(tool);
    const matchesCategory =
      !category ||
      toolCategory.toLowerCase() === category.trim().toLowerCase();

    const normalizedSearch = search.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      tool.name.toLowerCase().includes(normalizedSearch) ||
      toolCategory.toLowerCase().includes(normalizedSearch);

    const score = tool.total_score;
    let matchesScore = true;

    switch (filters.score) {
      case "45–50":
        matchesScore = score >= 45 && score <= 50;
        break;

      case "35–44":
        matchesScore = score >= 35 && score <= 44;
        break;

      case "Below 35":
        matchesScore = score < 35;
        break;
    }

    const matchesSaved = !showSavedOnly || bookmarks.includes(tool.name);

    return matchesCategory && matchesSearch && matchesScore && matchesSaved;
  });

  const handleSearch = () => {
    const query = search.trim();
    const nextParams = new URLSearchParams(searchParams);

    if (query) {
      nextParams.set("search", query);
    } else {
      nextParams.delete("search");
    }

    setSearchParams(nextParams);
  };

  const handleClearSearch = () => {
    setSearch("");
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("search");
    setSearchParams(nextParams);
  };

  const handleResetAll = () => {
    setSearch("");
    setFilters(EMPTY_FILTERS);
    setShowSavedOnly(false);
    setSearchParams(new URLSearchParams());
  };

  const avgVisibleScore =
    filteredTools.length > 0
      ? Math.round(
          (filteredTools.reduce((sum, t) => sum + t.total_score, 0) /
            filteredTools.length) *
            10,
        ) / 10
      : null;

  const hasActiveCriteria =
    Boolean(search.trim()) ||
    Boolean(category) ||
    showSavedOnly ||
    Object.values(filters).some(Boolean);

  return (
    <div className="w-full bg-white text-[#202B20]">
      {/* Compact Forest Green Editorial Hero */}
      <EditorialPageHero
        compact
        titleId="tools-directory-heading"
        backLink={{
          label: "Back to AI Ethics Dashboard",
          to: "/ai-ethics-dashboard",
        }}
        badges={[
          {
            label: category ? "Category Grouping" : "Full Tool Directory",
            tone: "cream",
          },
          {
            label: loading
              ? "Syncing CMS…"
              : `${filteredTools.length} of ${tools.length} Tools`,
            tone: "sage",
          },
        ]}
        title={
          category ? (
            <>
              {category}{" "}
              <em className="font-normal italic text-[#E9E6B2]">Tools</em>
            </>
          ) : search.trim() ? (
            <>
              Results for{" "}
              <em className="font-normal italic text-[#E9E6B2]">
                &ldquo;{search.trim()}&rdquo;
              </em>
            </>
          ) : (
            <>
              All Evaluated{" "}
              <em className="font-normal italic text-[#E9E6B2]">AI Tools</em>
            </>
          )
        }
        subtitle={
          category
            ? `Exploring evaluated tools under ${category}. Filter by ethicality score tier or search by name below.`
            : "Compare evaluated AI tools side by side across ethicality scores (0–50) and save favorites to revisit later."
        }
        aside={
          <div className="grid grid-cols-3 gap-3 rounded-2xl border-[1.5px] border-[#E9E6B2]/80 bg-white p-5 text-[#202B20] shadow-lg">
            <div className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-3">
              <span
                className="text-xl font-bold text-[#187347] sm:text-2xl"
                style={EDITORIAL_SERIF_STYLE}
              >
                {loading ? "—" : filteredTools.length}
              </span>
              <p className="mt-0.5 text-[11px] font-medium text-[#394838]">
                Showing
              </p>
            </div>
            <div className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-3">
              <span
                className="text-xl font-bold text-[#187347] sm:text-2xl"
                style={EDITORIAL_SERIF_STYLE}
              >
                {avgVisibleScore !== null ? `${avgVisibleScore}/50` : "—"}
              </span>
              <p className="mt-0.5 text-[11px] font-medium text-[#394838]">
                Avg. Score
              </p>
            </div>
            <div className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-3">
              <span
                className="text-xl font-bold text-[#187347] sm:text-2xl"
                style={EDITORIAL_SERIF_STYLE}
              >
                {bookmarks.length}
              </span>
              <p className="mt-0.5 text-[11px] font-medium text-[#394838]">
                Saved
              </p>
            </div>
          </div>
        }
      />

      {/* Sage Search & Filter Toolbar */}
      <section
        aria-label="Search and filter AI tools"
        className="w-full border-b border-[#B2C9A8] bg-[#F2F6EF]"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-xl">
              <ToolSearch
                variant="editorial"
                value={search}
                onChange={setSearch}
                onSearch={handleSearch}
                onClear={handleClearSearch}
              />
            </div>

            <DashboardResources variant="compact" />
          </div>

          <div className="border-t border-[#D5E3D9] pt-4">
            <p className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
              Explore by Category
            </p>
            <div
              role="tablist"
              aria-label="Filter tools by category"
              className="flex flex-wrap items-center gap-2"
            >
              <button
                type="button"
                role="tab"
                aria-selected={!category}
                onClick={() => handleSelectCategory(null)}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  !category
                    ? "bg-gradient-to-r from-[#3F673C] to-[#187347] text-white shadow-xs"
                    : "border border-[#94B985] bg-white text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8]"
                }`}
              >
                <span>All Tools</span>
                <span
                  className={`font-mono text-[10px] ${
                    !category ? "text-[#E9E6B2]" : "text-[#596556]"
                  }`}
                >
                  {loading ? "…" : tools.length}
                </span>
              </button>

              {TOOL_CATEGORIES.map((cat) => {
                const isSelected =
                  category?.trim().toLowerCase() === cat.toLowerCase();
                const count = toolsByCategory[cat]?.length ?? 0;

                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelectCategory(cat)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-[#3F673C] to-[#187347] font-semibold text-white shadow-xs"
                        : "border border-[#94B985] bg-white text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8]"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`font-mono text-[10px] ${
                        isSelected ? "text-[#E9E6B2]" : "text-[#596556]"
                      }`}
                    >
                      {loading ? "…" : count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#D5E3D9] pt-4">
            <ToolFilters
              filters={filters}
              onFilterChange={setFilters}
              hasExtraFilters={hasActiveCriteria}
              onClearAll={handleResetAll}
            />
          </div>
        </div>
      </section>

      {/* Tool Results Grid */}
      <EditorialSection tone="white" compact ariaLabel="Evaluated AI tools">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[#187347]">
              Evaluated Platforms
            </p>
            <h2
              className="mt-1 text-2xl font-semibold text-[#202B20]"
              style={EDITORIAL_SERIF_STYLE}
            >
              {category || "All Tools"}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {category && (
              <Link
                to="/ai-ethics-dashboard/tools"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#B2C9A8] bg-[#F2F6EF] px-3.5 py-1.5 text-xs font-semibold text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8]"
              >
                <span>Show all categories</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setShowSavedOnly((prev) => !prev)}
              aria-pressed={showSavedOnly}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                showSavedOnly
                  ? "border-[#3F673C] bg-[#3F673C] text-white"
                  : "border-[#B2C9A8] bg-white text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8]"
              }`}
            >
              <Bookmark
                className={`h-3.5 w-3.5 ${showSavedOnly ? "fill-current text-[#E9E6B2]" : "text-[#187347]"}`}
                aria-hidden="true"
              />
              <span>Saved ({bookmarks.length})</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-60 animate-pulse rounded-2xl border-[1.5px] border-[#D5E3D9] bg-[#F2F6EF] p-6"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div
            role="alert"
            className="mt-8 rounded-2xl border-[1.5px] border-[#E2B4B0] bg-[#FDF3F2] px-6 py-10 text-center"
          >
            <p
              className="text-xl font-semibold text-[#8F2D27]"
              style={EDITORIAL_SERIF_STYLE}
            >
              Unable to load AI tools
            </p>
            <p className="mt-2 text-sm text-[#596556]">{error}</p>
          </div>
        )}

        {/* Grid of Live Strapi Tool Cards */}
        {!loading && !error && (
          <AnimatePresence mode="popLayout">
            {filteredTools.length > 0 ? (
              <motion.div
                layout={!reduced}
                className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {filteredTools.map((tool, index) => {
                  const scoreTheme = getScoreTheme(tool.total_score);
                  const isBookmarked = bookmarks.includes(tool.name);
                  const logo =
                    tool.logo?.[0]?.formats?.small?.url || tool.logo?.[0]?.url;
                  const scorePct = Math.max(
                    0,
                    Math.min(100, (tool.total_score / 50) * 100),
                  );

                  return (
                    <motion.div
                      key={tool.documentId || tool.id}
                      layout={!reduced}
                      initial={reduced ? false : { opacity: 0, y: 14 }}
                      animate={reduced ? undefined : { opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
                      whileHover={reduced ? undefined : { y: -3 }}
                      transition={{
                        duration: 0.25,
                        delay: reduced ? 0 : Math.min(index * 0.03, 0.2),
                        ease: EDITORIAL_EASE,
                      }}
                      className="group flex flex-col justify-between rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6 transition-colors duration-200 hover:border-[#3F673C] hover:bg-[#FAFDF8]"
                    >
                      <div>
                        {/* Card Top Row: Logo + Title + Bookmark */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-1.5">
                              {logo ? (
                                <img
                                  src={logo}
                                  alt={`${tool.name} logo`}
                                  className="h-full w-full object-contain"
                                  loading="lazy"
                                />
                              ) : (
                                <Sparkles
                                  className="h-5 w-5 text-[#3F673C]"
                                  aria-hidden="true"
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <Link
                                to={`/ai-ethics-dashboard/tool?name=${encodeURIComponent(tool.name)}`}
                                className="block focus:outline-none"
                              >
                                <h3
                                  className="truncate text-lg font-semibold text-[#202B20] transition-colors group-hover:text-[#187347]"
                                  style={EDITORIAL_SERIF_STYLE}
                                >
                                  {tool.name}
                                </h3>
                              </Link>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSelectCategory(getToolCategory(tool))
                                }
                                className="mt-0.5 inline-block cursor-pointer truncate font-mono text-[10px] uppercase tracking-wider text-[#187347] hover:underline"
                              >
                                {getToolCategory(tool)}
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleBookmark(tool.name)}
                            aria-label={
                              isBookmarked
                                ? `Remove ${tool.name} from bookmarks`
                                : `Bookmark ${tool.name}`
                            }
                            aria-pressed={isBookmarked}
                            className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[#3F673C] ${
                              isBookmarked
                                ? "border-[#3F673C] bg-[#EDF4E8] text-[#187347]"
                                : "border-[#D5E3D9] bg-white text-[#596556] hover:border-[#3F673C] hover:bg-[#F2F6EF] hover:text-[#187347]"
                            }`}
                          >
                            <Bookmark
                              className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        {/* Ethicality Score Progress Bar (out of 50) */}
                        <div className="mt-6 rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-3.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#596556]">
                              Ethicality Score
                            </span>
                            <span
                              className={`rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold ${scoreTheme.badge}`}
                            >
                              {tool.total_score}/50
                            </span>
                          </div>

                          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white">
                            <motion.div
                              initial={reduced ? false : { width: 0 }}
                              animate={{ width: `${scorePct}%` }}
                              transition={{
                                duration: 0.65,
                                ease: EDITORIAL_EASE,
                              }}
                              className={`h-full rounded-full bg-gradient-to-r ${scoreTheme.bar}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card Footer CTA */}
                      <div className="mt-5 border-t border-[#E3EBDE] pt-4">
                        <Link
                          to={`/ai-ethics-dashboard/tool?name=${encodeURIComponent(tool.name)}`}
                          className="inline-flex w-full items-center justify-between text-sm font-semibold text-[#3F673C] transition-colors group-hover:text-[#187347]"
                        >
                          <span>View Ethical Breakdown</span>
                          <ArrowRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0 }}
                className="mt-10 flex flex-col items-center rounded-2xl border-[1.5px] border-dashed border-[#B2C9A8] bg-[#F2F6EF] px-6 py-14 text-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#94B985] bg-white text-[#3F673C]">
                  <SearchX className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3
                  className="mt-4 text-xl font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  No tools found
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#596556]">
                  Try adjusting your search keywords or score tier filter to see
                  more evaluated AI platforms.
                </p>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  <span>Reset Filters</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </EditorialSection>
    </div>
  );
}
