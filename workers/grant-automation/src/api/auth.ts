// The only authenticated route is the admin curation PATCH. The caller sends
// the Strapi users-permissions JWT; we forward it to Strapi's own account
// endpoint, which validates the token and returns the role. No secret is
// shared with this process and Strapi stays the single authority on who is
// a site admin.
import { z } from "zod";
import { ApiError } from "./errors.js";

const StrapiMe = z.object({
  id: z.number().int(),
  confirmed: z.boolean(),
  blocked: z.boolean(),
  role: z.object({ type: z.string() }).nullable().optional(),
});

export type SiteAdmin = { id: number };

export async function requireSiteAdmin(authorization: string | undefined, strapiUrl: string): Promise<SiteAdmin> {
  const token = /^Bearer\s+(.+)$/i.exec(authorization ?? "")?.[1];
  if (!token) throw new ApiError(401, "Sign in required");

  let response: Response;
  try {
    response = await fetch(`${strapiUrl.replace(/\/$/, "")}/api/account/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new ApiError(502, "Could not reach the sign-in service");
  }
  if (response.status === 401 || response.status === 403) throw new ApiError(401, "Invalid or expired session");
  if (!response.ok) throw new ApiError(502, "Could not verify the session");

  const me = StrapiMe.safeParse(await response.json().catch(() => null));
  if (!me.success) throw new ApiError(502, "Unexpected reply from the sign-in service");
  if (!me.data.confirmed || me.data.blocked || me.data.role?.type !== "admin") {
    throw new ApiError(403, "Site admin role required");
  }
  return { id: me.data.id };
}

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const hits = new Map<number, number[]>();

/** At most 30 curation changes per admin per minute. */
export function rateLimit(userId: number, now = Date.now()): void {
  const recent = (hits.get(userId) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) throw new ApiError(429, "Too many changes; wait a minute");
  recent.push(now);
  hits.set(userId, recent);
}
