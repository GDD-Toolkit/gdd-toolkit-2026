import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import * as authApi from "@/api/auth";
import { AuthApiError } from "@/api/auth";
import {
  AuthContext,
  type AuthContextValue,
  type AuthModalTab,
  type AuthStatus,
  type LoginOptions,
  type RegisterResult,
} from "@/context/auth-context";
import {
  siteRoleOf,
  type BookmarkKind,
  type LoginPayload,
  type RegisterPayload,
  type UserProfile,
} from "@/types/auth";

/**
 * The Strapi JWT lives in web storage (plan §5.4). That keeps the SPA simple
 * but means any XSS on this origin can read it; see the plan's open question 2.
 * "Remember me" keeps it in localStorage (survives closing the browser);
 * otherwise it goes to sessionStorage and ends with the tab.
 */
const TOKEN_KEY = "gdd.auth.token";

type TokenStore = "local" | "session";

function readStoredToken(): { token: string; store: TokenStore } | null {
  try {
    const local = localStorage.getItem(TOKEN_KEY);
    if (local) return { token: local, store: "local" };
    const session = sessionStorage.getItem(TOKEN_KEY);
    if (session) return { token: session, store: "session" };
  } catch {
    // Storage unavailable (private mode, blocked).
  }
  return null;
}

function writeStoredToken(token: string | null, store: TokenStore = "local") {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    if (token) (store === "local" ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  } catch {
    // Storage unavailable. The session lasts for this page load only.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readStoredToken()?.token ?? null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() =>
    readStoredToken() ? "loading" : "anonymous",
  );
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: AuthModalTab }>({
    open: false,
    tab: "sign-in",
  });

  const establishSession = useCallback(
    (jwt: string, profile: UserProfile, store: TokenStore = "local") => {
      writeStoredToken(jwt, store);
      setToken(jwt);
      setUser(profile);
      setStatus("authenticated");
    },
    [],
  );

  const clearSession = useCallback(() => {
    writeStoredToken(null);
    setToken(null);
    setUser(null);
    setStatus("anonymous");
  }, []);

  // Session hydration: verify the stored token against Strapi on startup.
  useEffect(() => {
    const stored = readStoredToken();
    if (!stored) return;

    let cancelled = false;
    authApi
      .getMe(stored.token)
      .then((profile) => {
        if (!cancelled) establishSession(stored.token, profile, stored.store);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const rejected =
          error instanceof AuthApiError && (error.status === 401 || error.status === 403);
        // Expired or revoked tokens are purged; a network failure just leaves the user signed out for now.
        if (rejected) clearSession();
        else setStatus("anonymous");
      });

    return () => {
      cancelled = true;
    };
  }, [establishSession, clearSession]);

  const loginWithToken = useCallback(
    async (jwt: string, { remember = true }: LoginOptions = {}) => {
      const profile = await authApi.getMe(jwt);
      establishSession(jwt, profile, remember ? "local" : "session");
      return profile;
    },
    [establishSession],
  );

  const login = useCallback(
    async (payload: LoginPayload, options?: LoginOptions) => {
      const { jwt } = await authApi.login(payload);
      const profile = await loginWithToken(jwt, options);
      setAuthModal((modal) => ({ ...modal, open: false }));
      return profile;
    },
    [loginWithToken],
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<RegisterResult> => {
      const response = await authApi.register(payload);
      if ("jwt" in response) {
        await loginWithToken(response.jwt);
        setAuthModal((modal) => ({ ...modal, open: false }));
        return "signed-in";
      }
      return "confirmation-required";
    },
    [loginWithToken],
  );

  const refreshUser = useCallback(async () => {
    if (!token) return;
    setUser(await authApi.getMe(token));
  }, [token]);

  const isBookmarked = useCallback(
    (kind: BookmarkKind, documentId: string) => {
      const list = kind === "tools" ? user?.bookmarkedTools : user?.savedGrants;
      return Boolean(list?.some((item) => item.documentId === documentId));
    },
    [user],
  );

  const toggleBookmark = useCallback(
    async (kind: BookmarkKind, documentId: string) => {
      if (!token || status !== "authenticated") {
        setAuthModal({ open: true, tab: "sign-in" });
        return;
      }
      const next = isBookmarked(kind, documentId)
        ? await authApi.removeBookmark(token, kind, documentId)
        : await authApi.addBookmark(token, kind, documentId);
      setUser(next);
    },
    [token, status, isBookmarked],
  );

  const openAuthModal = useCallback(
    (tab: AuthModalTab = "sign-in") => setAuthModal({ open: true, tab }),
    [],
  );
  const closeAuthModal = useCallback(
    () => setAuthModal((modal) => ({ ...modal, open: false })),
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      token,
      role: siteRoleOf(user),
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      login,
      register,
      loginWithToken,
      logout: clearSession,
      refreshUser,
      isBookmarked,
      toggleBookmark,
      authModal,
      openAuthModal,
      closeAuthModal,
    }),
    [
      status,
      user,
      token,
      login,
      register,
      loginWithToken,
      clearSession,
      refreshUser,
      isBookmarked,
      toggleBookmark,
      authModal,
      openAuthModal,
      closeAuthModal,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
