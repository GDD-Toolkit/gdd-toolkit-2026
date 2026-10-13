/**
 * Auth types for the Strapi v5 Users & Permissions plugin.
 * Site roles (issue #13): Public (anonymous), Student, Researcher, Admin.
 * The site "Admin" role is unrelated to Strapi admin-panel accounts.
 */

/** Strapi role `type` for signed-in site users. */
export type SiteRole = "student" | "researcher" | "admin";

export type UserRole = "Public" | "Student" | "Researcher" | "Admin";

export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  alternativeText?: string | null;
}

export interface BookmarkedTool {
  id: number;
  documentId: string;
  name: string;
}

export interface SavedGrant {
  id: number;
  documentId: string;
  grant_name: string;
}

export interface UserProfile {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider?: string;
  confirmed: boolean;
  blocked: boolean;
  role?: {
    id: number;
    name: string;
    type: string;
  };
  firstName?: string | null;
  lastName?: string | null;
  institution?: string | null;
  department?: string | null;
  bio?: string | null;
  avatar?: StrapiMedia | null;
  bookmarkedTools?: BookmarkedTool[];
  savedGrants?: SavedGrant[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  jwt: string;
  user: UserProfile;
}

/** Register response when email confirmation is enabled in Strapi: no JWT yet. */
export interface PendingConfirmationResponse {
  user: UserProfile;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  institution: string;
}

export interface LoginPayload {
  /** Email or username. */
  identifier: string;
  password: string;
}

export interface ProfileUpdatePayload {
  firstName?: string | null;
  lastName?: string | null;
  institution?: string | null;
  department?: string | null;
  bio?: string | null;
}

export type BookmarkKind = "tools" | "grants";

/** Site role of a user, or null for anything unexpected (e.g. legacy "authenticated"). */
export function siteRoleOf(user: UserProfile | null | undefined): SiteRole | null {
  const type = user?.role?.type;
  return type === "student" || type === "researcher" || type === "admin" ? type : null;
}

export function displayNameOf(user: UserProfile): string {
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return full || user.username || user.email;
}
