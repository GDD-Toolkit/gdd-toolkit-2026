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

export type StrapiMediaFormat = {
  url?: string | null;
  width?: number | null;
  height?: number | null;
};

export type StrapiMedia = {
  id?: number;
  documentId?: string;
  url?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: {
    thumbnail?: StrapiMediaFormat | null;
    small?: StrapiMediaFormat | null;
    medium?: StrapiMediaFormat | null;
    large?: StrapiMediaFormat | null;
  } | null;
  data?: {
    attributes?: {
      url?: string | null;
      alternativeText?: string | null;
      formats?: {
        thumbnail?: StrapiMediaFormat | null;
        small?: StrapiMediaFormat | null;
        medium?: StrapiMediaFormat | null;
        large?: StrapiMediaFormat | null;
      } | null;
    };
  } | null;
};

export type StrapiTeammate = {
  id?: number;
  member_name?: string | null;
  is_prm?: boolean | null;
  linkedin_url?: string | null;
  headshot?: StrapiMedia | null;
  full_body_photo?: StrapiMedia | null;
};

/**
 * Resolves a Strapi media URL (absolute S3/CDN URL or relative `/uploads/...` path)
 * into a browser-loadable URL.
 */
export function resolveStrapiMediaUrl(
  url?: string | null,
): string | undefined {
  const trimmed = url?.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (!trimmed.startsWith("/")) return undefined;

  const base = import.meta.env.VITE_STRAPI_URL?.replace(/\/$/, "");
  if (!base) return trimmed;
  const origin = base.endsWith("/api") ? base.slice(0, -4) : base;
  return `${origin}${trimmed}`;
}

export type StrapiTeam = {
  id?: number;
  documentId?: string;
  Team_name?: string | null;
  purpose?: string | null;
  description?: string | null;
  teammates?: StrapiTeammate[] | null;
  attributes?: {
    Team_name?: string | null;
    purpose?: string | null;
    description?: string | null;
    teammates?: StrapiTeammate[] | null;
  };
};

export type StrapiCohort = {
  id?: number;
  documentId?: string;
  year?: number | null;
  teams?: StrapiTeam[] | { data?: StrapiTeam[] } | null;
  attributes?: {
    year?: number | null;
    teams?: StrapiTeam[] | { data?: StrapiTeam[] } | null;
  };
};

function unwrapStrapiTeams(
  raw: StrapiTeam[] | { data?: StrapiTeam[] } | null | undefined,
): StrapiTeam[] {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  return [];
}

/**
 * Fetch all published Cohorts from Strapi with nested Teams, Teammates, and
 * teammate media (`headshot`, `full_body_photo`), sorted newest cohort first.
 *
 * Uses deep populate (`populate[teams][populate][teammates][populate]=*`) for Strapi v5,
 * and merges from `/api/teams?populate[teammates][populate]=*` if a Strapi instance
 * omits nested teammates.
 */
export async function getCohortsWithTeams(
  signal?: AbortSignal,
): Promise<StrapiCohort[]> {
  const baseUrl = getStrapiBaseUrl();
  const apiBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

  const cohorts: StrapiCohort[] = [];
  let page = 1;
  let pageCount = 1;

  do {
    const query = new URLSearchParams({
      "populate[teams][populate][teammates][populate]": "*",
      "sort[0]": "year:desc",
      "pagination[page]": String(page),
      "pagination[pageSize]": "100",
    });
    const url = `${apiBase}/coherts?${query.toString()}`;
    const response = await fetch(url, { method: "GET", signal });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      const snippet = body.slice(0, 200).replace(/\s+/g, " ").trim();
      throw new Error(
        `Failed to fetch cohorts with teams.\nURL: ${url}\nStatus: ${response.status} ${response.statusText}\nBody: ${snippet}`,
      );
    }

    const json = await response.json();
    const batch = Array.isArray(json?.data) ? (json.data as StrapiCohort[]) : [];
    cohorts.push(...batch);

    const count = json?.meta?.pagination?.pageCount;
    pageCount = Number.isInteger(count) && count > 0 ? count : 1;
    page += 1;
  } while (page <= pageCount);

  // Check whether any team lacked nested teammates; if so, enrich from /api/teams
  const needsTeamHydration = cohorts.some((cohort) => {
    const teams = unwrapStrapiTeams(cohort.teams ?? cohort.attributes?.teams);
    return teams.some((team) => {
      const mates = team.teammates ?? team.attributes?.teammates;
      return !Array.isArray(mates);
    });
  });

  if (needsTeamHydration) {
    try {
      const teamQuery = new URLSearchParams({
        "populate[teammates][populate]": "*",
        "pagination[pageSize]": "100",
      });
      const teamRes = await fetch(`${apiBase}/teams?${teamQuery.toString()}`, {
        method: "GET",
        signal,
      });
      if (teamRes.ok) {
        const teamJson = await teamRes.json();
        const allTeams: StrapiTeam[] = Array.isArray(teamJson?.data)
          ? teamJson.data
          : [];
        const byDocId = new Map<string, StrapiTeam>();
        const byId = new Map<number, StrapiTeam>();
        for (const t of allTeams) {
          if (t.documentId) byDocId.set(t.documentId, t);
          if (typeof t.id === "number") byId.set(t.id, t);
        }
        for (const cohort of cohorts) {
          const teams = unwrapStrapiTeams(
            cohort.teams ?? cohort.attributes?.teams,
          );
          const merged = teams.map((team) => {
            const mates = team.teammates ?? team.attributes?.teammates;
            if (Array.isArray(mates)) return team;
            const full =
              (team.documentId ? byDocId.get(team.documentId) : undefined) ??
              (typeof team.id === "number" ? byId.get(team.id) : undefined);
            if (!full) return team;
            return {
              ...team,
              Team_name:
                team.Team_name ??
                team.attributes?.Team_name ??
                full.Team_name ??
                full.attributes?.Team_name,
              purpose:
                team.purpose ??
                team.attributes?.purpose ??
                full.purpose ??
                full.attributes?.purpose,
              description:
                team.description ??
                team.attributes?.description ??
                full.description ??
                full.attributes?.description,
              teammates: full.teammates ?? full.attributes?.teammates ?? [],
            };
          });
          cohort.teams = merged;
        }
      }
    } catch {
      // Non-fatal: keep whatever cohort/team data we already received.
    }
  }

  return cohorts.sort((a, b) => {
    const yearA = Number(a.year ?? a.attributes?.year ?? 0);
    const yearB = Number(b.year ?? b.attributes?.year ?? 0);
    return yearB - yearA;
  });
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


export async function getAITools() {
  const baseUrl = getStrapiBaseUrl();
  const apiBase = baseUrl.endsWith("/api")
    ? baseUrl
    : `${baseUrl}/api`;

  const allTools = [];
  let page = 1;
  let pageCount = 1;

  do {
    const params = new URLSearchParams({
      populate: "*",
      "pagination[page]": String(page),
      "pagination[pageSize]": "25",
      sort: "id:asc",
    });

    const response = await fetch(
      `${apiBase}/ai-tools?${params}`,
      {
        method: "GET",
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");

      throw new Error(
        `Failed to fetch AI tools. Status: ${response.status}. Body: ${body.slice(0, 200)}`
      );
    }

    const json = await response.json();

    if (Array.isArray(json.data)) {
      allTools.push(...json.data);
    }

    pageCount = json.meta?.pagination?.pageCount ?? 1;
    page++;
  } while (page <= pageCount);

  return allTools;
}
