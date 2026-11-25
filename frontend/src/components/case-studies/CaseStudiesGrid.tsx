/**
 * CaseStudiesGrid - Responsive editorial magazine grid for case study cards.
 * Includes polished empty states and reusable loading skeleton cards.
 */

import { BookOpen, RotateCcw, SearchX } from "lucide-react";
import CaseStudyCard, { type CaseStudyCardItem } from "./CaseStudyCard";
import { EDITORIAL_SERIF_STYLE } from "@/components/editorial/EditorialPagePrimitives";

interface CaseStudiesGridProps {
  caseStudies: CaseStudyCardItem[];
  searchQuery?: string;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

export function CaseStudiesGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading case studies"
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col overflow-hidden rounded-2xl border-[1.5px] border-[#B2C9A8]/70 bg-white"
        >
          <div className="aspect-[16/10] w-full animate-pulse bg-[#EDF4E8]" />
          <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
            <div className="h-5 w-4/5 animate-pulse rounded bg-[#EDF4E8]" />
            <div className="h-5 w-3/5 animate-pulse rounded bg-[#EDF4E8]" />
            <div className="mt-1 space-y-2">
              <div className="h-3.5 w-full animate-pulse rounded bg-[#F2F6EF]" />
              <div className="h-3.5 w-11/12 animate-pulse rounded bg-[#F2F6EF]" />
              <div className="h-3.5 w-2/3 animate-pulse rounded bg-[#F2F6EF]" />
            </div>
            <div className="mt-2 flex gap-2">
              <div className="h-5 w-20 animate-pulse rounded-full bg-[#EDF4E8]" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-[#FAF8E4]" />
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-[#D5E3D9] pt-4">
              <div className="h-3 w-20 animate-pulse rounded bg-[#F2F6EF]" />
              <div className="h-3.5 w-20 animate-pulse rounded bg-[#EDF4E8]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CaseStudiesGrid({
  caseStudies,
  searchQuery,
  hasActiveFilters = false,
  onClearFilters,
}: CaseStudiesGridProps) {
  if (caseStudies.length === 0) {
    const isFiltered = Boolean(searchQuery?.trim()) || hasActiveFilters;

    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-[1.5px] border-dashed border-[#B2C9A8] bg-[#FAFDF8] px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#B2C9A8] bg-[#EDF4E8] text-[#284B26]">
          {isFiltered ? (
            <SearchX className="h-6 w-6" aria-hidden="true" />
          ) : (
            <BookOpen className="h-6 w-6" aria-hidden="true" />
          )}
        </div>

        <h3
          className="mt-4 text-xl font-semibold text-[#202B20]"
          style={EDITORIAL_SERIF_STYLE}
        >
          {isFiltered
            ? "No case studies match your criteria"
            : "No case studies available"}
        </h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#596556]">
          {searchQuery?.trim()
            ? `We couldn't find any studies matching "${searchQuery.trim()}". Try broadening your search or clearing active filters.`
            : isFiltered
              ? "Try removing one or more value, region, SDG, or segment filters to broaden the archive."
              : "Case studies are currently unavailable. Please check back shortly."}
        </p>

        {isFiltered && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#3F673C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#284B26] focus:outline-none focus:ring-2 focus:ring-[#3F673C] focus:ring-offset-2"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {caseStudies.map((study, index) => (
        <CaseStudyCard key={study.id} caseStudy={study} index={index} />
      ))}
    </div>
  );
}
