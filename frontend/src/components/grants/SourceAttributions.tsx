import type { SourceSummary } from "@shared/types/GrantsApi";

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
    <section aria-labelledby="grant-sources-heading" className="mt-10 border-t border-border pt-6">
      <h2 id="grant-sources-heading" className="text-sm font-medium">
        Data sources
      </h2>
      <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
        {credited.map((source) => (
          <li key={source.id}>
            <span className="font-medium text-foreground">{source.name}.</span> {source.license_note}
          </li>
        ))}
      </ul>
    </section>
  );
}
