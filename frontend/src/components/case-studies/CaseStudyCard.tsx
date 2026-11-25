/**
 * CaseStudyCard - Editorial magazine-style card for displaying a case study.
 * Echoes the Homepage Research & Case Studies green-outline aesthetic.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import type { CaseStudy, CaseStudySegment } from "@/types/caseStudies";
import { s3UriToHttps } from "@/utils/s3";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
} from "@/components/editorial/EditorialPagePrimitives";

export type CaseStudyCardItem = CaseStudy & {
  segment?: CaseStudySegment;
};

interface CaseStudyCardProps {
  caseStudy: CaseStudyCardItem;
  index?: number;
}

function getInitials(name?: string): string {
  return (
    name
      ?.split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 3)
      .toUpperCase() || "CS"
  );
}

function getExcerpt(study: CaseStudy): string {
  const candidates = [
    study.description,
    study.summary,
    study.issue,
    study.introduction,
  ];
  const first = candidates.find(
    (text): text is string => typeof text === "string" && text.trim().length > 0,
  );
  return first?.trim() ?? "";
}

function PlaceholderCover({
  name,
  segment,
}: {
  name: string;
  segment?: CaseStudySegment;
}) {
  const isMaldev = segment === "maldevelopment";

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${
        isMaldev
          ? "bg-gradient-to-br from-[#3C3A2B] via-[#4D563B] to-[#284B26]"
          : "bg-gradient-to-br from-[#284B26] via-[#3F673C] to-[#187347]"
      }`}
    >
      <div
        aria-hidden="true"
        className="editorial-grid-texture pointer-events-none absolute inset-0 opacity-70"
      />
      <span
        aria-hidden="true"
        className="relative z-10 select-none text-4xl font-semibold tracking-tight text-[#E9E6B2]/90"
        style={EDITORIAL_SERIF_STYLE}
      >
        {getInitials(name)}
      </span>
    </div>
  );
}

export default function CaseStudyCard({
  caseStudy,
  index = 0,
}: CaseStudyCardProps) {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [imageError, setImageError] = useState(false);

  const rawImage = caseStudy.image;
  const hasValidImage =
    typeof rawImage === "string" && rawImage.trim().length > 0;
  const imgUrl = hasValidImage ? s3UriToHttps(rawImage) || rawImage : null;

  const isMaldev = caseStudy.segment === "maldevelopment";
  const excerpt = getExcerpt(caseStudy);
  const values = Array.isArray(caseStudy.values) ? caseStudy.values : [];
  const regions = Array.isArray(caseStudy.regions) ? caseStudy.regions : [];
  const sdgs = Array.isArray(caseStudy.sdgs) ? caseStudy.sdgs : [];

  const visibleValues = values.slice(0, 3);
  const extraValuesCount = Math.max(0, values.length - visibleValues.length);
  const visibleSdgs = sdgs.slice(0, 3);
  const extraSdgsCount = Math.max(0, sdgs.length - visibleSdgs.length);

  const handleOpen = () => {
    navigate(`/case-studies?id=${caseStudy.id}`);
  };

  const staggerDelay = Math.min((index % 6) * 0.05, 0.25);

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ duration: 0.32, delay: staggerDelay, ease: EDITORIAL_EASE }}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Read case study: ${caseStudy.name}`}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white transition-colors duration-200 hover:border-[#3F673C] hover:shadow-[0_16px_36px_-18px_rgba(32,43,32,0.28)] focus:outline-none focus:ring-2 focus:ring-[#3F673C] focus:ring-offset-2"
    >
      {/* Photo Header */}
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#202B20]">
        {imgUrl && !imageError ? (
          <img
            src={imgUrl}
            alt={caseStudy.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className={`h-full w-full object-cover ${
              reduced
                ? ""
                : "transition-transform duration-500 ease-out group-hover:scale-105"
            }`}
          />
        ) : (
          <PlaceholderCover name={caseStudy.name} segment={caseStudy.segment} />
        )}

        {/* Legibility Scrim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#192419]/90 via-[#192419]/25 to-[#192419]/15"
        />

        {/* Top-left Segment Pill */}
        {caseStudy.segment && (
          <div className="absolute left-3.5 top-3.5 z-10">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider shadow-sm ${
                isMaldev
                  ? "border border-[#D6CE8A] bg-[#FAF8E4] text-[#6F4E37]"
                  : "border border-[#D6CE8A]/70 bg-[#E9E6B2] text-[#202B20]"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                  isMaldev ? "bg-[#A86B32]" : "bg-[#187347]"
                }`}
              />
              {isMaldev ? "Maldevelopment" : "Worthwhile Development"}
            </span>
          </div>
        )}

        {/* Bottom-left Region Pill on Scrim */}
        {regions.length > 0 && (
          <div className="absolute bottom-3 left-3.5 right-3.5 z-10 flex flex-wrap items-center gap-1.5">
            {regions.slice(0, 2).map((region) => (
              <span
                key={region}
                className="inline-flex items-center gap-1 rounded-full border border-[#9AB887]/50 bg-[#192419]/75 px-2.5 py-0.5 text-[11px] font-medium text-[#EDF4E8] backdrop-blur-sm"
              >
                <MapPin
                  className="h-3 w-3 shrink-0 text-[#E9E6B2]"
                  aria-hidden="true"
                />
                <span className="max-w-[160px] truncate">{region}</span>
              </span>
            ))}
            {regions.length > 2 && (
              <span className="rounded-full border border-[#9AB887]/40 bg-[#192419]/70 px-2 py-0.5 font-mono text-[10px] text-[#E9E6B2]">
                +{regions.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3
          className="line-clamp-2 text-lg font-semibold leading-snug text-[#202B20] transition-colors group-hover:text-[#187347] sm:text-[1.15rem]"
          style={EDITORIAL_SERIF_STYLE}
        >
          {caseStudy.name}
        </h3>

        {excerpt ? (
          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-[#596556]">
            {excerpt}
          </p>
        ) : (
          <p className="mt-2.5 text-sm italic text-[#596556]/80">
            Explore full ethical evaluation, lessons learned, and SDG alignment.
          </p>
        )}

        {/* Metadata Tags (Values & SDGs) */}
        {(visibleValues.length > 0 || visibleSdgs.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {visibleValues.map((value) => (
              <span
                key={`val-${value}`}
                className="inline-flex items-center rounded-full border border-[#B2C9A8]/80 bg-[#EDF4E8] px-2.5 py-0.5 text-[11px] font-medium text-[#284B26]"
              >
                {value}
              </span>
            ))}
            {extraValuesCount > 0 && (
              <span className="inline-flex items-center rounded-full border border-[#B2C9A8]/60 bg-[#FAFDF8] px-2 py-0.5 font-mono text-[10px] text-[#596556]">
                +{extraValuesCount}
              </span>
            )}
            {visibleSdgs.map((sdg) => (
              <span
                key={`sdg-${sdg}`}
                className="inline-flex items-center rounded-full border border-[#D6CE8A] bg-[#FAF8E4] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#5A5026]"
              >
                SDG {sdg}
              </span>
            ))}
            {extraSdgsCount > 0 && (
              <span className="inline-flex items-center rounded-full border border-[#D6CE8A]/70 bg-[#FAF8E4]/60 px-2 py-0.5 font-mono text-[10px] text-[#6F6057]">
                +{extraSdgsCount} SDGs
              </span>
            )}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-[#D5E3D9] pt-4 text-xs">
          <span className="font-mono uppercase tracking-wider text-[#596556]">
            Case Dossier
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#187347] transition-colors group-hover:text-[#105C37]">
            <span>Read Study</span>
            <ArrowRight
              className={`h-3.5 w-3.5 ${
                reduced
                  ? ""
                  : "transition-transform duration-200 group-hover:translate-x-1"
              }`}
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
