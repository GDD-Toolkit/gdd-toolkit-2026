import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
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
  if (!values.institution.trim())
    errors.institution = "Organization is required.";
  if (!values.country) errors.country = "Choose your country.";
  if (!values.language) errors.language = "Choose your preferred language.";
  if (values.interests.length === 0)
    errors.interests = "Pick at least one interest.";
  return errors;
}

const EDITORIAL_INPUT_CLASS =
  "h-10 rounded-xl border-[1.5px] border-[#B2C9A8] bg-white px-3 text-sm text-[#202B20] placeholder:text-[#596556]/65 transition-colors focus-visible:border-[#3F673C] focus-visible:ring-3 focus-visible:ring-[#3F673C]/15 aria-invalid:border-destructive";

/** Native select styled to match <Input>; Radix Select is awkward with ~200 options. */
const SELECT_CLASS =
  "h-10 w-full rounded-xl border-[1.5px] border-[#B2C9A8] bg-white px-3 py-1 text-base text-[#202B20] transition-colors outline-none focus-visible:border-[#3F673C] focus-visible:ring-3 focus-visible:ring-[#3F673C]/15 aria-invalid:border-destructive md:text-sm";

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
export function ProfileForm({
  user,
  variant,
  onCancel,
  onSaved,
}: ProfileFormProps) {
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
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't save your answers. Please try again.",
      );
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
      <Label
        htmlFor={`${variant}-${name}`}
        className="text-xs font-semibold text-[#284B26]"
      >
        {label}
      </Label>
      <Input
        id={`${variant}-${name}`}
        value={values[name]}
        onChange={(e) => setText(name, e.target.value)}
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label
            htmlFor={`${variant}-country`}
            className="text-xs font-semibold text-[#284B26]"
          >
            Country
          </Label>
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
          {fieldErrors.country && (
            <p className="text-xs text-destructive">{fieldErrors.country}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor={`${variant}-language`}
            className="text-xs font-semibold text-[#284B26]"
          >
            Preferred language
          </Label>
          <select
            id={`${variant}-language`}
            className={SELECT_CLASS}
            value={values.language ?? ""}
            onChange={(e) =>
              setValues((current) => ({
                ...current,
                language: (e.target.value || null) as Language | null,
              }))
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
      </div>
      <fieldset className="space-y-2.5">
        <legend className="text-xs font-semibold text-[#284B26]">
          Areas of interest
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {INTEREST_OPTIONS.map(({ value, label }) => {
            const checked = values.interests.includes(value);
            return (
              <div
                key={value}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-colors",
                  checked
                    ? "border-[#3F673C] bg-[#EDF4E8]"
                    : "border-[#D5E3D9] bg-[#FAFDF8] hover:border-[#94B985]",
                )}
              >
                <Checkbox
                  id={`${variant}-interest-${value}`}
                  checked={checked}
                  onCheckedChange={(next) =>
                    toggleInterest(value, next === true)
                  }
                  className="border-[#94B985] data-[state=checked]:border-[#187347] data-[state=checked]:bg-[#187347] data-checked:border-[#187347] data-checked:bg-[#187347]"
                />
                <Label
                  htmlFor={`${variant}-interest-${value}`}
                  className="flex-1 cursor-pointer text-xs font-medium text-[#202B20]"
                >
                  {label}
                </Label>
              </div>
            );
          })}
        </div>
        {fieldErrors.interests && (
          <p className="text-xs text-destructive">{fieldErrors.interests}</p>
        )}
      </fieldset>
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/25 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <DialogFooter className="-mx-6 -mb-6 mt-2 rounded-b-2xl border-t border-[#E3EBDE] bg-[#F2F6EF]/80 px-6 py-4">
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-full border-[1.5px] border-[#94B985] bg-white px-5 font-semibold text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8] hover:text-[#202B20]"
          onClick={onCancel}
          disabled={submitting}
        >
          {labels.cancelLabel}
        </Button>
        <Button
          type="submit"
          className="h-9 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-5 font-semibold text-white shadow-xs hover:brightness-110"
          disabled={submitting}
        >
          {submitting ? "Saving…" : labels.submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
