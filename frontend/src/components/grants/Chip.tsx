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
        "inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        // Filled state uses the darker accent: white 12px text on #6D83F2 is only 3.4:1.
        pressed
          ? "border-[#4B5FD9] bg-[#4B5FD9] text-white hover:bg-[#3F52C8]"
          : "border-border bg-background text-foreground hover:bg-muted",
        className,
      )}
    >
      {children}
      {count !== undefined && (
        <span className={cn("text-[10px] tabular-nums", pressed ? "text-white/80" : "text-muted-foreground")}>
          {count}
        </span>
      )}
    </button>
  );
}
