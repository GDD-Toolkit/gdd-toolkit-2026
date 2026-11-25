import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FolderOpen, SearchX, Sparkles } from "lucide-react";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
} from "@/components/editorial/EditorialPagePrimitives";
import type { AITool } from "../../pages/ai-ethics-dashboard/data/aiTools";

type SearchResultsProps = {
  query: string;
  category?: string;
  tools: AITool[];
  onCategoryClick: () => void;
  onToolClick: (tool: AITool) => void;
  onViewAll: () => void;
};

function getScoreBadgeClasses(score: number) {
  if (score >= 90) {
    return "border-[#94B985] bg-[#EDF4E8] text-[#187347]";
  }
  if (score >= 70) {
    return "border-[#D6CE8A] bg-[#FAF8E4] text-[#6F6057]";
  }
  return "border-[#E2B4B0] bg-[#FDF3F2] text-[#8F2D27]";
}

export default function SearchResults({
  query,
  category,
  tools,
  onCategoryClick,
  onToolClick,
  onViewAll,
}: SearchResultsProps) {
  const reduced = useReducedMotion();

  if (!query.trim()) {
    return null;
  }

  const hasCategory = Boolean(category);
  const hasTools = tools.length > 0;

  const motionProps = reduced
    ? {}
    : {
        initial: { opacity: 0, y: -8, scale: 0.99 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -6, scale: 0.99 },
        transition: { duration: 0.18, ease: EDITORIAL_EASE },
      };

  if (!hasCategory && !hasTools) {
    return (
      <motion.div
        {...motionProps}
        role="region"
        aria-label="Search results"
        className="mt-2.5 overflow-hidden rounded-2xl border-[1.5px] border-[#94B985] bg-white p-6 text-left text-[#202B20] shadow-xl"
      >
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] text-[#3F673C]">
            <SearchX className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p
              className="text-base font-semibold text-[#202B20]"
              style={EDITORIAL_SERIF_STYLE}
            >
              No results found for &ldquo;{query}&rdquo;
            </p>
            <p className="mt-1 text-sm text-[#596556]">
              Try searching by tool name, category (e.g., Research, Education),
              pricing tier, or ethicality score.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...motionProps}
      role="region"
      aria-label="Search results"
      className="mt-2.5 overflow-hidden rounded-2xl border-[1.5px] border-[#94B985] bg-white text-left text-[#202B20] shadow-xl"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#D5E3D9] bg-[#F2F6EF] px-5 py-3">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
          Search Results
        </span>
        <span className="font-mono text-[11px] font-medium text-[#394838]">
          {hasTools
            ? `${tools.length} ${tools.length === 1 ? "tool" : "tools"} matched`
            : "1 category matched"}
        </span>
      </div>

      {/* Matching Dashboard Category */}
      {hasCategory && (
        <div className="border-b border-[#D5E3D9] px-4 py-3.5 sm:px-5">
          <p className="px-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#596556]">
            Dashboard Section
          </p>

          <button
            type="button"
            onClick={onCategoryClick}
            className="group mt-1.5 flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-all hover:border-[#B2C9A8] hover:bg-[#FAFDF8] focus:outline-none focus:ring-2 focus:ring-[#3F673C]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#B2C9A8] bg-[#EDF4E8] text-[#187347]">
                <FolderOpen className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p
                  className="text-base font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {category}
                </p>
                <p className="text-xs text-[#596556]">
                  Jump to and highlight this category card
                </p>
              </div>
            </div>

            <ArrowRight
              className="h-4 w-4 shrink-0 text-[#3F673C] transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      )}

      {/* Matching Tools */}
      {hasTools && (
        <div className="px-4 py-3.5 sm:px-5">
          <div className="flex items-center justify-between px-2">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#596556]">
              Evaluated Tools
            </p>
            <p className="font-mono text-[10px] text-[#596556]">
              {tools.length > 5
                ? `Top 5 of ${tools.length}`
                : `${tools.length} ${tools.length === 1 ? "result" : "results"}`}
            </p>
          </div>

          <div className="mt-1.5 space-y-1">
            {tools.slice(0, 5).map((tool) => (
              <button
                key={tool.name}
                type="button"
                onClick={() => onToolClick(tool)}
                className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-all hover:border-[#B2C9A8] hover:bg-[#FAFDF8] focus:outline-none focus:ring-2 focus:ring-[#3F673C]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#D5E3D9] bg-[#F2F6EF] text-[#3F673C]">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-semibold text-[#202B20] sm:text-base"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {tool.name}
                    </p>
                    <p className="truncate text-xs text-[#596556]">
                      {tool.type} &middot; {tool.price} &middot; {tool.category}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2.5">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${getScoreBadgeClasses(tool.score)}`}
                  >
                    {tool.score}/100
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-[#596556] transition-all group-hover:translate-x-0.5 group-hover:text-[#187347]"
                    aria-hidden="true"
                  />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 border-t border-[#D5E3D9] pt-3">
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#3F673C] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#187347] focus:outline-none focus:ring-2 focus:ring-[#3F673C] focus:ring-offset-1"
            >
              <span>View all matching tools</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
