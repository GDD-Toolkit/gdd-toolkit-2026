import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import type { Grant, GrantFieldDef } from "@shared/types/Grants";
import {
  type GrantDetailResponse,
  type GrantFacets,
  type GrantListResponse,
  type GrantSort,
  type SourceSummary,
} from "@shared/types/GrantsApi";
import { getFacets, getFieldDefs, getGrants, getSources } from "@/api/grants";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
} from "@/components/editorial/EditorialPagePrimitives";
import { Chip } from "@/components/grants/Chip";
import { GrantCard } from "@/components/grants/GrantCard";
import { GrantDetailDialog } from "@/components/grants/GrantDetailDialog";
import { GrantFilters } from "@/components/grants/GrantFilters";
import { MetricBadges } from "@/components/grants/MetricBadges";
import {
  STATUS_LABELS,
  formatCompactNumber,
  geographyLabel,
  humanizeKey,
  isSameLocalDay,
  sourceName,
} from "@/components/grants/format";
import { SourceAttributions } from "@/components/grants/SourceAttributions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { countActiveFilters, useGrantQuery } from "@/hooks/useGrantQuery";

const SORT_OPTIONS: { value: GrantSort; label: string }[] = [
  { value: "deadline", label: "Deadline soonest" },
  { value: "title", label: "A→Z" },
  { value: "-title", label: "Z→A" },
  { value: "-amount_max", label: "Amount" },
  { value: "-first_seen_at", label: "Newest" },
];

type LoadState = "loading" | "ready" | "error";

interface ActiveFilterPill {
  key: string;
  label: string;
  onRemove: () => void;
}

