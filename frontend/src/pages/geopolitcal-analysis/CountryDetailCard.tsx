import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Globe2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GlobeCountry } from "@/components/ui/globe";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
} from "@/components/editorial/EditorialPagePrimitives";
import { cn } from "@/lib/utils";

const VALUE_DESCRIPTIONS: Record<string, string> = {
  "Well-being":
    "Evaluates material security, health outcomes, education access, and foundational conditions for human flourishing.",
  Equality:
    "Examines fair distribution of opportunities, resources, and social protections across demographic and geographic groups.",
  "Agency and Empowerment":
    "Measures the capacity of communities and individuals to shape policies, voice priorities, and lead local initiatives.",
  "Environmental Sustainability":
    "Assesses ecological stewardship, climate resilience, and responsible resource use for present and future generations.",
  "Human Rights":
    "Tracks legal safeguards, civil liberties, personal dignity, and protections against systemic harm or exclusion.",
  "Cultural Freedom":
    "Reflects respect for heritage, linguistic diversity, local knowledge systems, and self-determined cultural expression.",
  Responsibility:
    "Considers institutional accountability, ethical governance, and shared global obligations across stakeholders.",
};

interface CountryDetailCardProps {
  country: GlobeCountry;
  values: readonly string[];
  initialValue?: string;
  regionColor?: string;
  onClose: () => void;
}

