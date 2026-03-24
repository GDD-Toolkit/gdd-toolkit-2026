/**
 * CaseStudiesGrid component - Responsive grid layout for case study cards
 * Handles empty states and displays "no results" message when search yields no matches
 */

import CaseStudyCard from "./CaseStudyCard";
import type { CaseStudy } from "@/types/caseStudies";

interface CaseStudiesGridProps {
  caseStudies: (CaseStudy & { segment?: "worthwhile" | "maldevelopment" })[];
  searchQuery?: string;
}

export default function CaseStudiesGrid({ caseStudies, searchQuery }: CaseStudiesGridProps) {
  if (caseStudies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {searchQuery
            ? "No case studies match your search."
            : "No case studies available."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {caseStudies.map((study) => (
        <CaseStudyCard key={study.id} caseStudy={study} />
      ))}
    </div>
  );
}

