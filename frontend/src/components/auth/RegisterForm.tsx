import { useState, type FormEvent } from "react";
import { MailCheck } from "lucide-react";
import { EDITORIAL_SERIF_STYLE } from "@/components/editorial/EditorialPagePrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import type { RegisterPayload } from "@/types/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

const EDITORIAL_INPUT_CLASS =
  "h-10 rounded-xl border-[1.5px] border-[#B2C9A8] bg-white px-3 text-sm text-[#202B20] placeholder:text-[#596556]/65 transition-colors focus-visible:border-[#3F673C] focus-visible:ring-3 focus-visible:ring-[#3F673C]/15 aria-invalid:border-destructive";

type FieldErrors = Partial<Record<keyof RegisterPayload, string>>;

function validate(values: RegisterPayload): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.firstName.trim()) errors.firstName = "First name is required.";
  if (!values.lastName.trim()) errors.lastName = "Last name is required.";
  if (!values.institution.trim())
    errors.institution = "Institution is required.";
  if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = "Enter a valid email address.";
  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return errors;
}

const EMPTY: RegisterPayload = {
  firstName: "",
  lastName: "",
  email: "",
  institution: "",
  password: "",
};

export function RegisterForm() {
  const { register } = useAuth();
  const [values, setValues] = useState<RegisterPayload>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  function update(field: keyof RegisterPayload) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((current) => ({ ...current, [field]: event.target.value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setError(null);
    setSubmitting(true);
    try {
      const result = await register(values);
      if (result === "confirmation-required") setConfirmationSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Sign up failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmationSent) {
    return (
      <div
        role="status"
        className="space-y-3 rounded-xl border-[1.5px] border-[#94B985] bg-[#F2F6EF] p-5 text-sm"
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
          We sent a confirmation link to{" "}
          <span className="font-semibold text-[#202B20]">{values.email}</span>.
          Open it to activate your account, then sign in.
        </p>
      </div>
    );
  }

  const field = (
    name: keyof RegisterPayload,
    label: string,
    props: React.ComponentProps<typeof Input> = {},
  ) => (
    <div className="space-y-1.5">
      <Label
        htmlFor={`register-${name}`}
        className="text-xs font-semibold text-[#284B26]"
      >
        {label}
      </Label>
      <Input
        id={`register-${name}`}
        value={values[name]}
        onChange={update(name)}
        aria-invalid={fieldErrors[name] ? true : undefined}
        className={EDITORIAL_INPUT_CLASS}
        required
        {...props}
      />
      {fieldErrors[name] && (
        <p className="text-xs text-destructive">{fieldErrors[name]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field("firstName", "First name", { autoComplete: "given-name" })}
        {field("lastName", "Last name", { autoComplete: "family-name" })}
      </div>
      {field("email", "Email", { type: "email", autoComplete: "email" })}
      {field("institution", "Institution", {
        autoComplete: "organization",
        placeholder: "e.g. University of Maryland",
      })}
      {field("password", "Password", {
        type: "password",
        autoComplete: "new-password",
      })}
      <p className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] px-3.5 py-2.5 text-xs leading-relaxed text-[#394838]">
        New accounts start with the Student role. An administrator can upgrade
        you to Researcher.
      </p>
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
        {submitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
