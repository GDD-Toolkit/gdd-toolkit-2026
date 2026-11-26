import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  Compass,
  Globe2,
  MapPin,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Globe, {
  type GlobeCountry,
  type GlobeRegion,
} from "@/components/ui/globe";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialReveal,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import { cn } from "@/lib/utils";
import RankingCardRows from "./RankingCardRows";
import CountryDetailCard from "./CountryDetailCard";
import "./GeopoliticalAnalysis.css";

// Match the reference map's pre-July-2025 World Bank analytical grouping.
// Natural Earth's REGION_WB labels retain Afghanistan and Pakistan in South Asia.
const regions: GlobeRegion[] = [
  {
    name: "East Asia and Pacific",
    color: "#e1812c",
    worldBankRegion: "East Asia & Pacific",
    center: [135, 10],
  },
  {
    name: "Europe and Central Asia",
    color: "#d20b47",
    worldBankRegion: "Europe & Central Asia",
    center: [50, 50],
  },
  {
    name: "Latin America and Caribbean",
    color: "#39943a",
    worldBankRegion: "Latin America & Caribbean",
    center: [-75, -10],
  },
  {
    name: "Middle East and North Africa",
    color: "#803e85",
    worldBankRegion: "Middle East & North Africa",
    center: [30, 28],
  },
  {
    name: "North America",
    color: "#58595b",
    worldBankRegion: "North America",
    center: [-105, 50],
  },
  {
    name: "South Asia",
    color: "#227fba",
    worldBankRegion: "South Asia",
    center: [78, 23],
  },
  {
    name: "Sub-Saharan Africa",
    color: "#ffcc00",
    worldBankRegion: "Sub-Saharan Africa",
    center: [20, -5],
  },
];

const regionNames = regions.map((region) => region.name);

const regionColorByName = new Map(
  regions.map((region) => [region.name, region.color]),
);

const regionByWorldBankName = new Map(
  regions.map((region) => [region.worldBankRegion, region]),
);

const developmentValues = [
  "Well-being",
  "Equality",
  "Agency and Empowerment",
  "Environmental Sustainability",
  "Human Rights",
  "Cultural Freedom",
  "Responsibility",
];

const VALUE_SUMMARY: Record<string, string> = {
  "Well-being": "Health, livelihood security, and human flourishing.",
  Equality: "Equitable access to resources and social opportunity.",
  "Agency and Empowerment": "Local voice, self-determination, and leadership.",
  "Environmental Sustainability":
    "Climate resilience and long-term ecological care.",
  "Human Rights": "Dignity, civil protections, and legal safeguards.",
  "Cultural Freedom": "Respect for heritage, language, and local identity.",
  Responsibility: "Accountable governance and shared global stewardship.",
};

