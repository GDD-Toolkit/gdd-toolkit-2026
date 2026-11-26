import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, FileText, Layers, X } from "lucide-react";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
} from "@/components/editorial/EditorialPagePrimitives";

/**
 * TODO: Replace placeholder resource content with the
 * final methodology document and infographics provided
 * by the AI Ethics module.
 *
 * See README.md for additional handoff information.
 */
type DashboardResourcesProps = {
  variant?: "cards" | "compact";
};

export default function DashboardResources({
  variant = "cards",
}: DashboardResourcesProps) {
  const [showSupportingDocument, setShowSupportingDocument] = useState(false);
  const [showCommunityResource, setShowCommunityResource] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!showSupportingDocument && !showCommunityResource) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSupportingDocument(false);
        setShowCommunityResource(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showSupportingDocument, showCommunityResource]);

  return (
    <>
      {variant === "compact" ? (
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowSupportingDocument(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-[#B2C9A8] bg-white px-4 py-2 text-xs font-semibold text-[#284B26] transition-all duration-200 hover:border-[#3F673C] hover:bg-[#EDF4E8] focus:outline-none focus:ring-2 focus:ring-[#3F673C] sm:text-sm"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#187347]" aria-hidden="true" />
            <span>Read our Methodology</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCommunityResource(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-[#B2C9A8] bg-white px-4 py-2 text-xs font-semibold text-[#284B26] transition-all duration-200 hover:border-[#3F673C] hover:bg-[#EDF4E8] focus:outline-none focus:ring-2 focus:ring-[#3F673C] sm:text-sm"
          >
            <Layers className="h-3.5 w-3.5 text-[#187347]" aria-hidden="true" />
            <span>View our Infographics</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.button
            type="button"
            onClick={() => setShowSupportingDocument(true)}
            whileHover={reduced ? undefined : { y: -3 }}
            transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
            className="group flex cursor-pointer flex-col justify-between gap-5 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-7 text-left transition-colors duration-200 hover:border-[#3F673C] hover:bg-[#FAFDF8] focus:outline-none focus:ring-2 focus:ring-[#3F673C]"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full border border-[#94B985] bg-[#EDF4E8] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                  Evaluation Framework
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] text-[#3F673C] transition-colors group-hover:border-[#3F673C] group-hover:bg-[#3F673C] group-hover:text-white">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              <h3
                className="mt-4 text-2xl font-semibold text-[#202B20] group-hover:text-[#187347]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Read our Methodology
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#596556]">
                Review how each AI platform is assessed across viability, bias
                mitigation, transparency, privacy, low-tech compatibility, and
                accountability on a 50-point ethicality scale.
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3F673C] group-hover:text-[#187347]">
              <span>Open Supporting Document</span>
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setShowCommunityResource(true)}
            whileHover={reduced ? undefined : { y: -3 }}
            transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
            className="group flex cursor-pointer flex-col justify-between gap-5 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-7 text-left transition-colors duration-200 hover:border-[#3F673C] hover:bg-[#FAFDF8] focus:outline-none focus:ring-2 focus:ring-[#3F673C]"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full border border-[#D6CE8A] bg-[#FAF8E4] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#6F6057]">
                  Visual Guides
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] text-[#3F673C] transition-colors group-hover:border-[#3F673C] group-hover:bg-[#3F673C] group-hover:text-white">
                  <Layers className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              <h3
                className="mt-4 text-2xl font-semibold text-[#202B20] group-hover:text-[#187347]"
                style={EDITORIAL_SERIF_STYLE}
              >
                View our Infographics
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#596556]">
                Explore visual summaries, quick-reference rubrics, and community
                resources designed for practitioners and classrooms adopting AI
                responsibly.
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3F673C] group-hover:text-[#187347]">
              <span>Explore Community Resources</span>
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </motion.button>
        </div>
      )}

      {/* Supporting Document Modal */}
      <AnimatePresence>
        {showSupportingDocument && (
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setShowSupportingDocument(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#202B20]/60 px-4 backdrop-blur-xs"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="supporting-document-title"
              initial={reduced ? false : { opacity: 0, y: 16, scale: 0.97 }}
              animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border-[1.5px] border-[#94B985] bg-white text-[#202B20] shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#D5E3D9] bg-[#3F673C] px-6 py-5 text-white">
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#E9E6B2]">
                    AI Ethics Evaluation Methodology
                  </p>
                  <h2
                    id="supporting-document-title"
                    className="mt-1 text-2xl font-semibold"
                    style={EDITORIAL_SERIF_STYLE}
                  >
                    Supporting Document
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSupportingDocument(false)}
                  aria-label="Close"
                  className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#9AB887]/60 bg-[#2E502B] text-[#E9E6B2] transition-colors hover:bg-[#254223] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm leading-relaxed text-[#394838] sm:text-base">
                  Supporting documents for the AI Ethics Dashboard will be
                  available here.
                </p>

                <div className="mt-5 rounded-xl border border-[#B2C9A8] bg-[#F2F6EF] p-4">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#187347]">
                    Rubric Criteria Covered (50-Point Scale)
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {[
                      "Viability",
                      "Bias Mitigation",
                      "Transparency",
                      "Control & Oversight",
                      "Privacy & Data Ethics",
                      "Localization & Accessibility",
                      "Evidence of Impact",
                      "Low-Tech Compatibility",
                      "Ethical Failsafes",
                      "Accountability",
                      "Documentation & Support",
                    ].map((criterion) => (
                      <span
                        key={criterion}
                        className="rounded-full border border-[#94B985] bg-white px-3 py-1 text-xs font-medium text-[#284B26]"
                      >
                        {criterion}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowSupportingDocument(false)}
                    className="cursor-pointer rounded-full bg-[#3F673C] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#187347]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Community Resource Modal */}
      <AnimatePresence>
        {showCommunityResource && (
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setShowCommunityResource(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#202B20]/60 px-4 backdrop-blur-xs"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="community-resource-title"
              initial={reduced ? false : { opacity: 0, y: 16, scale: 0.97 }}
              animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border-[1.5px] border-[#94B985] bg-white text-[#202B20] shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#D5E3D9] bg-[#3F673C] px-6 py-5 text-white">
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#E9E6B2]">
                    Visual Guides &amp; Infographics
                  </p>
                  <h2
                    id="community-resource-title"
                    className="mt-1 text-2xl font-semibold"
                    style={EDITORIAL_SERIF_STYLE}
                  >
                    Community Resource
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCommunityResource(false)}
                  aria-label="Close"
                  className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#9AB887]/60 bg-[#2E502B] text-[#E9E6B2] transition-colors hover:bg-[#254223] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm leading-relaxed text-[#394838] sm:text-base">
                  Community resources and infographics will be available here.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    {
                      title: "Scorecard Guide",
                      detail: "How to interpret 0–50 ethicality ratings.",
                    },
                    {
                      title: "Field Checklist",
                      detail: "Pre-deployment questions for community work.",
                    },
                    {
                      title: "Classroom Poster",
                      detail: "Summary of responsible AI research habits.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-4"
                    >
                      <p
                        className="text-sm font-semibold text-[#202B20]"
                        style={EDITORIAL_SERIF_STYLE}
                      >
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[#596556]">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCommunityResource(false)}
                    className="cursor-pointer rounded-full bg-[#3F673C] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#187347]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
