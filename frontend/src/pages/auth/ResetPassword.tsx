import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { resetPassword } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const MIN_PASSWORD_LENGTH = 8;

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

  if (!code) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-xl font-semibold">This reset link is incomplete</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Open the link from your email again, or request a new one from the sign-in dialog.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => openAuthModal("sign-in")}>Sign in</Button>
          <Button variant="outline" asChild>
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <h1 className="text-2xl font-semibold">Choose a new password</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="reset-password">New password</Label>
          <Input
            id="reset-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reset-confirmation">Confirm new password</Label>
          <Input
            id="reset-confirmation"
            type="password"
            autoComplete="new-password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            required
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
