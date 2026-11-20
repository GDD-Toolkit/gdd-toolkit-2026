// Needs the migrated local database. `npm run test:db`. Strapi is mocked:
// the bearer token names the profile the fake /api/account/me returns.
import { sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  GrantDetailResponse,
  GrantFacets,
  GrantListResponse,
  HealthResponse,
  SourcesResponse,
} from "../../../shared/types/GrantsApi.js";
import { createCuratedAdapter } from "../src/adapters/curated.js";
import { createApp } from "../src/api/app.js";
import { createDb } from "../src/db/client.js";
import { clearCaches } from "../src/db/queries.js";
import { sampleEntries } from "../src/dev/sample-entries.js";
import { env } from "../src/env.js";
import { runIngest } from "../src/pipeline/ingest.js";

const SOURCE = "test-fixture";
const worker = createDb(env.DATABASE_URL);
const reader = createDb(env.DATABASE_READER_URL ?? env.DATABASE_URL);
const owner = createDb(env.DATABASE_OWNER_URL);
const app = createApp({ reader, writer: worker, strapiUrl: "http://strapi.test", corsOrigins: ["http://localhost:5173"] });

const PROFILES: Record<string, unknown> = {
  admin: { id: 7, confirmed: true, blocked: false, role: { type: "admin" } },
  student: { id: 8, confirmed: true, blocked: false, role: { type: "student" } },
  unconfirmed: { id: 9, confirmed: false, blocked: false, role: { type: "admin" } },
};

/** uuid by external_id, filled after the fixture ingest. */
const ids: Record<string, string> = {};

async function cleanup() {
  await owner.execute(sql`delete from grants.curation_log where grant_id in (select id from grants.grants where source_id = ${SOURCE})`);
  await owner.execute(sql`delete from grants.grant_raw where source_id = ${SOURCE}`);
  await owner.execute(sql`delete from grants.grants where source_id = ${SOURCE}`);
  await owner.execute(sql`delete from grants.ingest_runs where source_id = ${SOURCE}`);
  await owner.execute(sql`delete from grants.grant_sources where id = ${SOURCE}`);
}

beforeAll(async () => {
  await cleanup();
  await runIngest(worker, createCuratedAdapter({ sourceId: SOURCE, name: "Test fixture", entries: sampleEntries() }));
  const rows = await worker.execute<{ external_id: string; id: string }>(sql`select external_id, id from grants.grants where source_id = ${SOURCE}`);
  for (const row of rows.rows) ids[row.external_id] = row.id;
  clearCaches();
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: string, init?: RequestInit) => {
      const token = String((init?.headers as Record<string, string> | undefined)?.Authorization ?? "").replace(/^Bearer /, "");
      const profile = PROFILES[token];
      if (!profile) return new Response(JSON.stringify({ error: { status: 401, message: "Unauthorized" } }), { status: 401 });
      return new Response(JSON.stringify(profile), { status: 200, headers: { "content-type": "application/json" } });
    }),
  );
});

afterAll(async () => {
  vi.unstubAllGlobals();
  await cleanup();
  await Promise.all([worker.$client.end(), reader.$client.end(), owner.$client.end()]);
});

const get = async (path: string) => {
  const res = await app.request(path);
  return { status: res.status, headers: res.headers, body: (await res.json()) as unknown };
};
const patch = async (id: string, body: unknown, token?: string) => {
  const res = await app.request(`/grants/${id}/curation`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: (await res.json()) as unknown };
};
const list = async (params: string) => {
  const { status, body } = await get(`/grants?source=${SOURCE}&${params}`);
  expect(status).toBe(200);
  return GrantListResponse.parse(body);
};
const facets = async (params: string) => {
  const { status, body } = await get(`/grants/facets?source=${SOURCE}&${params}`);
  expect(status).toBe(200);
  return GrantFacets.parse(body);
};

