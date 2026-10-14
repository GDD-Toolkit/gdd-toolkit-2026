import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import type { RegisterPayload } from "@/types/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

type FieldErrors = Partial<Record<keyof RegisterPayload, string>>;

function validate(values: RegisterPayload): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.firstName.trim()) errors.firstName = "First name is required.";
  if (!values.lastName.trim()) errors.lastName = "Last name is required.";
  if (!values.institution.trim()) errors.institution = "Institution is required.";
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Enter a valid email address.";
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
      setError(err instanceof Error ? err.message : "Sign up failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmationSent) {
    return (
      <div role="status" className="space-y-2 text-sm">
        <p className="font-medium">Check your email</p>
        <p className="text-muted-foreground">
          We sent a confirmation link to <span className="font-medium">{values.email}</span>.
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
      <Label htmlFor={`register-${name}`}>{label}</Label>
      <Input
        id={`register-${name}`}
        value={values[name]}
        onChange={update(name)}
        aria-invalid={fieldErrors[name] ? true : undefined}
        required
        {...props}
      />
      {fieldErrors[name] && <p className="text-xs text-destructive">{fieldErrors[name]}</p>}
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
      {field("password", "Password", { type: "password", autoComplete: "new-password" })}
      <p className="text-xs text-muted-foreground">
        New accounts start with the Student role. An administrator can upgrade you to Researcher.
      </p>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
