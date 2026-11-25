import { useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { BookmarkKind } from "@/types/auth";

interface BookmarkButtonProps {
  kind: BookmarkKind;
  /** Strapi documentId of the ai-tool, or the grant uuid from the grants API. */
  itemId: string;
  /** Item name for the accessible label. */
  label: string;
  className?: string;
}

/**
 * Save / unsave toggle for tools and grants. Guests get the sign-in dialog.
 * The saved list lives on the server profile, so it follows the account.
 */
export function BookmarkButton({
  kind,
  itemId,
  label,
  className,
}: BookmarkButtonProps) {
  const { isAuthenticated, isBookmarked, toggleBookmark, openAuthModal } =
    useAuth();
  const [pending, setPending] = useState(false);
  const saved = isBookmarked(kind, itemId);

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
      await toggleBookmark(kind, itemId);
      toast.success(
        saved
          ? `Removed "${label}" from your saved items.`
          : `Saved "${label}".`,
      );
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
      className={cn(
        "cursor-pointer rounded-full border transition-all duration-200 active:scale-95",
        saved
          ? "border-[#94B985] bg-[#EDF4E8] text-[#187347] hover:border-[#3F673C] hover:bg-[#E1EFE0] hover:text-[#105C37]"
          : "border-transparent text-[#596556] hover:border-[#B2C9A8] hover:bg-[#F2F6EF] hover:text-[#284B26]",
        className,
      )}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${label} from saved items` : `Save ${label}`}
      disabled={pending}
      onClick={handleClick}
    >
      <Bookmark
        className="size-4.5 transition-transform duration-200"
        fill={saved ? "currentColor" : "none"}
      />
    </Button>
  );
}
