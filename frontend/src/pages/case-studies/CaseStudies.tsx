/**
 * CaseStudiesPage - Main page component for the Case Studies section
 * Features: search bar and magazine-style grid with all case studies
 * Each card is labeled as either "Worthwhile Development" or "Maldevelopment"
 */

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CaseStudiesGrid from "@/components/case-studies/CaseStudiesGrid";
import CaseStudyModal from "@/components/case-studies/CaseStudyModal";
import { fetchWorthwhile, fetchMaldevelopment } from "@/api/caseStudies";
import type { CaseStudy, CaseStudySegment } from "@/types/caseStudies";
import "./CaseStudies.css";
import CaseStudyFilters from "./CaseStudyFilters";

const DESKTOP_QUERY = "(min-width: 1280px)";
const DESKTOP_PAGE_SIZE = 9;
const MOBILE_PAGE_SIZE = 6;

function getPaginationItems(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  const pages = Array.from(new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]))
    .filter(page => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
  const items: (number | "ellipsis")[] = [];
  pages.forEach((page, index) => {
    const previous = pages[index - 1];
    if (previous !== undefined && page - previous === 2) items.push(previous + 1);
    else if (previous !== undefined && page - previous > 2) items.push("ellipsis");
    items.push(page);
  });
  return items;
}

// Extended CaseStudy type with segment label
type CaseStudyWithSegment = CaseStudy & {
  segment: "worthwhile" | "maldevelopment";
};

