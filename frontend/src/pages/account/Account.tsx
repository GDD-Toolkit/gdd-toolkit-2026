import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/auth/BookmarkButton";
import { useAuth } from "@/hooks/useAuth";
import { displayNameOf } from "@/types/auth";

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm">{value?.trim() ? value : <span className="text-muted-foreground">Not set</span>}</dd>
    </div>
  );
}

/** Minimal account page: profile summary and saved items. Guarded by ProtectedRoute. */
export default function AccountPage() {
  const { user } = useAuth();
  if (!user) return null;

  const tools = user.bookmarkedTools ?? [];
  const grants = user.savedGrants ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">{displayNameOf(user)}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Badge variant="secondary">{user.role?.name ?? "Member"}</Badge>
      </header>

      <section aria-labelledby="profile-heading" className="rounded-xl border border-border p-6">
        <h2 id="profile-heading" className="text-lg font-medium">
          Profile
        </h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Institution" value={user.institution} />
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
                <BookmarkButton kind="tools" documentId={tool.documentId} label={tool.name} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="grants-heading" className="rounded-xl border border-border p-6">
        <h2 id="grants-heading" className="text-lg font-medium">
          Saved grants <span className="text-muted-foreground">({grants.length})</span>
        </h2>
        {grants.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Funding opportunities you save will appear here.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {grants.map((grant) => (
              <li key={grant.documentId} className="flex items-center justify-between py-2">
                <span className="text-sm">{grant.grant_name}</span>
                <BookmarkButton kind="grants" documentId={grant.documentId} label={grant.grant_name} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
