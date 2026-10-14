import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { UserDropdown } from "./UserDropdown";

interface AuthControlsProps {
  /** "stacked" renders full-width buttons for the mobile drawer. */
  layout?: "inline" | "stacked";
}

/** Header auth controls: Sign in / Sign up for guests, the user menu when signed in. */
export function AuthControls({ layout = "inline" }: AuthControlsProps) {
  const { status, openAuthModal } = useAuth();
  const stacked = layout === "stacked";

  if (status === "loading") {
    return <Skeleton className={cn("h-10 rounded-full", stacked ? "w-full" : "w-28")} />;
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
        className={cn("h-10 rounded-lg px-5", stacked && "w-full")}
        onClick={() => openAuthModal("sign-in")}
      >
        Sign in
      </Button>
      <Button
        className={cn(
          "h-10 rounded-lg px-5 bg-gradient-to-r from-[#A07CFF] to-[#6D83F2] text-white hover:opacity-90",
          stacked && "w-full",
        )}
        onClick={() => openAuthModal("sign-up")}
      >
        Sign up
      </Button>
    </div>
  );
}
