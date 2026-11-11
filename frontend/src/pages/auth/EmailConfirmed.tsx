import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

/** Landing route for Strapi's email-confirmation redirect (/auth/confirmed). */
export default function EmailConfirmed() {
  const { openAuthModal, isAuthenticated } = useAuth();

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Email confirmed</h1>
      <p className="mt-2 text-muted-foreground">
        Your account is active.{" "}
        {isAuthenticated ? "You're signed in." : "You can sign in now."}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        {!isAuthenticated && (
          <Button onClick={() => openAuthModal("sign-in")}>Sign in</Button>
        )}
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
