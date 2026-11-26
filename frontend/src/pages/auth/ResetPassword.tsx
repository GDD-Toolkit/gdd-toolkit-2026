import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { resetPassword } from "@/api/auth";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
} from "@/components/editorial/EditorialPagePrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const MIN_PASSWORD_LENGTH = 8;

const EDITORIAL_INPUT_CLASS =
  "h-10 rounded-xl border-[1.5px] border-[#B2C9A8] bg-white px-3 text-sm text-[#202B20] placeholder:text-[#596556]/65 transition-colors focus-visible:border-[#3F673C] focus-visible:ring-3 focus-visible:ring-[#3F673C]/15 aria-invalid:border-destructive";

/** Landing route for the password-reset email (/auth/reset-password?code=…). */
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();
  const { loginWithToken, openAuthModal } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const reduced = useReducedMotion();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!code) return;
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmation) {
      setError("Passwords don't match.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const { jwt } = await resetPassword(code, password, confirmation);
      await loginWithToken(jwt);
      toast.success("Password updated. You're signed in.");
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't reset your password. The link may have expired.",
      );
    } finally {
      setSubmitting(false);
    }
  }

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

        {!code ? (
          <div className="px-6 py-9 text-center sm:px-8">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
              GDD Toolkit · Password Recovery
            </p>
            <div className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#D6CE8A] bg-[#FAF8E4] text-[#6F6057]">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
            <h1
              className="mt-4 text-2xl font-semibold text-[#202B20]"
              style={EDITORIAL_SERIF_STYLE}
            >
              This reset link is incomplete
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-[#596556]">
              Open the link from your email again, or request a new one from the
              sign-in dialog.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button
                className="h-10 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-6 font-semibold text-white hover:brightness-110"
                onClick={() => openAuthModal("sign-in")}
              >
                Sign in
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                className="h-10 rounded-full border-[1.5px] border-[#94B985] bg-white px-6 font-semibold text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8] hover:text-[#202B20]"
                render={<Link to="/" />}
              >
                Back to home
              </Button>
            </div>
          </div>
        ) : (
          <div className="px-6 py-8 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#94B985] bg-[#EDF4E8] text-[#187347]">
                <KeyRound className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                  Password Recovery
                </p>
                <h1
                  className="text-2xl font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  Choose a new password
                </h1>
              </div>
            </div>

            <p className="mt-3 text-sm text-[#596556]">
              Use at least {MIN_PASSWORD_LENGTH} characters to secure your
              account.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label
                  htmlFor="reset-password"
                  className="text-xs font-semibold text-[#284B26]"
                >
                  New password
                </Label>
                <Input
                  id="reset-password"
                  type="password"
                  autoComplete="new-password"
                  className={EDITORIAL_INPUT_CLASS}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="reset-confirmation"
                  className="text-xs font-semibold text-[#284B26]"
                >
                  Confirm new password
                </Label>
                <Input
                  id="reset-confirmation"
                  type="password"
                  autoComplete="new-password"
                  className={EDITORIAL_INPUT_CLASS}
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  required
                />
              </div>
              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-destructive/25 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive"
                >
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="h-10 w-full rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] font-semibold text-white shadow-xs hover:brightness-110"
                disabled={submitting}
              >
                {submitting ? "Updating…" : "Update password"}
              </Button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
