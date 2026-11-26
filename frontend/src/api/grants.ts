/**
 * Calls against the grants read API (workers/grant-automation). Every response
 * is parsed with the shared zod schemas, so the page can never render a shape
 * it does not understand. The query type is the schema the API itself parses.
 */
import type { ZodType } from "zod";
import {
  ApiErrorResponse,
  CurationPatch,
  FieldDefsResponse,
  GrantDetailResponse,
  GrantFacets,
  GrantListResponse,
  PAGE_SIZE_MAX,
  SourcesResponse,
  grantQueryToSearchParams,
  type GrantQueryInput,
} from "@shared/types/GrantsApi";

export class GrantsApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GrantsApiError";
    this.status = status;
  }
}

function baseUrl(): string {
  const url = import.meta.env.VITE_GRANTS_API_URL;
  if (!url) {
    throw new Error("Missing VITE_GRANTS_API_URL. Add it to your frontend .env file.");
  }
  return url.replace(/\/$/, "");
}

async function request<T>(path: string, schema: ZodType<T>, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl()}${path}`, init);
  const json: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsed = ApiErrorResponse.safeParse(json);
    const message = parsed.success
      ? parsed.data.error.message
      : `Grants API request failed: ${response.status} ${response.statusText}`;
    throw new GrantsApiError(message, response.status);
  }
  // A 200 that is not JSON is the site's index.html: nginx serving the app shell
  // because the API is not routed or not running.
  if (json === null) throw new GrantsApiError("The grants API did not respond.", response.status);

  return schema.parse(json);
}

export function getGrants(query: GrantQueryInput): Promise<GrantListResponse> {
  return request(`/grants?${grantQueryToSearchParams(query)}`, GrantListResponse);
}

export function getFacets(query: GrantQueryInput): Promise<GrantFacets> {
  return request(`/grants/facets?${grantQueryToSearchParams(query)}`, GrantFacets);
}

export function getFieldDefs() {
  return request("/grants/field-defs", FieldDefsResponse);
}

export function getSources() {
  return request("/sources", SourcesResponse);
}

export function getGrant(id: string): Promise<GrantDetailResponse> {
  return request(`/grants/${encodeURIComponent(id)}`, GrantDetailResponse);
}

/** Saved grants for the Account page. Archived and hidden rows still resolve by id. */
export async function getGrantsByIds(ids: string[]): Promise<GrantListResponse["data"]> {
  const unique = Array.from(new Set(ids));
  const found: GrantListResponse["data"] = [];
  for (let start = 0; start < unique.length; start += PAGE_SIZE_MAX) {
    const chunk = unique.slice(start, start + PAGE_SIZE_MAX);
    const { data } = await getGrants({ ids: chunk, pageSize: PAGE_SIZE_MAX });
    found.push(...data);
  }
  return found;
}

/** Site admins only; the Strapi JWT is verified by the API. */
export function setCuration(
  id: string,
  curation: CurationPatch["curation"],
  token: string,
): Promise<GrantDetailResponse> {
  return request(`/grants/${encodeURIComponent(id)}/curation`, GrantDetailResponse, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(CurationPatch.parse({ curation })),
  });
}
