import { createContext } from "react";
import type {
  BookmarkKind,
  LoginPayload,
  RegisterPayload,
  SiteRole,
  UserProfile,
} from "@/types/auth";

export type AuthStatus = "loading" | "authenticated" | "anonymous";
export type AuthModalTab = "sign-in" | "sign-up";
export type RegisterResult = "signed-in" | "confirmation-required";

export interface LoginOptions {
  /** Keep the session after the browser closes ("remember me"). Defaults to true. */
  remember?: boolean;
}

export interface AuthContextValue {
  status: AuthStatus;
  user: UserProfile | null;
  token: string | null;
  role: SiteRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload, options?: LoginOptions) => Promise<UserProfile>;
  register: (payload: RegisterPayload) => Promise<RegisterResult>;
  /** Accepts a JWT obtained elsewhere (OAuth callback, password reset) and loads the user. */
  loginWithToken: (jwt: string, options?: LoginOptions) => Promise<UserProfile>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isBookmarked: (kind: BookmarkKind, documentId: string) => boolean;
  toggleBookmark: (kind: BookmarkKind, documentId: string) => Promise<void>;
  authModal: { open: boolean; tab: AuthModalTab };
  openAuthModal: (tab?: AuthModalTab) => void;
  closeAuthModal: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
