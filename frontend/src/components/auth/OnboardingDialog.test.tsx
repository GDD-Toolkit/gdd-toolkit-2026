import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UserProfile } from "@/types/auth";

const mocks = vi.hoisted(() => ({
  updateProfile: vi.fn(),
  auth: {
    user: null as UserProfile | null,
    isAuthenticated: false,
    authModal: { open: false, tab: "sign-in" },
  },
}));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ ...mocks.auth, updateProfile: mocks.updateProfile }),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { OnboardingDialog } from "@/components/auth/OnboardingDialog";

const newUser = {
  id: 1,
  documentId: "u1",
  username: "ada@example.com",
  email: "ada@example.com",
  confirmed: true,
  blocked: false,
  role: { id: 3, name: "Student", type: "student" },
  firstName: "Ada",
  lastName: "Lovelace",
  institution: "UMD",
  onboardingComplete: false,
  createdAt: "",
  updatedAt: "",
} as UserProfile;

function signIn(user: UserProfile) {
  mocks.auth.user = user;
  mocks.auth.isAuthenticated = true;
}

beforeEach(() => {
  mocks.updateProfile.mockReset();
  mocks.auth.user = null;
  mocks.auth.isAuthenticated = false;
  mocks.auth.authModal = { open: false, tab: "sign-in" };
});

describe("OnboardingDialog", () => {
  it("stays closed for guests and for users who already finished", () => {
    const { rerender } = render(<OnboardingDialog />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    signIn({ ...newUser, onboardingComplete: true });
    rerender(<OnboardingDialog />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("prompts a signed-in user who has not answered yet", () => {
    signIn(newUser);
    render(<OnboardingDialog />);

    expect(screen.getByRole("dialog", { name: "Tell us about yourself" })).toBeInTheDocument();
    // The name was collected at sign-up, so it is not asked again.
    expect(screen.queryByLabelText("First name")).not.toBeInTheDocument();
  });

  it("offers a full language list in the dropdown", () => {
    signIn(newUser);
    render(<OnboardingDialog />);

    const options = Array.from(screen.getByLabelText("Preferred language").querySelectorAll("option"));
    expect(options.length).toBeGreaterThan(150);
    expect(options.map((option) => option.textContent)).toEqual(
      expect.arrayContaining(["English", "Swahili", "Tagalog"]),
    );
  });

  it("asks for a name when the account has none, as with Google sign-up", () => {
    signIn({ ...newUser, firstName: null, lastName: null, institution: null });
    render(<OnboardingDialog />);

    expect(screen.getByLabelText("First name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last name")).toBeInTheDocument();
  });

  it("requires every answer before saving", async () => {
    signIn(newUser);
    render(<OnboardingDialog />);

    await userEvent.click(screen.getByRole("button", { name: "Save answers" }));

    expect(screen.getByText("Occupation is required.")).toBeInTheDocument();
    expect(screen.getByText("Choose your country.")).toBeInTheDocument();
    expect(screen.getByText("Choose your preferred language.")).toBeInTheDocument();
    expect(screen.getByText("Pick at least one interest.")).toBeInTheDocument();
    expect(mocks.updateProfile).not.toHaveBeenCalled();
  });

  it("saves the answers and marks onboarding complete", async () => {
    signIn(newUser);
    mocks.updateProfile.mockResolvedValue({ ...newUser, onboardingComplete: true });
    render(<OnboardingDialog />);

    await userEvent.type(screen.getByLabelText("Occupation"), "Graduate student");
    await userEvent.selectOptions(screen.getByLabelText("Country"), "Kenya");
    await userEvent.selectOptions(screen.getByLabelText("Preferred language"), "sw");
    await userEvent.click(screen.getByRole("checkbox", { name: "Health" }));
    await userEvent.click(screen.getByRole("checkbox", { name: "Economic" }));
    await userEvent.click(screen.getByRole("button", { name: "Save answers" }));

    expect(mocks.updateProfile).toHaveBeenCalledWith({
      firstName: "Ada",
      lastName: "Lovelace",
      occupation: "Graduate student",
      institution: "UMD",
      country: "Kenya",
      language: "sw",
      interests: ["health", "economic"],
      onboardingComplete: true,
    });
  });

  it("shows the server's message when saving fails", async () => {
    signIn({
      ...newUser,
      occupation: "Analyst",
      country: "Kenya",
      language: "en",
      interests: ["social"],
    });
    mocks.updateProfile.mockRejectedValue(new Error("Answer these before finishing onboarding: institution"));
    render(<OnboardingDialog />);

    await userEvent.click(screen.getByRole("button", { name: "Save answers" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Answer these before finishing onboarding");
  });

  it("'Later' hides the prompt for this visit without saving", async () => {
    signIn(newUser);
    render(<OnboardingDialog />);

    await userEvent.click(screen.getByRole("button", { name: "Later" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(mocks.updateProfile).not.toHaveBeenCalled();
  });
});
