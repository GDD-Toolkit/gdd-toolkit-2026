import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SiteRole } from "@/types/auth";

const mocks = vi.hoisted(() => ({
  role: "student" as SiteRole | null,
  toggleBookmark: vi.fn(),
  openAuthModal: vi.fn(),
}));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    role: mocks.role,
    token: mocks.role ? "jwt" : null,
    isAuthenticated: mocks.role !== null,
    isBookmarked: () => false,
    toggleBookmark: mocks.toggleBookmark,
    openAuthModal: mocks.openAuthModal,
  }),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { GrantCard } from "@/components/grants/GrantCard";
import { sampleGrant, sampleSources } from "@/test/fixtures/grant";

beforeEach(() => {
  mocks.role = "student";
  mocks.toggleBookmark.mockReset();
});

describe("GrantCard", () => {
  it("shows the headline facts, provenance and the apply link", () => {
    render(<GrantCard grant={sampleGrant} sources={sampleSources} onOpen={vi.fn()} />);

    expect(screen.getByRole("heading", { name: sampleGrant.title })).toBeInTheDocument();
    expect(screen.getByText(/Example Foundation/)).toBeInTheDocument();
    expect(screen.getByText("$5k–$50k")).toBeInTheDocument();
    expect(screen.getByText(/Closes 31 Mar 2027/)).toBeInTheDocument();
    expect(screen.getByText(/Grants\.gov · verified 3 Nov 2026/)).toBeInTheDocument();
    expect(screen.getByText("SDG 6")).toBeInTheDocument();
    expect(screen.getByText("Philippines & SEA")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Apply/ })).toHaveAttribute("href", sampleGrant.apply_url);
  });

  it("has a bookmark button and opens the detail on the title", async () => {
    const onOpen = vi.fn();
    render(<GrantCard grant={sampleGrant} sources={sampleSources} onOpen={onOpen} />);

    expect(screen.getByRole("button", { name: `Save ${sampleGrant.title}` })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: sampleGrant.title }));
    expect(onOpen).toHaveBeenCalledWith(sampleGrant);
  });

  it("hides the curation controls from students and shows them to site admins", () => {
    const { unmount } = render(<GrantCard grant={sampleGrant} sources={sampleSources} onOpen={vi.fn()} />);
    expect(screen.queryByRole("button", { name: `Hide ${sampleGrant.title}` })).not.toBeInTheDocument();
    unmount();

    mocks.role = "admin";
    render(<GrantCard grant={sampleGrant} sources={sampleSources} onOpen={vi.fn()} />);
    expect(screen.getByRole("button", { name: `Hide ${sampleGrant.title}` })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: `Feature ${sampleGrant.title}` })).toBeInTheDocument();
  });

  it("labels featured and hidden rows", () => {
    const { rerender } = render(
      <GrantCard grant={{ ...sampleGrant, curation: "featured" }} sources={sampleSources} onOpen={vi.fn()} />,
    );
    expect(screen.getByText("Featured")).toBeInTheDocument();
    rerender(<GrantCard grant={{ ...sampleGrant, curation: "hidden" }} sources={sampleSources} onOpen={vi.fn()} />);
    expect(screen.getByText("Hidden")).toBeInTheDocument();
  });
});
