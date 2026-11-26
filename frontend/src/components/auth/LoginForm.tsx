import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { displayNameOf } from "@/types/auth";

interface LoginFormProps {
  /** Switches the dialog to the password-reset form. */
  onForgotPassword: () => void;
}

const EDITORIAL_INPUT_CLASS =
  "h-10 rounded-xl border-[1.5px] border-[#B2C9A8] bg-white px-3 text-sm text-[#202B20] placeholder:text-[#596556]/65 transition-colors focus-visible:border-[#3F673C] focus-visible:ring-3 focus-visible:ring-[#3F673C]/15 aria-invalid:border-destructive";

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const profile = await login(
        { identifier: identifier.trim(), password },
        { remember },
      );
      toast.success(`Signed in as ${displayNameOf(profile)}.`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Sign in failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label
          htmlFor="login-identifier"
          className="text-xs font-semibold text-[#284B26]"
        >
          Email
        </Label>
        <Input
          id="login-identifier"
          type="email"
          autoComplete="username"
          className={EDITORIAL_INPUT_CLASS}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label
          htmlFor="login-password"
          className="text-xs font-semibold text-[#284B26]"
        >
          Password
        </Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          className={EDITORIAL_INPUT_CLASS}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="login-remember"
            checked={remember}
            onCheckedChange={(checked) => setRemember(checked === true)}
            className="border-[#94B985] data-[state=checked]:border-[#187347] data-[state=checked]:bg-[#187347] data-checked:border-[#187347] data-checked:bg-[#187347]"
          />
          <Label
            htmlFor="login-remember"
            className="cursor-pointer text-sm font-normal text-[#394838]"
          >
            Remember me
          </Label>
        </div>
        <button
          type="button"
          className="cursor-pointer text-xs font-semibold text-[#187347] underline-offset-4 transition-colors hover:text-[#105C37] hover:underline"
          onClick={onForgotPassword}
        >
          Forgot password?
        </button>
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
        {submitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
