import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { UserDropdown } from "./UserDropdown";

interface AuthControlsProps {
  /** "stacked" renders full-width buttons for the mobile drawer. */
  layout?: "inline" | "stacked";
  /** "forest" adapts buttons to the green-outlined editorial theme. */
  tone?: "default" | "forest";
}

/** Header auth controls: Sign in / Sign up for guests, the user menu when signed in. */
export function AuthControls({
  layout = "inline",
  tone = "default",
}: AuthControlsProps) {
  const { status, openAuthModal } = useAuth();
  const stacked = layout === "stacked";
  const isForest = tone === "forest";

  if (status === "loading") {
    return (
      <Skeleton
        className={cn("h-10 rounded-full", stacked ? "w-full" : "w-28")}
      />
    );
  }

  if (status === "authenticated") {
    return (
      <div className={cn(stacked && "flex justify-start")}>
        <UserDropdown showName={stacked} />
      </div>
    );
  }

  return (
    <div className={cn("flex gap-2", stacked ? "flex-col" : "items-center")}>
      <Button
        variant="outline"
        className={cn(
          "h-10 px-5",
          isForest
            ? "rounded-full border-[#94B985] bg-white text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8] hover:text-[#202B20]"
            : "rounded-lg",
          stacked && "w-full",
        )}
        onClick={() => openAuthModal("sign-in")}
      >
        Sign in
      </Button>
      <Button
        className={cn(
          "h-10 px-5 text-white hover:opacity-95",
          isForest
            ? "rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] hover:brightness-110"
            : "rounded-lg bg-gradient-to-r from-[#A07CFF] to-[#6D83F2]",
          stacked && "w-full",
        )}
        onClick={() => openAuthModal("sign-up")}
      >
        Sign up
      </Button>
    </div>
  );
}
