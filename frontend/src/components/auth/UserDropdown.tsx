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
}

export function UserDropdown({ showName = false }: UserDropdownProps) {
  const { user, logout } = useAuth();
  if (!user) return null;

  const name = displayNameOf(user);
  const roleName = user.role?.name ?? "Member";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-10 cursor-pointer gap-2 rounded-full border-[1.5px] border-[#94B985] bg-white pl-1 pr-3.5 text-[#202B20] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8] hover:text-[#202B20]"
          aria-label={`Account menu for ${name}`}
        >
          <Avatar className="size-8 border border-[#B2C9A8]">
            {user.avatar?.url && (
              <AvatarImage src={strapiMediaUrl(user.avatar.url)} alt="" />
            )}
            <AvatarFallback className="bg-gradient-to-br from-[#3F673C] to-[#187347] text-xs font-semibold text-white">
              {initialsOf(user)}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "max-w-40 truncate text-sm font-medium text-[#202B20]",
              showName ? "inline" : "hidden md:inline",
            )}
          >
            {name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-1.5 shadow-lg"
      >
        <DropdownMenuLabel className="space-y-1 rounded-xl bg-[#F2F6EF] px-3 py-2.5">
          <p className="truncate text-sm font-semibold text-[#202B20]">
            {name}
          </p>
          <p className="truncate text-xs font-normal text-[#596556]">
            {user.email}
          </p>
          <Badge
            variant="secondary"
            className="mt-1 rounded-full border border-[#94B985] bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#284B26]"
          >
            {roleName}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1.5 bg-[#E3EBDE]" />
        <DropdownMenuItem
          asChild
          className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-[#202B20] focus:bg-[#EDF4E8] focus:text-[#187347]"
        >
          <Link to="/account">
            <UserRound className="text-[#3F673C]" />
            My account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1.5 bg-[#E3EBDE]" />
        <DropdownMenuItem
          className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-[#394838] focus:bg-[#FAF8E4] focus:text-[#202B20]"
          onSelect={() => {
            logout();
            toast.success("Signed out.");
          }}
        >
          <LogOut className="text-[#596556]" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
