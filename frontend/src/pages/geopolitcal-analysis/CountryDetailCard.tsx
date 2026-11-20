import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GlobeCountry } from "@/components/ui/globe";

interface CountryDetailCardProps {
  country: GlobeCountry;
  values: readonly string[];
  initialValue?: string;
  onClose: () => void;
}

export default function CountryDetailCard({ country, values, initialValue, onClose }: CountryDetailCardProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(initialValue ?? values[0] ?? null);

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="country-detail-card">
        <header className="country-detail-header">
          <p>Country</p>
          <DialogTitle className="country-detail-name">{country.name}</DialogTitle>
          <DialogDescription className="country-detail-region">
            {country.worldBankRegion}
          </DialogDescription>
        </header>
        <div className="country-detail-layout">
          <div className="country-detail-values" role="group" aria-label="Country development values">
            {values.map((value, index) => (
              <button
                key={value}
                type="button"
                className="country-detail-value"
                aria-pressed={selectedValue === value}
                aria-controls="country-detail-body"
                onClick={() => setSelectedValue((selected) => selected === value ? null : value)}
              >
                <span className="country-detail-score" aria-hidden="true">—</span>
                <span>
                  <span className="country-detail-value-number">Value {index + 1}</span>
                  <span className="country-detail-value-name">{value}</span>
                </span>
              </button>
            ))}
          </div>
          <section id="country-detail-body" className="country-detail-body" aria-live="polite" aria-atomic="true">
            {selectedValue ? (
              <>
                <h3>{selectedValue}</h3>
                <p>No data available yet.</p>
              </>
            ) : (
              <p>Select a value to view its details.</p>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
