/**
 * CaseStudyCard component - Magazine-style card for displaying a case study
 * Shows image, title, tags (values/regions), truncated description, and view details button
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CaseStudy } from "@/types/caseStudies";
import { s3UriToHttps } from "@/utils/s3";

interface CaseStudyCardProps {
  caseStudy: CaseStudy & { segment?: "worthwhile" | "maldevelopment" };
}

/**
 * Renders a placeholder image when image is missing or fails to load
 */
function PlaceholderImage({ name }: { name: string }) {
  const initials = name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase() || "CS";

  return (
    <div className="w-full h-48 bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-3xl">
      {initials}
    </div>
  );
}

export default function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  // Convert S3 URI to HTTPS URL if needed
  // Handle null, undefined, empty string, or missing image fields
  const rawImage = caseStudy.image;
  const hasValidImage = rawImage && typeof rawImage === 'string' && rawImage.trim().length > 0;
  const imgUrl = hasValidImage ? s3UriToHttps(rawImage) : null;

  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        onClick={() => navigate(`/case-studies?id=${caseStudy.id}`)}
      >
        {/* Image */}
        {imgUrl && !imageError ? (
          <div className="w-full h-48 relative">
            <img
              src={imgUrl}
              alt={caseStudy.name}
              className="w-full h-48 object-cover"
              loading="lazy"
              onError={() => {
                // Fallback: show placeholder when image fails to load
                setImageError(true);
              }}
            />
          </div>
        ) : (
          <PlaceholderImage name={caseStudy.name} />
        )}

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-semibold mb-3 text-gray-900 line-clamp-2">
            {caseStudy.name}
          </h3>

          {/* Segment Label */}
          {caseStudy.segment && (
            <div className="mb-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  caseStudy.segment === "worthwhile"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {caseStudy.segment === "worthwhile" ? "Worthwhile Development" : "Maldevelopment"}
              </span>
            </div>
          )}

          {/* Tags - Values, Regions, SDGs */}
          <div className="flex flex-wrap gap-2 mb-3">
            {caseStudy.values?.map((value, idx) => (
              <span
                key={`value-${idx}`}
                className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-sky-100 text-sky-700"
              >
                {value}
              </span>
            ))}
            {caseStudy.regions?.map((region, idx) => (
              <span
                key={`region-${idx}`}
                className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700"
              >
                {region}
              </span>
            ))}
            {/* SDG Tags */}
            {caseStudy.sdgs?.map((sdg, idx) => (
                <span
                key={`sdg-${idx}`}
                className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700"
                >
                SDG {sdg}
                </span>
            ))}
          </div>

          {/* Description (scrollable) */}
            <div className="text-sm text-gray-600 mb-4 flex-1 max-h-28 overflow-y-auto pr-1">
            <p className="leading-relaxed">
                {caseStudy.description} {/* Projects */}
                {caseStudy.summary} {/* Maldevelopment */}
                {caseStudy.issue} {/* Policies */}
            </p>
            </div>

          {/* View Details Button */}
          <div className="flex justify-end">
            <span
              className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
            >
              View details →
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

