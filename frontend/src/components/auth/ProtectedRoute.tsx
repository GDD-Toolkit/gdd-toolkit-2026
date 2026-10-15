import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
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
    <div className="mx-auto max-w-3xl space-y-3 px-4 py-16" aria-busy="true">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

function UnauthorizedNotice({ requiredRoles }: { requiredRoles: SiteRole[] }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">You don't have access to this page</h1>
      <p className="mt-2 text-muted-foreground">
        This page is limited to {requiredRoles.join(" or ")} accounts. Ask an administrator if
        you think your role should be upgraded.
      </p>
    </div>
  );
}

/**
 * Route guard. Guests are sent home with the sign-in dialog open; signed-in
 * users outside allowedRoles see an explanation instead of the page.
 */
export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingNotice />;

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ openAuthModal: true, from: location.pathname }} />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <UnauthorizedNotice requiredRoles={allowedRoles} />;
  }

  return <>{children}</>;
}
