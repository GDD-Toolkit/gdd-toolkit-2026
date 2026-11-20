import { createHash } from "node:crypto";
import type { NormalizedGrant } from "../../../../shared/types/Grants.js";

/** JSON with object keys sorted at every level, so equal records hash equal. */
export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export const sha256 = (text: string) => `sha256:${createHash("sha256").update(text).digest("hex")}`;

/** Hash of the normalized record minus the worker's own timestamp and the relevance trace. */
export function contentHash(grant: NormalizedGrant): string {
  const { last_verified_at, relevance, ...content } = grant;
  void last_verified_at;
  void relevance;
  return sha256(stableStringify(content));
}

export const payloadHash = (payload: unknown) => sha256(stableStringify(payload));
