import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToolSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  variant?: "editorial" | "hero";
  onFocus?: () => void;
  onClear?: () => void;
  className?: string;
};

export default function ToolSearch({
  value,
  onChange,
  onSearch,
  placeholder = "Search AI tools by name, category, pricing, or score...",
  variant = "editorial",
  onFocus,
  onClear,
  className,
}: ToolSearchProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSearch?.();
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange("");
    }
  };

  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "flex w-full max-w-3xl items-center gap-2 rounded-full border-[1.5px] bg-white pl-4 pr-1.5 py-1.5 transition-all duration-200",
        isHero
          ? "border-[#E9E6B2]/85 shadow-lg focus-within:border-[#E9E6B2] focus-within:ring-2 focus-within:ring-[#E9E6B2]/45"
          : "border-[#B2C9A8] shadow-xs hover:border-[#94B985] focus-within:border-[#3F673C] focus-within:ring-2 focus-within:ring-[#187347]/20",
        className,
      )}
    >
      <Search
        className="h-4 w-4 shrink-0 text-[#187347]"
        aria-hidden="true"
      />

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-[#202B20] placeholder:text-[#596556]/80 outline-none sm:text-base"
      />

      {value.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#596556] transition-colors hover:bg-[#EDF4E8] hover:text-[#202B20] focus:outline-none focus:ring-2 focus:ring-[#3F673C]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      <button
        type="button"
        onClick={onSearch}
        aria-label="Search"
        className={cn(
          "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 sm:px-5 sm:text-sm",
          isHero
            ? "bg-[#3F673C] text-white hover:bg-[#2E502B] focus:ring-[#3F673C]"
            : "bg-[#3F673C] text-white hover:bg-[#187347] focus:ring-[#3F673C]",
        )}
      >
        <span>Search</span>
      </button>
    </div>
  );
}
