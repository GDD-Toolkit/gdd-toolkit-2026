import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/api/auth")>();
  return {
    ...actual,
    getMe: vi.fn(),
    login: vi.fn(),
    updateProfile: vi.fn(),
    addBookmark: vi.fn(),
    removeBookmark: vi.fn(),
  };
});

import * as authApi from "@/api/auth";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import type { UserProfile } from "@/types/auth";

const TOKEN_KEY = "gdd.auth.token";

const user = {
  id: 1,
  documentId: "u1",
  username: "ada@example.com",
  email: "ada@example.com",
  confirmed: true,
  blocked: false,
  role: { id: 3, name: "Student", type: "student" },
  firstName: "Ada",
  createdAt: "",
  updatedAt: "",
} as UserProfile;

const getMe = vi.mocked(authApi.getMe);
const login = vi.mocked(authApi.login);

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("session hydration", () => {
  it("restores a remembered session from localStorage", async () => {
    localStorage.setItem(TOKEN_KEY, "stored-jwt");
    getMe.mockResolvedValue(user);

    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.status).toBe("loading");

    await waitFor(() => expect(result.current.status).toBe("authenticated"));
    expect(getMe).toHaveBeenCalledWith("stored-jwt");
    expect(result.current.role).toBe("student");
    expect(localStorage.getItem(TOKEN_KEY)).toBe("stored-jwt");
  });

  it("keeps a session-only token in sessionStorage after hydration", async () => {
    sessionStorage.setItem(TOKEN_KEY, "tab-jwt");
    getMe.mockResolvedValue(user);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
    expect(sessionStorage.getItem(TOKEN_KEY)).toBe("tab-jwt");
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it("purges a token Strapi rejects", async () => {
    localStorage.setItem(TOKEN_KEY, "expired");
    getMe.mockRejectedValue(new authApi.AuthApiError("Unauthorized", 401));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe("anonymous"));
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });
});

describe("login", () => {
  it("remembers the session by default", async () => {
    login.mockResolvedValue({ jwt: "jwt-1", user });
    getMe.mockResolvedValue(user);
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ identifier: "ada@example.com", password: "pw" });
    });

    expect(localStorage.getItem(TOKEN_KEY)).toBe("jwt-1");
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(result.current.user?.email).toBe("ada@example.com");
    expect(result.current.authModal.open).toBe(false);
  });

  it("uses sessionStorage when remember is off", async () => {
    login.mockResolvedValue({ jwt: "jwt-2", user });
    getMe.mockResolvedValue(user);
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ identifier: "ada@example.com", password: "pw" }, { remember: false });
    });

    expect(sessionStorage.getItem(TOKEN_KEY)).toBe("jwt-2");
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it("logout clears both stores", async () => {
    login.mockResolvedValue({ jwt: "jwt-3", user });
    getMe.mockResolvedValue(user);
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ identifier: "ada@example.com", password: "pw" });
    });
    act(() => result.current.logout());

    expect(result.current.status).toBe("anonymous");
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
  });
});

describe("bookmarks", () => {
  it("opens the sign-in dialog instead of calling the API for guests", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.toggleBookmark("tools", "t1");
    });

    expect(result.current.authModal).toEqual({ open: true, tab: "sign-in" });
    expect(authApi.addBookmark).not.toHaveBeenCalled();
  });
});

describe("profile", () => {
  it("updateProfile sends the token and stores the returned user", async () => {
    login.mockResolvedValue({ jwt: "jwt-4", user });
    getMe.mockResolvedValue(user);
    vi.mocked(authApi.updateProfile).mockResolvedValue({
      ...user,
      occupation: "Analyst",
      onboardingComplete: true,
    });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ identifier: "ada@example.com", password: "pw" });
    });
    await act(async () => {
      await result.current.updateProfile({ occupation: "Analyst", onboardingComplete: true });
    });

    expect(authApi.updateProfile).toHaveBeenCalledWith("jwt-4", {
      occupation: "Analyst",
      onboardingComplete: true,
    });
    expect(result.current.user?.onboardingComplete).toBe(true);
  });
});
