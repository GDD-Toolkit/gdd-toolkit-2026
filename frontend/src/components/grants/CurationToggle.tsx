import { useState } from "react";
import { Eye, EyeOff, Star } from "lucide-react";
import { toast } from "sonner";
import type { Grant } from "@shared/types/Grants";
import type { CurationPatch, GrantDetailResponse } from "@shared/types/GrantsApi";
import { setCuration } from "@/api/grants";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface CurationToggleProps {
  grant: Pick<Grant, "id" | "title" | "curation">;
  /** Called with the updated grant after the API confirms the change. */
  onChanged?: (grant: GrantDetailResponse) => void;
  className?: string;
}

type Curation = CurationPatch["curation"];

/**
 * Hide / feature / clear buttons for site admins. Optimistic: the pressed
 * state flips at once and reverts with a toast if the API refuses.
 */
export function CurationToggle({ grant, onChanged, className }: CurationToggleProps) {
  const { role, token } = useAuth();
  const [current, setCurrent] = useState<Grant["curation"]>(grant.curation);
  const [pending, setPending] = useState(false);

  if (role !== "admin" || !token) return null;

  async function apply(next: Curation) {
    const previous = current;
    setCurrent(next);
    setPending(true);
    try {
      const updated = await setCuration(grant.id, next, token!);
      setCurrent(updated.curation);
      onChanged?.(updated);
    } catch (error) {
      setCurrent(previous);
      toast.error(error instanceof Error ? error.message : `Couldn't update "${grant.title}".`);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)} role="group" aria-label={`Curation for ${grant.title}`}>
      {/* Visible text stays short; the accessible name carries the title so five cards are not five "Hide" buttons. */}
      <Button
        type="button"
        size="xs"
        variant={current === "hidden" ? "default" : "outline"}
        aria-pressed={current === "hidden"}
        aria-label={current === "hidden" ? `Unhide ${grant.title}` : `Hide ${grant.title}`}
        disabled={pending}
        onClick={() => apply(current === "hidden" ? "auto" : "hidden")}
        className={cn(
          "cursor-pointer rounded-full",
          current === "hidden"
            ? "bg-[#394838] text-white hover:bg-[#202B20]"
            : "border-[#B2C9A8] text-[#394838] hover:border-[#3F673C] hover:bg-[#EDF4E8]",
        )}
      >
        {current === "hidden" ? <EyeOff /> : <Eye />}
        {current === "hidden" ? "Hidden" : "Hide"}
      </Button>
      <Button
        type="button"
        size="xs"
        variant={current === "featured" ? "default" : "outline"}
        aria-pressed={current === "featured"}
        aria-label={current === "featured" ? `Unfeature ${grant.title}` : `Feature ${grant.title}`}
        disabled={pending}
        onClick={() => apply(current === "featured" ? "auto" : "featured")}
        className={cn(
          "cursor-pointer rounded-full",
          current === "featured"
            ? "bg-[#3F673C] text-[#E9E6B2] hover:bg-[#284B26]"
            : "border-[#B2C9A8] text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8]",
        )}
      >
        <Star />
        {current === "featured" ? "Featured" : "Feature"}
      </Button>
      {current !== "auto" && (
        <Button
          type="button"
          size="xs"
          variant="ghost"
          aria-label={`Clear curation for ${grant.title}`}
          disabled={pending}
          onClick={() => apply("auto")}
          className="cursor-pointer rounded-full text-[#596556] hover:bg-[#EDF4E8] hover:text-[#202B20]"
        >
          Clear
        </Button>
      )}
    </div>
  );
}
