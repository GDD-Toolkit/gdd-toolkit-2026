/**
 * Onboarding questions mirror the User shape in shared/types/Users.ts
 * (name, occupation, organization, country, language, interests).
 */
import { countries, languages, type Country, type Interest, type Language } from "../../../shared/types/Users";

export { countries, languages };
export type { Country, Interest, Language };

export const INTEREST_OPTIONS: { value: Interest; label: string }[] = [
  { value: "health", label: "Health" },
  { value: "environment", label: "Environment" },
  { value: "social", label: "Social" },
  { value: "economic", label: "Economic" },
];
