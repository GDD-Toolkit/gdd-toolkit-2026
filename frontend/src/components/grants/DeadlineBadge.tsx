import { CalendarDays, Hourglass } from "lucide-react";
import type { Grant } from "@shared/types/Grants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { deadlineText, type DeadlineInfo } from "./format";

const TONE: Record<Grant["status"], string> = {
  open: "border-emerald-200 bg-emerald-50 text-emerald-800",
  closing_soon: "border-amber-200 bg-amber-50 text-amber-900",
  forecasted: "border-sky-200 bg-sky-50 text-sky-900",
  rolling: "border-violet-200 bg-violet-50 text-violet-900",
  closed: "border-border bg-muted text-muted-foreground",
  archived: "border-border bg-muted text-muted-foreground",
};

/** Open · closing soon · forecast · rolling · closed, with the date that matters. */
export function DeadlineBadge({ grant, className }: { grant: DeadlineInfo; className?: string }) {
  const Icon = grant.status === "forecasted" ? CalendarDays : Hourglass;
  return (
    <Badge variant="outline" className={cn("h-6 gap-1 px-2", TONE[grant.status], className)}>
      <Icon aria-hidden="true" />
      {deadlineText(grant)}
    </Badge>
  );
}
