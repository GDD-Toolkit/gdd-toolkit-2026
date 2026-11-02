import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import type { UserProfile } from "@/types/auth";
import {
  countries,
  INTEREST_OPTIONS,
  languages,
  type Interest,
  type Language,
} from "@/types/onboarding";

interface Answers {
  firstName: string;
  lastName: string;
  occupation: string;
  institution: string;
  country: string;
  language: Language | null;
  interests: Interest[];
}

type TextField = Exclude<keyof Answers, "interests" | "language">;
type FieldErrors = Partial<Record<keyof Answers, string>>;

function answersFrom(user: UserProfile): Answers {
  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    occupation: user.occupation ?? "",
    institution: user.institution ?? "",
    country: user.country ?? "",
    language: user.language ?? null,
    interests: user.interests ?? [],
  };
}

function validate(values: Answers): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.firstName.trim()) errors.firstName = "First name is required.";
  if (!values.lastName.trim()) errors.lastName = "Last name is required.";
  if (!values.occupation.trim()) errors.occupation = "Occupation is required.";
  if (!values.institution.trim()) errors.institution = "Organization is required.";
  if (!values.country) errors.country = "Choose your country.";
  if (!values.language) errors.language = "Choose your preferred language.";
  if (values.interests.length === 0) errors.interests = "Pick at least one interest.";
  return errors;
}

/** Native select styled to match <Input>; Radix Select is awkward with ~200 options. */
const SELECT_CLASS =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm dark:bg-input/30";

const VARIANTS = {
  onboarding: {
    cancelLabel: "Later",
    submitLabel: "Save answers",
    successMessage: "Thanks! Your profile is complete.",
  },
  edit: {
    cancelLabel: "Cancel",
    submitLabel: "Save changes",
    successMessage: "Profile updated.",
  },
} as const;

interface ProfileFormProps {
  user: UserProfile;
  /**
   * "onboarding" asks the questions for the first time and skips the name
   * when sign-up already collected it; "edit" shows every field prefilled.
   */
  variant: keyof typeof VARIANTS;
  onCancel: () => void;
  onSaved?: () => void;
}

/**
 * The profile questions from shared/types/Users.ts, rendered inside a
 * <DialogContent>. Saves through the account API and marks onboarding
 * complete, which the server only accepts once every answer is present.
 */
export function ProfileForm({ user, variant, onCancel, onSaved }: ProfileFormProps) {
  const { updateProfile } = useAuth();
  const [values, setValues] = useState<Answers>(() => answersFrom(user));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const labels = VARIANTS[variant];
  // Email sign-up already collected the name; Google accounts arrive without one.
  const askName = variant === "edit" || !user.firstName || !user.lastName;

  function setText(field: TextField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function toggleInterest(interest: Interest, checked: boolean) {
    setValues((current) => ({
      ...current,
      interests: checked
        ? [...current.interests, interest]
        : current.interests.filter((item) => item !== interest),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setError(null);
    setSubmitting(true);
    try {
      await updateProfile({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        occupation: values.occupation.trim(),
        institution: values.institution.trim(),
        country: values.country,
        language: values.language ?? undefined,
        interests: values.interests,
        onboardingComplete: true,
      });
      toast.success(labels.successMessage);
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save your answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const textField = (
    name: TextField,
    label: string,
    props: React.ComponentProps<typeof Input> = {},
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={`${variant}-${name}`}>{label}</Label>
      <Input
        id={`${variant}-${name}`}
        value={values[name]}
        onChange={(e) => setText(name, e.target.value)}
        aria-invalid={fieldErrors[name] ? true : undefined}
        required
        {...props}
      />
      {fieldErrors[name] && <p className="text-xs text-destructive">{fieldErrors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {askName && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {textField("firstName", "First name", { autoComplete: "given-name" })}
          {textField("lastName", "Last name", { autoComplete: "family-name" })}
        </div>
      )}
      {textField("occupation", "Occupation", {
        placeholder: "e.g. Graduate student, Program officer",
      })}
      {textField("institution", "Organization", {
        autoComplete: "organization",
        placeholder: "e.g. University of Maryland",
      })}
      <div className="space-y-1.5">
        <Label htmlFor={`${variant}-country`}>Country</Label>
        <select
          id={`${variant}-country`}
          className={SELECT_CLASS}
          value={values.country}
          onChange={(e) => setText("country", e.target.value)}
          aria-invalid={fieldErrors.country ? true : undefined}
          required
        >
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {fieldErrors.country && <p className="text-xs text-destructive">{fieldErrors.country}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${variant}-language`}>Preferred language</Label>
        <select
          id={`${variant}-language`}
          className={SELECT_CLASS}
          value={values.language ?? ""}
          onChange={(e) =>
            setValues((current) => ({ ...current, language: (e.target.value || null) as Language | null }))
          }
          aria-invalid={fieldErrors.language ? true : undefined}
          required
        >
          <option value="">Select a language</option>
          {languages.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
        {fieldErrors.language && (
          <p className="text-xs text-destructive">{fieldErrors.language}</p>
        )}
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Areas of interest</legend>
        <div className="grid grid-cols-2 gap-2">
          {INTEREST_OPTIONS.map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <Checkbox
                id={`${variant}-interest-${value}`}
                checked={values.interests.includes(value)}
                onCheckedChange={(checked) => toggleInterest(value, checked === true)}
              />
              <Label htmlFor={`${variant}-interest-${value}`} className="font-normal">
                {label}
              </Label>
            </div>
          ))}
        </div>
        {fieldErrors.interests && (
          <p className="text-xs text-destructive">{fieldErrors.interests}</p>
        )}
      </fieldset>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          {labels.cancelLabel}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : labels.submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
