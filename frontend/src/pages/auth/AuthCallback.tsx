import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { exchangeProviderToken, RETURN_TO_KEY } from "@/api/auth";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
} from "@/components/editorial/EditorialPagePrimitives";
import { useAuth } from "@/hooks/useAuth";

/**
 * OAuth landing route (/auth/callback/:provider). Strapi redirects here after the
 * provider sign-in (with ?error= on failure); we exchange it for a Strapi JWT and continue.
 */
export default function AuthCallback() {
  const { provider = "google" } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const providerError =
      searchParams.get("error_description") ?? searchParams.get("error");
    if (providerError) {
      setError(providerError);
      return;
    }
    // Older Strapi versions send ?access_token=; newer ones keep it in the session cookie.
    const accessToken = searchParams.get("access_token");

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
        setError(
          err instanceof Error
            ? err.message
            : "Sign in failed. Please try again.",
        );
      }
    })();
  }, [provider, searchParams, loginWithToken, navigate]);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center bg-[#F2F6EF] px-4 py-16 sm:py-24">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EDITORIAL_EASE }}
        className="w-full max-w-md overflow-hidden rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white shadow-md"
      >
        <div
          aria-hidden="true"
          className="h-1.5 w-full bg-gradient-to-r from-[#3F673C] via-[#187347] to-[#94B985]"
        />
        <div className="px-6 py-9 text-center sm:px-8">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
            GDD Toolkit · Account Access
          </p>

          {error ? (
            <>
              <div className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
                <AlertCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <h1
                className="mt-4 text-2xl font-semibold text-[#202B20]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Sign in didn&apos;t complete
              </h1>
              <p
                role="alert"
                className="mt-3 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#94B985] bg-white px-5 py-2.5 text-sm font-semibold text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to home
              </Link>
            </>
          ) : (
            <div aria-busy="true" className="mt-5 flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#94B985] bg-[#EDF4E8] text-[#187347]">
                <Loader2
                  className={reduced ? "h-5 w-5" : "h-5 w-5 animate-spin"}
                  aria-hidden="true"
                />
              </div>
              <h1
                className="mt-4 text-2xl font-semibold text-[#202B20]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Signing you in…
              </h1>
              <p className="mt-2 text-sm text-[#596556]">
                Completing secure sign-in with{" "}
                <span className="font-medium capitalize text-[#284B26]">
                  {provider}
                </span>
                .
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
