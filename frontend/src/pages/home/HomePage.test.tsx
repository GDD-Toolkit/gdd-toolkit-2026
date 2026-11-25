import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import RootLayout from "@/app/layout/RootLayout";
import HomePage from "./index";

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

  it("navigates the Module Teams carousel across PRM and student researchers", async () => {
    const user = userEvent.setup();
    renderHome();

    const carousel = document.getElementById("module-teams");
    expect(carousel).not.toBeNull();
    const scope = within(carousel!);

    expect(
      scope.getByRole("heading", { name: /ai development module team/i }),
    ).toBeInTheDocument();
    expect(scope.getByText("Krishnan Tholkappian")).toBeInTheDocument();
    expect(scope.getByText("Youssef Ali Ahmed")).toBeInTheDocument();
    expect(scope.getByText(/01 \/ 08 modules/i)).toBeInTheDocument();

    await user.click(scope.getByRole("button", { name: /next team/i }));
    expect(
      await scope.findByRole("heading", { name: /ai ethics module team/i }),
    ).toBeInTheDocument();
    expect(scope.getByText("Justin Jones")).toBeInTheDocument();

    const hcdTab = scope.getByRole("tab", { name: "Human Centered Design" });
    await user.click(hcdTab);
    expect(hcdTab).toHaveAttribute("aria-selected", "true");
    expect(
      await scope.findByRole("heading", {
        name: /human centered design module team/i,
      }),
    ).toBeInTheDocument();
    expect(scope.getByText("Rowan Kuske")).toBeInTheDocument();

    await user.click(scope.getByRole("button", { name: /previous team/i }));
    expect(
      await scope.findByRole("heading", { name: /ai ethics module team/i }),
    ).toBeInTheDocument();
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

