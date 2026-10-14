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
        Your account is active. {isAuthenticated ? "You're signed in." : "You can sign in now."}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        {!isAuthenticated && <Button onClick={() => openAuthModal("sign-in")}>Sign in</Button>}
        <Button variant="outline" asChild>
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
