function getStrapiBaseUrl(): string {
  const url = import.meta.env.VITE_STRAPI_URL;
  if (!url) {
    throw new Error("Missing VITE_STRAPI_URL. Add it to your frontend .env file.");
  }

  // Remove trailing slash so URL building stays clean.
  return url.replace(/\/$/, "");
}

function buildStrapiHeaders(): HeadersInit {
  const token = import.meta.env.VITE_STRAPI_API_TOKEN;

  // If no token is set, return an empty headers object.
  if (!token) {
    return {};
  }

  // Send the Strapi API token as a Bearer token.
  return {
    Authorization: `Bearer ${token}`,
  };
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

  // Send a GET request to Strapi with the token header if available.
  const response = await fetch(url, {
    method: "GET",
    headers: buildStrapiHeaders(),
  });

  // If the request failed, throw an error so the component can handle it.
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const snippet = body.slice(0, 200).replace(/\s+/g, " ").trim();

    throw new Error(
      `Failed to fetch cohorts.\nURL: ${url}\nStatus: ${response.status} ${response.statusText}\nBody: ${snippet}`
    );
  }

  // Parse the JSON body from Strapi.
  const json = await response.json();
  // Return the array inside the "data" key.
  // Example shape in Strapi v5:
  // { data: [{ id, documentId, year, ... }], meta: {...} }
  return Array.isArray(json.data) ? json.data : [];
}


export async function getTeams() {
  const baseUrl = getStrapiBaseUrl();
  const pluralApiId = "teams";

  // If the env already ends with /api, do not add /api again.
  const apiBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
  const url = `${apiBase}/${pluralApiId}?populate=*`;

  // Send a GET request to Strapi with the token header if available.
  const response = await fetch(url, {
    method: "GET",
    headers: buildStrapiHeaders(),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const snippet = body.slice(0, 200).replace(/\s+/g, " ").trim();

    throw new Error(
      `Failed to fetch Maldevelopment data.
URL: ${url}
Status: ${response.status} ${response.statusText}
Body: ${snippet}`
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
    headers: buildStrapiHeaders(),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const snippet = body.slice(0, 200).replace(/\s+/g, " ").trim();

    throw new Error(
      `Failed to fetch Maldevelopment.
URL: ${url}
Status: ${response.status} ${response.statusText}
Body: ${snippet}`
    );
  }

  const json = await response.json();
  return Array.isArray(json.data) ? json.data : [];
}