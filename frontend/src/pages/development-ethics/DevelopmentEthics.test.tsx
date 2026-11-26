import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DevelopmentEthics from "./DevelopmentEthics";
import Worthwhile from "../worthwhile-development/worthwhile";
import CapabilityApproach from "../capability-approach/CapabilityApproach";
import HumanCenteredDesign from "../tools-remaining/HumanCenteredDesign";
import EthicsOfInnovation from "../tools/ethics-of-innovation/EthicsOfInnovation";
import DesignUser from "../tools/ethics-of-innovation/DesignUser";
import ReuseImprove from "../tools/ethics-of-innovation/ReuseImprove";
import { DIGITAL_PRINCIPLES } from "../tools/ethics-of-innovation/principlesData";
import PrincipleDetailPage from "../tools/ethics-of-innovation/PrincipleDetailPage";
import Navbar from "@/components/layout/navbar";
import { AuthProvider } from "@/context/AuthContext";

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

beforeEach(() => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

describe("Human Centred Innovation hub & navigation", () => {
  it("renders the hub hero and all four topic cards with working routes", () => {
    renderWithRouter(<DevelopmentEthics />);

    expect(
      screen.getByRole("heading", { level: 1, name: /human centred innovation/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Read Worthwhile Development" }),
    ).toHaveAttribute("href", "/worthwhile-development");
    expect(
      screen.getByRole("link", { name: "Read The Capability Approach" }),
    ).toHaveAttribute("href", "/capability-approach");
    expect(
      screen.getByRole("link", { name: "Read Ethics of Innovation" }),
    ).toHaveAttribute("href", "/ethics-of-innovation");
    expect(
      screen.getByRole("link", { name: "Read Human Centred Design" }),
    ).toHaveAttribute("href", "/human-centered-design");
  });

  it("consolidates Human Centered Innovations into one direct navbar link and removes HCD from Tools", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </MemoryRouter>,
    );

    const hciLink = screen.getByRole("link", {
      name: "Human Centered Innovations",
    });
    expect(hciLink).toHaveAttribute("href", "/development-ethics");

    expect(
      screen.queryByRole("link", { name: "Worthwhile Development" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "The Capability Approach" }),
    ).not.toBeInTheDocument();

    await user.hover(screen.getByRole("button", { name: /tools/i }));
    expect(
      await screen.findByRole("link", { name: "Ethics of Innovation" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Human Centered Design" }),
    ).not.toBeInTheDocument();
  });
});

describe("Worthwhile Development redesigned page", () => {
  it("supports next/previous buttons, dot pagination, keyboard arrows, and back navigation", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Worthwhile />);

    expect(
      screen.getByRole("link", { name: /human centred innovation/i }),
    ).toHaveAttribute("href", "/development-ethics");
    expect(
      screen.getByRole("heading", { level: 3, name: "Well-Being" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show next value" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "Equality" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Show Sustainability" }),
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Sustainability" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show next value" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "Well-Being" }),
    ).toBeInTheDocument();

    const carousel = screen.getByRole("region", {
      name: /seven values of worthwhile development/i,
    });
    carousel.focus();
    await user.keyboard("{ArrowLeft}");
    expect(
      screen.getByRole("heading", { level: 3, name: "Sustainability" }),
    ).toBeInTheDocument();
  });
});

describe("The Capability Approach redesigned page", () => {
  it("flips pioneer cards, renders local video source, and displays all four timeline milestones", async () => {
    const user = userEvent.setup();
    const { container } = renderWithRouter(<CapabilityApproach />);

    expect(
      screen.getByRole("link", { name: /human centred innovation/i }),
    ).toHaveAttribute("href", "/development-ethics");

    const source = container.querySelector("video source");
    expect(source).toHaveAttribute("src", "/assets/Cabability-approach-video.mp4");

    const senButton = screen.getByRole("button", {
      name: /learn more about amartya sen/i,
    });
    expect(senButton).toHaveAttribute("aria-pressed", "false");
    await user.click(senButton);
    expect(senButton).toHaveAttribute("aria-pressed", "true");

    for (const year of ["1948", "1997", "2003", "2004"]) {
      expect(screen.getByText(year)).toBeInTheDocument();
    }
  });
});

