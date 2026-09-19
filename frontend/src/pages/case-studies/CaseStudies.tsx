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
import { easeOut, motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

    const anyFilterActive =
      selectedValues.length || selectedRegions.length || selectedSdgs.length;

    if (!anyFilterActive) return true;

    return (
      study.values?.some(v => selectedValues.includes(v)) ||
      study.regions?.some(r => selectedRegions.includes(r)) ||
      study.sdgs?.some(s => selectedSdgs.includes(s))
    );
  });
  
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D83F2]"></div>
          <p className="mt-4 text-gray-600">Loading case studies...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 mx-auto">
          <p className="text-red-600 text-lg mb-2">Failed to load case studies.</p>
          <p className="text-gray-500">Please try again later.</p>
          {import.meta.env.DEV && (
            <p className="text-xs text-gray-400 mt-2">{error}</p>
          )}
        </div>
      );
    }

    return (
    <div className="flex flex-col gap-5 md:w-2/3 lg:w-2/3">
      <span className="mx-auto text-gray-500 size-xs">Showing {filteredCaseStudies.length} of {allCaseStudies.length} case studies</span>
      <CaseStudiesGrid caseStudies={filteredCaseStudies} searchQuery={searchQuery} />
    </div>
    );
  };

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <header className="bg-[#43673B] text-white py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-5 pb-20">
          <h1 className="text-4xl md:text-5xl font-bold">Case Studies</h1>
          <div className="text-lg">This tool includes a dedicated library of case studies that highlight both exemplary development practices and real-world instances of maldevelopment. These cases give users a grounded understanding of how ethical challenges unfold in practice—and how values-based, human-centered approaches can lead to better outcomes. By learning from successes and missteps alike, users of our toolkit can more confidently apply these lessons and principles to their own projects.</div>
          <div> See the <a
                        href="/projectevaloldinternal.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline transition-colors"
                    >case study evaluation methodology</a> for more details.
          </div>
          <div>Below is a tutorial on how to navigate and utilize the case studies effectively.</div>
        </div>
      </header>
        
            <section className="content-section">
                <div className="flex justify-center -mt-20">
                    <video
                        src="/Case_study_video.mp4" // Local video URL
                        width="100%"
                        height="480"
                        controls // adds play/pause buttons
                        style={{ border: "1px solid #ccc", borderRadius: "8px", display: "block" }}
                        title="Case Study Tutorial"
                    ></video>

                </div>
            </section>
        
      {/* Main Content */}
      <main className="max-w-full mx-auto p-10 flex flex-col md:flex-row lg:flex-row gap-6 md:gap-10 lg:gap-10">
        {/* Search */}
        <div className="flex flex-col gap-5 border border-[#AACDBB] bg-[#E1EDDD] p-5 z-10 md:sticky lg:sticky top-25 md:w-1/3 lg:w-1/3 h-fit rounded-lg">
          <h2 className="text-xl">Filter Case Studies</h2>
          <ul className="flex flex-col gap-5">
            <li>
              <h3>Search</h3>
              <input
                type="text"
                placeholder="Search by case study name…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-xl rounded-lg px-4 py-2
                border border-slate-400
                bg-gray-100
                text-gray-800
                placeholder-gray-500
                focus:outline-none focus:ring-1 "
              />
            </li>

            <li>
              <h3>Values</h3>
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
                  <ToggleGroupItem key={v} value={v} aria-label={"Toggle " + v} className="border border-gray-300">{v}</ToggleGroupItem>
                )}
              </ToggleGroup>
            </li>

            <li>
              <h3>Regions</h3>
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
                  <ToggleGroupItem key={v} value={v} aria-label={"Toggle " + v} className="border border-gray-300">{v}</ToggleGroupItem>
                )}
              </ToggleGroup>
            </li>

            <li>
              <h3>SDGs</h3>
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
                  <ToggleGroupItem key={v} value={""+v} aria-label={"Toggle " + v} className="border border-gray-300">{"SDG " + v}</ToggleGroupItem>
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
