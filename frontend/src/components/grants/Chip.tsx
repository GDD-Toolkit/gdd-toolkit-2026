import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChipProps {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
  /** Facet count shown after the label. */
  count?: number;
  disabled?: boolean;
  className?: string;
}

/** A toggle pill used for status, geography, SDG and value filters. */
export function Chip({ pressed, onClick, children, count, disabled, className }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C]/50 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        pressed
          ? "border-[#3F673C] bg-gradient-to-r from-[#3F673C] to-[#187347] text-white shadow-xs hover:brightness-110"
          : "border-[#B2C9A8] bg-white text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8]",
        className,
      )}
    >
      {children}
      {count !== undefined && (
        <span
          className={cn(
            "font-mono text-[10px] tabular-nums",
            pressed ? "text-[#E9E6B2]" : "text-[#596556]",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
