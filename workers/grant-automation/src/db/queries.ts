// Every read the API serves, plus the one write (curation). Filters are built
// once in whereFor() so the listing and the facets can never disagree.
import { and, arrayOverlaps, asc, count, desc, eq, gte, inArray, isNull, lte, max, ne, or, sql, type SQL } from "drizzle-orm";
import { z } from "zod";
import { GrantFieldDef } from "../../../../shared/types/Grants.js";
import {
  DEFAULT_STATUSES,
  type CurationPatch,
  type GrantDetailResponse,
  type GrantFacets,
  type GrantListResponse,
  type GrantQuery,
  type GrantSort,
  type HealthResponse,
  type SourceSummary,
} from "../../../../shared/types/GrantsApi.js";
import { stableStringify } from "../pipeline/hash.js";
import type { Db } from "./client.js";
import { rowToGrant } from "./rows.js";
import { curationLog, grantFieldDefs, grantSources, grants, ingestRuns } from "./schema.js";

type FacetKey = "status" | "geography" | "sdg" | "value" | "funding_type" | "source" | "amount";

const FIELD_DEFS_TTL_MS = 60 * 60 * 1000;
const FACETS_TTL_MS = 5 * 60 * 1000;

let fieldDefCache: { at: number; defs: GrantFieldDef[] } | null = null;
const facetCache = new Map<string, { at: number; value: GrantFacets }>();

export function clearCaches(): void {
  fieldDefCache = null;
  facetCache.clear();
}

export async function getFieldDefs(db: Db): Promise<GrantFieldDef[]> {
  if (fieldDefCache && Date.now() - fieldDefCache.at < FIELD_DEFS_TTL_MS) return fieldDefCache.defs;
  const rows = await db.select().from(grantFieldDefs).orderBy(asc(grantFieldDefs.display_order), asc(grantFieldDefs.key));
  const defs = z.array(GrantFieldDef).parse(
    rows.map(({ created_at, ...def }) => {
      void created_at;
      return def;
    }),
  );
  fieldDefCache = { at: Date.now(), defs };
  return defs;
}

function extrasFilterValue(def: GrantFieldDef, raw: string): unknown {
  if (def.type === "number") return Number(raw);
  if (def.type === "list") return [raw];
  if (def.type === "money") return undefined; // ranges on money extras are not supported at MVP
  return raw;
}

/** The WHERE for a query. `exclude` drops one facet's own filter so its counts show the other choices. */
function whereFor(query: GrantQuery, defs: GrantFieldDef[], exclude?: FacetKey): SQL {
  const conds: SQL[] = [ne(grants.curation, "hidden")];
  if (query.ids) conds.push(inArray(grants.id, query.ids));
  else if (exclude !== "status") conds.push(inArray(grants.status, query.status ?? [...DEFAULT_STATUSES]));
  if (query.q) conds.push(sql`${grants.search} @@ websearch_to_tsquery('english', ${query.q})`);
  if (query.geography && exclude !== "geography") conds.push(arrayOverlaps(grants.geographies, query.geography));
  if (query.sdg && exclude !== "sdg") conds.push(arrayOverlaps(grants.sdgs, query.sdg));
  if (query.value && exclude !== "value") conds.push(arrayOverlaps(grants.values, [...query.value]));
  if (query.funding_type && exclude !== "funding_type") conds.push(inArray(grants.funding_type, query.funding_type));
  if (query.source && exclude !== "source") conds.push(inArray(grants.source_id, query.source));
  if (exclude !== "amount") {
    // A grant matches when its range overlaps the requested one; unknown amounts are never hidden.
    if (query.amount_min != null) conds.push(or(isNull(grants.amount_max), gte(grants.amount_max, query.amount_min))!);
    if (query.amount_max != null) conds.push(or(isNull(grants.amount_min), lte(grants.amount_min, query.amount_max))!);
  }
  if (query.deadline_before) conds.push(lte(grants.deadline, query.deadline_before));
  if (query.deadline_after) conds.push(gte(grants.deadline, query.deadline_after));
  for (const [key, raw] of Object.entries(query.extras ?? {})) {
    const def = defs.find((d) => d.key === key);
    if (!def?.filterable) continue;
    const value = extrasFilterValue(def, raw);
    if (value === undefined || Number.isNaN(value)) continue;
    conds.push(sql`${grants.data} @> ${JSON.stringify({ extras: { [key]: value } })}::jsonb`);
  }
  return and(...conds)!;
}

function orderFor(query: GrantQuery): SQL[] {
  const requested: GrantSort = query.sort ?? (query.q ? "relevance" : "deadline");
  const sort: GrantSort = requested === "relevance" && !query.q ? "deadline" : requested;
  const byDeadline = sql`${grants.deadline} asc nulls last`;
  const by: Record<GrantSort, SQL[]> = {
    deadline: [byDeadline, asc(grants.title)],
    "-deadline": [sql`${grants.deadline} desc nulls last`, asc(grants.title)],
    title: [asc(grants.title)],
    "-title": [desc(grants.title)],
    "-amount_max": [sql`${grants.amount_max} desc nulls last`, asc(grants.title)],
    "-first_seen_at": [desc(grants.first_seen_at), asc(grants.title)],
    relevance: [sql`ts_rank_cd(${grants.search}, websearch_to_tsquery('english', ${query.q ?? ""})) desc`, byDeadline],
  };
  return [sql`(${grants.curation} = 'featured') desc`, ...by[sort], asc(grants.id)];
}

