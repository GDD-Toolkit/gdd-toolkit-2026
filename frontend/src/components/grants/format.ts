import type { Grant } from "@shared/types/Grants";
import type { SourceSummary } from "@shared/types/GrantsApi";

/** Labels for the coarse geography facet (heuristic until P3 enrichment). */
export const GEOGRAPHY_LABELS: Record<string, string> = {
  us_only: "U.S. only",
  eu_and_partners: "EU & partners",
  worldwide: "Worldwide",
  philippines_sea: "Philippines & SEA",
};

export const FUNDING_TYPE_LABELS: Record<Grant["funding_type"], string> = {
  grant: "Grant",
  fellowship: "Fellowship",
  scholarship: "Scholarship",
  prize: "Prize",
  cooperative_agreement: "Cooperative agreement",
  other: "Other",
};

export const STATUS_LABELS: Record<Grant["status"], string> = {
  open: "Open",
  closing_soon: "Closing ≤ 30 d",
  forecasted: "Forecast",
  rolling: "Rolling",
  closed: "Closed",
  archived: "Archived",
};

export function geographyLabel(value: string): string {
  return GEOGRAPHY_LABELS[value] ?? value;
}

export function formatMoney(amount: number, currency: string, compact = false): string {
  try {
    const text = new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      ...(compact ? { notation: "compact" as const } : {}),
    }).format(amount);
    return compact ? text.replace(/(\d)K\b/, "$1k") : text;
  } catch {
    return `${amount.toLocaleString("en")} ${currency}`;
  }
}

/** "10k", "1.5M": a number without a currency, for the amount slider. */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })
    .format(value)
    .replace(/(\d)K\b/, "$1k");
}

/** "$400k–$500k", "Up to $8k", "From $5k" or "Amount not stated". */
export function formatAmountRange(
  min: number | null,
  max: number | null,
  currency: string,
  compact = false,
): string {
  if (min != null && max != null) {
    return min === max
      ? formatMoney(min, currency, compact)
      : `${formatMoney(min, currency, compact)}–${formatMoney(max, currency, compact)}`;
  }
  if (max != null) return `Up to ${formatMoney(max, currency, compact)}`;
  if (min != null) return `From ${formatMoney(min, currency, compact)}`;
  return "Amount not stated";
}

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** "YYYY-MM-DD" as local midnight, so a deadline never shifts a day across time zones. */
export function parseDateOnly(value: string): Date {
  const match = DATE_ONLY.exec(value);
  if (!match) return new Date(value);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

/** "28 Nov 2026" for both date-only and ISO datetime strings; empty for nothing. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = parseDateOnly(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** Whole days from `from` (date part only) to a "YYYY-MM-DD" deadline; negative when past. */
export function daysUntil(dateOnly: string, from = new Date()): number {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = parseDateOnly(dateOnly);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

export function isSameLocalDay(iso: string, now = new Date()): boolean {
  const date = new Date(iso);
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

/** "past_awards" → "Past awards". */
export function humanizeKey(key: string): string {
  const text = key.replace(/_/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export type DeadlineInfo = Pick<Grant, "status" | "deadline" | "opens_at">;

/** The DeadlineBadge text for a grant's status and dates. */
export function deadlineText(grant: DeadlineInfo, now = new Date()): string {
  const { status, deadline, opens_at } = grant;
  switch (status) {
    case "open":
    case "closing_soon": {
      if (!deadline) return "Open";
      const days = daysUntil(deadline, now);
      const suffix = days === 1 ? "1 day" : `${days} days`;
      return `Closes ${formatDate(deadline)} · ${suffix}`;
    }
    case "forecasted":
      if (!opens_at) return "Forecast";
      // Funders leave a forecast listed after its estimated date: still a forecast, no longer an opening date.
      return daysUntil(opens_at, now) < 0 ? `Forecast · expected ${formatDate(opens_at)}` : `Forecast · opens ${formatDate(opens_at)}`;
    case "rolling":
      return "Rolling";
    case "closed":
      return deadline ? `Closed ${formatDate(deadline)}` : "Closed";
    case "archived":
      return "Archived";
  }
}

/** Display name of a source, falling back to its id until /sources has loaded. */
export function sourceName(sourceId: string, sources: SourceSummary[]): string {
  return sources.find((source) => source.id === sourceId)?.name ?? sourceId;
}

/** A round slider step so the thumbs land on tidy amounts: 1 / 2 / 5 × 10^n, about 50 stops across the range. */
export function niceStep(range: number): number {
  if (range <= 0) return 1;
  const raw = range / 50;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return Math.max(1, nice * magnitude);
}
