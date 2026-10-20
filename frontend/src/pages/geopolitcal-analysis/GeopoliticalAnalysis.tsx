import { useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Globe, { type GlobeCountry, type GlobeRegion } from "@/components/ui/globe";
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
const developmentValues = Array.from({ length: 7 }, (_, index) => `Development Value #${index + 1}`)

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
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<GlobeCountry[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedDevelopmentValues, setSelectedDevelopmentValues] = useState<string[]>([]);
  const activeRegions = regions.filter((region) => selectedRegions.includes(region.name));
  const activeWorldBankRegions = new Set(activeRegions.map((region) => region.worldBankRegion));
  const countryNames = countries
    .filter((country) => activeWorldBankRegions.has(country.worldBankRegion))
    .map((country) => country.name);
  const visibleRegions = selectedRegions.length > 0 ? activeRegions : regions;
  const focusedRegion = regions.find((region) => region.name === selectedRegions[selectedRegions.length - 1]);

  const changeRegions = (nextRegions: string[]) => {
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
  const resetSelections = () => {
    setSelectedRegions([]);
    setSelectedCountries([]);
    setSelectedDevelopmentValues([]);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-4xl font-bold">Geopolitical Analysis</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        World Bank analytical regions (before July 2025).
      </p>
      <div className="mt-6">
        <div className="grid items-start gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"> 
          <MultiSelectCombobox
            id="region-select"
            label="Regions"
            items={regionNames}
            value={selectedRegions}
            onValueChange={changeRegions}
            placeholder="Select regions"
          />
          <MultiSelectCombobox
            key={JSON.stringify(selectedRegions)}
            id="countries-select"
            label="Countries"
            items={countryNames}
            value={selectedCountries}
            onValueChange={setSelectedCountries}
            disabled={selectedRegions.length === 0 || countryNames.length === 0}
            placeholder={selectedRegions.length === 0 ? "Select a region first" : countries.length === 0 ? "Loading countries..." : "Select countries"}
          />
          <MultiSelectCombobox
            id="development-values-select"
            label="Development values"
            items={developmentValues}
            value={selectedDevelopmentValues}
            onValueChange={setSelectedDevelopmentValues}
            placeholder="Select development values"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="md:mt-7"
            aria-label="Reset all selections"
            title="Reset all selections"
            disabled={selectedRegions.length === 0 && selectedCountries.length === 0 && selectedDevelopmentValues.length === 0}
            onClick={resetSelections}
          >
            <RotateCcw aria-hidden="true" />
          </Button>
        </div>
        <p role="status" className="mt-2 text-sm text-muted-foreground">
          {selectedRegions.length > 0 ? `Highlighting ${selectedRegions.join(", ")}. Clear to show all regions.` : "Showing all region colors."}
        </p>
      </div>
      <ul aria-label="Region colors" className="mt-6 flex flex-wrap gap-4 text-sm">
        {visibleRegions.map((region) => (
          <li key={region.name} className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-full" style={{ backgroundColor: region.color }} />
            {region.name}
          </li>
        ))}
      </ul>
      <Globe
        regions={visibleRegions}
        selectedCountries={selectedCountries}
        onCountriesLoaded={setCountries}
        focusCenter={focusedRegion?.center ?? null}
        className="mx-auto mt-8 w-full max-w-[800px]"
      />
    </section>
  );
}