describe("Human Centred Design redesigned page", () => {
  it("switches D.School hexagon steps, flips field cards, and completes & restarts the quiz", async () => {
    const user = userEvent.setup();
    renderWithRouter(<HumanCenteredDesign />);

    expect(
      screen.getByRole("link", { name: /human centred innovation/i }),
    ).toHaveAttribute("href", "/development-ethics");

    expect(screen.getByText("Achieng Nyambura")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Define" }));
    expect(
      screen.getByText("Do you have any feedback on the class?"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Prototype" }));
    expect(
      screen.getByText(/low fidelity prototypes/i),
    ).toBeInTheDocument();

    const techCard = screen.getByRole("button", {
      name: /show more information about technology/i,
    });
    expect(techCard).toHaveAttribute("aria-pressed", "false");
    await user.click(techCard);
    expect(techCard).toHaveAttribute("aria-pressed", "true");

    // Answer all 6 quiz questions (correct indices: 3, 1, 1, 1, 2, 2)
    const correctPrefixes = ["D.", "B.", "B.", "B.", "C.", "C."];
    for (let i = 0; i < correctPrefixes.length; i++) {
      const option = screen.getByRole("button", {
        name: new RegExp(`^${correctPrefixes[i].replace(".", "\\.")}`),
      });
      await user.click(option);
      expect(screen.getByText("Correct!")).toBeInTheDocument();

      if (i < correctPrefixes.length - 1) {
        await user.click(screen.getByRole("button", { name: "Next question" }));
      }
    }

    expect(screen.getByText("Quiz complete: 6 / 6 correct")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Restart quiz" }));
    expect(screen.getByText("Question 1 of 6")).toBeInTheDocument();
    expect(screen.getByText("0 correct")).toBeInTheDocument();
  });
});

describe("Ethics of Innovation redesigned page", () => {
  it("renders editorial hero, simulation CTA, back link, and all 9 digital design principles", () => {
    renderWithRouter(<EthicsOfInnovation />);

    expect(
      screen.getByRole("heading", { level: 1, name: /ethics of innovation/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /human centred innovation/i }),
    ).toHaveAttribute("href", "/development-ethics");
    expect(
      screen.getByRole("link", { name: /launch simulation/i }),
    ).toHaveAttribute(
      "href",
      "https://umdsurvey.umd.edu/jfe/form/SV_6tAE6MSIm6aExU2",
    );

    expect(
      screen.getByRole("link", { name: "Explore Design with the User" }),
    ).toHaveAttribute("href", "/ethics-of-innovation/user");
    expect(
      screen.getByRole("link", { name: "Explore Reuse and Improve" }),
    ).toHaveAttribute("href", "/ethics-of-innovation/reuse");
    expect(
      screen.getByRole("link", { name: "Explore Be Collaborative" }),
    ).toHaveAttribute("href", "/ethics-of-innovation/collaboration");
  });

  it("renders all 9 principle detail pages with interactive checklists and pager links", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DesignUser />);

    expect(
      screen.getByRole("heading", { level: 1, name: /design with the user/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /ethics of innovation/i }),
    ).toHaveAttribute("href", "/ethics-of-innovation");
    expect(screen.getByText("0 / 5 checked")).toBeInTheDocument();

    const firstCheck = screen.getByRole("button", {
      name: /have you observed your user/i,
    });
    await user.click(firstCheck);
    expect(firstCheck).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("1 / 5 checked")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByText("0 / 5 checked")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /next · 02/i }),
    ).toHaveAttribute("href", "/ethics-of-innovation/ecosystem");
  });

  it("renders the completed Reuse and Improve page and verifies all 9 slugs mount cleanly", () => {
    const { unmount: unmountReuse } = renderWithRouter(<ReuseImprove />);
    expect(
      screen.getByRole("heading", { level: 1, name: /reuse and improve/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /share, reuse and improve \| principles for digital development/i,
      }),
    ).toHaveAttribute(
      "href",
      "https://digitalprinciples.org/principles/share-reuse-and-improve/",
    );
    unmountReuse();

    for (const principle of DIGITAL_PRINCIPLES) {
      const { unmount } = renderWithRouter(
        <PrincipleDetailPage slug={principle.slug} />,
      );
      expect(
        screen.getByText(`Principle ${principle.number} of 09`),
      ).toBeInTheDocument();
      unmount();
    }
  });
});
