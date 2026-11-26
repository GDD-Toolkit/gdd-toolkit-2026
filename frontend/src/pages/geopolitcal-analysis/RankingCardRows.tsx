import { Card, CardContent } from "@/components/ui/card";

const rows = [1, 2, 3];
const slots = Array.from({ length: 8 }, (_, index) => index);

export default function RankingCardRows() {
  return (
    <div className="grid w-full min-w-0 gap-4">
      {rows.map((row) => (
        <Card key={row} className="min-w-0">
          <CardContent
            role="region"
            aria-label={`Card row ${row}, scroll horizontally`}
            tabIndex={0}
            className="flex gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
          >
            {/* Replace these empty slots with cards when their content is ready. */}
            {slots.map((slot) => (
              <div
                key={slot}
                aria-hidden="true"
                className="h-40 w-56 shrink-0 rounded-xl border border-dashed border-border bg-muted/30 sm:w-64"
              />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