function MultiSelectCombobox({
  id,
  label,
  items,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  getItemColor,
}: {
  id: string;
  label: string;
  items: string[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder: string;
  disabled?: boolean;
  getItemColor?: (item: string) => string | undefined;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#284B26]"
        >
          {label}
        </label>
        {value.length > 0 && (
          <span className="rounded-full bg-[#3F673C] px-2 py-0.5 font-mono text-[10px] font-medium text-[#E9E6B2]">
            {value.length}
          </span>
        )}
      </div>

      <Combobox
        multiple
        items={items}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <ComboboxInput
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          showClear
          className="border-[1.5px] border-[#B2C9A8] bg-white transition-colors focus-within:border-[#3F673C] focus-within:ring-2 focus-within:ring-[#3F673C]/20"
        />
        <ComboboxContent className="border border-[#B2C9A8]">
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => {
              const dotColor = getItemColor?.(item);
              return (
                <ComboboxItem key={item} value={item}>
                  {dotColor && (
                    <span
                      aria-hidden="true"
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: dotColor }}
                    />
                  )}
                  <span className="truncate">{item}</span>
                </ComboboxItem>
              );
            }}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {value.length > 0 && (
        <ul
          aria-label={`Selected ${label.toLowerCase()}`}
          className="mt-2.5 flex flex-wrap gap-1.5"
        >
          {value.map((item) => {
            const dotColor = getItemColor?.(item);
            return (
              <li key={item}>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#94B985] bg-white px-2.5 py-1 text-xs font-medium text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F673C]"
                  aria-label={`Remove ${item}`}
                  onClick={() =>
                    onValueChange(value.filter((selected) => selected !== item))
                  }
                >
                  {dotColor && (
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full"
                      style={{ backgroundColor: dotColor }}
                    />
                  )}
                  <span>{item}</span>
                  <X className="size-3 text-[#596556]" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function GeopoliticalAnalysis() {
  const reduced = useReducedMotion();
  const [activeView, setActiveView] = useState("globe");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<GlobeCountry[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [focusCountry, setFocusCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [detailCountry, setDetailCountry] = useState<GlobeCountry | null>(null);
  const [selectedDevelopmentValues, setSelectedDevelopmentValues] = useState<
    string[]
  >([]);

  const activeRegions = regions.filter((region) =>
    selectedRegions.includes(region.name),
  );
  const activeWorldBankRegions = new Set(
    activeRegions.map((region) => region.worldBankRegion),
  );
  const countryNames = [...countries]
    .sort((a, b) => {
      const regionPriority =
        Number(activeWorldBankRegions.has(b.worldBankRegion)) -
        Number(activeWorldBankRegions.has(a.worldBankRegion));
      return regionPriority || a.name.localeCompare(b.name);
    })
    .map((country) => country.name);
  const visibleRegions = selectedRegions.length > 0 ? activeRegions : regions;

  const hoveredCountryRecord = hoveredCountry
    ? countries.find((c) => c.name === hoveredCountry)
    : undefined;
  const hoveredCountryRegion = hoveredCountryRecord
    ? regionByWorldBankName.get(hoveredCountryRecord.worldBankRegion)
    : undefined;

  const detailCountryRegion = detailCountry
    ? regionByWorldBankName.get(detailCountry.worldBankRegion)
    : undefined;

  const hasAnySelection =
    selectedRegions.length > 0 ||
    selectedCountries.length > 0 ||
    selectedDevelopmentValues.length > 0;

  const changeRegions = (nextRegions: string[]) => {
    setFocusCountry(null);
    setSelectedRegions(nextRegions);
    const nextWorldBankRegions = new Set(
      regions
        .filter((region) => nextRegions.includes(region.name))
        .map((region) => region.worldBankRegion),
    );
    const validCountries = new Set(
      countries
        .filter((country) => nextWorldBankRegions.has(country.worldBankRegion))
        .map((country) => country.name),
    );
    // Keep country choices from retained regions and discard only invalid ones.
    setSelectedCountries((selected) =>
      selected.filter((country) => validCountries.has(country)),
    );
  };

  const toggleRegion = (regionName: string) => {
    if (selectedRegions.includes(regionName)) {
      changeRegions(selectedRegions.filter((name) => name !== regionName));
    } else {
      changeRegions([...selectedRegions, regionName]);
    }
  };

  const changeCountries = (nextCountries: string[]) => {
    const addedCountry = nextCountries.find(
      (country) => !selectedCountries.includes(country),
    );
    setFocusCountry(activeView === "globe" ? (addedCountry ?? null) : null);
    setSelectedCountries(nextCountries);
    const addedCountries = countries.filter(
      (country) =>
        nextCountries.includes(country.name) &&
        !selectedCountries.includes(country.name),
    );
    const removedWorldBankRegions = new Set(
      countries
        .filter(
          (country) =>
            selectedCountries.includes(country.name) &&
            !nextCountries.includes(country.name),
        )
        .map((country) => country.worldBankRegion),
    );
    const remainingWorldBankRegions = new Set(
      countries
        .filter((country) => nextCountries.includes(country.name))
        .map((country) => country.worldBankRegion),
    );
    const emptiedRegions = new Set(
      regions
        .filter(
          (region) =>
            removedWorldBankRegions.has(region.worldBankRegion ?? "") &&
            !remainingWorldBankRegions.has(region.worldBankRegion ?? ""),
        )
        .map((region) => region.name),
    );
    setSelectedRegions((selected) => {
      const nextRegions = selected.filter(
        (region) => !emptiedRegions.has(region),
      );
      for (const country of addedCountries) {
        const region = regions.find(
          (item) => item.worldBankRegion === country.worldBankRegion,
        );
        if (region && !nextRegions.includes(region.name))
          nextRegions.push(region.name);
      }
      return nextRegions;
    });
  };

  const resetSelections = () => {
    setFocusCountry(null);
    setSelectedRegions([]);
    setSelectedCountries([]);
    setSelectedDevelopmentValues([]);
  };

  const scrollToExplorer = (targetView?: "globe" | "placeholder") => {
    if (targetView) {
      setActiveView(targetView);
    }
    const el = document.getElementById("geopolitical-explorer");
    if (el) {
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }
  };

  return (
    <div className="geopolitical-page">
      {/* Forest Green Editorial Hero */}
      <EditorialPageHero
        ariaLabel="Geopolitical Analysis introduction"
        backLink={{ label: "Back to Toolkit", to: "/" }}
        badges={[
          { label: "04 · 3D GLOBAL DATA", tone: "cream" },
          { label: "7 World Bank Regions", tone: "sage" },
        ]}
        title={
          <>
            <em className="font-normal italic text-[#E9E6B2]">Geopolitical</em>{" "}
            Analysis
          </>
        }
        subtitle="Compare World Bank regions and nations across all seven worthwhile development values, helping practitioners ground ethical project design in real regional context."
        actions={
          <>
            <button
              type="button"
              onClick={() => scrollToExplorer("globe")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#E9E6B2] px-6 py-3 text-sm font-semibold text-[#202B20] shadow-sm transition-all duration-200 hover:bg-[#f2efbf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E9E6B2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3F673C]"
            >
              <Globe2 className="h-4 w-4" aria-hidden="true" />
              Explore 3D Globe
            </button>
            <button
              type="button"
              onClick={() => scrollToExplorer("placeholder")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#9AB887] bg-[#2E502B] px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#254223] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E9E6B2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3F673C]"
            >
              <BarChart3
                className="h-4 w-4 text-[#E9E6B2]"
                aria-hidden="true"
              />
              Regional Rankings
            </button>
          </>
        }
        footnote="World Bank Analytical Groupings (pre-July 2025) · 7 Worthwhile Development Values · Natural Earth 110m Projection"
        aside={
          <div className="rounded-2xl border-[1.5px] border-[#E9E6B2] bg-white p-5 text-[#202B20] shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[#187347]">
                  Interactive Region Legend
                </p>
                <h2
                  className="mt-1 text-lg font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  World Bank Regions
                </h2>
              </div>
              {selectedRegions.length > 0 ? (
                <button
                  type="button"
                  onClick={() => changeRegions([])}
                  className="cursor-pointer rounded-full border border-[#94B985] bg-[#EDF4E8] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#dfeeda]"
                >
                  Clear ({selectedRegions.length})
                </button>
              ) : (
                <span className="rounded-full border border-[#D5E3D9] bg-[#F2F6EF] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26]">
                  Click to Filter
                </span>
              )}
            </div>

            <div
              role="group"
              aria-label="Toggle World Bank region filter"
              className="mt-4 flex flex-wrap gap-2"
            >
              {regions.map((region) => {
                const isSelected = selectedRegions.includes(region.name);
                const isDimmed = selectedRegions.length > 0 && !isSelected;

                return (
                  <button
                    key={region.name}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleRegion(region.name)}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F673C]",
                      isSelected
                        ? "border-[#3F673C] bg-[#284B26] text-white shadow-xs"
                        : "border-[#D5E3D9] bg-[#F2F6EF] text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8]",
                      isDimmed && "opacity-60 hover:opacity-100",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-2.5 shrink-0 rounded-full",
                        isSelected && "ring-2 ring-white/70",
                      )}
                      style={{ backgroundColor: region.color }}
                    />
                    <span>{region.name}</span>
                    {isSelected && (
                      <Check
                        className="h-3 w-3 text-[#E9E6B2]"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#E3EBDE] pt-4">
              <div>
                <span
                  className="block text-xl font-bold text-[#187347]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  7
                </span>
                <span className="text-[11px] font-medium text-[#596556]">
                  WB Regions
                </span>
              </div>
              <div>
                <span
                  className="block text-xl font-bold text-[#187347]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {countries.length > 0 ? countries.length : "177"}
                </span>
                <span className="text-[11px] font-medium text-[#596556]">
                  Nations Mapped
                </span>
              </div>
              <div>
                <span
                  className="block text-xl font-bold text-[#187347]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  7
                </span>
                <span className="text-[11px] font-medium text-[#596556]">
                  Ethical Values
                </span>
              </div>
            </div>
          </div>
        }
      />

      {/* Primary Interactive Atlas & Regional Rankings Workspace */}
      <EditorialSection
        id="geopolitical-explorer"
        tone="white"
        ariaLabelledBy="geopolitical-map-title"
        compact
      >
        <EditorialSectionHeader
          eyebrow="01 / Interactive Atlas & Comparison"
          title="Explore Development Around the World"
          titleId="geopolitical-map-title"
          description="Select a development value, region, or country to guide your exploration. Click any nation on the 3D globe to open its seven-value profile, or compare regions side by side."
        />

        <EditorialReveal className="mt-8">
          <Tabs
            value={activeView}
            onValueChange={setActiveView}
            className="gap-6"
          >
            {/* Soft Sage Editorial Filter Bar & View Switcher */}
            <section
              aria-label="Geopolitical exploration tools"
              className="rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#F2F6EF] p-5 sm:p-6"
            >
              {/* Top Utility Row: View Switcher + Actions */}
              <div className="flex flex-col justify-between gap-4 border-b border-[#D5E3D9] pb-4 lg:flex-row lg:items-center">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#187347]">
                    <SlidersHorizontal
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Controls &amp; View
                  </span>

                  <TabsList
                    aria-label="Visualization view"
                    className="h-auto rounded-full border-[1.5px] border-[#94B985] bg-white p-1"
                  >
                    <TabsTrigger
                      value="globe"
                      className="cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold text-[#394838] transition-all data-active:bg-[#3F673C] data-active:text-white data-active:shadow-xs"
                    >
                      <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                      3D Globe
                    </TabsTrigger>
                    <TabsTrigger
                      value="placeholder"
                      className="cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold text-[#394838] transition-all data-active:bg-[#3F673C] data-active:text-white data-active:shadow-xs"
                    >
                      <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
                      Regional Rankings
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    aria-label="Reset all selections"
                    title="Reset all selections"
                    disabled={!hasAnySelection}
                    onClick={resetSelections}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#94B985] bg-white px-3.5 py-2 text-xs font-semibold text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F673C] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView("placeholder")}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F673C]"
                  >
                    Explore Rankings
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* 3-Column Cascading Filters */}
              <div className="mt-5 grid grid-cols-1 items-start gap-4 md:grid-cols-3">
                <MultiSelectCombobox
                  id="development-values-select"
                  label="Development values"
                  items={developmentValues}
                  value={selectedDevelopmentValues}
                  onValueChange={(values) =>
                    setSelectedDevelopmentValues(values.slice(-1))
                  }
                  placeholder="Select a development value"
                />
                <MultiSelectCombobox
                  id="region-select"
                  label="Regions"
                  items={regionNames}
                  value={selectedRegions}
                  onValueChange={changeRegions}
                  placeholder="Select regions"
                  getItemColor={(name) => regionColorByName.get(name)}
                />
                <MultiSelectCombobox
                  id="countries-select"
                  label="Countries"
                  items={countryNames}
                  value={selectedCountries}
                  onValueChange={changeCountries}
                  disabled={countryNames.length === 0}
                  placeholder={
                    countries.length === 0
                      ? "Loading countries..."
                      : "Select countries"
                  }
                />
              </div>

              {/* Live Status & Interactive Region Color Legend */}
              <div className="mt-5 flex flex-col gap-3 border-t border-[#D5E3D9] pt-4">
                <p
                  role="status"
                  className="flex items-center gap-2 text-xs font-medium text-[#394838]"
                >
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full bg-[#187347]"
                  />
                  <span>
                    {selectedRegions.length > 0
                      ? `Highlighting ${selectedRegions.join(", ")}. Clear to highlight all regions.`
                      : "Showing all region colors across 7 World Bank regions."}
                  </span>
                </p>

                <ul
                  aria-label="Region colors"
                  className="flex flex-wrap items-center gap-2"
                >
                  {visibleRegions.map((region) => {
                    const isSelected = selectedRegions.includes(region.name);
                    return (
                      <li key={region.name}>
                        <button
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => toggleRegion(region.name)}
                          className={cn(
                            "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F673C]",
                            isSelected
                              ? "border-[#3F673C] bg-[#3F673C] text-white"
                              : "border-[#B2C9A8] bg-white text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8]",
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "size-2.5 rounded-full",
                              isSelected && "ring-1 ring-white/70",
                            )}
                            style={{ backgroundColor: region.color }}
                          />
                          <span>{region.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>

            {/* 3D Globe Stage */}
            <TabsContent value="globe" className="w-full min-w-0">
              <div className="overflow-hidden rounded-2xl border-[1.5px] border-[#94B985] bg-white shadow-sm">
                {/* Stage Telemetry Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D5E3D9] bg-[#FAFDF8] px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Compass
                      className="h-4 w-4 text-[#187347]"
                      aria-hidden="true"
                    />
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#284B26]">
                      Interactive 3D Projection &middot; Click Any Country
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {selectedDevelopmentValues[0] && (
                      <span className="inline-flex items-center rounded-full border border-[#94B985] bg-[#EDF4E8] px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                        Lens: {selectedDevelopmentValues[0]}
                      </span>
                    )}
                    {selectedCountries.length > 0 && (
                      <span className="inline-flex items-center rounded-full border border-[#B2C9A8] bg-white px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26]">
                        {selectedCountries.length}{" "}
                        {selectedCountries.length === 1
                          ? "Country"
                          : "Countries"}{" "}
                        Highlighted
                      </span>
                    )}
                  </div>
                </div>

                {/* Globe Canvas Container */}
                <div className="editorial-sage-dots relative px-3 py-5 sm:px-6 sm:py-7">
                  <Globe
                    regions={regions}
                    selectedRegions={selectedRegions}
                    selectedCountries={selectedCountries}
                    focusCountry={focusCountry}
                    onCountriesLoaded={setCountries}
                    onCountryHover={setHoveredCountry}
                    onCountryClick={(name) => {
                      const country = countries.find(
                        (item) => item.name === name,
                      );
                      if (country) setDetailCountry(country);
                    }}
                    className="geopolitical-globe mx-auto w-full max-w-[800px]"
                  />

                  {/* Floating Hover Country Indicator Pill */}
                  <AnimatePresence>
                    {hoveredCountry && (
                      <motion.div
                        key={hoveredCountry}
                        role="status"
                        initial={reduced ? false : { opacity: 0, y: 8, scale: 0.96 }}
                        animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
                        exit={reduced ? undefined : { opacity: 0, y: 4, scale: 0.97 }}
                        transition={{ duration: 0.16, ease: EDITORIAL_EASE }}
                        className="pointer-events-none absolute top-7 right-5 z-20 max-w-[calc(100%-2.5rem)] rounded-2xl border-[1.5px] border-[#E9E6B2]/85 bg-[#202B20]/95 px-4 py-3 text-white shadow-lg backdrop-blur-md sm:top-9 sm:right-9"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            aria-hidden="true"
                            className="size-2.5 shrink-0 rounded-full ring-2 ring-white/40"
                            style={{
                              backgroundColor:
                                hoveredCountryRegion?.color ?? "#E9E6B2",
                            }}
                          />
                          <div className="min-w-0">
                            <p
                              className="truncate text-sm font-semibold leading-tight text-white"
                              style={EDITORIAL_SERIF_STYLE}
                            >
                              {hoveredCountry}
                            </p>
                            <p className="mt-0.5 truncate text-[11px] text-[#E9E6B2]/90">
                              {hoveredCountryRegion?.name ??
                                hoveredCountryRecord?.worldBankRegion ??
                                "World Bank Region"}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 flex items-center gap-1 border-t border-white/15 pt-1.5 font-mono text-[10px] uppercase tracking-wider text-[#EDF4E8]/85">
                          <MapPin className="h-3 w-3 text-[#E9E6B2]" aria-hidden="true" />
                          Click to inspect values
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Stage Footer Note */}
                <div className="border-t border-[#E3EBDE] bg-[#FAFDF8] px-5 py-3 text-center text-xs text-[#596556]">
                  Region colors follow World Bank analytical groupings from
                  before July 2025.
                </div>
              </div>
            </TabsContent>

            {/* Regional Rankings Stage */}
            <TabsContent value="placeholder" className="w-full min-w-0">
              <RankingCardRows
                regions={visibleRegions}
                countries={countries}
                selectedCountries={selectedCountries}
                selectedDevelopmentValue={selectedDevelopmentValues[0]}
                onSelectCountry={setDetailCountry}
              />
            </TabsContent>
          </Tabs>
        </EditorialReveal>
      </EditorialSection>

      {/* Analytical Framework: Clickable Seven Worthwhile Development Values */}
      <EditorialSection
        tone="sage"
        ariaLabelledBy="geopolitical-values-heading"
        compact
      >
        <EditorialSectionHeader
          eyebrow="02 / Analytical Framework"
          title="Seven Worthwhile Development Values"
          titleId="geopolitical-values-heading"
          description="Select any ethical value below to focus your exploration across the 3D globe and regional rankings."
        />

        <EditorialReveal className="mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {developmentValues.map((value, index) => {
              const isSelected = selectedDevelopmentValues[0] === value;
              const code = String(index + 1).padStart(2, "0");

              return (
                <motion.button
                  key={value}
                  type="button"
                  whileHover={reduced ? undefined : { y: -3 }}
                  transition={{ duration: 0.18, ease: EDITORIAL_EASE }}
                  aria-pressed={isSelected}
                  onClick={() =>
                    setSelectedDevelopmentValues(isSelected ? [] : [value])
                  }
                  className={cn(
                    "flex cursor-pointer flex-col justify-between gap-3 rounded-xl border-[1.5px] p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F673C]",
                    isSelected
                      ? "border-[#3F673C] bg-[#3F673C] text-white shadow-sm"
                      : "border-[#B2C9A8] bg-white text-[#202B20] hover:border-[#3F673C] hover:bg-[#FAFDF8]",
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "font-mono text-[10px] font-medium uppercase tracking-[0.14em]",
                          isSelected ? "text-[#E9E6B2]" : "text-[#187347]",
                        )}
                      >
                        Value {code}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#9AB887] bg-[#2E502B] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#E9E6B2]">
                          <Check className="h-2.5 w-2.5" aria-hidden="true" />
                          Active
                        </span>
                      )}
                    </div>

                    <h3
                      className={cn(
                        "mt-2 text-lg font-semibold leading-snug",
                        isSelected ? "text-white" : "text-[#202B20]",
                      )}
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {value}
                    </h3>

                    <p
                      className={cn(
                        "mt-1.5 text-xs leading-relaxed",
                        isSelected ? "text-[#E8F0E5]" : "text-[#596556]",
                      )}
                    >
                      {VALUE_SUMMARY[value]}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </EditorialReveal>
      </EditorialSection>

      {/* Country Detail Modal with AnimatePresence */}
      <AnimatePresence>
        {detailCountry && (
          <CountryDetailCard
            key={detailCountry.name}
            country={detailCountry}
            values={developmentValues}
            initialValue={selectedDevelopmentValues[0]}
            regionColor={detailCountryRegion?.color}
            onClose={() => setDetailCountry(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
