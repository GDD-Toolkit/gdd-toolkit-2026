import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Acknowledgements from "./Acknowledgements";

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const cohort2026 = {
  id: 10,
  documentId: "c-2026",
  year: 2026,
  teams: [
    {
      id: 22,
      documentId: "t-infra",
      Team_name: "Infrastructure and Interface",
      teammates: [
        { id: 1, member_name: "Alice Student", is_prm: false, linkedin_url: null },
        {
          id: 2,
          member_name: "Youssef Ali Ahmed",
          is_prm: true,
          linkedin_url: "https://www.linkedin.com/in/youssefaliahmed/",
        },
      ],
    },
    {
      id: 18,
      documentId: "t-ai",
      Team_name: "AI Development",
      teammates: [
        { id: 3, member_name: "Esha", is_prm: null, linkedin_url: "javascript:alert(1)" },
      ],
    },
  ],
};

const cohort2025 = {
  id: 9,
  documentId: "c-2025",
  year: 2025,
  teams: [
    {
      id: 11,
      documentId: "t-hcd",
      Team_name: "Human Centered Design",
      teammates: [
        { id: 4, member_name: "PRM: Rowan Kuske", is_prm: false, linkedin_url: null },
        { id: 5, member_name: "Donovan Campos", is_prm: false, linkedin_url: null },
      ],
    },
  ],
};

describe("Acknowledgements page", () => {
  it("loads cohorts from Strapi, renders PRMs and valid LinkedIn links, switches tabs, and searches across cohorts", async () => {
    vi.stubEnv("VITE_STRAPI_URL", "https://cms.example");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: [cohort2025, cohort2026],
          meta: { pagination: { pageCount: 1 } },
        }),
      }),
    );

    render(<Acknowledgements />);

    // Defaults to newest cohort (2026) and orders module teams alphabetically.
    const tab2026 = await screen.findByRole("tab", { name: "Cohort 2026" });
    expect(tab2026).toHaveAttribute("aria-selected", "true");

    const tabpanel = screen.getByRole("tabpanel", { name: "Cohort 2026" });
    const moduleHeadings = Array.from(tabpanel.querySelectorAll("h3")).map(
      (el) => el.textContent,
    );
    expect(moduleHeadings).toEqual(["AI Development", "Infrastructure and Interface"]);

    // Valid LinkedIn URL renders as an external link; unsafe protocol stays plain text.
    const prmLink = screen.getByRole("link", { name: "PRM Youssef Ali Ahmed on LinkedIn" });
    expect(prmLink).toHaveAttribute("href", "https://www.linkedin.com/in/youssefaliahmed/");
    expect(screen.getByText("Esha")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Esha/i })).not.toBeInTheDocument();

    // Switching tabs displays the other cohort and strips legacy "PRM:" prefix.
    await userEvent.click(screen.getByRole("tab", { name: "Cohort 2025" }));
    expect(
      await screen.findByRole("heading", { level: 3, name: "Human Centered Design" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Rowan Kuske")).toBeInTheDocument();
    expect(screen.getByText("Donovan Campos")).toBeInTheDocument();

    // Searching finds contributors across all cohorts.
    const searchInput = screen.getByRole("searchbox", {
      name: /search students, mentors, or modules/i,
    });
    await userEvent.type(searchInput, "Youssef");
    expect(screen.getByText(/matching module/i)).toHaveTextContent(
      "Found 1 matching module",
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Infrastructure and Interface" }),
    ).toBeInTheDocument();
  });

  it("shows an error alert when Strapi fails and retries successfully", async () => {
    vi.stubEnv("VITE_STRAPI_URL", "https://cms.example");
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Server Error",
        text: async () => "Internal error",
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [cohort2026], meta: { pagination: { pageCount: 1 } } }),
      });
    vi.stubGlobal("fetch", fetcher);

    render(<Acknowledgements />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Could not load cohorts");

    await userEvent.click(screen.getByRole("button", { name: /Try again/i }));
    expect(await screen.findByRole("tab", { name: "Cohort 2026" })).toBeInTheDocument();
  });

  it("shows an empty state when Strapi returns no cohorts", async () => {
    vi.stubEnv("VITE_STRAPI_URL", "https://cms.example");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: [], meta: { pagination: { pageCount: 0 } } }),
      }),
    );

    render(<Acknowledgements />);

    expect(
      await screen.findByText("No research cohorts available yet."),
    ).toBeInTheDocument();
  });
});
