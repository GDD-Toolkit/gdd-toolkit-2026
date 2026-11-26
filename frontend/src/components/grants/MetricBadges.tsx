interface MetricBadgesProps {
  open: number | null;
  closingSoon: number | null;
  sourcesSyncedToday: number | null;
}

/** One headline number; reads as "212 Open opportunities". */
function Metric({ value, label }: { value: number | null; label: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex size-14 items-center justify-center rounded-full bg-[#6D83F2]/15 text-2xl font-semibold text-[#4C5FD4] tabular-nums">
        {value ?? "–"}
      </span>
      <span className="max-w-[7rem] text-sm leading-tight text-muted-foreground">{label}</span>
    </li>
  );
}

/** The three headline numbers under the banner. */
export function MetricBadges({ open, closingSoon, sourcesSyncedToday }: MetricBadgesProps) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-8" aria-label="Summary">
      <Metric value={open} label="Open opportunities" />
      <Metric value={closingSoon} label="Closing in 30 days" />
      <Metric value={sourcesSyncedToday} label="Sources synced today" />
    </ul>
  );
}
