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
          fetchMaldevelopment().catch(() => []),
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

  function SelectedChips<T extends string | number>({
    items,
    onRemove,
    format,
    variant,
  }: {
    items: T[];
    onRemove: (item: T) => void;
    format?: (item: T) => string;
    variant: "values" | "regions" | "sdgs";
  }) {
    const styles = {
      values: "bg-sky-100 text-sky-700",
      regions: "bg-slate-100 text-slate-700",
      sdgs: "bg-orange-100 text-orange-700",
    };

    return (
      <div className="flex flex-wrap gap-2 ml-3">
        {items.map(item => (
          <span
            key={item.toString()}
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${styles[variant]}`}
          >
            {format ? format(item) : item}
            <button
              className="ml-1 opacity-70 hover:opacity-100"
              onClick={() => onRemove(item)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    );
  }
  
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
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <p className="mt-4 text-gray-600">Loading case studies...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-600 text-lg mb-2">Failed to load case studies.</p>
          <p className="text-gray-500">Please try again later.</p>
          {import.meta.env.DEV && (
            <p className="text-xs text-gray-400 mt-2">{error}</p>
          )}
        </div>
      );
    }

    return <CaseStudiesGrid caseStudies={filteredCaseStudies} searchQuery={searchQuery} />;
  };

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center">Case Studies</h1>
        </div>
            </header>
        
            <section className="content-section">
                <div className="content-card">
                    <motion.p
                    className="simulation-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: easeOut }}
                    >
                    This tool includes a dedicated library of case studies that highlight both exemplary development practices and real-world instances of maldevelopment. These cases give users a grounded understanding of how ethical challenges unfold in practice—and how values-based, human-centered approaches can lead to better outcomes. By learning from successes and missteps alike, users of our toolkit can more confidently apply these lessons and principles to their own projects.
                    <br /><br />
                    See the <a
                        href="/projectevaloldinternal.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 font-semibold underline hover:text-emerald-700 transition-colors"
                    >
                        case study evaluation methodology
                    </a> for more details.
                    <br /><br />
                    Below is a tutorial on how to navigate and utilize the case studies effectively:
                    {/* Embedded Video */}
                    <motion.div
                    className="w-full flex justify-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: easeOut }}
                    >
                    <video
                        src="/Case_study_video.mp4" // Local video URL
                        width="80%"
                        height="480"
                        controls // adds play/pause buttons
                        style={{ border: "1px solid #ccc", borderRadius: "8px", display: "block" }}
                        title="Case Study Tutorial"
                    ></video>
                    </motion.div>
                    <br /><br />
                    Explore our comprehensive collection of case studies using the search bar or dropdowns. Each entry is thoughtfully categorized as either "Worthwhile Development" or "Maldevelopment," providing clear insights into ethical practices and challenges in the field. Dive in to learn from real-world examples and enhance your understanding of value-driven development.
                    </motion.p>
                </div>
            </section>
        
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Search */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by case study name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-xl rounded-full px-4 py-2 shadow-sm
              border border-emerald-700
              text-emerald-700
              placeholder-emerald-700
              focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="max-w-5xl mx-auto space-y-4 mb-8">
          {/* Values */}
          <div className="flex items-center flex-wrap gap-3">
            <label className="w-20 text-sm font-medium text-emerald-700">
              Values
            </label>
            <select
              className="w-48 rounded-full px-3 py-1.5 text-sm
                border border-emerald-700 text-emerald-700
                focus:outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => {
                const v = e.target.value;
                if (v && !selectedValues.includes(v)) {
                  setSelectedValues([...selectedValues, v]);
                }
                e.target.value = "";
              }}
            >
              <option value="">Select Values …</option>
              {allValues.map(v => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <SelectedChips
              items={selectedValues}
              variant="values"
              onRemove={(v) =>
                setSelectedValues(selectedValues.filter(x => x !== v))
              }
            />
          </div>

          {/* Regions */}
          <div className="flex items-center flex-wrap gap-3">
            <label className="w-20 text-sm font-medium text-emerald-700">
              Regions
            </label>
            <select
              className="w-48 rounded-full px-3 py-1.5 text-sm
                border border-emerald-700 text-emerald-700
                focus:outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => {
                const r = e.target.value;
                if (r && !selectedRegions.includes(r)) {
                  setSelectedRegions([...selectedRegions, r]);
                }
                e.target.value = "";
              }}
            >
              <option value="">Select Regions…</option>
              {allRegions.map(r => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <SelectedChips
              items={selectedRegions}
              variant="regions"
              onRemove={(r) =>
                setSelectedRegions(selectedRegions.filter(x => x !== r))
              }
            />
          </div>

          {/* SDGs */}
          <div className="flex items-center flex-wrap gap-3">
            <label className="w-20 text-sm font-medium text-emerald-700">
              SDGs
            </label>
            <select
              className="w-48 rounded-full px-3 py-1.5 text-sm
                border border-emerald-700 text-emerald-700
                focus:outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => {
                const s = Number(e.target.value);
                if (s && !selectedSdgs.includes(s)) {
                  setSelectedSdgs([...selectedSdgs, s]);
                }
                e.target.value = "";
              }}
            >
              <option value="">Select SDGs…</option>
              {allSdgs.map(s => (
                <option key={s} value={s}>
                  SDG {s}
                </option>
              ))}
            </select>
            <SelectedChips
              items={selectedSdgs}
              variant="sdgs"
              format={(s) => `SDG ${s}`}
              onRemove={(s) =>
                setSelectedSdgs(selectedSdgs.filter(x => x !== s))
              }
            />
          </div>
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
