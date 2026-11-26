import { Clock, Database, Sparkles, TrendingUp } from "lucide-react";
import { EDITORIAL_SERIF_STYLE } from "@/components/editorial/EditorialPagePrimitives";
import { cn } from "@/lib/utils";

interface MetricBadgesProps {
  open: number | null;
  closingSoon: number | null;
  sourcesSyncedToday: number | null;
  totalMatches?: number | null;
  variant?: "hero" | "inline";
  className?: string;
}

/** One headline number; reads as "212 Open opportunities". */
function InlineMetric({ value, label }: { value: number | null; label: string }) {
  return (
    <li className="flex items-center gap-3.5 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white px-4 py-3 shadow-xs">
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#94B985] bg-[#EDF4E8] text-xl font-bold text-[#187347] tabular-nums"
        style={EDITORIAL_SERIF_STYLE}
      >
        {value ?? "–"}
      </span>
      <span className="max-w-[8rem] text-xs font-medium leading-tight text-[#394838]">{label}</span>
    </li>
  );
}

/** The headline live metrics — either inside the Forest Hero aside card or inline. */
export function MetricBadges({
  open,
  closingSoon,
  sourcesSyncedToday,
  totalMatches,
  variant = "inline",
  className,
}: MetricBadgesProps) {
  if (variant === "hero") {
    return (
      <div
        className={cn(
          "rounded-2xl border-[1.5px] border-[#E9E6B2] bg-[#2E502B]/85 p-5 text-white shadow-xl backdrop-blur-sm sm:p-6",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-[#9AB887]/35 pb-3.5">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#E9E6B2]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Live Funding Index
          </span>
          {totalMatches !== undefined && totalMatches !== null && (
            <span className="rounded-full border border-[#9AB887]/60 bg-[#202B20]/50 px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#EDF4E8] tabular-nums">
              {totalMatches} {totalMatches === 1 ? "match" : "matches"}
            </span>
          )}
        </div>

        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3" aria-label="Summary">
          <li className="rounded-xl border border-[#94B985] bg-white/95 p-3.5 text-[#202B20] shadow-xs">
            <div className="flex items-center justify-between text-[#187347]">
              <TrendingUp className="size-4" aria-hidden="true" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#596556]">Active</span>
            </div>
            <p
              className="mt-2 text-2xl font-bold leading-none text-[#187347] tabular-nums"
              style={EDITORIAL_SERIF_STYLE}
            >
              {open ?? "–"}
            </p>
            <p className="mt-1.5 text-[11px] font-medium leading-snug text-[#394838]">Open opportunities</p>
          </li>

          <li className="rounded-xl border border-[#D6CE8A] bg-[#FAF8E4] p-3.5 text-[#202B20] shadow-xs">
            <div className="flex items-center justify-between text-amber-900">
              <Clock className="size-4" aria-hidden="true" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#6F6057]">Urgent</span>
            </div>
            <p
              className="mt-2 text-2xl font-bold leading-none text-[#284B26] tabular-nums"
              style={EDITORIAL_SERIF_STYLE}
            >
              {closingSoon ?? "–"}
            </p>
            <p className="mt-1.5 text-[11px] font-medium leading-snug text-[#394838]">Closing in 30 days</p>
          </li>

          <li className="rounded-xl border border-[#94B985] bg-[#EDF4E8] p-3.5 text-[#202B20] shadow-xs">
            <div className="flex items-center justify-between text-[#284B26]">
              <Database className="size-4" aria-hidden="true" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#596556]">Daily</span>
            </div>
            <p
              className="mt-2 text-2xl font-bold leading-none text-[#284B26] tabular-nums"
              style={EDITORIAL_SERIF_STYLE}
            >
              {sourcesSyncedToday ?? "–"}
            </p>
            <p className="mt-1.5 text-[11px] font-medium leading-snug text-[#394838]">Sources synced today</p>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <ul className={cn("flex flex-wrap items-center justify-center gap-4", className)} aria-label="Summary">
      <InlineMetric value={open} label="Open opportunities" />
      <InlineMetric value={closingSoon} label="Closing in 30 days" />
      <InlineMetric value={sourcesSyncedToday} label="Sources synced today" />
    </ul>
  );
}
