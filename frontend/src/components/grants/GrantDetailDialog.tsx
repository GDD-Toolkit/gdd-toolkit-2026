import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import type { Grant, GrantFieldDef } from "@shared/types/Grants";
import type { GrantDetailResponse, SourceSummary } from "@shared/types/GrantsApi";
import { getGrant } from "@/api/grants";
import { BookmarkButton } from "@/components/auth/BookmarkButton";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlignmentChips } from "./AlignmentChips";
import { CurationToggle } from "./CurationToggle";
import { DeadlineBadge } from "./DeadlineBadge";
import { FieldValueView } from "./FieldValueView";
import { FUNDING_TYPE_LABELS, formatAmountRange, formatDate, humanizeKey } from "./format";
import { SourceBadge } from "./SourceBadge";

interface GrantDetailDialogProps {
  /** The grant to show; null closes the dialog. */
  grantId: string | null;
  /** List row shown at once while the full record loads. */
  seed: Grant | null;
  fieldDefs: GrantFieldDef[];
  sources: SourceSummary[];
  onClose: () => void;
  onCurationChanged?: (grant: GrantDetailResponse) => void;
}

/** Extras rendered as their own sections, in this order; everything else goes under "Source details". */
const NARRATIVE_KEYS = [
  ["eligibility", "Eligibility"],
  ["timeline", "Timeline"],
  ["past_awards", "Past awards"],
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-1.5">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
      <div className="text-sm">{children}</div>
    </section>
  );
}

export function GrantDetailDialog({
  grantId,
  seed,
  fieldDefs,
  sources,
  onClose,
  onCurationChanged,
}: GrantDetailDialogProps) {
  const [detail, setDetail] = useState<GrantDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDetail(null);
    setError(null);
    if (!grantId) return;
    let cancelled = false;
    getGrant(grantId)
      .then((grant) => {
        if (!cancelled) setDetail(grant);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "This grant could not be loaded.");
      });
    return () => {
      cancelled = true;
    };
  }, [grantId]);

  const grant: Grant | null = detail ?? (seed && seed.id === grantId ? seed : null);
  const defsByKey = new Map(fieldDefs.map((def) => [def.key, def]));
  const narrative = grant ? NARRATIVE_KEYS.filter(([key]) => grant.extras[key] !== undefined) : [];
  const narrativeKeys = new Set<string>(narrative.map(([key]) => key));
  const details = grant
    ? Object.entries(grant.extras)
        .filter(([key]) => !narrativeKeys.has(key))
        .sort(([a], [b]) => {
          const orderA = defsByKey.get(a)?.display_order ?? Number.MAX_SAFE_INTEGER;
          const orderB = defsByKey.get(b)?.display_order ?? Number.MAX_SAFE_INTEGER;
          return orderA - orderB || a.localeCompare(b);
        })
    : [];

  return (
    <Dialog
      open={grantId !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto p-6 sm:max-w-2xl">
        {grant ? (
          <>
            <DialogHeader className="gap-3">
              <div className="flex flex-wrap items-center gap-2 pr-8">
                <DeadlineBadge grant={grant} />
                <SourceBadge sourceId={grant.source_id} sources={sources} lastVerifiedAt={grant.last_verified_at} />
                {grant.external_id && <span className="text-xs text-muted-foreground">{grant.external_id}</span>}
              </div>
              <DialogTitle className="text-lg leading-snug font-semibold">{grant.title}</DialogTitle>
              <DialogDescription>
                {grant.funder && <span>{grant.funder} · </span>}
                {FUNDING_TYPE_LABELS[grant.funding_type]} ·{" "}
                <span className="font-medium text-foreground">
                  {formatAmountRange(grant.amount_min, grant.amount_max, grant.currency)}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              {grant.summary && (
                <Section title="Overview">
                  <p className="whitespace-pre-line">{grant.summary}</p>
                </Section>
              )}
              {narrative.map(([key, title]) => (
                <Section key={key} title={title}>
                  <FieldValueView value={grant.extras[key]!} def={defsByKey.get(key)} />
                </Section>
              ))}
              {(grant.sdgs.length > 0 || grant.values.length > 0 || grant.geographies.length > 0) && (
                <Section title="Alignment">
                  <AlignmentChips grant={grant} />
                </Section>
              )}
              {details.length > 0 && (
                <Section title="Source details">
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                    {details.map(([key, value]) => (
                      <div key={key} className="min-w-0">
                        <dt className="text-xs text-muted-foreground">{defsByKey.get(key)?.label ?? humanizeKey(key)}</dt>
                        <dd className="mt-0.5 break-words">
                          <FieldValueView value={value} def={defsByKey.get(key)} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Section>
              )}
              <p className="text-xs text-muted-foreground">
                Source record:{" "}
                <a
                  href={grant.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all underline-offset-4 hover:underline"
                >
                  {grant.url}
                </a>
                {" · "}first seen {formatDate(grant.first_seen_at)}
                {detail?.source.last_run_at && <> · source synced {formatDate(detail.source.last_run_at)}</>}
              </p>
            </div>

            <DialogFooter className="items-center sm:justify-between">
              <CurationToggle grant={grant} onChanged={onCurationChanged} />
              <div className="flex items-center gap-2">
                <BookmarkButton kind="grants" itemId={grant.id} label={grant.title} />
                <a
                  href={grant.apply_url ?? grant.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants(), "bg-[#4B5FD9] text-white hover:bg-[#3F52C8]")}
                >
                  Apply
                  <ExternalLink aria-hidden="true" />
                  <span className="sr-only">(opens the funder's page in a new tab)</span>
                </a>
              </div>
            </DialogFooter>
          </>
        ) : error ? (
          <DialogHeader>
            <DialogTitle>Grant unavailable</DialogTitle>
            <DialogDescription>{error}</DialogDescription>
          </DialogHeader>
        ) : (
          <div className="space-y-3" aria-busy="true">
            <DialogTitle className="sr-only">Loading grant</DialogTitle>
            <DialogDescription className="sr-only">The grant details are loading.</DialogDescription>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
