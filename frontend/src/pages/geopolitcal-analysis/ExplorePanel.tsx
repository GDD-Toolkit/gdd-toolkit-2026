import { useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const desktopQuery = "(min-width: 768px)";
const subscribeToViewport = (onChange: () => void) => {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const isDesktopViewport = () => window.matchMedia(desktopQuery).matches;

interface ExplorePanelProps {
  regions: string[];
  countries: string[];
  developmentValues: string[];
}

export default function ExplorePanel({ regions, countries, developmentValues }: ExplorePanelProps) {
  const isDesktop = useSyncExternalStore(subscribeToViewport, isDesktopViewport, () => false);
  const selections = [
    { label: "Regions", values: regions, empty: "All regions" },
    { label: "Countries", values: countries, empty: "No countries selected" },
    { label: "Development values", values: developmentValues, empty: "No development values selected" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button">
          Explore <ArrowRight aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side={isDesktop ? "right" : "bottom"} className="geopolitical-explore-panel">
        <SheetHeader className="shrink-0 border-b px-6 py-5 pr-12">
          <SheetTitle className="text-xl">Explore your selections</SheetTitle>
          <SheetDescription>
            Review the regions, countries, and development values you selected.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-6 pb-6">
          {selections.map(({ label, values, empty }) => (
            <section key={label} aria-label={label} className="rounded-xl border bg-card p-4 text-card-foreground">
              <h3 className="mb-3 text-sm font-semibold">{label}</h3>
              {values.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {values.map((value) => (
                    <li key={value} className="rounded-md bg-muted px-2.5 py-1 text-sm break-words">
                      {value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">{empty}</p>
              )}
            </section>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