export default function FundingSources() {
  const reduced = useReducedMotion();
  const { query, setQuery, clearQuery, grantId, setGrantId } = useGrantQuery();

  const [sources, setSources] = useState<SourceSummary[]>([]);
  const [fieldDefs, setFieldDefs] = useState<GrantFieldDef[]>([]);
  const [list, setList] = useState<GrantListResponse | null>(null);
  const [facets, setFacets] = useState<GrantFacets | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [seed, setSeed] = useState<Grant | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchText, setSearchText] = useState(query.q ?? "");

  // Registry and source list: once per visit (and on retry).
  useEffect(() => {
    let cancelled = false;
    Promise.all([getSources(), getFieldDefs()])
      .then(([nextSources, nextDefs]) => {
        if (cancelled) return;
        setSources(nextSources);
        setFieldDefs(nextDefs);
      })
      .catch(() => {
        // Non-fatal: badges fall back to source ids and extras to raw keys.
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // The list and its facets follow the URL query.
  useEffect(() => {
    let cancelled = false;
    setState("loading");
    setError(null);
    Promise.all([getGrants(query), getFacets(query)])
      .then(([nextList, nextFacets]) => {
        if (cancelled) return;
        setList(nextList);
        setFacets(nextFacets);
        setState("ready");
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setError(cause instanceof Error ? cause.message : "The grants API did not respond.");
        setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [query, reloadKey]);

  // Search box: URL → box when the URL changes elsewhere; box → URL after a pause.
  useEffect(() => {
    setSearchText((current) => (current.trim() === (query.q ?? "") ? current : (query.q ?? "")));
  }, [query.q]);
  useEffect(() => {
    const trimmed = searchText.trim();
    if (trimmed === (query.q ?? "")) return;
    const timer = setTimeout(() => setQuery({ q: trimmed || undefined }), 300);
    return () => clearTimeout(timer);
  }, [searchText, query.q, setQuery]);

  const openGrant = (grant: Grant) => {
    setSeed(grant);
    setGrantId(grant.id);
  };
  const closeGrant = () => {
    setGrantId(null);
    setSeed(null);
  };
  const onCurationChanged = (grant: GrantDetailResponse) => {
    setSeed((current) => (current?.id === grant.id ? { ...current, curation: grant.curation } : current));
    setReloadKey((key) => key + 1);
  };

  const currentSort: GrantSort = query.sort ?? (query.q ? "relevance" : "deadline");
  const sortOptions = query.q ? [{ value: "relevance" as const, label: "Relevance" }, ...SORT_OPTIONS] : SORT_OPTIONS;
  const activeFilters = countActiveFilters(query);
  const totalPages = list ? Math.max(1, Math.ceil(list.meta.total / list.meta.pageSize)) : 1;
  const openCount = facets ? (facets.status["open"] ?? 0) + (facets.status["closing_soon"] ?? 0) : null;
  const syncedToday = sources.filter((source) => source.last_run_at && isSameLocalDay(source.last_run_at)).length;

  const activeFilterPills = useMemo<ActiveFilterPill[]>(() => {
    const pills: ActiveFilterPill[] = [];
    if (query.q) {
      pills.push({
        key: "q",
        label: `Search: “${query.q}”`,
        onRemove: () => {
          setSearchText("");
          setQuery({ q: undefined });
        },
      });
    }
    if (query.status) {
      pills.push({
        key: "status",
        label: `Status: ${query.status.map((s) => STATUS_LABELS[s]).join(", ")}`,
        onRemove: () => setQuery({ status: undefined }),
      });
    }
    if (query.amount_min !== undefined || query.amount_max !== undefined) {
      const minLabel = query.amount_min !== undefined ? formatCompactNumber(query.amount_min) : "Any";
      const maxLabel = query.amount_max !== undefined ? formatCompactNumber(query.amount_max) : "Any";
      pills.push({
        key: "amount",
        label: `Amount: ${minLabel}–${maxLabel}`,
        onRemove: () => setQuery({ amount_min: undefined, amount_max: undefined }),
      });
    }
    query.geography?.forEach((geo) => {
      pills.push({
        key: `geo-${geo}`,
        label: geographyLabel(geo),
        onRemove: () => {
          const next = query.geography?.filter((item) => item !== geo);
          setQuery({ geography: next && next.length > 0 ? next : undefined });
        },
      });
    });
    query.sdg?.forEach((sdg) => {
      pills.push({
        key: `sdg-${sdg}`,
        label: `SDG ${sdg}`,
        onRemove: () => {
          const next = query.sdg?.filter((item) => item !== sdg);
          setQuery({ sdg: next && next.length > 0 ? next : undefined });
        },
      });
    });
    query.value?.forEach((val) => {
      pills.push({
        key: `val-${val}`,
        label: val,
        onRemove: () => {
          const next = query.value?.filter((item) => item !== val);
          setQuery({ value: next && next.length > 0 ? next : undefined });
        },
      });
    });
    query.source?.forEach((src) => {
      pills.push({
        key: `src-${src}`,
        label: `Source: ${sourceName(src, sources)}`,
        onRemove: () => {
          const next = query.source?.filter((item) => item !== src);
          setQuery({ source: next && next.length > 0 ? next : undefined });
        },
      });
    });
    if (query.extras) {
      const defsByKey = new Map(fieldDefs.map((d) => [d.key, d.label]));
      Object.entries(query.extras).forEach(([k, v]) => {
        pills.push({
          key: `extra-${k}`,
          label: `${defsByKey.get(k) ?? humanizeKey(k)}: ${v}`,
          onRemove: () => {
            const next = { ...query.extras };
            delete next[k];
            setQuery({ extras: Object.keys(next).length > 0 ? next : undefined });
          },
        });
      });
    }
    return pills;
  }, [query, sources, fieldDefs, setQuery]);

  const filters = (
    <GrantFilters
      query={query}
      facets={facets}
      sources={sources}
      fieldDefs={fieldDefs}
      onChange={(patch) => setQuery(patch)}
      onClear={() => {
        setSearchText("");
        clearQuery();
        setFiltersOpen(false);
      }}
    />
  );

  return (
    <div className="min-h-screen bg-white text-[#202B20]">

      <EditorialPageHero
        ariaLabel="Funding Sources Tracker"
        badges={[
          { label: "Refreshed Nightly", tone: "cream" },
          { label: "Verified Public Funders", tone: "sage" },
        ]}
        title={
          <>
            <em className="font-normal italic text-[#E9E6B2]">Funding</em> Sources Tracker
          </>
        }
        subtitle="Discover open grants, fellowships, and funding calls for global development practitioners—gathered from verified public funders and searchable by deadline, amount, and ethical alignment."
        footnote="Automated nightly ingestion · Searchable across SDGs, development values, and regions"
        aside={
          <MetricBadges
            variant="hero"
            open={openCount}
            closingSoon={facets?.closing_soon ?? null}
            sourcesSyncedToday={sources.length > 0 ? syncedToday : null}
            totalMatches={list ? list.meta.total : null}
          />
        }
      />

      {/* Sage-tinted editorial search, sort, and active filters control strip */}
      <div className="border-b border-[#B2C9A8] bg-[#F2F6EF]">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-xl">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#596556]"
              />
              <Input
                type="search"
                id="grants-search"
                name="q"
                aria-label="Search grants"
                placeholder="Search by grant name, funder, or keyword…"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="h-11 rounded-full border-[1.5px] border-[#94B985] bg-white pr-9 pl-10 text-sm text-[#202B20] shadow-xs placeholder:text-[#596556] focus-visible:border-[#3F673C] focus-visible:ring-[#3F673C]/25"
              />
              {searchText && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchText("");
                    setQuery({ q: undefined });
                  }}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full p-1 text-[#596556] transition-colors hover:bg-[#EDF4E8] hover:text-[#202B20]"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Sort">
                <span className="mr-1 font-mono text-[11px] font-medium uppercase tracking-wider text-[#596556]">
                  Sort:
                </span>
                {sortOptions.map((option) => (
                  <Chip
                    key={option.value}
                    pressed={currentSort === option.value}
                    onClick={() => setQuery({ sort: option.value }, { keepPage: false })}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>

              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="ml-auto cursor-pointer rounded-full border-[1.5px] border-[#3F673C] bg-white px-4 text-xs font-semibold text-[#284B26] hover:bg-[#EDF4E8] lg:hidden"
                  >
                    <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                    Filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full border-l-[#B2C9A8] bg-white sm:max-w-sm">
                  {/* GrantFilters renders the visible "Filters" heading; these keep the sheet named for assistive tech. */}
                  <SheetTitle className="sr-only">Filters</SheetTitle>
                  <SheetDescription className="sr-only">Narrow the list; results update as you choose.</SheetDescription>
                  <div className="overflow-y-auto px-5 pt-12 pb-8">{filters}</div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {activeFilterPills.length > 0 && (
            <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-[#D5E3D9] pt-3.5">
              <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                Active filters:
              </span>
              {activeFilterPills.map((pill) => (
                <button
                  key={pill.key}
                  type="button"
                  onClick={pill.onRemove}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#94B985] bg-[#F6F4D8] px-3 py-1 text-xs font-medium text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#E9E6B2]"
                >
                  <span>{pill.label}</span>
                  <X className="size-3 text-[#284B26]" aria-hidden="true" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setSearchText("");
                  clearQuery();
                }}
                className="ml-1 inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#187347] underline-offset-4 hover:underline"
              >
                <RotateCcw className="size-3" aria-hidden="true" />
                Reset all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Results + Sticky Editorial Filter Sidebar */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
          <section aria-labelledby="results-heading" className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#E3EBDE] pb-3.5">
              <h2 id="results-heading" className="text-sm text-[#596556]">
                {list && state !== "loading" ? (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-[#202B20] tabular-nums">{list.data.length}</span> of{" "}
                    <span className="font-semibold text-[#202B20] tabular-nums">{list.meta.total}</span>{" "}
                    {list.meta.total === 1 ? "opportunity" : "opportunities"}
                  </>
                ) : (
                  "Loading opportunities…"
                )}
              </h2>
              {list && totalPages > 1 && (
                <span className="font-mono text-xs text-[#596556] tabular-nums">
                  Page {query.page} of {totalPages}
                </span>
              )}
            </div>

            {state === "error" ? (
              <div
                role="alert"
                className="mt-6 rounded-2xl border-[1.5px] border-destructive/40 bg-destructive/5 p-6 text-sm"
              >
                <p className="font-semibold text-[#202B20]" style={EDITORIAL_SERIF_STYLE}>
                  The funding list could not be loaded.
                </p>
                <p className="mt-1.5 text-[#596556]">{error}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4 cursor-pointer rounded-full border-[#3F673C] text-[#284B26] hover:bg-[#EDF4E8]"
                  onClick={() => setReloadKey((key) => key + 1)}
                >
                  Retry
                </Button>
              </div>
            ) : state === "loading" && !list ? (
              <ul className="mt-6 space-y-4" aria-busy="true" aria-label="Loading grants">
                {Array.from({ length: 6 }, (_, index) => (
                  <li key={index}>
                    <Skeleton className="h-48 w-full rounded-2xl border border-[#D5E3D9] bg-[#F2F6EF]" />
                  </li>
                ))}
              </ul>
            ) : list && list.data.length === 0 ? (
              <div className="mt-6 rounded-2xl border-[1.5px] border-dashed border-[#94B985] bg-[#FAFDF8] p-10 text-center">
                <p className="text-lg font-semibold text-[#202B20]" style={EDITORIAL_SERIF_STYLE}>
                  No grants match these filters.
                </p>
                <p className="mt-1.5 text-sm text-[#596556]">Try widening the deadline or clearing a facet.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-5 cursor-pointer rounded-full border-[1.5px] border-[#3F673C] bg-white px-5 text-xs font-semibold text-[#284B26] hover:bg-[#EDF4E8]"
                  onClick={() => {
                    setSearchText("");
                    clearQuery();
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              list && (
                <ul
                  className={state === "loading" ? "mt-6 space-y-4 opacity-60 transition-opacity" : "mt-6 space-y-4"}
                  aria-busy={state === "loading"}
                >
                  {list.data.map((grant, idx) => (
                    <motion.li
                      key={grant.id}
                      initial={reduced ? false : { opacity: 0, y: 12 }}
                      animate={reduced ? undefined : { opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: Math.min(idx * 0.03, 0.24), ease: EDITORIAL_EASE }}
                    >
                      <GrantCard
                        grant={grant}
                        sources={sources}
                        onOpen={openGrant}
                        onCurationChanged={onCurationChanged}
                      />
                    </motion.li>
                  ))}
                </ul>
              )
            )}

            {list && totalPages > 1 && (
              <nav
                className="mt-8 flex items-center justify-between rounded-2xl border border-[#D5E3D9] bg-[#F2F6EF] px-4 py-3"
                aria-label="Pagination"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={query.page <= 1}
                  onClick={() => setQuery({ page: query.page - 1 }, { keepPage: true })}
                  className="cursor-pointer gap-1.5 rounded-full border-[#94B985] bg-white px-4 text-xs font-medium text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8] disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                  Previous
                </Button>
                <span className="font-mono text-xs font-medium text-[#394838] tabular-nums">
                  Page {query.page} of {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={query.page >= totalPages}
                  onClick={() => setQuery({ page: query.page + 1 }, { keepPage: true })}
                  className="cursor-pointer gap-1.5 rounded-full border-[#94B985] bg-white px-4 text-xs font-medium text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8] disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Button>
              </nav>
            )}
          </section>

          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-5 shadow-xs">
              {filters}
            </div>
          </aside>
        </div>

        <SourceAttributions sources={sources} />
      </div>

      <GrantDetailDialog
        grantId={grantId}
        seed={seed}
        fieldDefs={fieldDefs}
        sources={sources}
        onClose={closeGrant}
        onCurationChanged={onCurationChanged}
      />
    </div>
  );
}
