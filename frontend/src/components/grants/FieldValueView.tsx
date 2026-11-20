import type { FieldValue, GrantFieldDef } from "@shared/types/Grants";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatMoney } from "./format";

interface FieldValueViewProps {
  value: FieldValue;
  /** The registry entry for this key; the value's own shape decides when it is missing. */
  def?: GrantFieldDef;
}

/** Renders one extras value by its registered type: money, url, list, date, or text. */
export function FieldValueView({ value, def }: FieldValueViewProps) {
  if (value === null || value === undefined) return <span className="text-muted-foreground">—</span>;

  if (typeof value === "object" && !Array.isArray(value)) {
    return <span>{formatMoney(value.amount, value.currency)}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-muted-foreground">—</span>;
    return (
      <span className="flex flex-wrap gap-1">
        {value.map((item) => (
          <Badge key={item} variant="secondary">
            {item}
          </Badge>
        ))}
      </span>
    );
  }

  if (typeof value === "boolean") return <span>{value ? "Yes" : "No"}</span>;

  if (typeof value === "number") return <span>{value.toLocaleString("en")}</span>;

  const type = def?.type;
  if (type === "url" || (type === undefined && /^https?:\/\//.test(value))) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-[#4B5FD9] underline-offset-4 hover:underline"
      >
        {value}
      </a>
    );
  }
  if (type === "date") return <span>{formatDate(value)}</span>;

  return <span className="whitespace-pre-line">{value}</span>;
}
