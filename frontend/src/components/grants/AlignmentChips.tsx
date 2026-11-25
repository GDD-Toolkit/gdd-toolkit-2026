import type { Grant } from "@shared/types/Grants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { geographyLabel } from "./format";

type Alignment = Pick<Grant, "sdgs" | "values" | "geographies">;

/** SDG, value and geography tags of a grant, in that order. */
export function AlignmentChips({ grant, className }: { grant: Alignment; className?: string }) {
  const chips = [
    ...grant.sdgs.map((sdg) => ({ key: `sdg-${sdg}`, label: `SDG ${sdg}`, tone: "sdg" as const })),
    ...grant.values.map((value) => ({ key: `value-${value}`, label: value, tone: "value" as const })),
    ...grant.geographies.map((geo) => ({ key: `geo-${geo}`, label: geographyLabel(geo), tone: "geo" as const })),
  ];
  if (chips.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Alignment">
      {chips.map((chip) => (
        <li key={chip.key}>
          <Badge
            variant="outline"
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
              chip.tone === "sdg"
                ? "border-[#94B985] bg-[#EDF4E8] text-[#187347]"
                : chip.tone === "value"
                  ? "border-[#D6CE8A] bg-[#F6F4D8] text-[#284B26]"
                  : "border-[#B2C9A8] bg-white text-[#596556]",
            )}
          >
            {chip.label}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
