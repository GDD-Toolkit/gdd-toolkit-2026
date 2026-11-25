import type { ProjectPlanningTool } from "../pages/project-planning/ToolModal";
import { parsePlanningTool } from "./planningToolValidation";

export async function getProjectPlanningTools(signal?: AbortSignal): Promise<ProjectPlanningTool[]> {
  const base = getStrapiBaseUrl();
  const api = base.endsWith("/api") ? base : `${base}/api`;
  const tools: ProjectPlanningTool[] = [];
  let page = 1;
  let pageCount = 1;
  do {
    const query = new URLSearchParams({
      "pagination[page]": String(page), "pagination[pageSize]": "100",
      "sort[0]": "sort_order:asc", "sort[1]": "slug:asc", status: "published",
    });
    const response = await fetch(`${api}/project-planning-tools?${query}`, { signal });
    if (!response.ok) throw new Error(`Could not load planning tools (${response.status}).`);
    const json = await response.json();
    const count = json?.meta?.pagination?.pageCount;
    if (!Array.isArray(json?.data) || !Number.isInteger(count) || count < 0) {
      throw new Error("Invalid project planning response from Strapi.");
    }
    tools.push(...json.data.map(parsePlanningTool));
    pageCount = count;
    page += 1;
  } while (page <= pageCount);
  return tools;
}

function getStrapiBaseUrl(): string {
  const url = import.meta.env.VITE_STRAPI_URL;
  if (!url) {
    throw new Error(
      "Missing VITE_STRAPI_URL. Add it to your frontend .env file.",
    );
  }

  // Remove trailing slash so URL building stays clean.
  return url.replace(/\/$/, "");
}

/**
 * Fetch all Cohorts from Strapi.
 *
 * Strapi v5 returns REST data in a flattened format,
 * so fields like "year" are directly on each item in data[].
 */
export async function getCohorts() {
  const baseUrl = getStrapiBaseUrl();
  const pluralApiId = "coherts";

  // If the env already ends with /api, do not add /api again.
  const apiBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
  const url = `${apiBase}/${pluralApiId}?populate=*`;

  // Public content: the Strapi Public role has read access, so no token is sent.
  const response = await fetch(url, {
    method: "GET",
  });

  // If the request failed, throw an error so the component can handle it.
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const snippet = body.slice(0, 200).replace(/\s+/g, " ").trim();

    throw new Error(
      `Failed to fetch cohorts.\nURL: ${url}\nStatus: ${response.status} ${response.statusText}\nBody: ${snippet}`,
    );
  }

  // Parse the JSON body from Strapi.
  const json = await response.json();
  // Return the array inside the "data" key.
  // Example shape in Strapi v5:
  // { data: [{ id, documentId, year, ... }], meta: {...} }
  return Array.isArray(json.data) ? json.data : [];
}

export type StrapiPodcast = {
  id: number;
  title: string;
  description: string;
  release_date?: string | null;
  createdAt: string;
  podcast_audio?: { id: number; url: string }[] | null;
};

export async function getPodcasts(): Promise<StrapiPodcast[]> {
  const baseUrl = getStrapiBaseUrl();
  const pluralApiId = "podcasts";

  // If the env already ends with /api, do not add /api again.
  const apiBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
  const url = `${apiBase}/${pluralApiId}?populate=*`;

  const response = await fetch(url, {
    method: "GET",
  });


  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const snippet = body.slice(0, 200).replace(/\s+/g, " ").trim();

    throw new Error(
      `Failed to fetch podcasts.\nURL: ${url}\nStatus: ${response.status} ${response.statusText}\nBody: ${snippet}`,
    );
  }

  const json = await response.json();

  return Array.isArray(json.data) ? json.data : [];
}

export async function getTeams() {
  const baseUrl = getStrapiBaseUrl();
  const pluralApiId = "teams";

  // If the env already ends with /api, do not add /api again.
  const apiBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
  const url = `${apiBase}/${pluralApiId}?populate=*`;

  // Public content: the Strapi Public role has read access, so no token is sent.
  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const snippet = body.slice(0, 200).replace(/\s+/g, " ").trim();

    throw new Error(
      `Failed to fetch teams.
URL: ${url}
Status: ${response.status} ${response.statusText}
Body: ${snippet}`,
    );
  }

  const json = await response.json();
  return Array.isArray(json.data) ? json.data : [];
}

export async function getMaldevelopment() {
  const baseUrl = getStrapiBaseUrl();
  const pluralApiId = "maldevelopments";

  const apiBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
  const url = `${apiBase}/${pluralApiId}?populate=*`;

  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const snippet = body.slice(0, 200).replace(/\s+/g, " ").trim();

    throw new Error(
      `Failed to fetch Maldevelopment.
URL: ${url}
Status: ${response.status} ${response.statusText}
Body: ${snippet}`,
    );
  }

  const json = await response.json();
  return Array.isArray(json.data) ? json.data : [];
}

export async function getProjects() {
  const baseUrl = getStrapiBaseUrl();
  const pluralApiId = "project-plannings";

  // If the env already ends with /api, do not add /api again.
  const apiBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
  const url = `${apiBase}/${pluralApiId}?populate=*`;

  // Public content: the Strapi Public role has read access, so no token is sent.
  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const snippet = body.slice(0, 200).replace(/\s+/g, " ").trim();

    throw new Error(
      `Failed to fetch projects.
URL: ${url}
Status: ${response.status} ${response.statusText}
Body: ${snippet}`
    );
  }

  const json = await response.json();
  return Array.isArray(json.data) ? json.data : [];
}
