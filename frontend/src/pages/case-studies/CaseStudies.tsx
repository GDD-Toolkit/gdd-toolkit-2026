/**
 * CaseStudiesPage - Main page component for the Case Studies section
 * Features: search bar and magazine-style grid with all case studies
 * Each card is labeled as either "Worthwhile Development" or "Maldevelopment"
 */

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CaseStudiesGrid from "@/components/case-studies/CaseStudiesGrid";
import CaseStudyModal from "@/components/case-studies/CaseStudyModal";
import { fetchWorthwhile, fetchMaldevelopment } from "@/api/caseStudies";
import type { CaseStudy } from "@/types/caseStudies";
import "./CaseStudies.css";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

const CASE_STUDIES_PER_PAGE = 8;

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
  
    const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(CASE_STUDIES_PER_PAGE);

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

    return matchesValues && matchesRegions && matchesSdgs;
  });

  useEffect(() => {
    setVisibleCount(CASE_STUDIES_PER_PAGE);
  }, [searchQuery, selectedValues, selectedRegions, selectedSdgs]);

  const visibleCaseStudies = filteredCaseStudies.slice(0, visibleCount);
  
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
    <div className="flex flex-col gap-5 md:w-2/3 lg:w-2/3">
      <span className="mx-auto font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#596556]">Showing {visibleCaseStudies.length} of {filteredCaseStudies.length} case studies</span>
      <CaseStudiesGrid caseStudies={visibleCaseStudies} searchQuery={searchQuery} />
      {visibleCount < filteredCaseStudies.length && (
        <Button
          className="self-center rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-7 text-sm font-semibold text-white hover:brightness-110"
          onClick={() => setVisibleCount(count => count + CASE_STUDIES_PER_PAGE)}
        >
          Load more
        </Button>
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
          <div className="text-base md:text-lg leading-relaxed text-[#E8F0E5]">This tool includes a dedicated library of case studies that highlight both exemplary development practices and real-world instances of maldevelopment. These cases give users a grounded understanding of how ethical challenges unfold in practice—and how values-based, human-centered approaches can lead to better outcomes. By learning from successes and missteps alike, users of our toolkit can more confidently apply these lessons and principles to their own projects.</div>
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
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col md:flex-row lg:flex-row gap-6 md:gap-10 lg:gap-10">
        {/* Search */}
        <div className="flex flex-col gap-5 border-[1.5px] border-[#B2C9A8] bg-[#F2F6EF] p-6 z-10 md:sticky lg:sticky top-25 md:w-1/3 lg:w-1/3 h-fit rounded-2xl shadow-xs">
          <h2 className="font-editorial text-xl font-semibold tracking-tight text-[#202B20]">Filter Case Studies</h2>
          <ul className="flex flex-col gap-5">
            <li>
              <h3 className="mb-1.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#187347]">Search</h3>
              <input
                type="text"
                placeholder="Search by case study name…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-xl rounded-full px-4 py-2
                border-[1.5px] border-[#B2C9A8]
                bg-white
                text-sm text-[#202B20]
                placeholder-[#596556]
                focus:border-[#3F673C] focus:outline-none focus:ring-2 focus:ring-[#3F673C]/25"
              />
            </li>

            <li>
              <h3 className="mb-1.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#187347]">Values</h3>
              <ToggleGroup 
                size="sm" 
                variant="outline"
                className="gap-2 p-1 rounded-lg flex-wrap"
                multiple
                onValueChange={(v) => {
                if (v) {
                  setSelectedValues(v);
                }
              }}
              >
                {allValues.map((v) => 
                  <ToggleGroupItem key={v} value={v} aria-label={"Toggle " + v} className="!rounded-full border border-[#94B985] bg-white px-3 text-xs font-medium text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8] aria-pressed:border-[#3F673C] aria-pressed:bg-[#3F673C] aria-pressed:text-white data-[state=on]:border-[#3F673C] data-[state=on]:bg-[#3F673C] data-[state=on]:text-white">{v}</ToggleGroupItem>
                )}
              </ToggleGroup>
            </li>

            <li>
              <h3 className="mb-1.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#187347]">Regions</h3>
              <ToggleGroup 
                size="sm" 
                variant="outline"
                className="gap-2 p-1 rounded-lg flex-wrap"
                multiple
                onValueChange={(v) => {
                if (v) {
                  setSelectedRegions(v);
                }
              }}
              >
                {allRegions.map((v) => 
                  <ToggleGroupItem key={v} value={v} aria-label={"Toggle " + v} className="!rounded-full border border-[#94B985] bg-white px-3 text-xs font-medium text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8] aria-pressed:border-[#3F673C] aria-pressed:bg-[#3F673C] aria-pressed:text-white data-[state=on]:border-[#3F673C] data-[state=on]:bg-[#3F673C] data-[state=on]:text-white">{v}</ToggleGroupItem>
                )}
              </ToggleGroup>
            </li>

            <li>
              <h3 className="mb-1.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#187347]">SDGs</h3>
              <ToggleGroup 
                size="sm" 
                variant="outline"
                className="gap-2 p-1 rounded-lg flex-wrap"
                multiple
                onValueChange={(v) => {
                if (v) {
                  const sdgs = v.map((s) => Number(s));
                  setSelectedSdgs(sdgs);
                }
              }}
              >
                {allSdgs.map((v) => 
                  <ToggleGroupItem key={v} value={""+v} aria-label={"Toggle " + v} className="!rounded-full border border-[#94B985] bg-white px-3 text-xs font-medium text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8] aria-pressed:border-[#3F673C] aria-pressed:bg-[#3F673C] aria-pressed:text-white data-[state=on]:border-[#3F673C] data-[state=on]:bg-[#3F673C] data-[state=on]:text-white">{"SDG " + v}</ToggleGroupItem>
                )}
              </ToggleGroup>
            </li>
          </ul>
        </div>

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
