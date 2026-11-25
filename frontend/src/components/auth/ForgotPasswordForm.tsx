import { useState, type FormEvent } from "react";
import { MailCheck } from "lucide-react";
import { forgotPassword } from "@/api/auth";
import { EDITORIAL_SERIF_STYLE } from "@/components/editorial/EditorialPagePrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EDITORIAL_INPUT_CLASS =
  "h-10 rounded-xl border-[1.5px] border-[#B2C9A8] bg-white px-3 text-sm text-[#202B20] placeholder:text-[#596556]/65 transition-colors focus-visible:border-[#3F673C] focus-visible:ring-3 focus-visible:ring-[#3F673C]/15 aria-invalid:border-destructive";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

/**
 * Requests a password-reset email. Strapi responds the same for unknown
 * addresses, so the copy never confirms whether an account exists.
 */
export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't send the reset email. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div
        role="status"
        className="space-y-4 rounded-xl border-[1.5px] border-[#94B985] bg-[#F2F6EF] p-5 text-sm"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#94B985] bg-white text-[#187347]">
            <MailCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <p
            className="text-base font-semibold text-[#202B20]"
            style={EDITORIAL_SERIF_STYLE}
          >
            Check your email
          </p>
        </div>
        <p className="leading-relaxed text-[#394838]">
          If an account exists for{" "}
          <span className="font-semibold text-[#202B20]">{email.trim()}</span>,
          we sent a link to choose a new password.
        </p>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-full border-[1.5px] border-[#94B985] bg-white font-semibold text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8] hover:text-[#202B20]"
          onClick={onBack}
        >
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <p className="text-sm leading-relaxed text-[#596556]">
        Enter your email and we&apos;ll send you a link to choose a new
        password.
      </p>
      <div className="space-y-1.5">
        <Label
          htmlFor="forgot-email"
          className="text-xs font-semibold text-[#284B26]"
        >
          Email
        </Label>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          className={EDITORIAL_INPUT_CLASS}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        {submitting ? "Sending…" : "Send reset link"}
      </Button>
      <button
        type="button"
        className="w-full cursor-pointer text-xs font-semibold text-[#187347] underline-offset-4 transition-colors hover:text-[#105C37] hover:underline"
        onClick={onBack}
      >
        Back to sign in
      </button>
    </form>
  );
}
