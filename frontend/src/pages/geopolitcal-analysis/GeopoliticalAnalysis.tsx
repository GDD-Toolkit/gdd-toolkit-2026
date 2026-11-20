import { useState } from "react";
import { ArrowRight, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Globe, { type GlobeCountry, type GlobeRegion } from "@/components/ui/globe";
import RankingCardRows from "./RankingCardRows";
import CountryDetailCard from "./CountryDetailCard";
import "./GeopoliticalAnalysis.css";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

// Match the reference map's pre-July-2025 World Bank analytical grouping.
// Natural Earth's REGION_WB labels retain Afghanistan and Pakistan in South Asia.
const regions: GlobeRegion[] = [
  { name: "East Asia and Pacific", color: "#e1812c", worldBankRegion: "East Asia & Pacific", center: [135, 10] },
  { name: "Europe and Central Asia", color: "#d20b47", worldBankRegion: "Europe & Central Asia", center: [50, 50] },
  { name: "Latin America and Caribbean", color: "#39943a", worldBankRegion: "Latin America & Caribbean", center: [-75, -10] },
  { name: "Middle East and North Africa", color: "#803e85", worldBankRegion: "Middle East & North Africa", center: [30, 28] },
  { name: "North America", color: "#58595b", worldBankRegion: "North America", center: [-105, 50] },
  { name: "South Asia", color: "#227fba", worldBankRegion: "South Asia", center: [78, 23] },
  { name: "Sub-Saharan Africa", color: "#ffcc00", worldBankRegion: "Sub-Saharan Africa", center: [20, -5] },
]
const regionNames = regions.map((region) => region.name)
const developmentValues = [
  "Well-being",
  "Equality",
  "Agency and Empowerment",
  "Environmental Sustainability",
  "Human Rights",
  "Cultural Freedom",
  "Responsibility",
]

function MultiSelectCombobox({
  id,
  label,
  items,
  value,
  onValueChange,
  placeholder,
  disabled = false,
}: {
  id: string
  label: string
  items: string[]
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder: string
  disabled?: boolean
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">{label}</label>
      <Combobox multiple items={items} value={value} onValueChange={onValueChange} disabled={disabled}>
        <ComboboxInput id={id} placeholder={placeholder} disabled={disabled} showClear />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {value.length > 0 && (
        <ul aria-label={`Selected ${label.toLowerCase()}`} className="mt-2 flex flex-wrap gap-1">
          {value.map((item) => (
            <li key={item}>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                aria-label={`Remove ${item}`}
                onClick={() => onValueChange(value.filter((selected) => selected !== item))}
              >
                {item}<X className="size-3" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function GeopoliticalAnalysis() {
  const [activeView, setActiveView] = useState("globe");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<GlobeCountry[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [focusCountry, setFocusCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [detailCountry, setDetailCountry] = useState<GlobeCountry | null>(null);
  const [selectedDevelopmentValues, setSelectedDevelopmentValues] = useState<string[]>([]);
  const activeRegions = regions.filter((region) => selectedRegions.includes(region.name));
  const activeWorldBankRegions = new Set(activeRegions.map((region) => region.worldBankRegion));
  const countryNames = [...countries]
    .sort((a, b) => {
      const regionPriority = Number(activeWorldBankRegions.has(b.worldBankRegion))
        - Number(activeWorldBankRegions.has(a.worldBankRegion));
      return regionPriority || a.name.localeCompare(b.name);
    })
    .map((country) => country.name);
  const visibleRegions = selectedRegions.length > 0 ? activeRegions : regions;

  const changeRegions = (nextRegions: string[]) => {
    setFocusCountry(null);
    setSelectedRegions(nextRegions);
    const nextWorldBankRegions = new Set(
      regions.filter((region) => nextRegions.includes(region.name)).map((region) => region.worldBankRegion),
    );
    const validCountries = new Set(
      countries.filter((country) => nextWorldBankRegions.has(country.worldBankRegion)).map((country) => country.name),
    );
    // Keep country choices from retained regions and discard only invalid ones.
    setSelectedCountries((selected) => selected.filter((country) => validCountries.has(country)));
  };
  const changeCountries = (nextCountries: string[]) => {
    const addedCountry = nextCountries.find((country) => !selectedCountries.includes(country));
    setFocusCountry(activeView === "globe" ? addedCountry ?? null : null);
    setSelectedCountries(nextCountries);
    const addedCountries = countries.filter(
      (country) => nextCountries.includes(country.name) && !selectedCountries.includes(country.name),
    );
    const removedWorldBankRegions = new Set(countries
      .filter((country) => selectedCountries.includes(country.name) && !nextCountries.includes(country.name))
      .map((country) => country.worldBankRegion));
    const remainingWorldBankRegions = new Set(countries
      .filter((country) => nextCountries.includes(country.name))
      .map((country) => country.worldBankRegion));
    const emptiedRegions = new Set(regions
      .filter((region) => removedWorldBankRegions.has(region.worldBankRegion ?? "")
        && !remainingWorldBankRegions.has(region.worldBankRegion ?? ""))
      .map((region) => region.name));
    setSelectedRegions((selected) => {
      const nextRegions = selected.filter((region) => !emptiedRegions.has(region));
      for (const country of addedCountries) {
        const region = regions.find((region) => region.worldBankRegion === country.worldBankRegion);
        if (region && !nextRegions.includes(region.name)) nextRegions.push(region.name);
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

  return (
    <section className="geopolitical-page">
      <header className="geopolitical-hero">
        <h1>Geopolitical Analysis</h1>
        <p>Explore the global context of development across regions and countries.</p>
      </header>
      <div className="geopolitical-content">
        <section className="geopolitical-introduction" aria-labelledby="geopolitical-map-title">
          <h2 id="geopolitical-map-title">Explore development around the world</h2>
          <p>
            Select a development value, region, or country to guide your exploration.
            Use the interactive globe to discover regional groupings and select countries for further analysis.
          </p>
        </section>
        <section className="geopolitical-map-panel" aria-label="Geopolitical exploration tools">
          <div>
            <div className="geopolitical-filters">
              <MultiSelectCombobox
                id="development-values-select"
                label="Development values"
                items={developmentValues}
                value={selectedDevelopmentValues}
                onValueChange={(values) => setSelectedDevelopmentValues(values.slice(-1))}
                placeholder="Select a development value"
              />
              <MultiSelectCombobox
                id="region-select"
                label="Regions"
                items={regionNames}
                value={selectedRegions}
                onValueChange={changeRegions}
                placeholder="Select regions"
              />
              <MultiSelectCombobox
                id="countries-select"
                label="Countries"
                items={countryNames}
                value={selectedCountries}
                onValueChange={changeCountries}
                disabled={countryNames.length === 0}
                placeholder={countries.length === 0 ? "Loading countries..." : "Select countries"}
              />
              <div className="geopolitical-filter-actions">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Reset all selections"
                  title="Reset all selections"
                  disabled={selectedRegions.length === 0 && selectedCountries.length === 0 && selectedDevelopmentValues.length === 0}
                  onClick={resetSelections}
                >
                  <RotateCcw aria-hidden="true" />
                </Button>
                <Button type="button" onClick={() => setActiveView("placeholder")}>
                  Explore <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            </div>
            <p role="status" className="mt-2 text-sm text-muted-foreground">
              {selectedRegions.length > 0 ? `Highlighting ${selectedRegions.join(", ")}. Clear to highlight all regions.` : "Showing all region colors."}
            </p>
          </div>
          <ul aria-label="Region colors" className="geopolitical-legend">
            {visibleRegions.map((region) => (
              <li key={region.name} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-3 rounded-full" style={{ backgroundColor: region.color }} />
                {region.name}
              </li>
            ))}
          </ul>
          <Tabs value={activeView} onValueChange={setActiveView} className="mt-8">
            <TabsList aria-label="Visualization view" className="mx-auto">
              <TabsTrigger value="globe">Globe</TabsTrigger>
              <TabsTrigger value="placeholder">Rankings</TabsTrigger>
            </TabsList>
            <TabsContent value="globe" className="relative">
              <Globe
                regions={regions}
                selectedRegions={selectedRegions}
                selectedCountries={selectedCountries}
                focusCountry={focusCountry}
                onCountriesLoaded={setCountries}
                onCountryHover={setHoveredCountry}
                onCountryClick={(name) => {
                  const country = countries.find((country) => country.name === name);
                  if (country) setDetailCountry(country);
                }}
                className="geopolitical-globe mx-auto w-full max-w-[800px]"
              />
              {hoveredCountry && (
                <Card className="geopolitical-country-hover-card pointer-events-none" size="sm" role="status">
                  <CardContent>{hoveredCountry}</CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="placeholder" className="w-full min-w-0">
              <RankingCardRows />
            </TabsContent>
          </Tabs>
          <p className="geopolitical-map-note">
            Region colors follow World Bank analytical groupings from before July 2025.
          </p>
        </section>
      </div>
      {detailCountry && (
        <CountryDetailCard
          key={detailCountry.name}
          country={detailCountry}
          values={developmentValues}
          initialValue={selectedDevelopmentValues[0]}
          onClose={() => setDetailCountry(null)}
        />
      )}
    </section>
  );
}
