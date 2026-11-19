import { configDefaults, defineConfig } from "vitest/config";

// `npm test`           hermetic unit tests (adapters replay recorded fixtures).
// `npm run test:db`    DB_TESTS=1: only *.db.test.ts, which need the .env database URLs.
// `npm run test:live`  LIVE_TESTS=1: only *.live.test.ts, which call the real source APIs.
const mode = process.env.LIVE_TESTS === "1" ? "live" : process.env.DB_TESTS === "1" ? "db" : "unit";
const only = { db: "test/**/*.db.test.ts", live: "test/**/*.live.test.ts" } as const;

export default defineConfig({
  test: {
    environment: "node",
    include: mode === "unit" ? ["test/**/*.test.ts"] : [only[mode]],
    exclude: mode === "unit" ? [...configDefaults.exclude, ...Object.values(only)] : [...configDefaults.exclude],
    // Database test files share one schema; run them one at a time.
    fileParallelism: mode !== "db",
  },
});