export default function CountryDetailCard({
  country,
  values,
  initialValue,
  regionColor,
  onClose,
}: CountryDetailCardProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(
    initialValue ?? values[0] ?? null,
  );
  const reduced = useReducedMotion();

  const selectedIndex = selectedValue ? values.indexOf(selectedValue) : -1;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="country-detail-card">
        {/* Forest Green Editorial Header */}
        <header className="relative overflow-hidden bg-[#3F673C] px-5 py-5 pr-14 text-white sm:px-7 sm:py-6">
          <div
            aria-hidden="true"
            className="editorial-grid-texture pointer-events-none absolute inset-0 opacity-60"
          />
          <div className="relative flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9AB887] bg-[#2E502B] px-3 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#E9E6B2]">
                <Globe2 className="h-3 w-3" aria-hidden="true" />
                Country Profile
              </span>
              <span className="inline-flex items-center rounded-full border border-[#9AB887]/60 bg-[#355832] px-3 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#EDF4E8]">
                7 Worthwhile Values
              </span>
            </div>

            <DialogTitle
              className="mt-1 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl"
              style={EDITORIAL_SERIF_STYLE}
            >
              {country.name}
            </DialogTitle>

            <DialogDescription className="flex items-center gap-2 text-sm text-[#E8F0E5]">
              {regionColor && (
                <span
                  aria-hidden="true"
                  className="inline-block size-2.5 shrink-0 rounded-full ring-2 ring-white/50"
                  style={{ backgroundColor: regionColor }}
                />
              )}
              <span>{country.worldBankRegion}</span>
            </DialogDescription>
          </div>
        </header>

        {/* Two-Column Editorial Content */}
        <div className="grid grid-cols-1 gap-5 bg-[#F2F6EF] p-5 sm:p-6 md:grid-cols-12">
          {/* Left: 7 Development Value Selectors */}
          <div
            className="flex flex-col gap-2.5 md:col-span-5"
            role="group"
            aria-label="Country development values"
          >
            {values.map((value, index) => {
              const isSelected = selectedValue === value;
              const formattedNumber = String(index + 1).padStart(2, "0");

              return (
                <motion.button
                  key={value}
                  type="button"
                  whileHover={reduced ? undefined : { x: 2 }}
                  transition={{ duration: 0.16, ease: EDITORIAL_EASE }}
                  aria-pressed={isSelected}
                  aria-controls="country-detail-body"
                  onClick={() =>
                    setSelectedValue((selected) =>
                      selected === value ? null : value,
                    )
                  }
                  className={cn(
                    "group flex w-full cursor-pointer items-center gap-3.5 rounded-xl border-[1.5px] px-3.5 py-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F673C]",
                    isSelected
                      ? "border-[#3F673C] bg-[#FAFDF8] shadow-sm ring-1 ring-[#3F673C]/15"
                      : "border-[#B2C9A8] bg-white hover:border-[#3F673C]/70 hover:bg-[#FAFDF8]",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-full border font-mono text-sm font-semibold transition-colors",
                      isSelected
                        ? "border-[#3F673C] bg-[#3F673C] text-[#E9E6B2]"
                        : "border-[#B2C9A8] bg-[#EDF4E8] text-[#284B26] group-hover:border-[#94B985]",
                    )}
                  >
                    &mdash;
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#187347]">
                        Value {formattedNumber}
                      </span>
                      <span className="font-mono text-[10px] text-[#596556]">
                        Pending
                      </span>
                    </span>
                    <span
                      className="mt-0.5 block truncate text-sm font-semibold text-[#202B20]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {value}
                    </span>
                    {/* Structural horizontal score bar track */}
                    <span
                      aria-hidden="true"
                      className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-[#EDF4E8]"
                    >
                      <motion.span
                        className="block h-full rounded-full"
                        style={{
                          backgroundColor: isSelected ? "#3F673C" : "#94B985",
                        }}
                        initial={false}
                        animate={{
                          width: isSelected ? "28%" : "12%",
                          opacity: isSelected ? 0.85 : 0.4,
                        }}
                        transition={
                          reduced
                            ? { duration: 0 }
                            : { duration: 0.35, ease: EDITORIAL_EASE }
                        }
                      />
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Right: Active Value Editorial Detail Panel */}
          <section
            id="country-detail-body"
            aria-live="polite"
            aria-atomic="true"
            className="flex min-h-[18rem] flex-col justify-between rounded-xl border-[1.5px] border-[#B2C9A8] bg-white p-5 sm:p-6 md:col-span-7"
          >
            <AnimatePresence mode="wait" initial={false}>
              {selectedValue ? (
                <motion.div
                  key={selectedValue}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={reduced ? undefined : { opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
                  className="flex h-full flex-col justify-between gap-6"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D5E3D9] pb-4">
                      <div>
                        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                          Value{" "}
                          {String(Math.max(selectedIndex + 1, 1)).padStart(
                            2,
                            "0",
                          )}{" "}
                          &middot; Worthwhile Development Lens
                        </p>
                        <h3
                          className="mt-1.5 text-xl font-semibold text-[#202B20] sm:text-2xl"
                          style={EDITORIAL_SERIF_STYLE}
                        >
                          {selectedValue}
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#D6CE8A] bg-[#FAF8E4] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#6F6057]">
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        Score Pending
                      </span>
                    </div>

                    {VALUE_DESCRIPTIONS[selectedValue] && (
                      <p className="mt-4 text-sm leading-relaxed text-[#394838]">
                        {VALUE_DESCRIPTIONS[selectedValue]}
                      </p>
                    )}

                    {/* Score & Metric Indicator Box */}
                    <div className="mt-5 rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] p-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#284B26]">
                          Country Index Readout
                        </span>
                        <span
                          className="text-xl font-bold text-[#187347]"
                          style={EDITORIAL_SERIF_STYLE}
                        >
                          &mdash;
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="mt-2.5 h-2 w-full overflow-hidden rounded-full border border-[#D5E3D9] bg-white"
                      >
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#3F673C] to-[#94B985]"
                          initial={reduced ? false : { width: "0%" }}
                          animate={{ width: "16%" }}
                          transition={
                            reduced
                              ? { duration: 0 }
                              : { duration: 0.45, ease: EDITORIAL_EASE }
                          }
                          style={{ opacity: 0.45 }}
                        />
                      </div>
                      <p className="mt-3 text-sm font-medium text-[#394838]">
                        No data available yet.
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[#596556]">
                        Quantitative benchmarks and qualitative field notes for{" "}
                        <span className="font-medium text-[#202B20]">
                          {country.name}
                        </span>{" "}
                        under {selectedValue} will populate here as datasets are
                        published.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E3EBDE] pt-3.5 text-xs text-[#596556]">
                    <span>World Bank Grouping</span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#284B26]">
                      {regionColor && (
                        <span
                          aria-hidden="true"
                          className="inline-block size-2 rounded-full"
                          style={{ backgroundColor: regionColor }}
                        />
                      )}
                      {country.worldBankRegion}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-selection"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={reduced ? undefined : { opacity: 1 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex h-full flex-col items-center justify-center py-10 text-center"
                >
                  <p
                    className="text-lg font-semibold text-[#202B20]"
                    style={EDITORIAL_SERIF_STYLE}
                  >
                    Select a Value to Inspect
                  </p>
                  <p className="mt-2 max-w-xs text-sm text-[#596556]">
                    Select a value to view its details.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
