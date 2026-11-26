import type { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { EDITORIAL_SERIF_STYLE } from "@/components/editorial/EditorialPagePrimitives";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import type { SiteRole } from "@/types/auth";

interface ProtectedRouteProps {
  /** Site roles allowed in; omit to allow any signed-in user. */
  allowedRoles?: SiteRole[];
  children: ReactNode;
}

function LoadingNotice() {
  return (
    <div
      className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center bg-[#F2F6EF] px-4 py-16"
      aria-busy="true"
    >
      <div className="w-full max-w-2xl space-y-4 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-8 shadow-xs">
        <Skeleton className="h-4 w-28 bg-[#EDF4E8]" />
        <Skeleton className="h-8 w-1/2 bg-[#EDF4E8]" />
        <Skeleton className="h-4 w-3/4 bg-[#F2F6EF]" />
        <Skeleton className="h-4 w-2/3 bg-[#F2F6EF]" />
      </div>
    </div>
  );
}

function UnauthorizedNotice({ requiredRoles }: { requiredRoles: SiteRole[] }) {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center bg-[#F2F6EF] px-4 py-16 sm:py-24">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white shadow-md">
        <div
          aria-hidden="true"
          className="h-1.5 w-full bg-gradient-to-r from-[#3F673C] via-[#187347] to-[#94B985]"
        />
        <div className="px-6 py-9 text-center sm:px-8">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
            GDD Toolkit · Access Restricted
          </p>
          <div className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#D6CE8A] bg-[#FAF8E4] text-[#6F6057]">
            <ShieldAlert className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1
            className="mt-4 text-2xl font-semibold text-[#202B20]"
            style={EDITORIAL_SERIF_STYLE}
          >
            You don&apos;t have access to this page
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-[#596556]">
            This page is limited to {requiredRoles.join(" or ")} accounts. Ask
            an administrator if you think your role should be upgraded.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#94B985] bg-white px-5 py-2.5 text-sm font-semibold text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Route guard. Guests are sent home with the sign-in dialog open; signed-in
 * users outside allowedRoles see an explanation instead of the page.
 */
export function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingNotice />;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{ openAuthModal: true, from: location.pathname }}
      />
    );
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <UnauthorizedNotice requiredRoles={allowedRoles} />;
  }

  return <>{children}</>;
}
