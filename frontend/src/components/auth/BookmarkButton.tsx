import { useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { BookmarkKind } from "@/types/auth";

interface BookmarkButtonProps {
  kind: BookmarkKind;
  /** Strapi documentId of the ai-tool or funding-resource. */
  documentId: string;
  /** Item name for the accessible label. */
  label: string;
  className?: string;
}

/**
 * Save / unsave toggle for tools and grants. Guests get the sign-in dialog.
 * Drop this onto any card once that module reads its items from Strapi.
 */
export function BookmarkButton({ kind, documentId, label, className }: BookmarkButtonProps) {
  const { isAuthenticated, isBookmarked, toggleBookmark, openAuthModal } = useAuth();
  const [pending, setPending] = useState(false);
  const saved = isBookmarked(kind, documentId);

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    // Cards are often links; keep the click from navigating.
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      openAuthModal("sign-in");
      return;
    }
    setPending(true);
    try {
      await toggleBookmark(kind, documentId);
      toast.success(saved ? `Removed "${label}" from your saved items.` : `Saved "${label}".`);
    } catch {
      toast.error("Couldn't update your saved items. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(saved && "text-[#6D83F2]", className)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${label} from saved items` : `Save ${label}`}
      disabled={pending}
      onClick={handleClick}
    >
      <Bookmark className="size-5" fill={saved ? "currentColor" : "none"} />
    </Button>
  );
}
