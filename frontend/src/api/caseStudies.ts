/**
 * API functions for fetching case studies from different DynamoDB tables
 * Fetches from AWS API Gateway endpoints
 */

import type { CaseStudy } from "@/types/caseStudies";

const BASE_API_URL = "https://xwo9yyyg6c.execute-api.us-east-2.amazonaws.com/dev";

const PROJECTS_API_URL = `${BASE_API_URL}/casestudies`;
const POLICIES_API_URL = `${BASE_API_URL}/policies`;
const MALDEVELOPMENT_API_URL = `${BASE_API_URL}/maldevelopment`;

/**
 * Generic function to fetch case studies from an API endpoint
 */
async function fetchFromEndpoint(url: string): Promise<CaseStudy[]> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch case studies: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  
  // Handle both array response and wrapped response
  if (Array.isArray(data)) {
    return data;
  }
  
  // If response is wrapped in a data property
  if (data.data && Array.isArray(data.data)) {
    return data.data;
  }
  
  // Fallback: return empty array if structure is unexpected
  return [];
}

/**
 * Fetches all case studies (Projects) from the API
 * @returns Promise<CaseStudy[]> Array of case studies
 * @throws Error if the request fails
 */
export async function fetchProjects(): Promise<CaseStudy[]> {
  return fetchFromEndpoint(PROJECTS_API_URL);
}

/**
 * Fetches all case studies (Policies) from the API
 * @returns Promise<CaseStudy[]> Array of case studies
 * @throws Error if the request fails
 */
export async function fetchPolicies(): Promise<CaseStudy[]> {
  return fetchFromEndpoint(POLICIES_API_URL);
}

/**
 * Fetches all case studies (Maldevelopment) from the API
 * @returns Promise<CaseStudy[]> Array of case studies
 * @throws Error if the request fails
 */
export async function fetchMaldevelopment(): Promise<CaseStudy[]> {
  return fetchFromEndpoint(MALDEVELOPMENT_API_URL);
}

/**
 * Fetches all worthwhile case studies (Projects + Policies combined)
 * @returns Promise<CaseStudy[]> Combined array of projects and policies
 */
export async function fetchWorthwhile(): Promise<CaseStudy[]> {
  try {
    const [projects, policies] = await Promise.all([
      fetchProjects(),
      fetchPolicies().catch(() => []), // Gracefully handle if policies endpoint doesn't exist yet
    ]);
    return [...projects, ...policies];
  } catch (error) {
    // If projects fails, try to return policies only
    try {
      return await fetchPolicies();
    } catch {
      throw error;
    }
  }
}

