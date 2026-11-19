import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Grant } from "@shared/types/Grants";
import { getGrantsByIds } from "@/api/grants";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/auth/BookmarkButton";
import { EditProfileDialog } from "@/components/auth/EditProfileDialog";
import { DeadlineBadge } from "@/components/grants/DeadlineBadge";
import { useAuth } from "@/hooks/useAuth";
import { displayNameOf } from "@/types/auth";
import { INTEREST_OPTIONS, languages } from "@/types/onboarding";

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm">{value?.trim() ? value : <span className="text-muted-foreground">Not set</span>}</dd>
    </div>
  );
}

/** Interests as badges, keeping the display order from the onboarding form. */
function Interests({ values }: { values?: string[] | null }) {
  const chosen = INTEREST_OPTIONS.filter(({ value }) => values?.includes(value));
  return (
    <div className="sm:col-span-2">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">Areas of interest</dt>
      <dd className="mt-1 flex flex-wrap gap-1.5">
        {chosen.length === 0 ? (
          <span className="text-sm text-muted-foreground">Not set</span>
        ) : (
          chosen.map(({ value, label }) => (
            <Badge key={value} variant="outline">
              {label}
            </Badge>
          ))
        )}
      </dd>
    </div>
  );
}

/**
 * Saved grants are uuids on the profile; titles and status come from the
 * grants API in one request. Ids the API no longer returns stay removable.
 */
function SavedGrants({ ids }: { ids: string[] }) {
  const idsKey = ids.join(",");
  const [grants, setGrants] = useState<Grant[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const list = idsKey ? idsKey.split(",") : [];
    if (list.length === 0) {
      setGrants([]);
      return;
    }
    let cancelled = false;
    setGrants(null);
    setFailed(false);
    getGrantsByIds(list)
      .then((found) => {
        if (!cancelled) setGrants(found);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  if (ids.length === 0) {
    return <p className="mt-2 text-sm text-muted-foreground">Funding opportunities you save will appear here.</p>;
  }
  if (failed) {
    return (
      <p className="mt-2 text-sm text-muted-foreground" role="alert">
        Your saved grants could not be loaded right now.
      </p>
    );
  }
  if (grants === null) {
    return <p className="mt-2 text-sm text-muted-foreground">Loading saved grants…</p>;
  }

  const byId = new Map(grants.map((grant) => [grant.id, grant]));
  return (
    <ul className="mt-3 divide-y divide-border">
      {ids.map((id) => {
        const grant = byId.get(id);
        return (
          <li key={id} className="flex items-center justify-between gap-3 py-2">
            {grant ? (
              <div className="min-w-0 space-y-1">
                <Link
                  to={`/funding-sources?grant=${encodeURIComponent(grant.id)}`}
                  className="block truncate text-sm underline-offset-4 hover:underline"
                >
                  {grant.title}
                </Link>
                <DeadlineBadge grant={grant} />
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No longer available</span>
            )}
            <BookmarkButton kind="grants" itemId={id} label={grant?.title ?? "this grant"} />
          </li>
        );
      })}
    </ul>
  );
}

/** Minimal account page: profile summary and saved items. Guarded by ProtectedRoute. */
export default function AccountPage() {
  const { user } = useAuth();
  if (!user) return null;

  const tools = user.bookmarkedTools ?? [];
  const savedGrantIds = user.savedGrantIds ?? [];
  const languageLabel = languages.find(({ code }) => code === user.language)?.label ?? user.language;

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-12">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Welcome {displayNameOf(user)}!</h1>
        </div>
        <Badge variant="secondary" className="h-7 px-3 text-sm">{user.role?.name ?? "Member"}</Badge>
      </header>

      <section aria-labelledby="profile-heading" className="rounded-xl border border-border p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="profile-heading" className="text-lg font-medium">
            Profile
          </h2>
          <EditProfileDialog user={user} />
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Occupation" value={user.occupation} />
          <Field label="Organization" value={user.institution} />
          <Field label="Country" value={user.country} />
          <Field label="Preferred language" value={languageLabel} />
          <Interests values={user.interests} />
          <Field label="Department" value={user.department} />
          <Field label="Email status" value={user.confirmed ? "Confirmed" : "Not confirmed"} />
          <Field label="Sign-in method" value={user.provider === "local" ? "Email & password" : user.provider} />
        </dl>
        {user.bio && <p className="mt-4 text-sm">{user.bio}</p>}
      </section>

      <section aria-labelledby="tools-heading" className="rounded-xl border border-border p-6">
        <h2 id="tools-heading" className="text-lg font-medium">
          Saved tools <span className="text-muted-foreground">({tools.length})</span>
        </h2>
        {tools.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Tools you bookmark in the AI Ethics Dashboard will appear here.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {tools.map((tool) => (
              <li key={tool.documentId} className="flex items-center justify-between py-2">
                <span className="text-sm">{tool.name}</span>
                <BookmarkButton kind="tools" itemId={tool.documentId} label={tool.name} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="grants-heading" className="rounded-xl border border-border p-6">
        <h2 id="grants-heading" className="text-lg font-medium">
          Saved grants <span className="text-muted-foreground">({savedGrantIds.length})</span>
        </h2>
        <SavedGrants ids={savedGrantIds} />
      </section>
    </div>
  );
}
