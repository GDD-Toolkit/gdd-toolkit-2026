import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { GrantFieldDef } from "@shared/types/Grants";
import { FieldValueView } from "@/components/grants/FieldValueView";

const def = (type: GrantFieldDef["type"]): GrantFieldDef => ({
  key: "k",
  label: "K",
  type,
  filterable: false,
  facet: false,
  display_order: 0,
  sources: [],
});

describe("FieldValueView", () => {
  it("formats money", () => {
    render(<FieldValueView value={{ amount: 50000, currency: "EUR" }} def={def("money")} />);
    expect(screen.getByText("€50,000")).toBeInTheDocument();
  });

  it("links urls, by def type or by shape", () => {
    render(<FieldValueView value="https://example.org/call" def={def("url")} />);
    const link = screen.getByRole("link", { name: "https://example.org/call" });
    expect(link).toHaveAttribute("href", "https://example.org/call");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders a list as chips", () => {
    render(<FieldValueView value={["nonprofit", "university"]} def={def("list")} />);
    expect(screen.getByText("nonprofit")).toBeInTheDocument();
    expect(screen.getByText("university")).toBeInTheDocument();
  });

  it("localises dates and shows a dash for nothing", () => {
    const { rerender } = render(<FieldValueView value="2027-01-15" def={def("date")} />);
    expect(screen.getByText("15 Jan 2027")).toBeInTheDocument();
    rerender(<FieldValueView value={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("prints numbers, booleans and plain text", () => {
    const { rerender } = render(<FieldValueView value={1234567} def={def("number")} />);
    expect(screen.getByText("1,234,567")).toBeInTheDocument();
    rerender(<FieldValueView value={true} />);
    expect(screen.getByText("Yes")).toBeInTheDocument();
    rerender(<FieldValueView value="Two-stage call" def={def("string")} />);
    expect(screen.getByText("Two-stage call")).toBeInTheDocument();
  });
});
