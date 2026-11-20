// The grants read API. Public GETs, one admin PATCH. Mounted behind nginx at
// /grants/api in production (nginx strips the prefix), served directly on
// http://localhost:4100 in development.
import { Hono } from "hono";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";
import { CurationPatch, grantQueryFromSearchParams } from "../../../../shared/types/GrantsApi.js";
import type { Db } from "../db/client.js";
import { getFacets, getFieldDefs, getGrant, health, listGrants, listSources, setCuration } from "../db/queries.js";
import { rateLimit, requireSiteAdmin } from "./auth.js";
import { ApiError } from "./errors.js";

export type AppDeps = {
  /** grants_reader: every GET. */
  reader: Db;
  /** grants_worker: the curation PATCH. */
  writer: Db;
  strapiUrl: string;
  corsOrigins: string[];
};

const UUID = z.uuid();

/** Lists and facets change with every ingest, so clients revalidate (cheap 304s via ETag). */
const REVALIDATE = "public, max-age=0, must-revalidate";
const FIVE_MINUTES = "public, max-age=300";

export function createApp({ reader, writer, strapiUrl, corsOrigins }: AppDeps) {
  const app = new Hono();

  app.use("*", cors({ origin: corsOrigins, allowMethods: ["GET", "PATCH", "OPTIONS"], allowHeaders: ["Authorization", "Content-Type"] }));
  app.use("*", etag());

  app.onError((error, c) => {
    if (error instanceof ApiError) {
      return c.json({ error: { status: error.status, message: error.message } }, error.status as ContentfulStatusCode);
    }
    console.error(error);
    return c.json({ error: { status: 500, message: "Internal error" } }, 500);
  });
  app.notFound((c) => c.json({ error: { status: 404, message: "Not found" } }, 404));

  app.get("/healthz", async (c) => {
    const status = await health(reader);
    return c.json(status, status.ok ? 200 : 503);
  });

  app.get("/grants", async (c) => {
    const query = grantQueryFromSearchParams(new URL(c.req.url).searchParams);
    c.header("Cache-Control", REVALIDATE);
    return c.json(await listGrants(reader, query));
  });

  app.get("/grants/facets", async (c) => {
    const query = grantQueryFromSearchParams(new URL(c.req.url).searchParams);
    c.header("Cache-Control", REVALIDATE);
    return c.json(await getFacets(reader, query));
  });

  app.get("/grants/field-defs", async (c) => {
    c.header("Cache-Control", FIVE_MINUTES);
    return c.json(await getFieldDefs(reader));
  });

  app.get("/grants/:id", async (c) => {
    const id = UUID.safeParse(c.req.param("id"));
    const grant = id.success ? await getGrant(reader, id.data) : null;
    if (!grant) throw new ApiError(404, "Grant not found");
    c.header("Cache-Control", REVALIDATE);
    return c.json(grant);
  });

  app.patch("/grants/:id/curation", async (c) => {
    const admin = await requireSiteAdmin(c.req.header("authorization"), strapiUrl);
    rateLimit(admin.id);
    const id = UUID.safeParse(c.req.param("id"));
    if (!id.success) throw new ApiError(404, "Grant not found");
    const body = CurationPatch.safeParse(await c.req.json().catch(() => null));
    if (!body.success) throw new ApiError(400, "Body must be { curation: auto | hidden | featured }");
    const grant = await setCuration(writer, id.data, body.data, admin.id);
    if (!grant) throw new ApiError(404, "Grant not found");
    c.header("Cache-Control", "no-store");
    return c.json(grant);
  });

  app.get("/sources", async (c) => {
    c.header("Cache-Control", FIVE_MINUTES);
    return c.json(await listSources(reader));
  });

  return app;
}
