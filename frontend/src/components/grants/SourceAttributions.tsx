import { Database } from "lucide-react";
import type { SourceSummary } from "@shared/types/GrantsApi";
import { EDITORIAL_SERIF_STYLE } from "@/components/editorial/EditorialPagePrimitives";

interface SourceAttributionsProps {
  sources: SourceSummary[];
}

/**
 * The notice each source's terms require, as the worker records it
 * (data/sources.json → license_note). Sources that have never run are left out.
 */
export function SourceAttributions({ sources }: SourceAttributionsProps) {
  const credited = sources.filter((source) => source.enabled && source.last_run_at && source.license_note);
  if (credited.length === 0) return null;
  return (
    <section
      aria-labelledby="grant-sources-heading"
      className="mt-12 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#F2F6EF] p-6 sm:p-7"
    >
      <div className="flex items-center gap-2.5">
        <span className="inline-flex size-8 items-center justify-center rounded-full border border-[#94B985] bg-white text-[#187347]">
          <Database className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
            Provenance &amp; Licensing
          </p>
          <h2
            id="grant-sources-heading"
            className="text-base font-semibold text-[#202B20]"
            style={EDITORIAL_SERIF_STYLE}
          >
            Data sources
          </h2>
        </div>
      </div>
      <ul className="mt-4 space-y-2 border-t border-[#D5E3D9] pt-4 text-xs leading-relaxed text-[#596556]">
        {credited.map((source) => (
          <li key={source.id} className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#3F673C]" aria-hidden="true" />
            <span>
              <span className="font-semibold text-[#202B20]">{source.name}.</span> {source.license_note}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
