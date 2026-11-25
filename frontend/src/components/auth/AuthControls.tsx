import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { UserDropdown } from "./UserDropdown";

interface AuthControlsProps {
  /** "stacked" renders full-width buttons for the mobile drawer. */
  layout?: "inline" | "stacked";
  /** "dark" adapts button surfaces for the dark obsidian homepage navbar. */
  tone?: "light" | "dark";
}

/** Header auth controls: Sign in / Sign up for guests, the user menu when signed in. */
export function AuthControls({
  layout = "inline",
  tone = "light",
}: AuthControlsProps) {
  const { status, openAuthModal } = useAuth();
  const stacked = layout === "stacked";
  const isDark = tone === "dark";

  if (status === "loading") {
    return (
      <Skeleton
        className={cn(
          "h-10 rounded-full",
          isDark && "bg-white/10",
          stacked ? "w-full" : "w-28",
        )}
      />
    );
  }

  if (status === "authenticated") {
    return (
      <div className={cn(stacked && "flex justify-start")}>
        <UserDropdown showName={stacked} tone={tone} />
      </div>
    );
  }

  return (
    <div className={cn("flex gap-2", stacked ? "flex-col" : "items-center")}>
      <Button
        variant="outline"
        className={cn(
          "h-10 px-5",
          isDark
            ? "rounded-full border-white/15 bg-[#12141C] text-slate-200 hover:border-[#A07CFF]/50 hover:bg-[#1B1E2B] hover:text-white"
            : "rounded-lg",
          stacked && "w-full",
        )}
        onClick={() => openAuthModal("sign-in")}
      >
        Sign in
      </Button>
      <Button
        className={cn(
          "h-10 bg-gradient-to-r from-[#A07CFF] to-[#6D83F2] px-5 text-white hover:opacity-90",
          isDark ? "rounded-full" : "rounded-lg",
          stacked && "w-full",
        )}
        onClick={() => openAuthModal("sign-up")}
      >
        Sign up
      </Button>
    </div>
  );
}
