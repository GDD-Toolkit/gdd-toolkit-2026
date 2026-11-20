import { useEffect, useState } from "react";
import { motion, easeOut } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Grant, GrantFieldDef } from "@shared/types/Grants";
import {
  type GrantDetailResponse,
  type GrantFacets,
  type GrantListResponse,
  type GrantSort,
  type SourceSummary,
} from "@shared/types/GrantsApi";
import { getFacets, getFieldDefs, getGrants, getSources } from "@/api/grants";
import { Chip } from "@/components/grants/Chip";
import { GrantCard } from "@/components/grants/GrantCard";
import { GrantDetailDialog } from "@/components/grants/GrantDetailDialog";
import { GrantFilters } from "@/components/grants/GrantFilters";
import { MetricBadges } from "@/components/grants/MetricBadges";
import { isSameLocalDay } from "@/components/grants/format";
import { SourceAttributions } from "@/components/grants/SourceAttributions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { countActiveFilters, useGrantQuery } from "@/hooks/useGrantQuery";

const bannerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

const SORT_OPTIONS: { value: GrantSort; label: string }[] = [
  { value: "deadline", label: "Deadline soonest" },
  { value: "title", label: "A→Z" },
  { value: "-title", label: "Z→A" },
  { value: "-amount_max", label: "Amount" },
  { value: "-first_seen_at", label: "Newest" },
];

type LoadState = "loading" | "ready" | "error";

export default function FundingSources() {
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

  const filters = (
    <GrantFilters
      query={query}
      facets={facets}
      sources={sources}
      fieldDefs={fieldDefs}
      onChange={(patch) => setQuery(patch)}
      onClear={() => {
        clearQuery();
        setFiltersOpen(false);
      }}
    />
  );

  return (
    <div className="min-h-screen bg-slate-50 text-foreground">
      <header className="bg-[linear-gradient(to_right,#A07CFF,#6D83F2)] px-4 py-14 text-center text-white">
        <motion.h1
          className="text-4xl font-extrabold tracking-tight md:text-5xl"
          initial="hidden"
          animate="visible"
          variants={bannerVariants}
        >
          Funding Sources
        </motion.h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/90 md:text-base">
          Grants, fellowships and calls for development practitioners, gathered from public funders and refreshed
          nightly.
        </p>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <MetricBadges
          open={openCount}
          closingSoon={facets?.closing_soon ?? null}
          sourcesSyncedToday={sources.length > 0 ? syncedToday : null}
        />

        <div className="relative mx-auto mt-8 max-w-2xl">
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            id="grants-search"
            name="q"
            aria-label="Search grants"
            placeholder="Search by grant name, funder, or keyword…"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="h-11 bg-white pl-9"
          />
        </div>

        <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
          <section aria-labelledby="results-heading" className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h2 id="results-heading" className="text-sm text-muted-foreground">
                {list && state !== "loading" ? (
                  <>
                    Showing <span className="font-medium text-foreground">{list.data.length}</span> of{" "}
                    <span className="font-medium text-foreground">{list.meta.total}</span>
                  </>
                ) : (
                  "Loading opportunities…"
                )}
              </h2>
              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Sort">
                <span className="text-sm text-muted-foreground">Sort:</span>
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
                  <Button type="button" variant="outline" size="sm" className="ml-auto lg:hidden">
                    <SlidersHorizontal />
                    Filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-sm">
                  {/* GrantFilters renders the visible "Filters" heading; these keep the sheet named for assistive tech. */}
                  <SheetTitle className="sr-only">Filters</SheetTitle>
                  <SheetDescription className="sr-only">Narrow the list; results update as you choose.</SheetDescription>
                  <div className="overflow-y-auto px-4 pt-12 pb-6">{filters}</div>
                </SheetContent>
              </Sheet>
            </div>

            {state === "error" ? (
              <div role="alert" className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm">
                <p className="font-medium">The funding list could not be loaded.</p>
                <p className="mt-1 text-muted-foreground">{error}</p>
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => setReloadKey((key) => key + 1)}>
                  Retry
                </Button>
              </div>
            ) : state === "loading" && !list ? (
              <ul className="mt-6 space-y-4" aria-busy="true" aria-label="Loading grants">
                {Array.from({ length: 6 }, (_, index) => (
                  <li key={index}>
                    <Skeleton className="h-44 w-full rounded-xl" />
                  </li>
                ))}
              </ul>
            ) : list && list.data.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-border bg-white p-10 text-center">
                <p className="font-medium">No grants match these filters.</p>
                <p className="mt-1 text-sm text-muted-foreground">Try widening the deadline or clearing a facet.</p>
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={clearQuery}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              list && (
                <ul className={state === "loading" ? "mt-6 space-y-4 opacity-60" : "mt-6 space-y-4"} aria-busy={state === "loading"}>
                  {list.data.map((grant) => (
                    <li key={grant.id}>
                      <GrantCard grant={grant} sources={sources} onOpen={openGrant} onCurationChanged={onCurationChanged} />
                    </li>
                  ))}
                </ul>
              )
            )}

            {list && totalPages > 1 && (
              <nav className="mt-6 flex items-center justify-between" aria-label="Pagination">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={query.page <= 1}
                  onClick={() => setQuery({ page: query.page - 1 }, { keepPage: true })}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {query.page} of {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={query.page >= totalPages}
                  onClick={() => setQuery({ page: query.page + 1 }, { keepPage: true })}
                >
                  Next
                </Button>
              </nav>
            )}
          </section>

          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-6 rounded-xl border border-border bg-white p-5">{filters}</div>
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
