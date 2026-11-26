import type { SourceSummary } from "@shared/types/GrantsApi";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate, sourceName } from "./format";

interface SourceBadgeProps {
  sourceId: string;
  sources: SourceSummary[];
  /** The worker's last_verified_at for this grant. */
  lastVerifiedAt: string;
  className?: string;
}

/** Provenance: where the row came from and when the worker last checked it. */
export function SourceBadge({ sourceId, sources, lastVerifiedAt, className }: SourceBadgeProps) {
  return (
    <Badge variant="outline" className={cn("h-6 px-2 font-normal text-muted-foreground", className)}>
      {sourceName(sourceId, sources)} · verified {formatDate(lastVerifiedAt)}
    </Badge>
  );
}
