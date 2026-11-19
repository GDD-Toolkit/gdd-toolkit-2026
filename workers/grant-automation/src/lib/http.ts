// One fetch wrapper for every source: a descriptive User-Agent, a timeout, and
// a few retries on the failures that are worth retrying.

export const USER_AGENT = "gdd-toolkit-grant-automation/0.2 (+https://github.com/GDD-Toolkit/gdd-toolkit-2026)";

const RETRY_DELAYS_MS = [1_000, 4_000];
const TIMEOUT_MS = 60_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Fetches and parses JSON. Retries network errors, timeouts, 429 and 5xx; anything else throws at once. */
export async function fetchJson(url: string, init: RequestInit = {}, fetchImpl: typeof fetch = fetch): Promise<unknown> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    if (attempt > 0) await sleep(RETRY_DELAYS_MS[attempt - 1]!);
    try {
      const response = await fetchImpl(url, {
        ...init,
        headers: { "User-Agent": USER_AGENT, Accept: "application/json", ...init.headers },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (response.ok) return await response.json();
      const error = new Error(`${init.method ?? "GET"} ${url} → HTTP ${response.status}`);
      if (response.status !== 429 && response.status < 500) throw Object.assign(error, { fatal: true });
      lastError = error;
    } catch (error) {
      if (error instanceof Error && "fatal" in error) throw error;
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

/** Runs `task` over `items`, at most `size` at a time, yielding results in input order. */
export async function* inBatches<T, R>(items: T[], size: number, task: (item: T) => Promise<R>): AsyncGenerator<R> {
  for (let start = 0; start < items.length; start += size) {
    yield* await Promise.all(items.slice(start, start + size).map(task));
  }
}
