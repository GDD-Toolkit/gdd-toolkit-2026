import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { SourceSummary } from "@shared/types/GrantsApi";
import { SourceAttributions } from "./SourceAttributions";

const source = (overrides: Partial<SourceSummary>): SourceSummary => ({
  id: "grants-gov",
  name: "Grants.gov",
  enabled: true,
  last_run_at: "2026-11-05T08:00:00.000Z",
  license_note: "This product uses the Grants.gov API but is not endorsed or certified by the U.S. Department of Health and Human Services.",
  ...overrides,
});

describe("SourceAttributions", () => {
  it("shows the notice of every source that has run", () => {
    render(
      <SourceAttributions
        sources={[source({}), source({ id: "eu-ft", name: "EU Funding & Tenders Portal", license_note: "Source: European Commission." })]}
      />,
    );
    expect(screen.getByRole("heading", { name: "Data sources" })).toBeInTheDocument();
    expect(screen.getByText(/not endorsed or certified by the U\.S\. Department of Health and Human Services/)).toBeInTheDocument();
    expect(screen.getByText(/Source: European Commission\./)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("leaves out sources that never ran, are disabled or have no notice, and renders nothing when none is left", () => {
    const { container } = render(
      <SourceAttributions
        sources={[source({ last_run_at: null }), source({ id: "b", enabled: false }), source({ id: "c", license_note: null })]}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
