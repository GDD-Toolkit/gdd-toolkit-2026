import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { exchangeProviderToken, RETURN_TO_KEY } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";

/**
 * OAuth landing route (/auth/callback/:provider). Strapi redirects here with
 * ?access_token=<provider token>; we exchange it for a Strapi JWT and continue.
 */
export default function AuthCallback() {
  const { provider = "google" } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const accessToken = searchParams.get("access_token");
    if (!accessToken) {
      setError(
        searchParams.get("error_description") ??
          searchParams.get("error") ??
          "The sign-in provider did not return a token.",
      );
      return;
    }

    (async () => {
      try {
        const { jwt } = await exchangeProviderToken(provider, accessToken);
        await loginWithToken(jwt);

        let returnTo = "/";
        try {
          returnTo = sessionStorage.getItem(RETURN_TO_KEY) || "/";
          sessionStorage.removeItem(RETURN_TO_KEY);
        } catch {
          // Session storage unavailable; go home.
        }
        navigate(returnTo, { replace: true });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
      }
    })();
  }, [provider, searchParams, loginWithToken, navigate]);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      {error ? (
        <>
          <h1 className="text-xl font-semibold">Sign in didn't complete</h1>
          <p role="alert" className="mt-2 text-sm text-destructive">
            {error}
          </p>
          <Link to="/" className="mt-6 inline-block text-sm underline underline-offset-4">
            Back to home
          </Link>
        </>
      ) : (
        <p aria-busy="true" className="text-muted-foreground">
          Signing you in…
        </p>
      )}
    </div>
  );
}
