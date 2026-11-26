import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { EDITORIAL_EASE } from "@/components/editorial/EditorialPagePrimitives";
import {
  toolTypes,
  researchTypes,
  projectDevelopmentTypes,
  priceTypes,
  scoreTypes,
} from "../../pages/ai-ethics-dashboard/data/toolFilters";

export type ToolFilterValues = {
  type: string | null;
  research: string | null;
  projectDevelopment: string | null;
  price: string | null;
  score: string | null;
};

type ToolFiltersProps = {
  onFilterChange: (filters: ToolFilterValues) => void;
  filters?: ToolFilterValues;
  onClearAll?: () => void;
  hasExtraFilters?: boolean;
};

const EMPTY_FILTERS: ToolFilterValues = {
  type: null,
  research: null,
  projectDevelopment: null,
  price: null,
  score: null,
};

export default function ToolFilters({
  onFilterChange,
  filters,
  onClearAll,
  hasExtraFilters = false,
}: ToolFiltersProps) {
  const [internalFilters, setInternalFilters] =
    useState<ToolFilterValues>(EMPTY_FILTERS);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeFilters = filters ?? internalFilters;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenKey(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenKey(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const updateFilter = (key: keyof ToolFilterValues, value: string | null) => {
    const next: ToolFilterValues = {
      ...activeFilters,
      [key]: activeFilters[key] === value ? null : value,
    };

    if (!filters) {
      setInternalFilters(next);
    }
    onFilterChange(next);
    setOpenKey(null);
  };

  const handleClear = () => {
    if (!filters) {
      setInternalFilters(EMPTY_FILTERS);
    }
    onFilterChange(EMPTY_FILTERS);
    onClearAll?.();
    setOpenKey(null);
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;
  const showClearButton = activeFilterCount > 0 || hasExtraFilters;

  const filterConfigs: {
    key: keyof ToolFilterValues;
    label: string;
    options: string[];
  }[] = [
    { key: "type", label: "Tool Type", options: toolTypes },
    { key: "research", label: "Research", options: researchTypes },
    {
      key: "projectDevelopment",
      label: "Project Development",
      options: projectDevelopmentTypes,
    },
    { key: "price", label: "Price", options: priceTypes },
    { key: "score", label: "Ethicality Score", options: scoreTypes },
  ];

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="mr-1 inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#284B26]">
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#187347]" aria-hidden="true" />
          Filter by
        </span>

        {filterConfigs.map((config) => (
          <FilterDropdown
            key={config.key}
            label={config.label}
            options={config.options}
            selected={activeFilters[config.key]}
            isOpen={openKey === config.key}
            onToggle={() =>
              setOpenKey((prev) => (prev === config.key ? null : config.key))
            }
            onSelect={(value) => updateFilter(config.key, value)}
            onClear={() => updateFilter(config.key, null)}
          />
        ))}

        {showClearButton && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-[#94B985] bg-white px-3.5 py-2 text-xs font-semibold text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8] focus:outline-none focus:ring-2 focus:ring-[#3F673C]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              Clear filters
              {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

type FilterDropdownProps = {
  label: string;
  options: string[];
  selected: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  onClear: () => void;
};

function FilterDropdown({
  label,
  options,
  selected,
  isOpen,
  onToggle,
  onSelect,
  onClear,
}: FilterDropdownProps) {
  const reduced = useReducedMotion();
  const isSelected = Boolean(selected);

  return (
    <div className="relative">
      <div
        className={`inline-flex items-center rounded-full border-[1.5px] transition-all duration-150 ${
          isSelected
            ? "border-[#3F673C] bg-[#3F673C] text-white shadow-xs"
            : isOpen
              ? "border-[#3F673C] bg-[#FAFDF8] text-[#202B20]"
              : "border-[#B2C9A8] bg-white text-[#202B20] hover:border-[#3F673C] hover:bg-[#FAFDF8]"
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="inline-flex cursor-pointer items-center gap-1.5 py-2 pl-3.5 pr-3 text-xs font-medium focus:outline-none sm:text-sm"
        >
          <span>{selected ? `${label}: ${selected}` : label}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-150 ${
              isOpen ? "rotate-180" : ""
            } ${isSelected ? "text-[#E9E6B2]" : "text-[#3F673C]"}`}
            aria-hidden="true"
          />
        </button>

        {isSelected && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            aria-label={`Clear ${label} filter`}
            className="mr-1.5 inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#2E502B] text-[#E9E6B2] transition-colors hover:bg-[#202B20]"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: EDITORIAL_EASE }}
            role="listbox"
            aria-label={label}
            className="absolute left-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-xl border-[1.5px] border-[#94B985] bg-white py-1.5 shadow-lg"
          >
            {options.map((option) => {
              const active = selected === option;

              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => onSelect(option)}
                  className={`flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                    active
                      ? "bg-[#EDF4E8] font-semibold text-[#187347]"
                      : "text-[#202B20] hover:bg-[#F2F6EF]"
                  }`}
                >
                  <span>{option}</span>
                  {active && (
                    <Check
                      className="h-4 w-4 shrink-0 text-[#187347]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