describe("GET /grants", () => {
  it("lists everything that is not closed, soonest deadline first, rolling last", async () => {
    const { data, meta } = await list("");
    expect(meta).toEqual({ total: 5, page: 1, pageSize: 24 });
    expect(data.map((g) => g.external_id)).toEqual([
      "cfli-philippines-2026",
      "gpsa-call-2027",
      "forest-foundation-ph-small-grants",
      "global-europe-cso-philippines-2027",
      "wellcome-discovery-awards",
    ]);
    expect(data.map((g) => g.status)).toEqual(["closing_soon", "open", "open", "forecasted", "rolling"]);
    expect(data[0]?.extras.funder_type).toBe("government");
  });

  it("filters by status, geography, sdg, value, funding type, amount and search", async () => {
    expect((await list("status=open")).data.map((g) => g.external_id)).toEqual(["gpsa-call-2027", "forest-foundation-ph-small-grants"]);
    expect((await list("geography=philippines_sea")).meta.total).toBe(3);
    expect((await list("geography=philippines_sea&geography=eu_and_partners")).meta.total).toBe(3);
    expect((await list("sdg=3")).data.map((g) => g.external_id)).toEqual(["wellcome-discovery-awards"]);
    expect((await list("value=Human%20Rights")).meta.total).toBe(1);
    expect((await list("funding_type=cooperative_agreement")).meta.total).toBe(0); // the only one is closed
    expect((await list("funding_type=cooperative_agreement&status=closed")).meta.total).toBe(1);
    expect((await list("amount_min=1000000")).data.map((g) => g.external_id)).toEqual([
      "forest-foundation-ph-small-grants",
      "global-europe-cso-philippines-2027",
      "wellcome-discovery-awards",
    ]);
    expect((await list("q=accountability")).data.map((g) => g.external_id)).toEqual(["gpsa-call-2027"]);
    expect((await list("q=philippines&sort=title")).data.map((g) => g.external_id)).toEqual([
      "cfli-philippines-2026",
      "forest-foundation-ph-small-grants",
      "global-europe-cso-philippines-2027",
    ]);
  });

  it("honours filterable extras and ignores the rest", async () => {
    expect((await list("extras[funder_type]=foundation")).data.map((g) => g.external_id)).toEqual([
      "forest-foundation-ph-small-grants",
      "wellcome-discovery-awards",
    ]);
    expect((await list("extras[eligibility]=anything")).meta.total).toBe(5);
  });

  it("sorts and paginates", async () => {
    expect((await list("sort=-amount_max")).data[0]?.external_id).toBe("wellcome-discovery-awards");
    expect((await list("sort=-title")).data[0]?.external_id).toBe("wellcome-discovery-awards");
    const page2 = await list("pageSize=2&page=2");
    expect(page2.data.map((g) => g.external_id)).toEqual(["forest-foundation-ph-small-grants", "global-europe-cso-philippines-2027"]);
    expect(page2.meta).toEqual({ total: 5, page: 2, pageSize: 2 });
  });

  it("drops invalid params instead of failing", async () => {
    const { meta } = await list("sdg=99&page=abc&sort=sideways");
    expect(meta).toEqual({ total: 5, page: 1, pageSize: 24 });
  });

  it("resolves exact ids regardless of status (Account page)", async () => {
    const { data } = await list(`ids=${ids["wash-partnerships-2026"]}&ids=${ids["gpsa-call-2027"]}`);
    expect(data.map((g) => g.external_id).sort()).toEqual(["gpsa-call-2027", "wash-partnerships-2026"]);
    expect(data.find((g) => g.external_id === "wash-partnerships-2026")?.status).toBe("closed");
  });
});

describe("GET /grants/facets", () => {
  it("counts under the current filters, excluding each facet's own filter", async () => {
    const all = await facets("");
    expect(all.total).toBe(5);
    expect(all.status).toEqual({ open: 2, closing_soon: 1, forecasted: 1, rolling: 1, closed: 1 });
    expect(all.geographies).toEqual({ worldwide: 2, philippines_sea: 3, eu_and_partners: 1 });
    expect(all.sdgs["16"]).toBe(3);
    expect(all.values["Sustainability"]).toBe(2);
    expect(all.funding_types).toEqual({ grant: 5 });
    // The sources facet ignores the source filter, so it also counts whatever else the local database holds.
    expect(all.sources[SOURCE]).toBe(5);
    expect(all.closing_soon).toBe(1);
    expect(all.amount).toEqual({ min: 15000, max: 3000000 });

    const narrowed = await facets("geography=eu_and_partners");
    expect(narrowed.total).toBe(1);
    expect(narrowed.geographies).toEqual({ worldwide: 2, philippines_sea: 3, eu_and_partners: 1 });
    expect(narrowed.status).toEqual({ forecasted: 1 });
  });
});

