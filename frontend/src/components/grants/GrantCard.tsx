import { ExternalLink } from "lucide-react";
import type { Grant } from "@shared/types/Grants";
import type { GrantDetailResponse, SourceSummary } from "@shared/types/GrantsApi";
import { BookmarkButton } from "@/components/auth/BookmarkButton";
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
  return (
    <Card
      className={cn(
        "gap-3 py-4",
        grant.curation === "featured" && "border-[#6D83F2]/50 shadow-[0_0_0_1px_#6D83F2]/20",
        grant.curation === "hidden" && "opacity-70",
      )}
    >
      <CardHeader className="gap-2 px-4">
        <div className="flex flex-wrap items-center gap-2">
          <DeadlineBadge grant={grant} />
          <SourceBadge sourceId={grant.source_id} sources={sources} lastVerifiedAt={grant.last_verified_at} />
          {grant.curation === "featured" && <Badge className="bg-[#4B5FD9] text-white">Featured</Badge>}
          {grant.curation === "hidden" && <Badge variant="secondary">Hidden</Badge>}
          <BookmarkButton kind="grants" itemId={grant.id} label={grant.title} className="ml-auto -my-1" />
        </div>
        <h3 className="text-base leading-snug font-semibold">
          <button
            type="button"
            onClick={() => onOpen(grant)}
            className="text-left underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
          >
            {grant.title}
          </button>
        </h3>
        <p className="text-sm text-muted-foreground">
          {grant.funder && <span>{grant.funder} · </span>}
          <span>{FUNDING_TYPE_LABELS[grant.funding_type]}</span>
          <span> · </span>
          <span className="font-medium text-foreground">
            {formatAmountRange(grant.amount_min, grant.amount_max, grant.currency, true)}
          </span>
        </p>
      </CardHeader>
      <CardContent className="space-y-3 px-4">
        {grant.summary && <p className="line-clamp-3 text-sm">{grant.summary}</p>}
        <AlignmentChips grant={grant} />
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-2 px-4">
        <a
          href={applyHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: "sm" }), "bg-[#4B5FD9] text-white hover:bg-[#3F52C8]")}
        >
          Apply
          <ExternalLink aria-hidden="true" />
          <span className="sr-only">(opens the funder's page in a new tab)</span>
        </a>
        <button
          type="button"
          onClick={() => onOpen(grant)}
          className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
        >
          Details
        </button>
        <CurationToggle grant={grant} onChanged={onCurationChanged} className="ml-auto" />
      </CardFooter>
    </Card>
  );
}
