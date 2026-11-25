import { ArrowUpRight, ExternalLink, Sparkles } from "lucide-react";
import type { Grant } from "@shared/types/Grants";
import type { GrantDetailResponse, SourceSummary } from "@shared/types/GrantsApi";
import { BookmarkButton } from "@/components/auth/BookmarkButton";
import { EDITORIAL_SERIF_STYLE } from "@/components/editorial/EditorialPagePrimitives";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlignmentChips } from "./AlignmentChips";
import { CurationToggle } from "./CurationToggle";
import { DeadlineBadge } from "./DeadlineBadge";
import { FUNDING_TYPE_LABELS, formatAmountRange } from "./format";
import { SourceBadge } from "./SourceBadge";

interface GrantCardProps {
  grant: Grant;
  sources: SourceSummary[];
  onOpen: (grant: Grant) => void;
  onCurationChanged?: (grant: GrantDetailResponse) => void;
}

export function GrantCard({ grant, sources, onOpen, onCurationChanged }: GrantCardProps) {
  const applyHref = grant.apply_url ?? grant.url;
  const isFeatured = grant.curation === "featured";
  const isHidden = grant.curation === "hidden";

  return (
    <Card
      className={cn(
        "group gap-3.5 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white py-5 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3F673C] hover:bg-[#FAFDF8] hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        isFeatured && "border-[#3F673C] bg-[#FAFDF8] ring-1 ring-[#3F673C]/15",
        isHidden && "border-dashed border-[#B2C9A8] opacity-70",
      )}
    >
      <CardHeader className="gap-2.5 px-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <DeadlineBadge grant={grant} />
          <SourceBadge sourceId={grant.source_id} sources={sources} lastVerifiedAt={grant.last_verified_at} />
          {isFeatured && (
            <Badge className="h-6 gap-1 rounded-full border border-[#9AB887] bg-[#3F673C] px-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#E9E6B2]">
              <Sparkles className="size-3" aria-hidden="true" />
              Featured
            </Badge>
          )}
          {isHidden && (
            <Badge
              variant="secondary"
              className="h-6 rounded-full border border-[#D5E3D9] bg-[#F2F6EF] px-2.5 font-mono text-[10px] uppercase tracking-wider text-[#596556]"
            >
              Hidden
            </Badge>
          )}
          <BookmarkButton kind="grants" itemId={grant.id} label={grant.title} className="ml-auto -my-1" />
        </div>

        <h3
          className="text-lg leading-snug font-semibold text-[#202B20] sm:text-xl"
          style={EDITORIAL_SERIF_STYLE}
        >
          <button
            type="button"
            onClick={() => onOpen(grant)}
            className="cursor-pointer text-left text-[#202B20] underline-offset-4 transition-colors hover:text-[#187347] hover:underline focus-visible:text-[#187347] focus-visible:underline focus-visible:outline-none"
          >
            {grant.title}
          </button>
        </h3>

        <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-[#596556]">
          {grant.funder && (
            <>
              <span className="font-medium text-[#284B26]">{grant.funder}</span>
              <span aria-hidden="true">·</span>
            </>
          )}
          <span>{FUNDING_TYPE_LABELS[grant.funding_type]}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center rounded-md bg-[#F2F6EF] px-2 py-0.5 font-mono text-xs font-semibold text-[#187347]">
            {formatAmountRange(grant.amount_min, grant.amount_max, grant.currency, true)}
          </span>
        </p>
      </CardHeader>

      <CardContent className="space-y-3.5 px-5 sm:px-6">
        {grant.summary && <p className="line-clamp-3 text-sm leading-relaxed text-[#394838]">{grant.summary}</p>}
        <AlignmentChips grant={grant} />
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-2.5 border-t border-[#E3EBDE]/80 px-5 pt-3.5 sm:px-6">
        <a
          href={applyHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ size: "sm" }),
            "rounded-full bg-[#187347] px-4 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#105C37]",
          )}
        >
          Apply
          <ExternalLink className="size-3.5" aria-hidden="true" />
          <span className="sr-only">(opens the funder's page in a new tab)</span>
        </a>
        <button
          type="button"
          onClick={() => onOpen(grant)}
          className={cn(
            buttonVariants({ size: "sm", variant: "outline" }),
            "cursor-pointer rounded-full border-[1.5px] border-[#B2C9A8] bg-white px-4 text-xs font-medium text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8]",
          )}
        >
          Details
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </button>
        <CurationToggle grant={grant} onChanged={onCurationChanged} className="ml-auto" />
      </CardFooter>
    </Card>
  );
}
