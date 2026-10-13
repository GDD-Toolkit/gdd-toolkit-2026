/**
 * Auth and account calls against the Strapi Users & Permissions plugin.
 * All requests go to VITE_STRAPI_URL; the JWT is passed explicitly so this
 * module stays free of React state.
 */
import type {
  AuthResponse,
  BookmarkKind,
  LoginPayload,
  PendingConfirmationResponse,
  ProfileUpdatePayload,
  RegisterPayload,
  UserProfile,
} from "@/types/auth";

export class AuthApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.details = details;
  }
}

export function strapiApiBase(): string {
  const url = import.meta.env.VITE_STRAPI_URL;
  if (!url) {
    throw new Error("Missing VITE_STRAPI_URL. Add it to your frontend .env file.");
  }
  const base = url.replace(/\/$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  token?: string | null;
  body?: unknown;
}

async function request<T>(path: string, { method = "GET", token, body }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${strapiApiBase()}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      json?.error?.message ?? `Request failed: ${response.status} ${response.statusText}`;
    throw new AuthApiError(message, response.status, json?.error?.details);
  }

  return json as T;
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/local", { method: "POST", body: payload });
}

/**
 * Registers a new user. Strapi assigns the default role (Student); the role
 * cannot be chosen by the client. The username is set to the email because
 * the sign-up form has no separate handle field.
 */
export function register(
  payload: RegisterPayload,
): Promise<AuthResponse | PendingConfirmationResponse> {
  const email = payload.email.trim().toLowerCase();
  return request("/auth/local/register", {
    method: "POST",
    body: {
      username: email,
      email,
      password: payload.password,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      institution: payload.institution.trim(),
    },
  });
}

/**
 * Current user with role, profile fields and bookmarks. Served by the custom
 * account API because the stock /users/me strips the role relation.
 */
export function getMe(token: string): Promise<UserProfile> {
  return request<UserProfile>("/account/me", { token });
}

/** sessionStorage key: where to send the user after the OAuth callback finishes. */
export const RETURN_TO_KEY = "gdd.auth.returnTo";

/** Browser URL that starts the OAuth dance for a provider (e.g. "google"). */
export function providerConnectUrl(provider: string): string {
  return `${strapiApiBase()}/connect/${provider}`;
}

/** Exchanges the provider access token Strapi sent back for a Strapi JWT. */
export function exchangeProviderToken(provider: string, accessToken: string): Promise<AuthResponse> {
  const query = new URLSearchParams({ access_token: accessToken });
  return request<AuthResponse>(`/auth/${provider}/callback?${query}`);
}

export function updateProfile(token: string, payload: ProfileUpdatePayload): Promise<UserProfile> {
  return request<UserProfile>("/account/profile", { method: "PUT", token, body: payload });
}

export function addBookmark(token: string, kind: BookmarkKind, documentId: string): Promise<UserProfile> {
  return request<UserProfile>(`/account/bookmarks/${kind}/${encodeURIComponent(documentId)}`, {
    method: "POST",
    token,
  });
}

export function removeBookmark(token: string, kind: BookmarkKind, documentId: string): Promise<UserProfile> {
  return request<UserProfile>(`/account/bookmarks/${kind}/${encodeURIComponent(documentId)}`, {
    method: "DELETE",
    token,
  });
}

/** Absolute URL for a Strapi media file (local provider returns relative paths). */
export function strapiMediaUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url;
  const origin = strapiApiBase().replace(/\/api$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}
