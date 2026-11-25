import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronRight, Layers } from "lucide-react";
import type { GlobeCountry, GlobeRegion } from "@/components/ui/globe";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
} from "@/components/editorial/EditorialPagePrimitives";
import { cn } from "@/lib/utils";

const PLACEHOLDER_ROWS = [
  { id: 1, label: "Regional Comparison Tier 01" },
  { id: 2, label: "Regional Comparison Tier 02" },
  { id: 3, label: "Regional Comparison Tier 03" },
];
const PLACEHOLDER_SLOTS = Array.from({ length: 8 }, (_, index) => index);
const INITIAL_VISIBLE_PER_REGION = 12;

export interface RankingCardRowsProps {
  regions?: readonly GlobeRegion[];
  countries?: readonly GlobeCountry[];
  selectedCountries?: readonly string[];
  selectedDevelopmentValue?: string;
  onSelectCountry?: (country: GlobeCountry) => void;
}

export default function RankingCardRows({
  regions = [],
  countries = [],
  selectedCountries = [],
  selectedDevelopmentValue,
  onSelectCountry,
}: RankingCardRowsProps) {
  const reduced = useReducedMotion();
  const [expandedRegions, setExpandedRegions] = useState<
    Record<string, boolean>
  >({});

  const selectedCountrySet = new Set(selectedCountries);
  const hasMappedData = regions.length > 0 && countries.length > 0;

  if (!hasMappedData) {
    return (
      <div className="grid w-full min-w-0 gap-5">
        {PLACEHOLDER_ROWS.map((row, rowIndex) => (
          <div
            key={row.id}
            className="min-w-0 overflow-hidden rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3EBDE] bg-[#FAFDF8] px-5 py-3.5">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                  0{rowIndex + 1} / Ranking Rail
                </p>
                <h3
                  className="mt-0.5 text-base font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {row.label}
                </h3>
              </div>
              <span className="rounded-full border border-[#D5E3D9] bg-[#F2F6EF] px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26]">
                Awaiting Data
              </span>
            </div>

            <div
              role="region"
              aria-label={`Card row ${row.id}, scroll horizontally`}
              tabIndex={0}
              className="ranking-rail-scroll flex gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain p-5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#3F673C]"
            >
              {PLACEHOLDER_SLOTS.map((slot) => (
                <div
                  key={slot}
                  aria-hidden="true"
                  className="flex h-40 w-56 shrink-0 flex-col justify-between rounded-xl border-[1.5px] border-dashed border-[#B2C9A8] bg-[#F2F6EF]/60 p-4 sm:w-64"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#596556]">
                      Rank #{String(slot + 1).padStart(2, "0")}
                    </span>
                    <span className="size-2.5 rounded-full bg-[#B2C9A8]" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3.5 w-3/4 rounded-full bg-[#D5E3D9]/80" />
                    <div className="h-2 w-full rounded-full bg-[#E3EBDE]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const regionGroups = regions
    .map((region) => {
      const regionCountries = countries
        .filter((c) => c.worldBankRegion === region.worldBankRegion)
        .filter((c) =>
          selectedCountrySet.size > 0 ? selectedCountrySet.has(c.name) : true,
        );
      return { region, countries: regionCountries };
    })
    .filter((group) => group.countries.length > 0);

  const totalCountriesInView = regionGroups.reduce(
    (sum, group) => sum + group.countries.length,
    0,
  );

  return (
    <div className="grid w-full min-w-0 gap-5">
      {/* Editorial Summary Banner */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border-[1.5px] border-[#94B985] bg-[#F2F6EF] px-5 py-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
            Regional Rankings &middot; Comparative Directory
          </p>
          <h3
            className="mt-1 text-lg font-semibold text-[#202B20] sm:text-xl"
            style={EDITORIAL_SERIF_STYLE}
          >
            {selectedDevelopmentValue
              ? `Focus Value: ${selectedDevelopmentValue}`
              : "All Seven Worthwhile Development Values"}
          </h3>
          <p className="mt-0.5 text-xs text-[#596556]">
            Showing {totalCountriesInView}{" "}
            {totalCountriesInView === 1 ? "country" : "countries"} across{" "}
            {regionGroups.length}{" "}
            {regionGroups.length === 1 ? "region" : "regions"}. Click any
            country card to inspect its seven-value profile.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D6CE8A] bg-[#FAF8E4] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#6F6057]">
            <Layers className="h-3 w-3" aria-hidden="true" />
            Index Scores Pending
          </span>
        </div>
      </div>

      {/* Per-Region Horizontal Editorial Ranking Rails */}
      {regionGroups.map(({ region, countries: groupCountries }, groupIndex) => {
        const isExpanded = Boolean(expandedRegions[region.name]);
        const visibleCountries = isExpanded
          ? groupCountries
          : groupCountries.slice(0, INITIAL_VISIBLE_PER_REGION);
        const hiddenCount = groupCountries.length - visibleCountries.length;

        return (
          <motion.section
            key={region.name}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: Math.min(groupIndex * 0.05, 0.25),
              ease: EDITORIAL_EASE,
            }}
            aria-label={`${region.name} regional rankings`}
            className="min-w-0 overflow-hidden rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white shadow-xs"
          >
            {/* Region Row Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3EBDE] bg-[#FAFDF8] px-5 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="size-3.5 shrink-0 rounded-full ring-4 ring-[#EDF4E8]"
                  style={{ backgroundColor: region.color }}
                />
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[#187347]">
                    Region {String(groupIndex + 1).padStart(2, "0")} &middot;
                    World Bank Grouping
                  </p>
                  <h4
                    className="truncate text-lg font-semibold text-[#202B20]"
                    style={EDITORIAL_SERIF_STYLE}
                  >
                    {region.name}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="rounded-full border border-[#94B985] bg-white px-3 py-1 font-mono text-[11px] font-medium text-[#284B26]">
                  {groupCountries.length}{" "}
                  {groupCountries.length === 1 ? "Nation" : "Nations"}
                </span>
                {hiddenCount > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedRegions((prev) => ({
                        ...prev,
                        [region.name]: true,
                      }))
                    }
                    className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#B2C9A8] bg-[#F2F6EF] px-3 py-1 text-xs font-medium text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F673C]"
                  >
                    Show all +{hiddenCount}
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* Horizontal Scrollable Country Cards Rail */}
            <div
              role="region"
              aria-label={`${region.name} country ranking cards, scroll horizontally`}
              tabIndex={0}
              className="ranking-rail-scroll flex gap-3.5 overflow-x-auto overflow-y-hidden overscroll-x-contain p-5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#3F673C]"
            >
              {visibleCountries.map((country, slotIndex) => {
                const isSelected = selectedCountrySet.has(country.name);
                const rankLabel = String(slotIndex + 1).padStart(2, "0");

                return (
                  <motion.button
                    key={country.name}
                    type="button"
                    whileHover={reduced ? undefined : { y: -3 }}
                    transition={{ duration: 0.18, ease: EDITORIAL_EASE }}
                    onClick={() => onSelectCountry?.(country)}
                    className={cn(
                      "group flex w-60 shrink-0 cursor-pointer flex-col justify-between gap-4 rounded-xl border-[1.5px] p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F673C] sm:w-64",
                      isSelected
                        ? "border-[#3F673C] bg-[#FAFDF8] shadow-sm ring-1 ring-[#3F673C]/15"
                        : "border-[#B2C9A8] bg-white hover:border-[#3F673C] hover:bg-[#FAFDF8]",
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                          <span
                            aria-hidden="true"
                            className="size-2 rounded-full"
                            style={{ backgroundColor: region.color }}
                          />
                          Slot #{rankLabel}
                        </span>
                        <span className="rounded-full border border-[#D5E3D9] bg-[#F2F6EF] px-2 py-0.5 font-mono text-[10px] font-medium text-[#284B26]">
                          {isSelected ? "Selected" : "—"}
                        </span>
                      </div>

                      <h5
                        className="mt-2.5 line-clamp-2 text-base font-semibold leading-snug text-[#202B20]"
                        style={EDITORIAL_SERIF_STYLE}
                      >
                        {country.name}
                      </h5>

                      <p className="mt-1 truncate text-xs text-[#596556]">
                        {selectedDevelopmentValue ?? "7-Value Composite"}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-[#596556]">
                        <span>INDEX SCORE</span>
                        <span className="text-[#284B26]">Pending</span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#EDF4E8]"
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: region.color }}
                          initial={reduced ? false : { width: "0%" }}
                          animate={{ width: isSelected ? "36%" : "18%" }}
                          transition={
                            reduced
                              ? { duration: 0 }
                              : {
                                  duration: 0.45,
                                  delay: Math.min(slotIndex * 0.03, 0.25),
                                  ease: EDITORIAL_EASE,
                                }
                          }
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-[#EDF4E8] pt-2.5 text-xs font-semibold text-[#3F673C] transition-colors group-hover:text-[#187347]">
                        <span>Inspect profile</span>
                        <ArrowUpRight
                          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
