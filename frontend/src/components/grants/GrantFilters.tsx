import { useEffect, useState, type ReactNode } from "react";
import { SDGS, VALUES } from "@shared/types/Common";
import { GEOGRAPHIES, type GrantFieldDef } from "@shared/types/Grants";
import {
  DEFAULT_STATUSES,
  type GrantFacets,
  type GrantQuery,
  type GrantQueryInput,
  type SourceSummary,
} from "@shared/types/GrantsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AmountSlider } from "./AmountSlider";
import { Chip } from "./Chip";
import { STATUS_LABELS, formatCompactNumber, geographyLabel } from "./format";

interface GrantFiltersProps {
  query: GrantQuery;
  facets: GrantFacets | null;
  sources: SourceSummary[];
  fieldDefs: GrantFieldDef[];
  onChange: (patch: Partial<GrantQueryInput>) => void;
  onClear: () => void;
}

/** Radix Select forbids an empty item value, so "no filter" needs a sentinel. */
const ANY = "__any__";

type Status = (typeof DEFAULT_STATUSES)[number];

function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold">{title}</legend>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </fieldset>
  );
}

/** Adds or removes `value`; an empty result means "no filter". */
function toggleIn<T>(list: readonly T[] | undefined, value: T): T[] | undefined {
  const current = list ?? [];
  const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
  return next.length > 0 ? next : undefined;
}

/** Text or number input that commits on blur or Enter, so typing does not refetch per keystroke. */
function CommitInput({
  id,
  type,
  value,
  onCommit,
  label,
}: {
  id: string;
  type: "text" | "number";
  value: string;
  onCommit: (value: string | undefined) => void;
  label: string;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed !== value) onCommit(trimmed || undefined);
  };
  return (
    <Input
      id={id}
      type={type}
      aria-label={label}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") commit();
      }}
    />
  );
}

export function GrantFilters({ query, facets, sources, fieldDefs, onChange, onClear }: GrantFiltersProps) {
  const activeStatuses: readonly Status[] = query.status
    ? DEFAULT_STATUSES.filter((status) => query.status!.includes(status))
    : DEFAULT_STATUSES;

  function toggleStatus(status: Status) {
    const isOn = activeStatuses.includes(status);
    if (isOn && activeStatuses.length === 1) return; // keep at least one
    const next = isOn ? activeStatuses.filter((item) => item !== status) : [...activeStatuses, status];
    const isDefault = next.length === DEFAULT_STATUSES.length;
    onChange({ status: isDefault ? undefined : next });
  }

  function setExtra(key: string, value: string | undefined) {
    const extras = { ...(query.extras ?? {}) };
    if (value === undefined) delete extras[key];
    else extras[key] = value;
    onChange({ extras: Object.keys(extras).length > 0 ? extras : undefined });
  }

  const count = (facet: Record<string, number> | undefined, key: string | number) => facet?.[String(key)] ?? 0;

  const boundsMin = facets?.amount.min ?? null;
  const boundsMax = facets?.amount.max ?? null;
  const hasAmount = boundsMin !== null && boundsMax !== null && boundsMax > boundsMin;
  const low = hasAmount ? Math.min(boundsMin, query.amount_min ?? boundsMin) : 0;
  const high = hasAmount ? Math.max(boundsMax, query.amount_max ?? boundsMax) : 0;

  const filterable = fieldDefs.filter((def) => def.filterable);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Filters</h2>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Clear all
        </Button>
      </div>

      {hasAmount && (
        <Group title="Grant amount" hint="Amounts are compared as numbers across currencies.">
          <AmountSlider
            min={low}
            max={high}
            value={[query.amount_min ?? low, query.amount_max ?? high]}
            format={formatCompactNumber}
            onCommit={([min, max]) =>
              onChange({ amount_min: min > low ? min : undefined, amount_max: max < high ? max : undefined })
            }
          />
        </Group>
      )}

      <Group title="Deadline">
        <div className="flex flex-wrap gap-1.5">
          {DEFAULT_STATUSES.map((status) => (
            <Chip
              key={status}
              pressed={activeStatuses.includes(status)}
              onClick={() => toggleStatus(status)}
              count={count(facets?.status, status)}
            >
              {STATUS_LABELS[status]}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title="Geography" hint="Heuristic until P3 enrichment adds regions.">
        <div className="flex flex-wrap gap-1.5">
          {GEOGRAPHIES.map((geography) => (
            <Chip
              key={geography}
              pressed={query.geography?.includes(geography) ?? false}
              onClick={() => onChange({ geography: toggleIn(query.geography, geography) })}
              count={count(facets?.geographies, geography)}
            >
              {geographyLabel(geography)}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title="SDGs">
        <div className="flex flex-wrap gap-1.5">
          {SDGS.map((sdg) => (
            <Chip
              key={sdg}
              pressed={query.sdg?.includes(sdg) ?? false}
              onClick={() => onChange({ sdg: toggleIn(query.sdg, sdg) })}
              count={count(facets?.sdgs, sdg)}
            >
              <span className="sr-only">SDG </span>
              {sdg}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title="Values">
        <div className="flex flex-wrap gap-1.5">
          {VALUES.map((value) => (
            <Chip
              key={value}
              pressed={query.value?.includes(value) ?? false}
              onClick={() => onChange({ value: toggleIn(query.value, value) })}
              count={count(facets?.values, value)}
            >
              {value}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title="Source">
        <Select
          value={query.source?.[0] ?? ANY}
          onValueChange={(next) => onChange({ source: next === ANY ? undefined : [next] })}
        >
          <SelectTrigger aria-label="Source" className="w-full">
            <SelectValue placeholder="All sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>All sources</SelectItem>
            {sources.map((source) => (
              <SelectItem key={source.id} value={source.id}>
                {source.name} ({count(facets?.sources, source.id)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Group>

      {filterable.map((def) => {
        const id = `filter-extra-${def.key}`;
        const current = query.extras?.[def.key] ?? "";
        return (
          <Group key={def.key} title={def.label}>
            {def.type === "enum" ? (
              <Select value={current || ANY} onValueChange={(next) => setExtra(def.key, next === ANY ? undefined : next)}>
                <SelectTrigger id={id} aria-label={def.label} className="w-full">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY}>Any</SelectItem>
                  {(def.options ?? []).map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <CommitInput
                id={id}
                type={def.type === "number" ? "number" : "text"}
                value={current}
                label={def.label}
                onCommit={(value) => setExtra(def.key, value)}
              />
            )}
          </Group>
        );
      })}
    </div>
  );
}