export default function CaseStudies() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [allCaseStudies, setAllCaseStudies] = useState<CaseStudyWithSegment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedSdgs, setSelectedSdgs] = useState<number[]>([]);
    const [selectedSegment, setSelectedSegment] = useState<CaseStudySegment | "">("");
  
    const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
      setCurrentPage(1);
    };
    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Fetch all case studies (both worthwhile and maldevelopment)
  useEffect(() => {
    async function loadAllCaseStudies() {
      try {
        setLoading(true);
        setError(null);
        const [worthwhile, maldevelopment] = await Promise.all([
          fetchWorthwhile().catch(() => []),
          fetchMaldevelopment().catch(() => []), // !!! Failed to load resource: the server responded with a status of 404 (Not Found)
        ]);

        // Combine and label each case study with its segment
        const worthwhileWithSegment: CaseStudyWithSegment[] = worthwhile.map(cs => ({
          ...cs,
          segment: "worthwhile" as const,
        }));
        const maldevelopmentWithSegment: CaseStudyWithSegment[] = maldevelopment.map(cs => ({
          ...cs,
          segment: "maldevelopment" as const,
        }));

        setAllCaseStudies([...worthwhileWithSegment, ...maldevelopmentWithSegment]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load case studies");
      } finally {
        setLoading(false);
      }
    }

    loadAllCaseStudies();
  }, []);

  const filteredCaseStudies = allCaseStudies.filter(study => {
    if (searchQuery.trim()) {
      if (!study.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
    }

    const matchesValues =
    selectedValues.length === 0 ||
    selectedValues.some(v => study.values?.includes(v));

    const matchesRegions =
    selectedRegions.length === 0 ||
    selectedRegions.some(r => study.regions?.includes(r));

    const matchesSdgs =
    selectedSdgs.length === 0 ||
    selectedSdgs.some(s => study.sdgs?.includes(s));

    return matchesValues && matchesRegions && matchesSdgs &&
      (!selectedSegment || study.segment === selectedSegment);
  });

  const pageSize = isDesktop ? DESKTOP_PAGE_SIZE : MOBILE_PAGE_SIZE;
  const totalPages = Math.ceil(filteredCaseStudies.length / pageSize);
  const page = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (page - 1) * pageSize;
  const visibleCaseStudies = filteredCaseStudies.slice(startIndex, startIndex + pageSize);
  
  const allValues = Array.from(
    new Set(allCaseStudies.flatMap(cs => cs.values ?? []))
  ).sort();
  
  const allRegions = Array.from(
    new Set(allCaseStudies.flatMap(cs => cs.regions ?? []))
  ).sort();
  
  const allSdgs = Array.from(
    new Set(allCaseStudies.flatMap(cs => cs.sdgs ?? []))
  ).sort((a, b) => a - b);
  
  // Check for case study ID in URL and open modal
  useEffect(() => {
    const caseStudyId = searchParams.get("id");
    if (caseStudyId) {
      async function loadCaseStudy() {
        try {
          const [worthwhile, maldevelopment] = await Promise.all([
            fetchWorthwhile().catch(() => []),
            fetchMaldevelopment().catch(() => []),
          ]);
          const allCaseStudies = [...worthwhile, ...maldevelopment];
          const found = allCaseStudies.find((cs) => cs.id === caseStudyId);
          if (found) {
            setSelectedCaseStudy(found);
            setIsModalOpen(true);
          }
        } catch (err) {
          console.error("Failed to load case study:", err);
        }
      }
      loadCaseStudy();
    }
  }, [searchParams]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCaseStudy(null);
    // Remove id from URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("id");
    setSearchParams(newSearchParams, { replace: true });
  };

  // Render content
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12 mx-auto">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#B2C9A8] border-t-[#187347]"></div>
          <p className="mt-4 text-sm text-[#596556]">Loading case studies...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 mx-auto">
          <p className="font-editorial text-lg font-semibold text-[#9a2f26] mb-2">Failed to load case studies.</p>
          <p className="text-sm text-[#596556]">Please try again later.</p>
          {import.meta.env.DEV && (
            <p className="text-xs text-[#596556] mt-2">{error}</p>
          )}
        </div>
      );
    }

    return (
    <div className="flex w-full flex-col gap-5">
      <span aria-live="polite" className="mx-auto font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#596556]">
        Showing {visibleCaseStudies.length ? `${startIndex + 1}–${startIndex + visibleCaseStudies.length}` : "0"} of {filteredCaseStudies.length} case studies
      </span>
      <CaseStudiesGrid
        caseStudies={visibleCaseStudies}
        searchQuery={searchQuery}
        hasActiveFilters={Boolean(selectedValues.length || selectedRegions.length || selectedSdgs.length || selectedSegment)}
      />
      {totalPages > 1 && (
        <nav aria-label="Case study pagination" className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => setCurrentPage(page - 1)}
            className="flex size-11 items-center justify-center rounded-xl border border-[#B2C9A8] bg-white text-[#284B26] transition-colors hover:bg-[#F2F6EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C]/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          {getPaginationItems(page, totalPages).map((item, index) => item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} aria-hidden="true" className="flex size-8 items-center justify-center text-[#596556]">…</span>
          ) : (
            <button
              key={item}
              type="button"
              aria-label={`Page ${item}`}
              aria-current={page === item ? "page" : undefined}
              onClick={() => setCurrentPage(item)}
              className={`flex size-11 items-center justify-center rounded-xl border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C]/50 ${
                page === item
                  ? "border-[#3F673C] bg-[#3F673C] text-white"
                  : "border-[#B2C9A8] bg-white text-[#284B26] hover:bg-[#F2F6EF]"
              }`}
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            disabled={page === totalPages}
            onClick={() => setCurrentPage(page + 1)}
            className="flex size-11 items-center justify-center rounded-xl border border-[#B2C9A8] bg-white text-[#284B26] transition-colors hover:bg-[#F2F6EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C]/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
    );
  };

    return (
    <div className="min-h-screen bg-white text-[#202B20]">
      {/* Page Header */}
      <header className="editorial-grid-texture bg-[#3F673C] text-white py-14">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-5 pb-20">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center rounded-full border border-[#9AB887] bg-[#2E502B] px-3.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#E9E6B2]">
              03 · Global Case Library
            </span>
            <span className="inline-flex items-center rounded-full border border-[#9AB887]/60 bg-[#355832] px-3.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#EDF4E8]">
              Worthwhile &amp; Maldevelopment
            </span>
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl font-semibold tracking-tight text-white">Case <em className="font-normal italic text-[#E9E6B2]">Studies</em></h1>
          <div className="text-base md:text-lg leading-relaxed text-[#E8F0E5]">This tool includes a dedicated library of case studies that highlight both exemplary development practices and real-world instances of maldevelopment. These cases give users a grounded understanding of how ethical challenges unfold in practice, and how values-based, human-centered approaches can lead to better outcomes. By learning from successes and missteps alike, users of our toolkit can more confidently apply these lessons and principles to their own projects.</div>
          <div className="text-sm md:text-base text-[#E8F0E5]"> See the <a
                        href="/projectevaloldinternal.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#E9E6B2] underline underline-offset-4 transition-colors hover:text-[#f2efbf]"
                    >case study evaluation methodology</a> for more details.
          </div>
          <div className="text-sm md:text-base text-[#E8F0E5]">Below is a tutorial on how to navigate and utilize the case studies effectively.</div>
        </div>
      </header>
        
            <section className="content-section">
                <div className="flex justify-center -mt-20">
                    <video
                        src="/Case_study_video.mp4" // Local video URL
                        width="100%"
                        height="480"
                        controls // adds play/pause buttons
                        className="block rounded-2xl border-[1.5px] border-[#94B985] bg-[#202B20] shadow-xl"
                        title="Case Study Tutorial"
                    ></video>

                </div>
            </section>
        
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-8">
        <CaseStudyFilters
          searchQuery={searchQuery}
          onSearchChange={(query) => { setSearchQuery(query); setCurrentPage(1); }}
          values={allValues}
          selectedValues={selectedValues}
          onValuesChange={(values) => { setSelectedValues(values); setCurrentPage(1); }}
          regions={allRegions}
          selectedRegions={selectedRegions}
          onRegionsChange={(regions) => { setSelectedRegions(regions); setCurrentPage(1); }}
          sdgs={allSdgs}
          selectedSdgs={selectedSdgs}
          onSdgsChange={(sdgs) => { setSelectedSdgs(sdgs); setCurrentPage(1); }}
          segment={selectedSegment}
          onSegmentChange={(segment) => { setSelectedSegment(segment); setCurrentPage(1); }}
          onClear={() => {
            setSearchQuery("");
            setSelectedValues([]);
            setSelectedRegions([]);
            setSelectedSdgs([]);
            setSelectedSegment("");
            setCurrentPage(1);
          }}
        />
        {renderContent()}
      </main>

      {/* Case Study Modal */}
      <CaseStudyModal
        caseStudy={selectedCaseStudy}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
        </div>
    );
}
