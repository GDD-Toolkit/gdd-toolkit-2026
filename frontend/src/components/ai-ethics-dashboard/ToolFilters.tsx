import { useState } from "react";
import {
  toolTypes,
  researchTypes,
  projectDevelopmentTypes,
  priceTypes,
  scoreTypes,
} from "../../pages/ai-ethics-dashboard/data/toolFilters";

type ToolFiltersProps = {
  onFilterChange: (filters: {
    type: string | null;
    research: string | null;
    projectDevelopment: string | null;
    price: string | null;
    score: string | null;
  }) => void;
};

export default function ToolFilters({ onFilterChange }: ToolFiltersProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedResearch, setSelectedResearch] = useState<string | null>(null);
  const [selectedProjectDevelopment, setSelectedProjectDevelopment] = useState<
    string | null
  >(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedScore, setSelectedScore] = useState<string | null>(null);

  const updateFilters = (
    type: string | null,
    research: string | null,
    projectDevelopment: string | null,
    price: string | null,
    score: string | null,
  ) => {
    onFilterChange({
      type,
      research,
      projectDevelopment,
      price,
      score,
    });
  };

  const handleType = (value: string) => {
    const next = selectedType === value ? null : value;

    setSelectedType(next);

    updateFilters(
      next,
      selectedResearch,
      selectedProjectDevelopment,
      selectedPrice,
      selectedScore,
    );
  };

  const handleResearch = (value: string) => {
    const next = selectedResearch === value ? null : value;

    setSelectedResearch(next);

    updateFilters(
      selectedType,
      next,
      selectedProjectDevelopment,
      selectedPrice,
      selectedScore,
    );
  };

  const handleProjectDevelopment = (value: string) => {
    const next = selectedProjectDevelopment === value ? null : value;

    setSelectedProjectDevelopment(next);

    updateFilters(
      selectedType,
      selectedResearch,
      next,
      selectedPrice,
      selectedScore,
    );
  };

  const handlePrice = (value: string) => {
    const next = selectedPrice === value ? null : value;

    setSelectedPrice(next);

    updateFilters(
      selectedType,
      selectedResearch,
      selectedProjectDevelopment,
      next,
      selectedScore,
    );
  };

  const handleScore = (value: string) => {
    const next = selectedScore === value ? null : value;

    setSelectedScore(next);

    updateFilters(
      selectedType,
      selectedResearch,
      selectedProjectDevelopment,
      selectedPrice,
      next,
    );
  };

  return (
    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3 text-base">
      {/* Tool Type */}
      <FilterDropdown
        label="Tool Type"
        options={toolTypes}
        selected={selectedType}
        onSelect={handleType}
      />

      {/* Research */}
      <FilterDropdown
        label="Research"
        options={researchTypes}
        selected={selectedResearch}
        onSelect={handleResearch}
      />

      {/* Project Development */}
      <FilterDropdown
        label="Project Development"
        options={projectDevelopmentTypes}
        selected={selectedProjectDevelopment}
        onSelect={handleProjectDevelopment}
      />

      {/* Price */}
      <FilterDropdown
        label="Price"
        options={priceTypes}
        selected={selectedPrice}
        onSelect={handlePrice}
      />

      {/* Score */}
      <FilterDropdown
        label="Score"
        options={scoreTypes}
        selected={selectedScore}
        onSelect={handleScore}
      />
    </div>
  );
}

type FilterDropdownProps = {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
};

function FilterDropdown({
  label,
  options,
  selected,
  onSelect,
}: FilterDropdownProps) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1">
        {selected || label}
        <span className="text-sm">⌄</span>
      </button>

      <div className="absolute left-0 top-full z-20 hidden group-hover:block pt-2">
        <div className="w-48 bg-white border border-gray-300 rounded-md shadow-md py-1">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                selected === option ? "font-medium" : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
