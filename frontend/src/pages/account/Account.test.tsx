import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UserProfile } from "@/types/auth";

const mocks = vi.hoisted(() => ({
  updateProfile: vi.fn(),
  user: null as UserProfile | null,
}));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: mocks.user,
    updateProfile: mocks.updateProfile,
    isBookmarked: () => false,
    toggleBookmark: vi.fn(),
  }),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import AccountPage from "@/pages/account/Account";

const member = {
  id: 1,
  documentId: "u1",
  username: "ada@example.com",
  email: "ada@example.com",
  provider: "local",
  confirmed: true,
  blocked: false,
  role: { id: 3, name: "Student", type: "student" },
  firstName: "Ada",
  lastName: "Lovelace",
  institution: "UMD",
  occupation: "Graduate student",
  country: "Kenya",
  language: "sw",
  interests: ["health", "economic"],
  onboardingComplete: true,
  createdAt: "",
  updatedAt: "",
} as UserProfile;

beforeEach(() => {
  mocks.updateProfile.mockReset();
  mocks.user = member;
});

describe("AccountPage profile section", () => {
  it("shows the onboarding answers, with the language spelled out and interests as badges", () => {
    render(<AccountPage />);

    const profile = within(screen.getByRole("region", { name: "Profile" }));
    expect(profile.getByText("Graduate student")).toBeInTheDocument();
    expect(profile.getByText("UMD")).toBeInTheDocument();
    expect(profile.getByText("Kenya")).toBeInTheDocument();
    expect(profile.getByText("Swahili")).toBeInTheDocument();
    expect(profile.getByText("Health")).toBeInTheDocument();
    expect(profile.getByText("Economic")).toBeInTheDocument();
    expect(profile.queryByText("Environment")).not.toBeInTheDocument();
  });

  it("marks unanswered questions as not set", () => {
    mocks.user = { ...member, occupation: null, language: null, interests: [] };
    render(<AccountPage />);

    const profile = within(screen.getByRole("region", { name: "Profile" }));
    expect(profile.getAllByText("Not set").length).toBeGreaterThanOrEqual(3);
  });

  it("opens the edit dialog prefilled, saves the changes, and closes", async () => {
    mocks.updateProfile.mockResolvedValue({ ...member, occupation: "Program officer" });
    render(<AccountPage />);

    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    const dialog = screen.getByRole("dialog", { name: "Edit profile" });

    // Every answer is editable, including the name collected at sign-up.
    expect(within(dialog).getByLabelText("First name")).toHaveValue("Ada");
    expect(within(dialog).getByLabelText("Occupation")).toHaveValue("Graduate student");
    expect(within(dialog).getByLabelText("Country")).toHaveValue("Kenya");
    expect(within(dialog).getByLabelText("Preferred language")).toHaveValue("sw");
    expect(within(dialog).getByRole("checkbox", { name: "Health" })).toBeChecked();
    expect(within(dialog).getByRole("checkbox", { name: "Social" })).not.toBeChecked();

    await userEvent.clear(within(dialog).getByLabelText("Occupation"));
    await userEvent.type(within(dialog).getByLabelText("Occupation"), "Program officer");
    await userEvent.click(within(dialog).getByRole("checkbox", { name: "Social" }));
    await userEvent.click(within(dialog).getByRole("button", { name: "Save changes" }));

    expect(mocks.updateProfile).toHaveBeenCalledWith({
      firstName: "Ada",
      lastName: "Lovelace",
      occupation: "Program officer",
      institution: "UMD",
      country: "Kenya",
      language: "sw",
      interests: ["health", "economic", "social"],
      onboardingComplete: true,
    });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("keeps the dialog open and shows the error when saving fails", async () => {
    mocks.updateProfile.mockRejectedValue(new Error("occupation must be at most 100 characters"));
    render(<AccountPage />);

    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("occupation must be at most 100 characters");
    expect(screen.getByRole("dialog", { name: "Edit profile" })).toBeInTheDocument();
  });

  it("'Cancel' closes the dialog without saving", async () => {
    render(<AccountPage />);

    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(mocks.updateProfile).not.toHaveBeenCalled();
  });
});
