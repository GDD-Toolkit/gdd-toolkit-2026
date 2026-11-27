import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import RootLayout from "@/app/layout/RootLayout";
import HomePage from "./index";
import { AUTO_SCROLL_PX_PER_SEC } from "./sections/ModuleTeamsCarousel";

function renderHome() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <HomePage />
    </MemoryRouter>,
  );
}

describe("HomePage (Concept 4 — Unified Forest & Sage Editorial)", () => {
  it("renders hero headline, 7 values strip, and all 7 toolkit tools", () => {
    renderHome();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /ethical tools for worthwhile global development/i,
      }),
    ).toBeInTheDocument();

    // Preserved animated splash logo is mounted on initial load
    expect(
      screen.getByLabelText(/^development ethics toolkit$/i),
    ).toBeInTheDocument();

    // 7 Values strip is present
    expect(screen.getByText("Well-being")).toBeInTheDocument();
    expect(screen.getByText("Cultural Freedom")).toBeInTheDocument();

    // All 7 tools are highlighted inside the tools section
    const toolsSection = document.getElementById("tools");
    expect(toolsSection).not.toBeNull();
    const toolsScope = within(toolsSection!);
    for (const toolName of [
      "AI Business Ethics Canvas",
      "AI Ethics Dashboard",
      "Ethics of Innovation",
      "Geopolitical Analysis",
      "Human Centered Design",
      "Project Planning",
      "Project Evaluation",
    ]) {
      expect(toolsScope.getByText(toolName)).toBeInTheDocument();
    }
  });

  it("pulls cohorts, module teams, headshots, PRM flags, and LinkedIn links from Strapi", async () => {
    vi.stubEnv("VITE_STRAPI_URL", "https://cms.example.test");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            id: 2,
            documentId: "cohort-2024",
            year: 2024,
            teams: [
              {
                id: 20,
                documentId: "team-2024-hcd",
                Team_name: "Human Centered Design",
                teammates: [
                  { id: 1, member_name: "PRM: Khadija Wane" },
                  { id: 2, member_name: "Alyssa Moreno" },
                ],
              },
            ],
          },
          {
            id: 3,
            documentId: "cohort-2025",
            year: 2025,
            teams: [
              {
                id: 30,
                documentId: "team-2025-pp",
                Team_name: "Project Planning",
                teammates: [{ id: 1, member_name: "Ruth Whitehouse", is_prm: true }],
              },
            ],
          },
          {
            id: 1,
            documentId: "cohort-2026",
            year: 2026,
            teams: [
              {
                id: 10,
                documentId: "team-2026-ai",
                Team_name: "AI Development",
                purpose: "Custom team mission from Strapi CMS.",
                teammates: [
                  {
                    id: 1,
                    member_name: "Youssef Ali Ahmed",
                    is_prm: true,
                    linkedin_url: "https://www.linkedin.com/in/youssefaliahmed/",
                    headshot: {
                      url: "/uploads/youssef-full.jpg",
                      formats: {
                        small: {
                          url: "https://cdn.example.test/youssef-small.jpg",
                        },
                      },
                    },
                  },
                  {
                    id: 2,
                    member_name: "Maya Patel",
                    is_prm: false,
                    linkedin_url: "www.linkedin.com/in/maya-patel",
                    headshot: {
                      url: "/uploads/maya-headshot.jpg",
                    },
                  },
                  {
                    id: 3,
                    member_name: "Liam Chen",
                    is_prm: false,
                  },
                ],
              },
              {
                id: 11,
                documentId: "team-2026-eval",
                Team_name: "Project Evaluation",
                teammates: [
                  { id: 4, member_name: "Avery Demarco", is_prm: true },
                  { id: 5, member_name: "Nora Lin", is_prm: false },
                ],
              },
            ],
          },
        ],
        meta: { pagination: { page: 1, pageCount: 1 } },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    renderHome();

    const carousel = document.getElementById("module-teams");
    expect(carousel).not.toBeNull();
    const scope = within(carousel!);

    // Wait for Strapi data to hydrate and mount Cohort 2026's cards
    const primaryTrack = carousel!.querySelector("[data-marquee-primary]");
    expect(primaryTrack).not.toBeNull();
    const primaryScope = within(primaryTrack as HTMLElement);

    expect(await primaryScope.findByText("Maya Patel")).toBeInTheDocument();
    expect(primaryScope.getByText("Youssef Ali Ahmed")).toBeInTheDocument();
    expect(primaryScope.getByText("Liam Chen")).toBeInTheDocument();
    expect(
      primaryScope.getByText("Custom team mission from Strapi CMS."),
    ).toBeInTheDocument();

    // PRM detected from Strapi is_prm boolean without needing "PRM:" prefix
    expect(
      primaryScope.getAllByText("Peer Research Mentor").length,
    ).toBeGreaterThanOrEqual(1);

    // Headshots resolve both absolute CDN URLs and relative Strapi /uploads URLs
    const youssefPhoto = primaryScope.getByAltText(/youssef ali ahmed headshot/i);
    expect(youssefPhoto).toHaveAttribute(
      "src",
      "https://cdn.example.test/youssef-small.jpg",
    );
    const mayaPhoto = primaryScope.getByAltText(/maya patel headshot/i);
    expect(mayaPhoto).toHaveAttribute(
      "src",
      "https://cms.example.test/uploads/maya-headshot.jpg",
    );

    // LinkedIn links render with safe target/rel attributes and normalized URLs
    const youssefLinkedin = primaryScope.getByRole("link", {
      name: /view youssef ali ahmed on linkedin/i,
    });
    expect(youssefLinkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/youssefaliahmed/",
    );
    expect(youssefLinkedin).toHaveAttribute("target", "_blank");
    expect(youssefLinkedin).toHaveAttribute("rel", "noopener noreferrer");

    const mayaLinkedin = primaryScope.getByRole("link", {
      name: /view maya patel on linkedin/i,
    });
    expect(mayaLinkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/maya-patel",
    );

    const yearGroup = scope.getByRole("group", { name: /select cohort year/i });
    const yearButtons = within(yearGroup).getAllByRole("button");
    expect(yearButtons.map((b) => b.textContent)).toEqual(["2026", "2025", "2024"]);
    expect(yearButtons[0]).toHaveAttribute("aria-pressed", "true");

    // Verify request hit Strapi's coherts endpoint with deep teammate media populate + descending sort
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/coherts?"),
      expect.objectContaining({ method: "GET" }),
    );
    const requestedUrl = String(fetchMock.mock.calls[0][0]);
    expect(requestedUrl).toContain(
      "populate%5Bteams%5D%5Bpopulate%5D%5Bteammates%5D%5Bpopulate%5D=*",
    );
    expect(requestedUrl).toContain("sort%5B0%5D=year%3Adesc");

    // Switching to 2024 displays Cohort 2024's legacy PRM prefix and teammate
    await user.click(yearButtons[2]);
    expect(await scope.findByText("Khadija Wane")).toBeInTheDocument();
    expect(scope.getByText("Alyssa Moreno")).toBeInTheDocument();
  });

  it("continuously auto-scrolls team cards right-to-left until the user interacts", () => {
    vi.useFakeTimers();
    try {
      renderHome();

      const carousel = document.getElementById("module-teams");
      expect(carousel).not.toBeNull();
      const scope = within(carousel!);

      // Default descending years from fallback: 2025 -> 2020
      const yearGroup = scope.getByRole("group", { name: /select cohort year/i });
      const yearLabels = within(yearGroup)
        .getAllByRole("button")
        .map((b) => b.textContent);
      expect(yearLabels).toEqual(["2025", "2024", "2023", "2022", "2021", "2020"]);

      const track = carousel!.querySelector(
        "[data-continuous-marquee-track]",
      ) as HTMLDivElement | null;
      expect(track).not.toBeNull();
      expect(track).toHaveAttribute("data-auto-scrolling", "true");
      expect(track).toHaveAttribute("data-scroll-direction", "right-to-left");
      expect(carousel!.querySelector("[data-marquee-clone]")).not.toBeNull();
      expect(AUTO_SCROLL_PX_PER_SEC).toBeGreaterThan(0);

      // Continuous RAF loop advances scrollLeft right-to-left automatically
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(track!.scrollLeft).toBeGreaterThan(0);

      // Once user clicks Next Team, continuous auto-scroll sleeps and stays off (no resume button)
      fireEvent.click(scope.getByRole("button", { name: /next team/i }));
      expect(track).toHaveAttribute("data-auto-scrolling", "false");
      expect(carousel!.querySelector("[data-marquee-clone]")).toBeNull();
      expect(
        scope.queryByRole("button", { name: /resume auto-scroll/i }),
      ).not.toBeInTheDocument();

      // Let Next Team's one-shot scrollToCard settle, then verify advancing time does NOT move scrollLeft
      act(() => {
        vi.advanceTimersByTime(50);
      });
      const settledScrollLeft = track!.scrollLeft;
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(track!.scrollLeft).toBe(settledScrollLeft);

      // Clicking a cohort year switches cohorts cleanly while remaining paused
      fireEvent.click(within(yearGroup).getByRole("button", { name: "2023" }));
      expect(scope.getByText(/01 \/ 07 modules/i)).toBeInTheDocument();
      expect(track).toHaveAttribute("data-auto-scrolling", "false");
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(track!.scrollLeft).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("renders student research pillars, case studies, video, podcast, and funding tracker", () => {
    renderHome();

    expect(screen.getByText("Development Ethics")).toBeInTheDocument();
    expect(screen.getByText("Worthwhile vs. Maldevelopment")).toBeInTheDocument();
    expect(screen.getByText("The Capability Approach")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /harnessing icts for efficient development in smart nation singapore/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /health professional education and training/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /play explainer video/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /listen to latest episode/i }),
    ).toHaveAttribute("href", "/podcast");
    expect(
      screen.getByRole("link", { name: /search funding database/i }),
    ).toHaveAttribute("href", "/funding-sources");
  });

  it("unmounts the non-blocking splash overlay cleanly inside RootLayout", () => {
    vi.useFakeTimers();
    try {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route element={<RootLayout />}>
              <Route index element={<HomePage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      const overlay = screen.getByTestId("splash-overlay");
      expect(overlay).toHaveClass("pointer-events-none");

      act(() => {
        vi.advanceTimersByTime(1750);
      });

      expect(screen.queryByTestId("splash-overlay")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
