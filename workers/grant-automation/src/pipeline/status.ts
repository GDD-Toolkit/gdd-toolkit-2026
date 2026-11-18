import type { DeadlineType, GrantStatus } from "../../../../shared/types/Grants.js";

export const CLOSING_SOON_DAYS = 30;

/** UTC calendar date as "YYYY-MM-DD". Deadlines are dates, so UTC is good enough. */
export const todayISO = () => new Date().toISOString().slice(0, 10);

export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

type StatusInputs = {
  opens_at: string | null;
  deadline: string | null;
  deadline_type: DeadlineType;
  /** The source itself lists the item as forecasted / forthcoming. */
  forecast?: boolean | null;
};

/** The status a row should have today. Adapters never set it; the upsert and the nightly sweep call this. */
export function deriveStatus({ opens_at, deadline, deadline_type, forecast }: StatusInputs, today = todayISO()): GrantStatus {
  if (deadline && deadline < today) return "closed";
  if (forecast || (opens_at && opens_at > today)) return "forecasted";
  if (deadline) return deadline <= addDays(today, CLOSING_SOON_DAYS) ? "closing_soon" : "open";
  return deadline_type === "rolling" ? "rolling" : "open";
}