describe("GET /grants/:id, /sources, /grants/field-defs, /healthz", () => {
  it("returns the detail with its source", async () => {
    const { status, body } = await get(`/grants/${ids["gpsa-call-2027"]}`);
    expect(status).toBe(200);
    const detail = GrantDetailResponse.parse(body);
    expect(detail.source.name).toBe("Test fixture");
    expect(detail.source.last_run_at).not.toBeNull();
    expect(detail.extras.past_awards).toMatch(/49 grants/);
  });

  it("404s for unknown and malformed ids", async () => {
    expect((await get("/grants/0f6c9a2e-5c1b-4f0e-9d5a-2b7e1c3d4a5b")).status).toBe(404);
    expect((await get("/grants/not-a-uuid")).status).toBe(404);
    expect((await get("/nope")).body).toEqual({ error: { status: 404, message: "Not found" } });
  });

  it("lists sources and field defs, and reports health", async () => {
    const sources = SourcesResponse.parse((await get("/sources")).body);
    expect(sources.find((s) => s.id === SOURCE)).toMatchObject({ name: "Test fixture", enabled: true });
    const defs = (await get("/grants/field-defs")).body as { key: string; display_order: number }[];
    expect(defs.map((d) => d.key)).toContain("funder_type");
    expect(defs.map((d) => d.display_order)).toEqual([...defs.map((d) => d.display_order)].sort((a, b) => a - b));
    const health = HealthResponse.parse((await get("/healthz")).body);
    expect(health).toMatchObject({ ok: true, db: true });
    expect(health.last_ingest_at).not.toBeNull();
  });

  it("sends ETag and revalidation headers", async () => {
    const { headers } = await get(`/grants?source=${SOURCE}`);
    expect(headers.get("etag")).toBeTruthy();
    expect(headers.get("cache-control")).toContain("must-revalidate");
  });
});

describe("PATCH /grants/:id/curation", () => {
  const id = () => ids["cfli-philippines-2026"]!;

  it("rejects anonymous, non-admin and unconfirmed callers", async () => {
    expect((await patch(id(), { curation: "hidden" })).status).toBe(401);
    expect((await patch(id(), { curation: "hidden" }, "nobody")).status).toBe(401);
    expect((await patch(id(), { curation: "hidden" }, "student")).status).toBe(403);
    expect((await patch(id(), { curation: "hidden" }, "unconfirmed")).status).toBe(403);
  });

  it("validates the body and the id", async () => {
    expect((await patch(id(), { curation: "reviewed" }, "admin")).status).toBe(400);
    expect((await patch("0f6c9a2e-5c1b-4f0e-9d5a-2b7e1c3d4a5b", { curation: "hidden" }, "admin")).status).toBe(404);
  });

  it("hides, features and clears, logging every change", async () => {
    const hidden = await patch(id(), { curation: "hidden" }, "admin");
    expect(hidden.status).toBe(200);
    expect(GrantDetailResponse.parse(hidden.body).curation).toBe("hidden");
    expect((await list("")).data.map((g) => g.external_id)).not.toContain("cfli-philippines-2026");
    expect(GrantDetailResponse.parse((await get(`/grants/${id()}`)).body).curation).toBe("hidden");

    const featured = await patch(id(), { curation: "featured" }, "admin");
    expect(featured.status).toBe(200);
    expect((await list("sort=-title")).data[0]?.external_id).toBe("cfli-philippines-2026");

    expect((await patch(id(), { curation: "auto" }, "admin")).status).toBe(200);
    expect((await patch(id(), { curation: "auto" }, "admin")).status).toBe(200); // no-op, not logged

    const log = await owner.execute<{ from_curation: string; to_curation: string; user_id: number }>(
      sql`select from_curation, to_curation, user_id from grants.curation_log where grant_id = ${id()} order by at`,
    );
    expect(log.rows.map((r) => `${r.from_curation}>${r.to_curation}`)).toEqual(["auto>hidden", "hidden>featured", "featured>auto"]);
    expect(log.rows.every((r) => r.user_id === 7)).toBe(true);
  });
});
