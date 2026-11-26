import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  exchangeProviderToken: vi.fn(),
  loginWithToken: vi.fn(),
}));
vi.mock("@/api/auth", () => ({
  exchangeProviderToken: mocks.exchangeProviderToken,
  RETURN_TO_KEY: "gdd.auth.returnTo",
}));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ loginWithToken: mocks.loginWithToken }),
}));

import AuthCallback from "@/pages/auth/AuthCallback";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/auth/callback/:provider" element={<AuthCallback />} />
        <Route path="/" element={<p>home</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

describe("AuthCallback", () => {
  it("signs in from the session cookie when Strapi sends no token", async () => {
    mocks.exchangeProviderToken.mockResolvedValue({ jwt: "jwt-1", user: {} });
    mocks.loginWithToken.mockResolvedValue({});
    renderAt("/auth/callback/google");

    expect(await screen.findByText("home")).toBeInTheDocument();
    expect(mocks.exchangeProviderToken).toHaveBeenCalledWith("google", null);
    expect(mocks.loginWithToken).toHaveBeenCalledWith("jwt-1");
  });

  it("passes an access token through when Strapi sends one", async () => {
    mocks.exchangeProviderToken.mockResolvedValue({ jwt: "jwt-2", user: {} });
    mocks.loginWithToken.mockResolvedValue({});
    renderAt("/auth/callback/google?access_token=tok");

    expect(await screen.findByText("home")).toBeInTheDocument();
    expect(mocks.exchangeProviderToken).toHaveBeenCalledWith("google", "tok");
  });

  it("shows the provider error without calling the API", () => {
    renderAt("/auth/callback/google?error=oauth_error&error_description=OAuth2+state+mismatch");

    expect(screen.getByRole("alert")).toHaveTextContent("OAuth2 state mismatch");
    expect(mocks.exchangeProviderToken).not.toHaveBeenCalled();
  });
});
