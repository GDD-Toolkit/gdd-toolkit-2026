import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DeadlineBadge } from "@/components/grants/DeadlineBadge";
import { deadlineText } from "@/components/grants/format";

const now = new Date(2026, 10, 3); // 3 Nov 2026, local time
const at = (status: Parameters<typeof deadlineText>[0]["status"], deadline: string | null, opens_at: string | null = null) => ({
  status,
  deadline,
  opens_at,
});

describe("deadlineText", () => {
  it("counts the days to an open deadline", () => {
    expect(deadlineText(at("open", "2026-11-28"), now)).toBe("Closes 28 Nov 2026 · 25 days");
    expect(deadlineText(at("closing_soon", "2026-11-04"), now)).toBe("Closes 4 Nov 2026 · 1 day");
  });

  it("says Open when an open grant has no deadline", () => {
    expect(deadlineText(at("open", null), now)).toBe("Open");
  });

  it("shows the opening date of a forecast when the source gives one", () => {
    expect(deadlineText(at("forecasted", null, "2027-01-15"), now)).toBe("Forecast · opens 15 Jan 2027");
    expect(deadlineText(at("forecasted", null), now)).toBe("Forecast");
    expect(deadlineText(at("forecasted", "2027-02-01", "2026-08-14"), now)).toBe("Forecast · expected 14 Aug 2026");
  });

  it("labels rolling, closed and archived rows", () => {
    expect(deadlineText(at("rolling", null), now)).toBe("Rolling");
    expect(deadlineText(at("closed", "2026-10-01"), now)).toBe("Closed 1 Oct 2026");
    expect(deadlineText(at("closed", null), now)).toBe("Closed");
    expect(deadlineText(at("archived", "2026-01-01"), now)).toBe("Archived");
  });
});

describe("DeadlineBadge", () => {
  it("renders the text with a warning tone when closing soon", () => {
    render(<DeadlineBadge grant={at("closing_soon", "2099-01-01")} />);
    expect(screen.getByText(/Closes 1 Jan 2099/)).toHaveClass("text-amber-900");
  });
});
