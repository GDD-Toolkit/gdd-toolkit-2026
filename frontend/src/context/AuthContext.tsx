import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import * as authApi from "@/api/auth";
import { AuthApiError } from "@/api/auth";
import {
  AuthContext,
  type AuthContextValue,
  type AuthModalTab,
  type AuthStatus,
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
 * The Strapi JWT lives in localStorage (plan §5.4). That keeps the SPA simple
 * but means any XSS on this origin can read it; see the plan's open question 2.
 */
const TOKEN_KEY = "gdd.auth.token";

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeStoredToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage unavailable (private mode, blocked). The session lasts for this page load only.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readStoredToken);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() =>
    readStoredToken() ? "loading" : "anonymous",
  );
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: AuthModalTab }>({
    open: false,
    tab: "sign-in",
  });

  const establishSession = useCallback((jwt: string, profile: UserProfile) => {
    writeStoredToken(jwt);
    setToken(jwt);
    setUser(profile);
    setStatus("authenticated");
  }, []);

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
      .getMe(stored)
      .then((profile) => {
        if (!cancelled) establishSession(stored, profile);
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
    async (jwt: string) => {
      const profile = await authApi.getMe(jwt);
      establishSession(jwt, profile);
      return profile;
    },
    [establishSession],
  );

  const login = useCallback(
    async (payload: LoginPayload) => {
      const { jwt } = await authApi.login(payload);
      await loginWithToken(jwt);
      setAuthModal((modal) => ({ ...modal, open: false }));
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
