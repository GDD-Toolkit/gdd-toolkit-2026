import { decodeHTML } from "entities";

/** HTML or entity-laden text → plain text on one line. */
export function htmlToText(html: string | null | undefined): string {
  if (!html) return "";
  return decodeHTML(
    html
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The first `maxWords` words of `text`, cut at a sentence end when one falls in
 * the second half, otherwise marked with an ellipsis. An excerpt, never a rewrite:
 * source terms forbid modifying the content.
 */
export function excerpt(text: string, maxWords = 60): string {
  const words = text.split(" ").filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  const cut = words.slice(0, maxWords).join(" ");
  const sentenceEnd = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  return sentenceEnd > cut.length / 2 ? cut.slice(0, sentenceEnd + 1) : `${cut}…`;
}

/** "Others (see text field entitled …)" → "Others". Grants.gov code lists end in a cross-reference; "501(c)(3)" must survive. */
export const withoutCrossReference = (label: string) => label.replace(/\s*\((?:see\b|i\.e\.).*$/is, "").trim();

/** A positive whole number from a numeric string or number; anything else (including 0) is null. */
export function positiveInt(value: unknown): number | null {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value.replace(/,/g, "")) : NaN;
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

/** A calendar date at noon UTC, so every time zone shows the same day. */
export const noonUTC = (isoDate: string) => `${isoDate}T12:00:00.000Z`;

/** The "YYYY-MM-DD" at the start of a date-like string, or null. */
export function leadingDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return match ? match[0] : null;
}

/** An absolute http(s) URL, or null. */
export function httpUrl(value: unknown): string | null {
  if (typeof value !== "string" || !/^https?:\/\//i.test(value.trim())) return null;
  return URL.canParse(value.trim()) ? value.trim() : null;
}

// Philippines / Southeast Asia: the launch market, tagged as its own geography.
const SEA_TEXT =
  /\b(philippines?|filipino|southeast asia|south-east asia|asean|indonesia|viet ?nam|thailand|malaysia|cambodia|laos?|lao pdr|myanmar|burma|timor-leste|brunei|singapore|mekong)\b/i;
export const mentionsSoutheastAsia = (text: string) => SEA_TEXT.test(text);
export const SEA_COUNTRY_CODES = new Set(["PH", "ID", "VN", "TH", "MY", "KH", "LA", "MM", "TL", "BN", "SG"]);
