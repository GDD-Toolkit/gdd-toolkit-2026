import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import RootLayout from "@/app/layout/RootLayout";
import HomePage from "./index";
import { AUTO_ADVANCE_MS } from "./sections/ModuleTeamsCarousel";

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

  it("pulls cohorts, module teams, and teammates from Strapi in descending year order", async () => {
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
            id: 1,
            documentId: "cohort-2026",
            year: 2026,
            teams: [
              {
                id: 10,
                documentId: "team-2026-ai",
                Team_name: "AI Development",
                teammates: [
                  { id: 1, member_name: "PRM: Youssef Ali Ahmed" },
                  { id: 2, member_name: "Maya Patel" },
                  { id: 3, member_name: "Liam Chen" },
                ],
              },
              {
                id: 11,
                documentId: "team-2026-eval",
                Team_name: "Project Evaluation",
                teammates: [
                  { id: 4, member_name: "PRM: Avery Demarco" },
                  { id: 5, member_name: "Nora Lin" },
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

    // Wait for Strapi data to hydrate and mount Cohort 2026's card
    expect(await scope.findByText("Maya Patel")).toBeInTheDocument();
    expect(scope.getByText("Youssef Ali Ahmed")).toBeInTheDocument();
    expect(scope.getByText("Liam Chen")).toBeInTheDocument();

    const yearGroup = scope.getByRole("group", { name: /select cohort year/i });
    const yearButtons = within(yearGroup).getAllByRole("button");
    expect(yearButtons.map((b) => b.textContent)).toEqual(["2026", "2024"]);
    expect(yearButtons[0]).toHaveAttribute("aria-pressed", "true");

    // Verify request hit Strapi's coherts endpoint with nested populate + descending sort
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/coherts?"),
      expect.objectContaining({ method: "GET" }),
    );
    const requestedUrl = String(fetchMock.mock.calls[0][0]);
    expect(requestedUrl).toContain("populate%5Bteams%5D%5Bpopulate%5D%5Bteammates%5D=true");
    expect(requestedUrl).toContain("sort%5B0%5D=year%3Adesc");

    // Switching to 2024 displays Cohort 2024's module team and teammates
    await user.click(yearButtons[1]);
    expect(await scope.findByText("Khadija Wane")).toBeInTheDocument();
    expect(scope.getByText("Alyssa Moreno")).toBeInTheDocument();
  });

  it("slowly auto-advances teams until the user interacts to view a specific cohort or module", () => {
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

      // Starts at module 01
      expect(scope.getByText(/01 \/ 10 modules/i)).toBeInTheDocument();

      // Auto-advances slowly after AUTO_ADVANCE_MS without user interaction
      act(() => {
        vi.advanceTimersByTime(AUTO_ADVANCE_MS);
      });
      expect(scope.getByText(/02 \/ 10 modules/i)).toBeInTheDocument();

      // Once user clicks a specific cohort year (2023), auto-advance stops
      fireEvent.click(within(yearGroup).getByRole("button", { name: "2023" }));
      expect(scope.getByText(/01 \/ 07 modules/i)).toBeInTheDocument();
      expect(
        scope.getByRole("button", { name: /resume auto-scroll/i }),
      ).toBeInTheDocument();

      // Advancing time well past AUTO_ADVANCE_MS must NOT move away from user's selection
      act(() => {
        vi.advanceTimersByTime(AUTO_ADVANCE_MS * 3);
      });
      expect(scope.getByText(/01 \/ 07 modules/i)).toBeInTheDocument();
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
