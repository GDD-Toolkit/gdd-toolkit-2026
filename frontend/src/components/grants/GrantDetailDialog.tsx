import { useEffect, useState } from "react";
import { Building2, Coins, ExternalLink, Tag } from "lucide-react";
import type { Grant, GrantFieldDef } from "@shared/types/Grants";
import type { GrantDetailResponse, SourceSummary } from "@shared/types/GrantsApi";
import { getGrant } from "@/api/grants";
import { BookmarkButton } from "@/components/auth/BookmarkButton";
import { EDITORIAL_SERIF_STYLE } from "@/components/editorial/EditorialPagePrimitives";
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
    <section className="space-y-2">
      <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#187347]">{title}</h3>
      <div className="text-sm leading-relaxed text-[#394838]">{children}</div>
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
      <DialogContent className="max-h-[86vh] overflow-y-auto rounded-2xl border-[1.5px] border-[#94B985] bg-white p-6 text-[#202B20] shadow-xl sm:max-w-2xl sm:p-7">
        {grant ? (
          <>
            <DialogHeader className="gap-3 text-left">
              <div className="flex flex-wrap items-center gap-2 pr-8">
                <DeadlineBadge grant={grant} />
                <SourceBadge sourceId={grant.source_id} sources={sources} lastVerifiedAt={grant.last_verified_at} />
                {grant.external_id && (
                  <span className="rounded-full border border-[#D5E3D9] bg-[#FAFDF8] px-2.5 py-0.5 font-mono text-[10px] text-[#596556]">
                    {grant.external_id}
                  </span>
                )}
              </div>

              <DialogTitle
                className="text-xl leading-snug font-semibold text-[#202B20] sm:text-2xl"
                style={EDITORIAL_SERIF_STYLE}
              >
                {grant.title}
              </DialogTitle>

              {/* Sage info callout strip */}
              <DialogDescription asChild>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-[#B2C9A8] bg-[#F2F6EF] px-4 py-3 text-xs text-[#394838]">
                  {grant.funder && (
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#284B26]">
                      <Building2 className="size-3.5 text-[#187347]" aria-hidden="true" />
                      {grant.funder}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="size-3.5 text-[#187347]" aria-hidden="true" />
                    {FUNDING_TYPE_LABELS[grant.funding_type]}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-[#187347]">
                    <Coins className="size-3.5" aria-hidden="true" />
                    {formatAmountRange(grant.amount_min, grant.amount_max, grant.currency)}
                  </span>
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 space-y-5">
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
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {details.map(([key, value]) => (
                      <div
                        key={key}
                        className="min-w-0 rounded-xl border border-[#D5E3D9] bg-[#FAFDF8] px-3.5 py-2.5"
                      >
                        <dt className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#596556]">
                          {defsByKey.get(key)?.label ?? humanizeKey(key)}
                        </dt>
                        <dd className="mt-1 break-words text-sm text-[#202B20]">
                          <FieldValueView value={value} def={defsByKey.get(key)} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Section>
              )}

              <div className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF]/70 px-3.5 py-2.5 text-xs text-[#596556]">
                Source record:{" "}
                <a
                  href={grant.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all font-medium text-[#187347] underline-offset-4 hover:underline"
                >
                  {grant.url}
                </a>
                {" · "}first seen {formatDate(grant.first_seen_at)}
                {detail?.source.last_run_at && <> · source synced {formatDate(detail.source.last_run_at)}</>}
              </div>
            </div>

            <DialogFooter className="mt-2 items-center gap-3 border-t border-[#E3EBDE] pt-4 sm:justify-between">
              <CurationToggle grant={grant} onChanged={onCurationChanged} />
              <div className="flex items-center gap-2.5">
                <BookmarkButton kind="grants" itemId={grant.id} label={grant.title} />
                <a
                  href={grant.apply_url ?? grant.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants(),
                    "rounded-full bg-[#187347] px-5 font-semibold text-white shadow-xs transition-colors hover:bg-[#105C37]",
                  )}
                >
                  Apply
                  <ExternalLink className="size-4" aria-hidden="true" />
                  <span className="sr-only">(opens the funder's page in a new tab)</span>
                </a>
              </div>
            </DialogFooter>
          </>
        ) : error ? (
          <DialogHeader>
            <DialogTitle style={EDITORIAL_SERIF_STYLE} className="text-[#202B20]">
              Grant unavailable
            </DialogTitle>
            <DialogDescription className="text-[#596556]">{error}</DialogDescription>
          </DialogHeader>
        ) : (
          <div className="space-y-3" aria-busy="true">
            <DialogTitle className="sr-only">Loading grant</DialogTitle>
            <DialogDescription className="sr-only">The grant details are loading.</DialogDescription>
            <Skeleton className="h-5 w-40 bg-[#EDF4E8]" />
            <Skeleton className="h-7 w-3/4 bg-[#EDF4E8]" />
            <Skeleton className="h-12 w-full rounded-xl bg-[#F2F6EF]" />
            <Skeleton className="h-24 w-full rounded-xl bg-[#F2F6EF]" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
