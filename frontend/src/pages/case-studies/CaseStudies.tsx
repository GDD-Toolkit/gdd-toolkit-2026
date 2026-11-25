/**
 * CaseStudies - Global Case Studies Library page.
 * Forest & Sage Green-Outline Editorial design with live KPI summary,
 * tabbed filter workspace, magazine grid, tutorial video drawer, and modal deep-linking.
 */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowDown,
  ChevronDown,
  FileText,
  Globe2,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import CaseStudiesGrid, {
  CaseStudiesGridSkeleton,
} from "@/components/case-studies/CaseStudiesGrid";
import CaseStudyModal from "@/components/case-studies/CaseStudyModal";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialReveal,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import { fetchMaldevelopment, fetchWorthwhile } from "@/api/caseStudies";
import type { CaseStudy, CaseStudySegment } from "@/types/caseStudies";
import "./CaseStudies.css";

const CASE_STUDIES_PER_PAGE = 9;

type CaseStudyWithSegment = CaseStudy & {
  segment: CaseStudySegment;
};

type SegmentFilter = "all" | CaseStudySegment;
type FilterTab = "values" | "regions" | "sdgs";

export default function CaseStudies() {
  const reduced = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allCaseStudies, setAllCaseStudies] = useState<CaseStudyWithSegment[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<SegmentFilter>("all");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedSdgs, setSelectedSdgs] = useState<number[]>([]);
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab | null>(
    "values",
  );
  const [showTutorial, setShowTutorial] = useState(false);

  const [selectedCaseStudy, setSelectedCaseStudy] = useState<
    (CaseStudy & { segment?: CaseStudySegment }) | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(CASE_STUDIES_PER_PAGE);

  // Fetch all case studies (both worthwhile and maldevelopment)
  useEffect(() => {
    let cancelled = false;

    async function loadAllCaseStudies() {
      try {
        setLoading(true);
        setError(null);
        const [worthwhile, maldevelopment] = await Promise.all([
          fetchWorthwhile().catch(() => []),
          fetchMaldevelopment().catch(() => []),
        ]);

        if (cancelled) return;

        const worthwhileWithSegment: CaseStudyWithSegment[] = worthwhile.map(
          (cs) => ({
            ...cs,
            segment: "worthwhile" as const,
          }),
        );
        const maldevelopmentWithSegment: CaseStudyWithSegment[] =
          maldevelopment.map((cs) => ({
            ...cs,
            segment: "maldevelopment" as const,
          }));

        setAllCaseStudies([
          ...worthwhileWithSegment,
          ...maldevelopmentWithSegment,
        ]);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load case studies",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAllCaseStudies();
    return () => {
      cancelled = true;
    };
  }, []);

  // Derive filter taxonomies & archive KPIs
  const { worthwhileCount, maldevelopmentCount, allValues, allRegions, allSdgs } =
    useMemo(() => {
      let worthwhile = 0;
      let maldev = 0;
      const valuesSet = new Set<string>();
      const regionsSet = new Set<string>();
      const sdgsSet = new Set<number>();

      for (const cs of allCaseStudies) {
        if (cs.segment === "worthwhile") worthwhile += 1;
        else maldev += 1;

        cs.values?.forEach((v) => {
          if (v) valuesSet.add(v);
        });
        cs.regions?.forEach((r) => {
          if (r) regionsSet.add(r);
        });
        cs.sdgs?.forEach((s) => {
          const num = Number(s);
          if (!Number.isNaN(num)) sdgsSet.add(num);
        });
      }

      return {
        worthwhileCount: worthwhile,
        maldevelopmentCount: maldev,
        allValues: Array.from(valuesSet).sort((a, b) => a.localeCompare(b)),
        allRegions: Array.from(regionsSet).sort((a, b) => a.localeCompare(b)),
        allSdgs: Array.from(sdgsSet).sort((a, b) => a - b),
      };
    }, [allCaseStudies]);

  // Filter case studies
  const filteredCaseStudies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allCaseStudies.filter((study) => {
      if (selectedSegment !== "all" && study.segment !== selectedSegment) {
        return false;
      }

      if (query) {
        const matchesTitle = study.name?.toLowerCase().includes(query);
        const matchesDesc =
          typeof study.description === "string" &&
          study.description.toLowerCase().includes(query);
        const matchesSummary =
          typeof study.summary === "string" &&
          study.summary.toLowerCase().includes(query);
        const matchesRegions = study.regions?.some((r) =>
          r.toLowerCase().includes(query),
        );
        const matchesValues = study.values?.some((v) =>
          v.toLowerCase().includes(query),
        );
        const matchesKeywords = study.keywords?.some((k) =>
          k.toLowerCase().includes(query),
        );

        if (
          !matchesTitle &&
          !matchesDesc &&
          !matchesSummary &&
          !matchesRegions &&
          !matchesValues &&
          !matchesKeywords
        ) {
          return false;
        }
      }

      const matchesValues =
        selectedValues.length === 0 ||
        selectedValues.some((v) => study.values?.includes(v));

      const matchesRegions =
        selectedRegions.length === 0 ||
        selectedRegions.some((r) => study.regions?.includes(r));

      const matchesSdgs =
        selectedSdgs.length === 0 ||
        selectedSdgs.some((s) => study.sdgs?.map(Number).includes(s));

      return matchesValues && matchesRegions && matchesSdgs;
    });
  }, [
    allCaseStudies,
    searchQuery,
    selectedSegment,
    selectedValues,
    selectedRegions,
    selectedSdgs,
  ]);

  // Reset pagination whenever filters change
  useEffect(() => {
    setVisibleCount(CASE_STUDIES_PER_PAGE);
  }, [
    searchQuery,
    selectedSegment,
    selectedValues,
    selectedRegions,
    selectedSdgs,
  ]);

  const visibleCaseStudies = filteredCaseStudies.slice(0, visibleCount);

  // URL ?id=... modal deep-linking
  useEffect(() => {
    const caseStudyId = searchParams.get("id");
    if (!caseStudyId) {
      return;
    }

    const existing = allCaseStudies.find(
      (cs) => String(cs.id) === caseStudyId,
    );
    if (existing) {
      setSelectedCaseStudy(existing);
      setIsModalOpen(true);
      return;
    }

    let cancelled = false;
    async function loadCaseStudyById() {
      try {
        const [worthwhile, maldevelopment] = await Promise.all([
          fetchWorthwhile().catch(() => []),
          fetchMaldevelopment().catch(() => []),
        ]);
        if (cancelled) return;

        const combined: CaseStudyWithSegment[] = [
          ...worthwhile.map((cs) => ({
            ...cs,
            segment: "worthwhile" as const,
          })),
          ...maldevelopment.map((cs) => ({
            ...cs,
            segment: "maldevelopment" as const,
          })),
        ];
        const found = combined.find((cs) => String(cs.id) === caseStudyId);
        if (found) {
          setSelectedCaseStudy(found);
          setIsModalOpen(true);
        }
      } catch (err) {
        console.error("Failed to load case study:", err);
      }
    }

    loadCaseStudyById();
    return () => {
      cancelled = true;
    };
  }, [searchParams, allCaseStudies]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCaseStudy(null);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("id");
    setSearchParams(newSearchParams, { replace: true });
  };

  const toggleStringFilter = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const toggleSdgFilter = (sdg: number) => {
    setSelectedSdgs((prev) =>
      prev.includes(sdg) ? prev.filter((item) => item !== sdg) : [...prev, sdg],
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedSegment("all");
    setSelectedValues([]);
    setSelectedRegions([]);
    setSelectedSdgs([]);
  };

  const activeTaxonomyCount =
    selectedValues.length + selectedRegions.length + selectedSdgs.length;
  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedSegment !== "all" ||
    activeTaxonomyCount > 0;

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }
  };

  const handleWatchTutorial = () => {
    setShowTutorial(true);
    setTimeout(() => scrollToId("case-study-tutorial"), 60);
  };

  const heroKpis = [
    {
      label: "Total Studies",
      value: allCaseStudies.length,
      accent: "text-[#187347]",
    },
    {
      label: "Worthwhile Dev.",
      value: worthwhileCount,
      accent: "text-[#284B26]",
    },
    {
      label: "Maldevelopment",
      value: maldevelopmentCount,
      accent: "text-[#6F4E37]",
    },
    {
      label: "Regions Covered",
      value: allRegions.length,
      accent: "text-[#187347]",
    },
  ];

  const filterTabs: {
    id: FilterTab;
    label: string;
    count: number;
    total: number;
    icon: React.ReactNode;
  }[] = [
    {
      id: "values",
      label: "7 Values",
      count: selectedValues.length,
      total: allValues.length,
      icon: <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />,
    },
    {
      id: "regions",
      label: "Regions",
      count: selectedRegions.length,
      total: allRegions.length,
      icon: <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />,
    },
    {
      id: "sdgs",
      label: "UN SDGs",
      count: selectedSdgs.length,
      total: allSdgs.length,
      icon: <Target className="h-3.5 w-3.5" aria-hidden="true" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#202B20]">

      {/* Editorial Forest Green Hero */}
      <EditorialPageHero
        id="case-studies-hero"
        titleId="case-studies-heading"
        badges={[
          { label: "03 · Global Case Library", tone: "cream" },
          { label: "Student-Led Scholarship", tone: "sage" },
        ]}
        title={
          <>
            Global{" "}
            <em className="font-normal italic text-[#E9E6B2]">Case Studies</em>
          </>
        }
        subtitle="A dedicated library highlighting exemplary worthwhile development practices alongside real-world instances of maldevelopment—grounding ethical principles in real communities and projects."
        actions={
          <>
            <button
              type="button"
              onClick={() => scrollToId("case-library")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#E9E6B2] px-6 py-3 text-sm font-semibold text-[#202B20] shadow-sm transition-colors hover:bg-[#f2efbf] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C]"
            >
              <span>Explore Case Library</span>
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={handleWatchTutorial}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#9AB887] bg-[#2E502B] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#254223] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C]"
            >
              <Play
                className="h-3.5 w-3.5 fill-current text-[#E9E6B2]"
                aria-hidden="true"
              />
              <span>Watch Tutorial</span>
            </button>

            <a
              href="/projectevaloldinternal.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#9AB887]/55 bg-[#355832]/80 px-4 py-3 text-xs font-medium text-[#EDF4E8] transition-colors hover:border-[#E9E6B2] hover:text-[#E9E6B2]"
            >
              <FileText className="h-3.5 w-3.5 text-[#E9E6B2]" aria-hidden="true" />
              <span>Evaluation Methodology (PDF)</span>
            </a>
          </>
        }
        footnote="UMD FIRE Global Development & Design · Evaluated against the 7 Values of Worthwhile Development & UN SDGs"
        aside={
          <div className="rounded-2xl border-[1.5px] border-[#E9E6B2]/85 bg-[#2E502B]/90 p-5 shadow-xl backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between gap-2 pb-4">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#E9E6B2]">
                Archive Snapshot
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9AB887]/60 bg-[#355832] px-2.5 py-0.5 font-mono text-[10px] text-[#EDF4E8]">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${
                    loading ? "animate-pulse bg-[#E9E6B2]" : "bg-[#94B985]"
                  }`}
                />
                {loading ? "Syncing" : "Live Catalog"}
              </span>
            </div>

            {/* Floating Green-Outlined White KPI Card */}
            <div className="grid grid-cols-2 gap-3.5 rounded-xl border-[1.5px] border-[#94B985] bg-white/95 p-4 text-[#202B20] shadow-md sm:p-5">
              {heroKpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="flex flex-col rounded-lg border border-[#D5E3D9]/70 bg-[#FAFDF8] px-3.5 py-3"
                >
                  {loading ? (
                    <div className="h-7 w-12 animate-pulse rounded bg-[#EDF4E8]" />
                  ) : (
                    <span
                      className={`text-2xl font-bold leading-tight sm:text-3xl ${kpi.accent}`}
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {kpi.value}
                    </span>
                  )}
                  <span className="mt-1 text-[11px] font-medium text-[#596556]">
                    {kpi.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#E8F0E5]/90">
              Filter across ethical values, global regions, and UN Sustainable
              Development Goals to compare real-world outcomes.
            </p>
          </div>
        }
      />

      {/* Collapsible Video Tutorial Strip */}
      <section
        id="case-study-tutorial"
        aria-label="Case study tutorial video"
        className="border-b border-[#B2C9A8] bg-[#F2F6EF]"
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#B2C9A8] bg-white text-[#187347]">
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#187347]">
                  Library Walkthrough
                </p>
                <p className="text-sm font-medium text-[#202B20]">
                  Learn how to navigate and apply the case studies to your own
                  projects.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href="/projectevaloldinternal.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-1.5 rounded-full border border-[#B2C9A8] bg-white px-3.5 py-1.5 text-xs font-medium text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8] sm:inline-flex"
              >
                <FileText className="h-3.5 w-3.5 text-[#187347]" aria-hidden="true" />
                Methodology PDF
              </a>
              <button
                type="button"
                onClick={() => setShowTutorial((open) => !open)}
                aria-expanded={showTutorial}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] border-[#3F673C] bg-white px-4 py-1.5 text-xs font-semibold text-[#284B26] transition-colors hover:bg-[#3F673C] hover:text-white"
              >
                <span>{showTutorial ? "Hide Video" : "Watch Video"}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    showTutorial ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {showTutorial && (
              <motion.div
                key="tutorial-video-drawer"
                initial={reduced ? false : { opacity: 0, height: 0 }}
                animate={reduced ? undefined : { opacity: 1, height: "auto" }}
                exit={reduced ? undefined : { opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
                className="overflow-hidden"
              >
                <div className="mt-5 overflow-hidden rounded-2xl border-[1.5px] border-[#94B985] bg-[#192419] shadow-md">
                  <video
                    src="/Case_study_video.mp4"
                    controls
                    className="case-studies-video-frame block max-h-[480px] w-full"
                    title="Case Study Tutorial"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Main Editorial Case Library Section */}
      <EditorialSection
        id="case-library"
        tone="white"
        ariaLabelledBy="library-section-heading"
        compact
      >
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="Curated Archive"
            title="Search & Filter Real-World Cases"
            titleId="library-section-heading"
            description="Compare worthwhile development initiatives and documented cases of maldevelopment across regions, values, and UN SDGs."
          />
        </EditorialReveal>

        {/* Soft Sage Bordered Filter Workspace */}
        <EditorialReveal delay={0.05} className="mt-8">
          <div className="rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#F2F6EF] p-4 shadow-xs sm:p-6">
            {/* Top Row: Search Input + Quick Segment Pills */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Prominent Editorial Search Input */}
              <div className="relative flex-1 lg:max-w-xl">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#596556]"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, region, ethical value, or keyword…"
                  aria-label="Search case studies"
                  className="w-full rounded-xl border-[1.5px] border-[#B2C9A8] bg-white py-3 pl-11 pr-10 text-sm text-[#202B20] placeholder-[#596556]/80 transition-colors focus:border-[#3F673C] focus:outline-none focus:ring-2 focus:ring-[#3F673C]/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#596556] transition-colors hover:bg-[#EDF4E8] hover:text-[#202B20]"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Segment Quick Filters */}
              <div
                role="group"
                aria-label="Filter by development category"
                className="flex flex-wrap items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => setSelectedSegment("all")}
                  aria-pressed={selectedSegment === "all"}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] px-4 py-2 text-xs font-semibold transition-all ${
                    selectedSegment === "all"
                      ? "border-[#3F673C] bg-[#3F673C] text-white shadow-xs"
                      : "border-[#B2C9A8] bg-white text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8]"
                  }`}
                >
                  <span>All Cases</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                      selectedSegment === "all"
                        ? "bg-white/20 text-[#E9E6B2]"
                        : "bg-[#F2F6EF] text-[#596556]"
                    }`}
                  >
                    {allCaseStudies.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSegment("worthwhile")}
                  aria-pressed={selectedSegment === "worthwhile"}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] px-4 py-2 text-xs font-semibold transition-all ${
                    selectedSegment === "worthwhile"
                      ? "border-[#284B26] bg-[#284B26] text-[#E9E6B2] shadow-xs"
                      : "border-[#B2C9A8] bg-white text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-[#187347]"
                  />
                  <span>Worthwhile Development</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                      selectedSegment === "worthwhile"
                        ? "bg-white/15 text-white"
                        : "bg-[#EDF4E8] text-[#187347]"
                    }`}
                  >
                    {worthwhileCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSegment("maldevelopment")}
                  aria-pressed={selectedSegment === "maldevelopment"}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] px-4 py-2 text-xs font-semibold transition-all ${
                    selectedSegment === "maldevelopment"
                      ? "border-[#C4B76A] bg-[#FAF8E4] text-[#6F4E37] shadow-xs"
                      : "border-[#B2C9A8] bg-white text-[#284B26] hover:border-[#D6CE8A] hover:bg-[#FAF8E4]/70"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-[#A86B32]"
                  />
                  <span>Maldevelopment</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                      selectedSegment === "maldevelopment"
                        ? "bg-[#E9E6B2] text-[#6F4E37]"
                        : "bg-[#FAF8E4] text-[#6F6057]"
                    }`}
                  >
                    {maldevelopmentCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Tabbed Collapsible Taxonomy Drawers (7 Values, Regions, UN SDGs) */}
            <div className="mt-4 border-t border-[#B2C9A8]/70 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                  role="tablist"
                  aria-label="Filter categories"
                  className="flex flex-wrap items-center gap-2"
                >
                  {filterTabs.map((tab) => {
                    const isOpen = activeFilterTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isOpen}
                        onClick={() =>
                          setActiveFilterTab(isOpen ? null : tab.id)
                        }
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                          isOpen
                            ? "border-[#3F673C] bg-white text-[#202B20] shadow-xs"
                            : "border-transparent bg-white/60 text-[#394838] hover:border-[#B2C9A8] hover:bg-white"
                        }`}
                      >
                        <span className="text-[#187347]">{tab.icon}</span>
                        <span>{tab.label}</span>
                        {tab.count > 0 ? (
                          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#3F673C] px-1.5 font-mono text-[10px] font-bold text-[#E9E6B2]">
                            {tab.count}
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-[#596556]">
                            ({tab.total})
                          </span>
                        )}
                        <ChevronDown
                          className={`h-3.5 w-3.5 text-[#596556] transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-[#3F673C]" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#B2C9A8] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#3F673C] hover:text-white"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    Clear All
                  </button>
                )}
              </div>

              {/* Active Filter Drawer Panel */}
              <AnimatePresence mode="wait" initial={false}>
                {activeFilterTab && (
                  <motion.div
                    key={activeFilterTab}
                    role="tabpanel"
                    initial={reduced ? false : { opacity: 0, y: -6 }}
                    animate={reduced ? undefined : { opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: EDITORIAL_EASE }}
                    className="mt-3.5 rounded-xl border border-[#B2C9A8]/80 bg-white p-4"
                  >
                    {activeFilterTab === "values" && (
                      <div>
                        <p className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#596556]">
                          Select one or more Values of Worthwhile Development
                        </p>
                        {allValues.length === 0 ? (
                          <p className="text-xs text-[#596556]">
                            {loading
                              ? "Loading values…"
                              : "No value tags available."}
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {allValues.map((value) => {
                              const active = selectedValues.includes(value);
                              return (
                                <button
                                  key={value}
                                  type="button"
                                  aria-pressed={active}
                                  onClick={() =>
                                    toggleStringFilter(value, setSelectedValues)
                                  }
                                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                                    active
                                      ? "border-[#3F673C] bg-[#3F673C] text-white shadow-xs"
                                      : "border-[#B2C9A8] bg-[#FAFDF8] text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8]"
                                  }`}
                                >
                                  {value}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {activeFilterTab === "regions" && (
                      <div>
                        <p className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#596556]">
                          Filter by Geographic Region
                        </p>
                        {allRegions.length === 0 ? (
                          <p className="text-xs text-[#596556]">
                            {loading
                              ? "Loading regions…"
                              : "No region tags available."}
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {allRegions.map((region) => {
                              const active = selectedRegions.includes(region);
                              return (
                                <button
                                  key={region}
                                  type="button"
                                  aria-pressed={active}
                                  onClick={() =>
                                    toggleStringFilter(
                                      region,
                                      setSelectedRegions,
                                    )
                                  }
                                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                                    active
                                      ? "border-[#3F673C] bg-[#3F673C] text-white shadow-xs"
                                      : "border-[#B2C9A8] bg-[#FAFDF8] text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8]"
                                  }`}
                                >
                                  {region}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {activeFilterTab === "sdgs" && (
                      <div>
                        <p className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#596556]">
                          Filter by UN Sustainable Development Goals
                        </p>
                        {allSdgs.length === 0 ? (
                          <p className="text-xs text-[#596556]">
                            {loading ? "Loading SDGs…" : "No SDGs available."}
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {allSdgs.map((sdg) => {
                              const active = selectedSdgs.includes(sdg);
                              return (
                                <button
                                  key={sdg}
                                  type="button"
                                  aria-pressed={active}
                                  onClick={() => toggleSdgFilter(sdg)}
                                  className={`cursor-pointer rounded-full border px-3 py-1.5 font-mono text-xs font-medium transition-all ${
                                    active
                                      ? "border-[#3F673C] bg-[#3F673C] text-[#E9E6B2] shadow-xs"
                                      : "border-[#D6CE8A] bg-[#FAF8E4] text-[#5A5026] hover:border-[#3F673C] hover:bg-[#EDF4E8] hover:text-[#284B26]"
                                  }`}
                                >
                                  SDG {sdg}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active Filter Chips Summary */}
              {activeTaxonomyCount > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#596556]">
                    Active:
                  </span>
                  {selectedValues.map((v) => (
                    <button
                      key={`chip-val-${v}`}
                      type="button"
                      onClick={() => toggleStringFilter(v, setSelectedValues)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#3F673C]/40 bg-[#EDF4E8] px-2.5 py-1 text-[11px] font-medium text-[#284B26] transition-colors hover:bg-[#3F673C] hover:text-white"
                    >
                      <span>{v}</span>
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  ))}
                  {selectedRegions.map((r) => (
                    <button
                      key={`chip-reg-${r}`}
                      type="button"
                      onClick={() => toggleStringFilter(r, setSelectedRegions)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#3F673C]/40 bg-white px-2.5 py-1 text-[11px] font-medium text-[#284B26] transition-colors hover:bg-[#3F673C] hover:text-white"
                    >
                      <span>{r}</span>
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  ))}
                  {selectedSdgs.map((s) => (
                    <button
                      key={`chip-sdg-${s}`}
                      type="button"
                      onClick={() => toggleSdgFilter(s)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#D6CE8A] bg-[#FAF8E4] px-2.5 py-1 font-mono text-[11px] font-medium text-[#5A5026] transition-colors hover:bg-[#3F673C] hover:text-white"
                    >
                      <span>SDG {s}</span>
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </EditorialReveal>

        {/* Results Count & Magazine Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="h-4 w-52 animate-pulse rounded bg-[#EDF4E8]" />
              </div>
              <CaseStudiesGridSkeleton count={6} />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-[1.5px] border-[#E3B5AD] bg-[#FDF1EE]/70 px-6 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E3B5AD] bg-white text-[#9E3223]">
                <AlertCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3
                className="mt-4 text-xl font-semibold text-[#202B20]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Unable to load case studies
              </h3>
              <p className="mt-2 max-w-md text-sm text-[#596556]">
                We encountered a problem retrieving the case study archive.
                Please refresh or try again in a moment.
              </p>
              {import.meta.env.DEV && (
                <p className="mt-3 rounded-lg border border-[#E3B5AD] bg-white px-3 py-1.5 font-mono text-xs text-[#9E3223]">
                  {error}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D5E3D9] pb-3.5 text-xs text-[#596556]">
                <p className="font-mono uppercase tracking-wider">
                  Showing{" "}
                  <span className="font-semibold text-[#202B20]">
                    {visibleCaseStudies.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#202B20]">
                    {filteredCaseStudies.length}
                  </span>{" "}
                  {filteredCaseStudies.length === 1
                    ? "case study"
                    : "case studies"}
                  {hasActiveFilters &&
                    filteredCaseStudies.length !== allCaseStudies.length && (
                      <span className="text-[#596556]">
                        {" "}
                        (filtered from {allCaseStudies.length} total)
                      </span>
                    )}
                </p>
                <p className="hidden text-xs text-[#596556] sm:block">
                  Click any card to open the editorial reader
                </p>
              </div>

              <CaseStudiesGrid
                caseStudies={visibleCaseStudies}
                searchQuery={searchQuery}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearAllFilters}
              />

              {visibleCount < filteredCaseStudies.length && (
                <div className="flex flex-col items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((count) => count + CASE_STUDIES_PER_PAGE)
                    }
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#3F673C] focus:ring-offset-2"
                  >
                    <span>Load More Case Studies</span>
                    <span className="rounded-full bg-white/15 px-2 py-0.5 font-mono text-[11px] text-[#E9E6B2]">
                      +{Math.min(CASE_STUDIES_PER_PAGE, filteredCaseStudies.length - visibleCount)}
                    </span>
                  </button>
                  <p className="font-mono text-[11px] text-[#596556]">
                    {filteredCaseStudies.length - visibleCount} more remaining
                    in current view
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </EditorialSection>

      {/* Case Study Reader Modal */}
      <CaseStudyModal
        caseStudy={selectedCaseStudy}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
