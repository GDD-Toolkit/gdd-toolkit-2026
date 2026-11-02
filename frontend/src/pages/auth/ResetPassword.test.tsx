import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  resetPassword: vi.fn(),
  loginWithToken: vi.fn(),
  openAuthModal: vi.fn(),
}));
vi.mock("@/api/auth", () => ({ resetPassword: mocks.resetPassword }));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ loginWithToken: mocks.loginWithToken, openAuthModal: mocks.openAuthModal }),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import ResetPassword from "@/pages/auth/ResetPassword";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<p>home</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillPasswords(password: string, confirmation: string) {
  await userEvent.type(screen.getByLabelText("New password"), password);
  await userEvent.type(screen.getByLabelText("Confirm new password"), confirmation);
  await userEvent.click(screen.getByRole("button", { name: "Update password" }));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ResetPassword", () => {
  it("explains when the link has no code", () => {
    renderAt("/auth/reset-password");
    expect(screen.getByRole("heading", { name: /incomplete/i })).toBeInTheDocument();
    expect(screen.queryByLabelText("New password")).not.toBeInTheDocument();
  });

  it("rejects mismatched passwords before calling the API", async () => {
    renderAt("/auth/reset-password?code=abc");
    await fillPasswords("newpass123", "different1");

    expect(screen.getByRole("alert")).toHaveTextContent("Passwords don't match.");
    expect(mocks.resetPassword).not.toHaveBeenCalled();
  });

  it("resets, signs the user in and goes home", async () => {
    mocks.resetPassword.mockResolvedValue({ jwt: "jwt-9", user: {} });
    mocks.loginWithToken.mockResolvedValue({});
    renderAt("/auth/reset-password?code=abc");

    await fillPasswords("newpass123", "newpass123");

    expect(mocks.resetPassword).toHaveBeenCalledWith("abc", "newpass123", "newpass123");
    expect(mocks.loginWithToken).toHaveBeenCalledWith("jwt-9");
    expect(await screen.findByText("home")).toBeInTheDocument();
  });

  it("shows the API error when the code is rejected", async () => {
    mocks.resetPassword.mockRejectedValue(new Error("Incorrect code provided"));
    renderAt("/auth/reset-password?code=stale");

    await fillPasswords("newpass123", "newpass123");

    expect(await screen.findByRole("alert")).toHaveTextContent("Incorrect code provided");
    expect(mocks.loginWithToken).not.toHaveBeenCalled();
  });
});
