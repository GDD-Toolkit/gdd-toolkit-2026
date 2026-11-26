/**
 * CaseStudyCard component - Magazine-style card for displaying a case study
 * Shows image, title, tags (values/regions), truncated description, and view details button
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CaseStudy } from "@/types/caseStudies";
import { s3UriToHttps } from "@/utils/s3";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface CaseStudyCardProps {
  caseStudy: CaseStudy & { segment?: "worthwhile" | "maldevelopment" };
}

/*
TODO: Map SDG names to an array. Right now it displays the number
*/

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
    <div className="w-full h-48 bg-gradient-to-br from-[#3F673C] to-[#187347] flex items-center justify-center font-editorial text-[#E9E6B2] font-semibold text-3xl">
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
      <Card 
        className="group bg-white p-0 rounded-2xl border-[1.5px] border-[#B2C9A8] shadow-xs overflow-hidden flex flex-col hover:border-[#3F673C] hover:bg-[#FAFDF8] hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        onClick={() => navigate(`/case-studies?id=${caseStudy.id}`)}
      >
        {/* Image */}
        {imgUrl && !imageError ? (
          <div className="w-full h-48 relative overflow-hidden">
            <img
              src={imgUrl}
              alt={caseStudy.name}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
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
          <h3 className="font-editorial text-lg font-semibold leading-snug mb-3 text-[#202B20] group-hover:text-[#187347] transition-colors line-clamp-2">
            {caseStudy.name}
          </h3>

          {/* Segment Label */}
          {caseStudy.segment && (
            <div className="mb-2.5">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${
                  caseStudy.segment === "worthwhile"
                    ? "border-[#94B985] bg-[#EDF4E8] text-[#187347]"
                    : "border-[#D6CE8A] bg-[#FAF8E4] text-[#6F6057]"
                }`}
              >
                {caseStudy.segment === "worthwhile" ? "Worthwhile Development" : "Maldevelopment"}
              </span>
            </div>
          )}

          {/* Badges - Values, Regions, SDGs */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {caseStudy.values?.map((value, idx) => (
              <Badge
                key={`value-${idx}`}
                className="inline-flex items-center rounded-full border border-[#B2C9A8] bg-[#F2F6EF] px-2.5 py-0.5 text-[11px] font-medium text-[#284B26]"
              >
                {value}
              </Badge>
            ))}
            {caseStudy.regions?.map((region, idx) => (
              <Badge
                key={`region-${idx}`}
                className="inline-flex items-center rounded-full border border-[#A2B7D8] bg-[#EFF4FA] px-2.5 py-0.5 text-[11px] font-medium text-[#395273]"
              >
                {region}
              </Badge>
            ))}
            {/* SDG */}
            {caseStudy.sdgs?.map((sdg, idx) => (
                <Badge
                key={`sdg-${idx}`}
                className="inline-flex items-center rounded-full border border-[#D6CE8A] bg-[#FAF8E4] px-2.5 py-0.5 text-[11px] font-medium text-[#6F6057]"
                >
                SDG {sdg}
                </Badge>
            ))}
          </div>

          {/* Description (scrollable) */}
            <div className="text-sm text-[#596556] mb-4 flex-1 max-h-28 overflow-y-auto pr-1">
            <p className="leading-relaxed">
                {caseStudy.description} {/* Projects */}
                {caseStudy.summary} {/* Maldevelopment */}
                {caseStudy.issue} {/* Policies */}
            </p>
            </div>

          {/* View Details Button */}
          <div className="flex justify-end">
            <span
              className="text-sm font-semibold text-[#3F673C] hover:text-[#187347] transition-colors"
            >
              View details →
            </span>
          </div>
        </div>
      </Card>
    </>
  );
}

