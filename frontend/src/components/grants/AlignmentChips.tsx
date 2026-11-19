import type { Grant } from "@shared/types/Grants";
import { Badge } from "@/components/ui/badge";
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
    <ul className={className ? `flex flex-wrap gap-1.5 ${className}` : "flex flex-wrap gap-1.5"} aria-label="Alignment">
      {chips.map((chip) => (
        <li key={chip.key}>
          <Badge
            variant="outline"
            className={
              chip.tone === "sdg"
                ? "border-[#6D83F2]/40 bg-[#6D83F2]/10 text-[#4C5FD4]"
                : chip.tone === "value"
                  ? "border-border bg-muted text-foreground"
                  : "border-border text-muted-foreground"
            }
          >
            {chip.label}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
