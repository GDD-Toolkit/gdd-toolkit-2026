import type { ReactNode } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { CaseStudySegment } from "@/types/caseStudies";

type MultiSelectFilterProps<T extends string | number> = {
  label: string;
  options: T[];
  selected: T[];
  onChange: (selected: T[]) => void;
  formatOption?: (option: T) => string;
};

const triggerClassName = "group flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-[#94B985] bg-[#F2F6EF] px-4 py-2.5 text-left text-sm font-semibold text-[#284B26] transition-colors hover:bg-[#E5F0E0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C]/50 sm:w-auto sm:min-w-36";
const optionClassName = "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#202B20] hover:bg-[#F2F6EF]";

const sdgNames: Readonly<Record<number, string>> = {
  1: "No Poverty",
  2: "Zero Hunger",
  3: "Good Health and Well-Being",
  4: "Quality Education",
  5: "Gender Equality",
  6: "Clean Water and Sanitation",
  7: "Affordable and Clean Energy",
  8: "Decent Work and Economic Growth",
  9: "Industry, Innovation and Infrastructure",
  10: "Reduced Inequalities",
  11: "Sustainable Cities and Communities",
  12: "Responsible Consumption and Production",
  13: "Climate Action",
  14: "Life Below Water",
  15: "Life on Land",
  16: "Peace, Justice and Strong Institutions",
  17: "Partnerships for the Goals",
};

function formatSdg(sdg: number): string {
  const name = sdgNames[sdg];
  return name ? `SDG ${sdg} (${name})` : `SDG ${sdg}`;
}

function FilterPopover({ label, count, children }: {
  label: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={triggerClassName}>
          <span>
            {label}
            {count > 0 && <> <span className="text-[#187347]">({count})</span></>}
          </span>
          <ChevronDown className="size-4 shrink-0 text-[#596556] transition-transform group-data-[state=open]:rotate-180" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        aria-label={`${label} filter`}
        className="max-h-[min(20rem,var(--radix-popover-content-available-height))] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-[#B2C9A8] bg-white p-2 shadow-lg"
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}

function MultiSelectFilter<T extends string | number>({
  label, options, selected, onChange, formatOption = String,
}: MultiSelectFilterProps<T>) {
  return (
    <FilterPopover label={label} count={selected.length}>
      {options.length === 0 ? (
        <p className="px-3 py-2 text-sm text-[#596556]">No options available.</p>
      ) : options.map(option => (
        <label key={option} className={optionClassName}>
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={(event) => onChange(
              event.target.checked
                ? [...selected, option]
                : selected.filter(value => value !== option),
            )}
            className="size-4 shrink-0 accent-[#3F673C]"
          />
          <span>{formatOption(option)}</span>
        </label>
      ))}
    </FilterPopover>
  );
}

type CaseStudyFiltersProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  values: string[];
  selectedValues: string[];
  onValuesChange: (values: string[]) => void;
  regions: string[];
  selectedRegions: string[];
  onRegionsChange: (regions: string[]) => void;
  sdgs: number[];
  selectedSdgs: number[];
  onSdgsChange: (sdgs: number[]) => void;
  segment: CaseStudySegment | "";
  onSegmentChange: (segment: CaseStudySegment | "") => void;
  onClear: () => void;
};

export default function CaseStudyFilters({
  searchQuery, onSearchChange, values, selectedValues, onValuesChange,
  regions, selectedRegions, onRegionsChange, sdgs, selectedSdgs, onSdgsChange,
  segment, onSegmentChange, onClear,
}: CaseStudyFiltersProps) {
  const hasFilters = Boolean(searchQuery || selectedValues.length || selectedRegions.length || selectedSdgs.length || segment);

  return (
    <section aria-label="Filter case studies" className="flex flex-col gap-5 border-b border-[#DCE8D8] pb-6">
      <label className="sr-only" htmlFor="case-study-search">Search case studies</label>
      <input
        id="case-study-search"
        type="search"
        placeholder="Search by case study name..."
        value={searchQuery}
        onChange={event => onSearchChange(event.target.value)}
        className="w-full rounded-xl border-[1.5px] border-[#B2C9A8] bg-[#F8FAF7] px-4 py-3 text-sm text-[#202B20] placeholder:text-[#596556] focus:border-[#3F673C] focus:outline-none focus:ring-2 focus:ring-[#3F673C]/25"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex items-center gap-2 text-[#284B26] sm:mr-1 sm:border-r sm:border-[#B2C9A8] sm:pr-4">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          <span className="font-editorial text-lg font-semibold">Filters</span>
        </div>
        <MultiSelectFilter label="Values" options={values} selected={selectedValues} onChange={onValuesChange} />
        <MultiSelectFilter label="Regions" options={regions} selected={selectedRegions} onChange={onRegionsChange} />
        <MultiSelectFilter label="SDGs" options={sdgs} selected={selectedSdgs} onChange={onSdgsChange} formatOption={formatSdg} />
        <FilterPopover label="Pro vs Maldevelopment" count={segment ? 1 : 0}>
          {([
            ["", "All case studies"],
            ["worthwhile", "Worthwhile Development"],
            ["maldevelopment", "Maldevelopment"],
          ] as const).map(([value, label]) => (
            <label key={value} className={optionClassName}>
              <input
                type="radio"
                name="case-study-segment"
                value={value}
                checked={segment === value}
                onChange={() => onSegmentChange(value)}
                className="size-4 shrink-0 accent-[#3F673C]"
              />
              <span>{label}</span>
            </label>
          ))}
        </FilterPopover>
        {hasFilters && (
          <button type="button" onClick={onClear} className="self-start rounded-md px-2 py-2 text-sm font-semibold text-[#187347] underline underline-offset-4 hover:text-[#284B26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C]/50 sm:self-auto">
            Clear filters
          </button>
        )}
      </div>
    </section>
  );
}
