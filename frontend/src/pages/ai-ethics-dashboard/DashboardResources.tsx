import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Layers,
  Sparkles,
  X,
} from "lucide-react";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
} from "@/components/editorial/EditorialPagePrimitives";

type DashboardResourcesProps = {
  variant?: "cards" | "compact";
};

const METHODOLOGY_DIMENSIONS = [
  "Viability",
  "Bias Mitigation",
  "Transparency",
  "Control & Oversight",
  "Privacy & Data",
  "Localization",
  "Evidence of Impact",
  "Low-tech Compatibility",
];

export default function DashboardResources({
  variant = "cards",
}: DashboardResourcesProps) {
  const reduced = useReducedMotion();
  const [showSupportingDocument, setShowSupportingDocument] = useState(false);
  const [showCommunityResource, setShowCommunityResource] = useState(false);

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
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-[#B2C9A8] bg-white px-4 py-2 text-xs font-semibold text-[#284B26] transition-all hover:border-[#3F673C] hover:bg-[#FAFDF8] focus:outline-none focus:ring-2 focus:ring-[#3F673C] sm:text-sm"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#187347]" aria-hidden="true" />
            <span>Read our Methodology</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCommunityResource(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-[#B2C9A8] bg-white px-4 py-2 text-xs font-semibold text-[#284B26] transition-all hover:border-[#3F673C] hover:bg-[#FAFDF8] focus:outline-none focus:ring-2 focus:ring-[#3F673C] sm:text-sm"
          >
            <Layers className="h-3.5 w-3.5 text-[#187347]" aria-hidden="true" />
            <span>View our Infographics</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Methodology Card */}
          <motion.div
            whileHover={reduced ? undefined : { y: -3 }}
            transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
            className="flex flex-col justify-between gap-6 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6 transition-colors hover:border-[#3F673C] hover:bg-[#FAFDF8] sm:p-7"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E3D9] bg-[#EDF4E8] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#187347]">
                  <FileText className="h-3 w-3" aria-hidden="true" />
                  01 &middot; Methodology
                </span>
                <BookOpen
                  className="h-5 w-5 text-[#3F673C]"
                  aria-hidden="true"
                />
              </div>

              <h3
                className="mt-4 text-xl font-semibold text-[#202B20] sm:text-2xl"
                style={EDITORIAL_SERIF_STYLE}
              >
                Evaluation Rubric &amp; Supporting Document
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-[#596556]">
                Review how each AI platform is scored across eight worthwhile
                development dimensions—covering bias mitigation, data privacy,
                transparency, and low-tech accessibility.
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {METHODOLOGY_DIMENSIONS.slice(0, 4).map((dim) => (
                  <span
                    key={dim}
                    className="rounded-full border border-[#D5E3D9] bg-[#F2F6EF] px-2.5 py-0.5 text-[11px] font-medium text-[#284B26]"
                  >
                    {dim}
                  </span>
                ))}
                <span className="rounded-full border border-[#D5E3D9] bg-[#F2F6EF] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#187347]">
                  +4 more
                </span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowSupportingDocument(true)}
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#3F673C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#187347] focus:outline-none focus:ring-2 focus:ring-[#3F673C] focus:ring-offset-2"
              >
                <span>Read our Methodology</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </motion.div>

          {/* Infographics / Community Resources Card */}
          <motion.div
            whileHover={reduced ? undefined : { y: -3 }}
            transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
            className="flex flex-col justify-between gap-6 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6 transition-colors hover:border-[#3F673C] hover:bg-[#FAFDF8] sm:p-7"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E3D9] bg-[#EDF4E8] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#187347]">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  02 &middot; Community Resources
                </span>
                <Layers
                  className="h-5 w-5 text-[#3F673C]"
                  aria-hidden="true"
                />
              </div>

              <h3
                className="mt-4 text-xl font-semibold text-[#202B20] sm:text-2xl"
                style={EDITORIAL_SERIF_STYLE}
              >
                Practitioner Guides &amp; Infographics
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-[#596556]">
                Explore visual summaries, classroom handouts, and ethical AI
                decision checklists crafted to help students and development
                teams adopt AI tools responsibly.
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Scorecard Guides", "Field Checklists", "Workshop Visuals"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#D5E3D9] bg-[#F2F6EF] px-2.5 py-0.5 text-[11px] font-medium text-[#284B26]"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowCommunityResource(true)}
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-[#3F673C] bg-white px-5 py-2.5 text-sm font-semibold text-[#284B26] transition-colors hover:bg-[#EDF4E8] focus:outline-none focus:ring-2 focus:ring-[#3F673C] focus:ring-offset-2"
              >
                <span>View our Infographics</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </motion.div>
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
                    Methodology &amp; Rubric
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

                <div className="mt-5 rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-4">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#187347]">
                    Eight Evaluated Ethical Dimensions
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {METHODOLOGY_DIMENSIONS.map((dimension) => (
                      <div
                        key={dimension}
                        className="flex items-center gap-2 text-sm text-[#284B26]"
                      >
                        <CheckCircle2
                          className="h-4 w-4 shrink-0 text-[#187347]"
                          aria-hidden="true"
                        />
                        <span>{dimension}</span>
                      </div>
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
                      detail: "How to interpret 0–100 ethicality ratings.",
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