export async function listGrants(db: Db, query: GrantQuery): Promise<GrantListResponse> {
  const where = whereFor(query, await getFieldDefs(db));
  const [rows, totals] = await Promise.all([
    db
      .select()
      .from(grants)
      .where(where)
      .orderBy(...orderFor(query))
      .limit(query.pageSize)
      .offset((query.page - 1) * query.pageSize),
    db.select({ total: count() }).from(grants).where(where),
  ]);
  return { data: rows.map(rowToGrant), meta: { total: totals[0]?.total ?? 0, page: query.page, pageSize: query.pageSize } };
}

export async function getGrant(db: Db, id: string): Promise<GrantDetailResponse | null> {
  const [row] = await db
    .select({ grant: grants, source_name: grantSources.name, source_last_run_at: grantSources.last_run_at })
    .from(grants)
    .innerJoin(grantSources, eq(grants.source_id, grantSources.id))
    .where(eq(grants.id, id));
  if (!row) return null;
  return {
    ...rowToGrant(row.grant),
    source: { name: row.source_name, last_run_at: row.source_last_run_at?.toISOString() ?? null },
  };
}

async function grouped(db: Db, expr: SQL, where: SQL): Promise<Record<string, number>> {
  const result = await db.execute<{ k: string | number | null; n: number }>(
    sql`select ${expr} as k, count(*)::int as n from ${grants} where ${where} group by 1 order by 1`,
  );
  const counts: Record<string, number> = {};
  for (const row of result.rows) if (row.k != null) counts[String(row.k)] = Number(row.n);
  return counts;
}

export async function getFacets(db: Db, query: GrantQuery): Promise<GrantFacets> {
  const key = stableStringify({ ...query, page: undefined, pageSize: undefined, sort: undefined });
  const cached = facetCache.get(key);
  if (cached && Date.now() - cached.at < FACETS_TTL_MS) return cached.value;

  const defs = await getFieldDefs(db);
  const where = (exclude?: FacetKey) => whereFor(query, defs, exclude);
  const [status, geographies, sdgs, values, funding_types, sources, totals, closing, amounts] = await Promise.all([
    grouped(db, sql`${grants.status}`, where("status")),
    grouped(db, sql`unnest(${grants.geographies})`, where("geography")),
    grouped(db, sql`unnest(${grants.sdgs})`, where("sdg")),
    grouped(db, sql`unnest(${grants.values})`, where("value")),
    grouped(db, sql`${grants.funding_type}`, where("funding_type")),
    grouped(db, sql`${grants.source_id}`, where("source")),
    db.select({ total: count() }).from(grants).where(where()),
    db
      .select({ n: count() })
      .from(grants)
      .where(and(where(), eq(grants.status, "closing_soon"))),
    db
      .select({ min: sql<number | null>`min(${grants.amount_min})`, max: sql<number | null>`max(${grants.amount_max})` })
      .from(grants)
      .where(where("amount")),
  ]);
  const value: GrantFacets = {
    total: totals[0]?.total ?? 0,
    status,
    geographies,
    sdgs,
    values,
    funding_types,
    sources,
    closing_soon: closing[0]?.n ?? 0,
    amount: { min: amounts[0]?.min == null ? null : Number(amounts[0].min), max: amounts[0]?.max == null ? null : Number(amounts[0].max) },
  };
  facetCache.set(key, { at: Date.now(), value });
  return value;
}

export async function listSources(db: Db): Promise<SourceSummary[]> {
  const rows = await db.select().from(grantSources).orderBy(asc(grantSources.name));
  return rows.map((s) => ({
    id: s.id,
    name: s.name,
    enabled: s.enabled,
    last_run_at: s.last_run_at?.toISOString() ?? null,
    license_note: s.license_note,
  }));
}

/** The one write the API makes: through the grants_worker connection, logged per change. */
export async function setCuration(
  writer: Db,
  id: string,
  { curation }: CurationPatch,
  userId: number,
): Promise<GrantDetailResponse | null> {
  const changed = await writer.transaction(async (tx) => {
    const [current] = await tx.select({ curation: grants.curation }).from(grants).where(eq(grants.id, id)).for("update");
    if (!current) return false;
    if (current.curation === curation) return true;
    await tx.update(grants).set({ curation }).where(eq(grants.id, id));
    await tx.insert(curationLog).values({ grant_id: id, user_id: userId, from_curation: current.curation, to_curation: curation });
    return true;
  });
  if (!changed) return null;
  facetCache.clear();
  return getGrant(writer, id);
}

export async function health(db: Db): Promise<HealthResponse> {
  try {
    const [row] = await db.select({ last: max(ingestRuns.finished_at) }).from(ingestRuns).where(eq(ingestRuns.status, "ok"));
    return { ok: true, db: true, last_ingest_at: row?.last ? new Date(row.last).toISOString() : null };
  } catch {
    return { ok: false, db: false, last_ingest_at: null };
  }
}
