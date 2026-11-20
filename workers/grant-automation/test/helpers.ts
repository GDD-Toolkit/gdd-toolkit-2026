import { readFileSync } from "node:fs";
import { z } from "zod";
import { Grant, type NormalizedGrant, type RawFetch, type SourceAdapter } from "../../../shared/types/Grants.js";

/** What normalize() must return: the Grant minus database-derived fields, plus the forecast flag and the relevance trace. */
export const NormalizedGrantSchema = Grant.omit({
  id: true,
  status: true,
  first_seen_at: true,
  last_seen_at: true,
  curation: true,
  content_hash: true,
}).extend({
  forecast: z.boolean().optional(),
  relevance: z.object({ score: z.number(), reasons: z.array(z.string()) }),
});

export const fixture = (path: string): any => JSON.parse(readFileSync(new URL(`./fixtures/${path}`, import.meta.url), "utf8"));

export type Call = { url: string; body: unknown; init: RequestInit };

/**
 * A `fetch` that answers from `respond` and records every call. JSON request
 * bodies are parsed; multipart bodies stay FormData. `respond` returns the JSON
 * to send with a 200, or a Response to send as it is.
 */
export function fakeFetch(respond: (call: Call) => unknown) {
  const calls: Call[] = [];
  const impl = (async (input: Parameters<typeof fetch>[0], init: RequestInit = {}) => {
    const call: Call = { url: String(input), init, body: typeof init.body === "string" ? JSON.parse(init.body) : init.body };
    calls.push(call);
    const answer = respond(call);
    if (answer instanceof Response) return answer;
    return new Response(JSON.stringify(answer), { status: 200, headers: { "Content-Type": "application/json" } });
  }) as typeof fetch;
  return { impl, calls };
}

export async function collect(adapter: SourceAdapter, opts: { limit?: number } = {}): Promise<RawFetch[]> {
  const out: RawFetch[] = [];
  for await (const raw of adapter.fetch(opts)) out.push(raw);
  return out;
}

/** normalize() with the worker timestamp pinned, so results are comparable. */
export const normalizeAt = (adapter: SourceAdapter, raw: RawFetch, fetched_at: string): NormalizedGrant | null =>
  adapter.normalize({ ...raw, fetched_at });
