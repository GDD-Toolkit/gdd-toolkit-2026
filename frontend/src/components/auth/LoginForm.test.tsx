import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ login: vi.fn() }));
vi.mock("@/hooks/useAuth", () => ({ useAuth: () => ({ login: mocks.login }) }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { LoginForm } from "@/components/auth/LoginForm";

async function fillCredentials(password = "secret123") {
  await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
  await userEvent.type(screen.getByLabelText("Password"), password);
}

beforeEach(() => {
  mocks.login.mockReset();
});

describe("LoginForm", () => {
  it("submits credentials with remember-me on by default", async () => {
    mocks.login.mockResolvedValue({ username: "ada@example.com", email: "ada@example.com" });
    render(<LoginForm onForgotPassword={() => {}} />);

    await fillCredentials();
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(mocks.login).toHaveBeenCalledWith(
      { identifier: "ada@example.com", password: "secret123" },
      { remember: true },
    );
  });

  it("passes remember: false when the box is unchecked", async () => {
    mocks.login.mockResolvedValue({ username: "ada@example.com", email: "ada@example.com" });
    render(<LoginForm onForgotPassword={() => {}} />);

    await fillCredentials();
    await userEvent.click(screen.getByRole("checkbox", { name: "Remember me" }));
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(mocks.login).toHaveBeenCalledWith(expect.anything(), { remember: false });
  });

  it("shows Strapi's error inline", async () => {
    mocks.login.mockRejectedValue(new Error("Invalid identifier or password"));
    render(<LoginForm onForgotPassword={() => {}} />);

    await fillCredentials("wrong");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid identifier or password");
  });

  it("hands off to the forgot-password view", async () => {
    const onForgotPassword = vi.fn();
    render(<LoginForm onForgotPassword={onForgotPassword} />);

    await userEvent.click(screen.getByRole("button", { name: "Forgot password?" }));

    expect(onForgotPassword).toHaveBeenCalledTimes(1);
  });
});
