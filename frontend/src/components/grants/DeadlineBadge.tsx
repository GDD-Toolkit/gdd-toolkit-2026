import { CalendarDays, Hourglass } from "lucide-react";
import type { Grant } from "@shared/types/Grants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { deadlineText, type DeadlineInfo } from "./format";

const TONE: Record<Grant["status"], string> = {
  open: "border-[#94B985] bg-[#EDF4E8] text-[#187347]",
  closing_soon: "border-[#D6CE8A] bg-[#FAF8E4] text-amber-900",
  forecasted: "border-[#B2C9A8] bg-[#F2F6EF] text-[#284B26]",
  rolling: "border-[#94B985] bg-[#F6F4D8] text-[#284B26]",
  closed: "border-[#D5E3D9] bg-[#F2F6EF]/70 text-[#596556]",
  archived: "border-[#D5E3D9] bg-[#F2F6EF]/70 text-[#596556]",
};

/** Open · closing soon · forecast · rolling · closed, with the date that matters. */
export function DeadlineBadge({ grant, className }: { grant: DeadlineInfo; className?: string }) {
  const Icon = grant.status === "forecasted" ? CalendarDays : Hourglass;
  return (
    <Badge
      variant="outline"
      className={cn("h-6 gap-1 rounded-full px-2.5 font-mono text-[11px] font-medium", TONE[grant.status], className)}
    >
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      {deadlineText(grant)}
    </Badge>
  );
}
