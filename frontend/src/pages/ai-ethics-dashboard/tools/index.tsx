import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  RotateCcw,
  SearchX,
  ShieldCheck,
  Tag,
} from "lucide-react";

import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialSection,
} from "@/components/editorial/EditorialPagePrimitives";
import DashboardResources from "../DashboardResources";
import { tools } from "../data/aiTools";
import ToolFilters, {
  type ToolFilterValues,
} from "../../../components/ai-ethics-dashboard/ToolFilters";
import ToolSearch from "../../../components/ai-ethics-dashboard/ToolSearch";

const BOOKMARKS_STORAGE_KEY = "gdd-ai-ethics-bookmarks";

const EMPTY_FILTERS: ToolFilterValues = {
  type: null,
  research: null,
  projectDevelopment: null,
  price: null,
  score: null,
};

function loadBookmarks(): string[] {
  try {
    const raw = window.localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function getScoreVisuals(score: number) {
  if (score >= 90) {
    return {
      badge: "border-[#94B985] bg-[#EDF4E8] text-[#187347]",
      bar: "bg-[#187347]",
      label: "Strong",
    };
  }
  if (score >= 70) {
    return {
      badge: "border-[#D6CE8A] bg-[#FAF8E4] text-[#6F6057]",
      bar: "bg-[#C2A83E]",
      label: "Moderate",
    };
  }
  return {
    badge: "border-[#E2B4B0] bg-[#FDF3F2] text-[#8F2D27]",
    bar: "bg-[#C65347]",
    label: "Caution",
  };
}

export default function AIEthicsTools() {
  const reduced = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();

  /*
   * Category comes from the main dashboard.
   * Example: /tools?category=Research
   */
  const category = searchParams.get("category")?.trim();

  /*
   * Search can come from the main dashboard.
   * Example: /tools?search=Chatbot
   */
  const urlSearch = searchParams.get("search")?.trim() || "";

  const [filters, setFilters] = useState<ToolFilterValues>(EMPTY_FILTERS);
  const [search, setSearch] = useState(urlSearch);
  const [bookmarks, setBookmarks] = useState<string[]>(() => loadBookmarks());
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  /*
   * Keep the search box synchronized with the URL.
   */
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  const toggleBookmark = (
    event: React.MouseEvent<HTMLButtonElement>,
    toolName: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setBookmarks((prev) => {
      const next = prev.includes(toolName)
        ? prev.filter((item) => item !== toolName)
        : [...prev, toolName];
      try {
        window.localStorage.setItem(
          BOOKMARKS_STORAGE_KEY,
          JSON.stringify(next),
        );
      } catch {
        // Ignore storage write failures in private browsing.
      }
      return next;
    });
  };

  /*
   * A search is a Tools-page filter.
   * Therefore, once search or any filter is active,
   * the main dashboard category is ignored and filtering runs on ALL tools.
   */
  const hasToolFilters =
    filters.type !== null ||
    filters.research !== null ||
    filters.projectDevelopment !== null ||
    filters.price !== null ||
    filters.score !== null ||
    search.trim() !== "";

  const filteredTools = useMemo(() => {
    const base = tools.filter((tool) => {
      if (!hasToolFilters) {
        if (!category) {
          return true;
        }

        return (
          tool.category.trim().toLowerCase() === category.trim().toLowerCase()
        );
      }

      const matchesType = filters.type ? tool.type === filters.type : true;

      const matchesResearch = filters.research
        ? tool.research === filters.research
        : true;

      const matchesProjectDevelopment = filters.projectDevelopment
        ? tool.projectDevelopment === filters.projectDevelopment
        : true;

      const matchesPrice = filters.price ? tool.price === filters.price : true;

      const matchesScore = filters.score
        ? filters.score === "90–100"
          ? tool.score >= 90
          : filters.score === "70–89"
            ? tool.score >= 70 && tool.score <= 89
            : tool.score < 70
        : true;

      const normalizedSearch = search.trim().toLowerCase();

      const matchesSearch = normalizedSearch
        ? [
            tool.name,
            tool.category,
            tool.type,
            tool.research,
            tool.projectDevelopment,
            tool.price,
            String(tool.score),
          ].some((value) => value.toLowerCase().includes(normalizedSearch))
        : true;

      return (
        matchesType &&
        matchesResearch &&
        matchesProjectDevelopment &&
        matchesPrice &&
        matchesScore &&
        matchesSearch
      );
    });

    if (bookmarkedOnly) {
      return base.filter((tool) => bookmarks.includes(tool.name));
    }

    return base;
  }, [hasToolFilters, category, filters, search, bookmarkedOnly, bookmarks]);

  const averageVisibleScore = useMemo(() => {
    if (filteredTools.length === 0) return 0;
    return Math.round(
      filteredTools.reduce((sum, item) => sum + item.score, 0) /
        filteredTools.length,
    );
  }, [filteredTools]);

  const categoryTitle = hasToolFilters
    ? search.trim()
      ? `Search: "${search.trim()}"`
      : "Filtered Tools"
    : category || "All Tools";

  const handleSearch = () => {
    const query = search.trim();

    if (!query) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("search");
      setSearchParams(nextParams);
      return;
    }

    setSearchParams({
      search: query,
    });
  };

  const handleClearSearch = () => {
    setSearch("");
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("search");
    setSearchParams(nextParams);
  };

  const handleResetAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch("");
    setBookmarkedOnly(false);
    setSearchParams(new URLSearchParams());
  };

  return (
    <main className="min-h-screen w-full bg-white text-[#202B20]">

      {/* Compact Forest Green Editorial Hero */}
      <EditorialPageHero
        compact
        ariaLabel="AI Tools Directory header"
        backLink={{
          label: "Back to AI Ethics Dashboard",
          to: "/ai-ethics-dashboard",
        }}
        badges={[
          {
            label:
              category && !hasToolFilters
                ? "Category Grouping"
                : hasToolFilters
                  ? "Filtered Directory"
                  : "Full Directory",
            tone: "cream",
          },
          {
            label: `${filteredTools.length} of ${tools.length} Tools`,
            tone: "sage",
          },
        ]}
        title={
          category && !hasToolFilters ? (
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
              AI Tools{" "}
              <em className="font-normal italic text-[#E9E6B2]">Directory</em>
            </>
          )
        }
        subtitle={
          hasToolFilters
            ? "Searching and filtering across all evaluated AI tools in the dashboard. Clear active filters to browse by dashboard category."
            : category
              ? `Exploring evaluated tools grouped under ${category}. Use any filter below to compare across the full directory.`
              : "Compare evaluated AI platforms by type, research fit, project development stage, pricing, and ethicality score."
        }
        aside={
          <div className="grid grid-cols-3 gap-3 rounded-2xl border-[1.5px] border-[#E9E6B2]/80 bg-white p-4 text-[#202B20] shadow-lg sm:p-5">
            <div className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-3">
              <p
                className="text-2xl font-bold text-[#187347]"
                style={EDITORIAL_SERIF_STYLE}
              >
                {filteredTools.length}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-[#394838]">
                Showing
              </p>
            </div>
            <div className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-3">
              <p
                className="text-2xl font-bold text-[#187347]"
                style={EDITORIAL_SERIF_STYLE}
              >
                {filteredTools.length > 0 ? averageVisibleScore : "—"}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-[#394838]">
                Avg. Score
              </p>
            </div>
            <div className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-3">
              <p
                className="text-2xl font-bold text-[#187347]"
                style={EDITORIAL_SERIF_STYLE}
              >
                {bookmarks.length}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-[#394838]">
                Saved
              </p>
            </div>
          </div>
        }
      />

      {/* Sage Wash Editorial Search & Filter Bar */}
      <EditorialSection
        tone="sage"
        compact
        ariaLabel="Search and filter AI tools"
        className="py-7 md:py-9"
      >
        <div className="flex flex-col gap-5">
          {/* Search + Resource Actions Row */}
          <div className="flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
            <ToolSearch
              value={search}
              onChange={setSearch}
              onSearch={handleSearch}
              onClear={handleClearSearch}
              className="max-w-2xl"
            />

            <DashboardResources variant="compact" />
          </div>

          {/* Filter Pills Row */}
          <div className="border-t border-[#D5E3D9] pt-4">
            <ToolFilters
              filters={filters}
              onFilterChange={setFilters}
              onClearAll={handleResetAll}
              hasExtraFilters={
                search.trim().length > 0 || bookmarkedOnly || Boolean(category)
              }
            />
          </div>
        </div>
      </EditorialSection>

      {/* White Directory Grid Section */}
      <EditorialSection
        tone="white"
        compact
        ariaLabelledBy="directory-results-heading"
      >
        {/* Directory Results Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#D5E3D9] pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#187347]">
              Evaluated Platforms
            </p>
            <h2
              id="directory-results-heading"
              className="mt-1.5 text-2xl font-semibold tracking-tight text-[#202B20] sm:text-3xl"
              style={EDITORIAL_SERIF_STYLE}
            >
              {categoryTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {category && !hasToolFilters && (
              <Link
                to="/ai-ethics-dashboard/tools"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#B2C9A8] bg-[#F2F6EF] px-3.5 py-1.5 text-xs font-semibold text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8]"
              >
                <span>Show all categories</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setBookmarkedOnly((prev) => !prev)}
              aria-pressed={bookmarkedOnly}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                bookmarkedOnly
                  ? "border-[#3F673C] bg-[#3F673C] text-white"
                  : "border-[#B2C9A8] bg-white text-[#284B26] hover:border-[#3F673C] hover:bg-[#FAFDF8]"
              }`}
            >
              <Bookmark
                className={`h-3.5 w-3.5 ${bookmarkedOnly ? "fill-current text-[#E9E6B2]" : "text-[#187347]"}`}
                aria-hidden="true"
              />
              <span>Saved ({bookmarks.length})</span>
            </button>
          </div>
        </div>

        {/* Animated Grid of Green-Outlined Tool Cards */}
        {filteredTools.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool, index) => {
                const isBookmarked = bookmarks.includes(tool.name);
                const scoreVisual = getScoreVisuals(tool.score);

                return (
                  <motion.div
                    key={tool.name}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    animate={reduced ? undefined : { opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
                    whileHover={reduced ? undefined : { y: -4 }}
                    transition={{
                      duration: 0.24,
                      delay: reduced ? 0 : Math.min(index * 0.03, 0.2),
                      ease: EDITORIAL_EASE,
                    }}
                    className="h-full"
                  >
                    <Link
                      to={`/ai-ethics-dashboard/tool?name=${encodeURIComponent(
                        tool.name,
                      )}`}
                      className="group flex h-full flex-col justify-between rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6 transition-all duration-200 hover:border-[#3F673C] hover:bg-[#FAFDF8] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#3F673C] focus:ring-offset-2"
                    >
                      <div>
                        {/* Top row: Category pill + Bookmark */}
                        <div className="flex items-start justify-between gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#D5E3D9] bg-[#F2F6EF] px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26]">
                            <Tag className="h-2.5 w-2.5 text-[#187347]" aria-hidden="true" />
                            <span className="max-w-[155px] truncate">
                              {tool.category}
                            </span>
                          </span>

                          <button
                            type="button"
                            onClick={(e) => toggleBookmark(e, tool.name)}
                            aria-label={
                              isBookmarked
                                ? `Remove ${tool.name} from bookmarks`
                                : `Bookmark ${tool.name}`
                            }
                            aria-pressed={isBookmarked}
                            className={`inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors ${
                              isBookmarked
                                ? "border-[#3F673C] bg-[#EDF4E8] text-[#187347]"
                                : "border-transparent bg-transparent text-[#596556] hover:border-[#B2C9A8] hover:bg-[#F2F6EF] hover:text-[#284B26]"
                            }`}
                          >
                            <Bookmark
                              className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        {/* Tool Title */}
                        <h3
                          className="mt-3.5 text-xl font-semibold text-[#202B20] transition-colors group-hover:text-[#187347]"
                          style={EDITORIAL_SERIF_STYLE}
                        >
                          {tool.name}
                        </h3>

                        {/* Metadata Tags */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="rounded-full border border-[#D5E3D9] bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#394838]">
                            {tool.type}
                          </span>
                          <span className="rounded-full border border-[#D5E3D9] bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#394838]">
                            {tool.price}
                          </span>
                          <span className="rounded-full border border-[#D5E3D9] bg-[#F2F6EF] px-2.5 py-0.5 text-[11px] font-medium text-[#284B26]">
                            {tool.projectDevelopment}
                          </span>
                        </div>

                        {/* Ethicality Score Bar */}
                        <div className="mt-5 rounded-xl border border-[#D5E3D9] bg-[#F2F6EF]/70 p-3.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#394838]">
                              <ShieldCheck
                                className="h-3.5 w-3.5 text-[#187347]"
                                aria-hidden="true"
                              />
                              Ethicality Score
                            </span>

                            <span
                              className={`rounded-full border px-2 py-0.5 font-mono text-[11px] font-semibold ${scoreVisual.badge}`}
                            >
                              {tool.score}/100
                            </span>
                          </div>

                          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#DCE8D7]">
                            <motion.div
                              initial={reduced ? false : { width: 0 }}
                              animate={{ width: `${tool.score}%` }}
                              transition={{
                                duration: 0.6,
                                delay: reduced ? 0 : 0.1,
                                ease: EDITORIAL_EASE,
                              }}
                              className={`h-full rounded-full ${scoreVisual.bar}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-5 flex items-center justify-between border-t border-[#D5E3D9]/80 pt-3.5 text-xs font-semibold text-[#3F673C] group-hover:text-[#187347]">
                        <span>Inspect ethical profile</span>
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Editorial Empty State */
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border-[1.5px] border-dashed border-[#B2C9A8] bg-[#F2F6EF]/60 px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#B2C9A8] bg-white text-[#3F673C]">
              <SearchX className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3
              className="mt-4 text-xl font-semibold text-[#202B20]"
              style={EDITORIAL_SERIF_STYLE}
            >
              No matching AI tools found
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#596556]">
              {bookmarkedOnly
                ? "You do not have any bookmarked tools matching your current selection."
                : "No tools matched your active search or filter combination. Try broadening your criteria or resetting all filters."}
            </p>
            <button
              type="button"
              onClick={handleResetAll}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#3F673C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#187347]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Reset Filters &amp; Show All Tools</span>
            </button>
          </div>
        )}
      </EditorialSection>
    </main>
  );
}
