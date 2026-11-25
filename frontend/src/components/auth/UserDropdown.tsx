import { Link } from "react-router-dom";
import { LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";
import { strapiMediaUrl } from "@/api/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { displayNameOf, type UserProfile } from "@/types/auth";

function initialsOf(user: UserProfile): string {
  const first = user.firstName?.[0] ?? user.username?.[0] ?? "?";
  const last = user.lastName?.[0] ?? "";
  return `${first}${last}`.toUpperCase();
}

interface UserDropdownProps {
  /** Always show the name next to the avatar (used in the mobile drawer). */
  showName?: boolean;
  /** "dark" adapts the trigger pill for dark navigation bars. */
  tone?: "light" | "dark";
}

export function UserDropdown({
  showName = false,
  tone = "light",
}: UserDropdownProps) {
  const { user, logout } = useAuth();
  if (!user) return null;

  const name = displayNameOf(user);
  const roleName = user.role?.name ?? "Member";
  const isDark = tone === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-10 gap-2 rounded-full pl-1 pr-3",
            isDark &&
              "border-white/15 bg-[#12141C] text-slate-100 hover:border-[#A07CFF]/50 hover:bg-[#1B1E2B] hover:text-white",
          )}
          aria-label={`Account menu for ${name}`}
        >
          <Avatar>
            {user.avatar?.url && (
              <AvatarImage src={strapiMediaUrl(user.avatar.url)} alt="" />
            )}
            <AvatarFallback>{initialsOf(user)}</AvatarFallback>
          </Avatar>
          <span className={cn("max-w-40 truncate text-sm", showName ? "inline" : "hidden md:inline")}>
            {name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="space-y-1">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
          <Badge variant="secondary" className="mt-1">
            {roleName}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/account">
            <UserRound />
            My account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            logout();
            toast.success("Signed out.");
          }}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
