// Needs a bootstrapped + migrated database (see README). Run with `npm run test:db`.
// Every write happens inside a transaction that is rolled back.
import { eq, sql, TransactionRollbackError } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import { Grant } from "../../../shared/types/Grants.js";
import { createDb, type Db } from "../src/db/client.js";
import { grantToRow } from "../src/db/rows.js";
import { grants, grantSources } from "../src/db/schema.js";
import { env } from "../src/env.js";
import { sampleGrant } from "./fixtures/sample-grant.js";

const db = createDb(env.DATABASE_URL);
afterAll(() => db.$client.end());

/** Postgres SQLSTATE from a drizzle-wrapped or bare pg error. */
const pgCode = (error: unknown): string | undefined => {
  const cause = (error as { cause?: { code?: string } })?.cause ?? (error as { code?: string });
  return cause?.code;
};

/** Runs `fn` in a transaction and always rolls it back. */
async function rolledBack(fn: (tx: Parameters<Parameters<Db["transaction"]>[0]>[0]) => Promise<void>) {
  try {
    await db.transaction(async (tx) => {
      await fn(tx);
      tx.rollback();
    });
  } catch (error) {
    if (!(error instanceof TransactionRollbackError)) throw error;
  }
}

describe("grants schema (grants_worker)", () => {
  it("exists with its migration bookkeeping", async () => {
    const result = await db.execute(
      sql`select to_regclass('grants.grants')::text as t, to_regclass('grants.__drizzle_migrations')::text as m`,
    );
    expect(result.rows[0]).toEqual({ t: "grants.grants", m: "grants.__drizzle_migrations" });
  });

  it("inserts one grant and reads it back through the columns, data, search and facets", async () => {
    await rolledBack(async (tx) => {
      await tx.insert(grantSources).values({ id: sampleGrant.source_id, name: "Smoke test", adapter: "none" });
      await tx.insert(grants).values(grantToRow(sampleGrant));

      const [row] = await tx.select().from(grants).where(eq(grants.id, sampleGrant.id));
      expect(row?.title).toBe(sampleGrant.title);
      expect(row?.deadline).toBe(sampleGrant.deadline);
      expect(row?.values).toEqual(sampleGrant.values);
      expect(Grant.parse(row?.data)).toEqual(sampleGrant);

      const bySearch = await tx
        .select({ id: grants.id })
        .from(grants)
        .where(sql`${grants.search} @@ plainto_tsquery('english', 'sanitation water')`);
      expect(bySearch.map((r) => r.id)).toContain(sampleGrant.id);

      const byFacet = await tx
        .select({ id: grants.id })
        .from(grants)
        .where(sql`${grants.geographies} @> array['philippines_sea']::text[] and ${grants.sdgs} @> array[6]::smallint[]`);
      expect(byFacet.map((r) => r.id)).toContain(sampleGrant.id);

      const byExtra = await tx
        .select({ id: grants.id })
        .from(grants)
        .where(sql`${grants.data} @> ${JSON.stringify({ extras: { agency_code: "EXAMPLE" } })}::jsonb`);
      expect(byExtra.map((r) => r.id)).toContain(sampleGrant.id);
    });
  });

  it("rejects a status outside the vocabulary (CHECK constraint)", async () => {
    await rolledBack(async (tx) => {
      await tx.insert(grantSources).values({ id: sampleGrant.source_id, name: "Smoke test", adapter: "none" });
      await expect(
        tx.insert(grants).values({ ...grantToRow(sampleGrant), status: "maybe" }),
      ).rejects.toSatisfy((e) => pgCode(e) === "23514");
    });
  });

  it("cannot read Strapi's tables in public", async () => {
    await expect(db.execute(sql`select 1 from public.up_users limit 1`)).rejects.toSatisfy((e) =>
      ["42501", "42P01"].includes(pgCode(e) ?? ""),
    );
  });
});

describe.skipIf(!env.DATABASE_READER_URL)("grants_reader", () => {
  it("can SELECT but cannot INSERT", async () => {
    const reader = createDb(env.DATABASE_READER_URL!);
    try {
      await expect(reader.select({ id: grants.id }).from(grants).limit(1)).resolves.toBeDefined();
      await expect(reader.insert(grantSources).values({ id: "reader-test", name: "x", adapter: "x" })).rejects.toSatisfy(
        (e) => pgCode(e) === "42501",
      );
    } finally {
      await reader.$client.end();
    }
  });
});
