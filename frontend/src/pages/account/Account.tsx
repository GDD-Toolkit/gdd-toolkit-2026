import { useEffect, useState, type ReactNode } from "react";
import { Link, useInRouterContext } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  Compass,
  FolderOpen,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { Grant } from "@shared/types/Grants";
import { strapiMediaUrl } from "@/api/auth";
import { getGrantsByIds } from "@/api/grants";
import { BookmarkButton } from "@/components/auth/BookmarkButton";
import { EditProfileDialog } from "@/components/auth/EditProfileDialog";
import {
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialReveal,
  EditorialSection,
} from "@/components/editorial/EditorialPagePrimitives";
import { DeadlineBadge } from "@/components/grants/DeadlineBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { displayNameOf, type UserProfile } from "@/types/auth";
import { INTEREST_OPTIONS, languages } from "@/types/onboarding";

function AccountReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  if (typeof IntersectionObserver !== "undefined") {
    return (
      <EditorialReveal delay={delay} className={className}>
        {children}
      </EditorialReveal>
    );
  }
  return <div className={className}>{children}</div>;
}

function SafeLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) {
  const inRouter = useInRouterContext();
  if (inRouter) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
}

function initialsOf(user: UserProfile): string {
  const first = user.firstName?.[0] ?? user.username?.[0] ?? "?";
  const last = user.lastName?.[0] ?? "";
  return `${first}${last}`.toUpperCase();
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl border border-[#D5E3D9] bg-[#FAFDF8] px-4 py-3">
      <dt className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#187347]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-[#202B20]">
        {value?.trim() ? (
          value
        ) : (
          <span className="font-normal italic text-[#596556]">Not set</span>
        )}
      </dd>
    </div>
  );
}

/** Interests as badges, keeping the display order from the onboarding form. */
function Interests({ values }: { values?: string[] | null }) {
  const chosen = INTEREST_OPTIONS.filter(({ value }) => values?.includes(value));
  return (
    <div className="rounded-xl border border-[#D5E3D9] bg-[#FAFDF8] px-4 py-3 sm:col-span-2">
      <dt className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#187347]">
        Areas of interest
      </dt>
      <dd className="mt-2 flex flex-wrap gap-2">
        {chosen.length === 0 ? (
          <span className="text-sm italic text-[#596556]">Not set</span>
        ) : (
          chosen.map(({ value, label }) => (
            <Badge
              key={value}
              variant="outline"
              className="rounded-full border-[#94B985] bg-[#EDF4E8] px-3 py-1 text-xs font-medium text-[#284B26]"
            >
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
    return (
      <div className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-dashed border-[#B2C9A8] bg-[#FAFDF8] p-5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#B2C9A8] bg-[#EDF4E8] text-[#187347]">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-sm leading-relaxed text-[#596556]">
          Funding opportunities you save will appear here.
        </p>
        <SafeLink
          to="/funding-sources"
          className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#3F673C] bg-white px-4 py-1.5 text-xs font-semibold text-[#284B26] transition-colors hover:bg-[#EDF4E8]"
        >
          Browse Funding Sources
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </SafeLink>
      </div>
    );
  }
  if (failed) {
    return (
      <p
        className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        role="alert"
      >
        Your saved grants could not be loaded right now.
      </p>
    );
  }
  if (grants === null) {
    return (
      <div className="mt-4 space-y-2.5" aria-busy="true">
        <p className="text-sm text-[#596556]">Loading saved grants…</p>
        <div className="h-12 animate-pulse rounded-xl bg-[#EDF4E8]" />
      </div>
    );
  }

  const byId = new Map(grants.map((grant) => [grant.id, grant]));
  return (
    <ul className="mt-4 divide-y divide-[#E3EBDE]">
      {ids.map((id) => {
        const grant = byId.get(id);
        return (
          <li
            key={id}
            className="flex items-center justify-between gap-3 py-3 transition-colors first:pt-1 last:pb-0"
          >
            {grant ? (
              <div className="min-w-0 space-y-1.5">
                <SafeLink
                  to={`/funding-sources?grant=${encodeURIComponent(grant.id)}`}
                  className="block truncate text-sm font-medium text-[#202B20] underline-offset-4 transition-colors hover:text-[#187347] hover:underline"
                >
                  {grant.title}
                </SafeLink>
                <DeadlineBadge grant={grant} />
              </div>
            ) : (
              <span className="text-sm italic text-[#596556]">
                No longer available
              </span>
            )}
            <BookmarkButton
              kind="grants"
              itemId={id}
              label={grant?.title ?? "this grant"}
            />
          </li>
        );
      })}
    </ul>
  );
}

/** Account page: profile summary and saved items. Guarded by ProtectedRoute. */
export default function AccountPage() {
  const { user } = useAuth();
  const inRouter = useInRouterContext();
  if (!user) return null;

  const tools = user.bookmarkedTools ?? [];
  const savedGrantIds = user.savedGrantIds ?? [];
  const interestsCount = user.interests?.length ?? 0;
  const languageLabel =
    languages.find(({ code }) => code === user.language)?.label ??
    user.language;
  const displayName = displayNameOf(user);

  return (
    <div className="min-h-screen w-full bg-[#F2F6EF] text-[#202B20]">
      <EditorialPageHero
        compact
        id="account-hero"
        titleId="account-hero-heading"
        backLink={inRouter ? { label: "Back to Home", to: "/" } : undefined}
        badges={[
          { label: user.role?.name ?? "Member", tone: "cream" },
          {
            label: user.confirmed ? "Email Confirmed" : "Pending Confirmation",
            tone: "sage",
          },
        ]}
        title={
          <>
            Your <em className="font-normal italic text-[#E9E6B2]">Account</em>
          </>
        }
        subtitle={
          <p>
            Welcome, <span className="font-semibold text-white">{displayName}</span>!
            Manage your member details, saved AI Ethics tools, and bookmarked
            funding opportunities.
          </p>
        }
        actions={
          <>
            <EditProfileDialog user={user} variant="hero" />
            <SafeLink
              to="/funding-sources"
              className="inline-flex items-center gap-2 rounded-full border border-[#9AB887] bg-[#2E502B] px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-[#E9E6B2] hover:bg-[#254223]"
            >
              Browse Funding
              <ArrowRight className="h-4 w-4 text-[#E9E6B2]" aria-hidden="true" />
            </SafeLink>
          </>
        }
        aside={
          <div className="rounded-2xl border-[1.5px] border-[#E9E6B2]/80 bg-white p-5 text-[#202B20] shadow-xl">
            <div className="flex items-center gap-4">
              <Avatar className="size-14 border-2 border-[#94B985] shadow-xs">
                {user.avatar?.url && (
                  <AvatarImage src={strapiMediaUrl(user.avatar.url)} alt="" />
                )}
                <AvatarFallback className="bg-gradient-to-br from-[#3F673C] to-[#187347] text-base font-semibold text-white">
                  {initialsOf(user)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-lg font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {displayName}
                </p>
                <p className="truncate text-xs text-[#596556]">{user.email}</p>
                {user.institution && (
                  <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wider text-[#187347]">
                    {user.institution}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5 border-t border-[#E3EBDE] pt-4 text-center">
              <div className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] px-2 py-2.5">
                <p
                  className="text-xl font-bold leading-none text-[#187347]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {tools.length}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[#596556]">
                  Tools
                </p>
              </div>
              <div className="rounded-xl border border-[#D5E3D9] bg-[#F2F6EF] px-2 py-2.5">
                <p
                  className="text-xl font-bold leading-none text-[#187347]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {savedGrantIds.length}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[#596556]">
                  Grants
                </p>
              </div>
              <div className="rounded-xl border border-[#D5E3D9] bg-[#F6F4D8] px-2 py-2.5">
                <p
                  className="text-xl font-bold leading-none text-[#284B26]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {interestsCount}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[#596556]">
                  Interests
                </p>
              </div>
            </div>
          </div>
        }
      />

      <EditorialSection tone="sage" compact className="border-t-0">
        <div className="space-y-6">
          {/* Profile Details Card */}
          <AccountReveal>
            <section
              aria-labelledby="profile-heading"
              className="rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6 shadow-xs sm:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E3EBDE] pb-5">
                <div>
                  <p className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                    <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                    01 / Member Details
                  </p>
                  <h2
                    id="profile-heading"
                    className="mt-1.5 text-2xl font-semibold tracking-tight text-[#202B20]"
                    style={EDITORIAL_SERIF_STYLE}
                  >
                    Profile
                  </h2>
                </div>
                <Badge
                  variant="secondary"
                  className="rounded-full border border-[#94B985] bg-[#EDF4E8] px-3.5 py-1 text-xs font-medium text-[#284B26]"
                >
                  {user.role?.name ?? "Member"}
                </Badge>
              </div>

              <dl className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Occupation" value={user.occupation} />
                <Field label="Organization" value={user.institution} />
                <Field label="Country" value={user.country} />
                <Field label="Preferred language" value={languageLabel} />
                <Interests values={user.interests} />
                <Field label="Department" value={user.department} />
                <Field
                  label="Email status"
                  value={user.confirmed ? "Confirmed" : "Not confirmed"}
                />
                <Field
                  label="Sign-in method"
                  value={
                    user.provider === "local"
                      ? "Email & password"
                      : user.provider
                  }
                />
              </dl>

              {user.bio && (
                <div className="mt-5 rounded-xl border border-[#D6CE8A] bg-[#F6F4D8] p-4">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#284B26]">
                    Bio
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#394838]">
                    {user.bio}
                  </p>
                </div>
              )}
            </section>
          </AccountReveal>

          {/* Saved Funding & Saved Tools Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AccountReveal delay={0.05} className="h-full">
              <section
                aria-labelledby="grants-heading"
                className="flex h-full flex-col rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6 shadow-xs sm:p-7"
              >
                <div className="flex items-start justify-between gap-3 border-b border-[#E3EBDE] pb-4">
                  <div>
                    <p className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                      <FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      02 / Funding Tracker
                    </p>
                    <h2
                      id="grants-heading"
                      className="mt-1.5 text-xl font-semibold text-[#202B20]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      Saved grants{" "}
                      <span className="font-sans text-base font-normal text-[#596556]">
                        ({savedGrantIds.length})
                      </span>
                    </h2>
                  </div>
                </div>
                <SavedGrants ids={savedGrantIds} />
              </section>
            </AccountReveal>

            <AccountReveal delay={0.1} className="h-full">
              <section
                aria-labelledby="tools-heading"
                className="flex h-full flex-col rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6 shadow-xs sm:p-7"
              >
                <div className="flex items-start justify-between gap-3 border-b border-[#E3EBDE] pb-4">
                  <div>
                    <p className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
                      <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
                      03 / Bookmarked Tools
                    </p>
                    <h2
                      id="tools-heading"
                      className="mt-1.5 text-xl font-semibold text-[#202B20]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      Saved tools{" "}
                      <span className="font-sans text-base font-normal text-[#596556]">
                        ({tools.length})
                      </span>
                    </h2>
                  </div>
                </div>

                {tools.length === 0 ? (
                  <div className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-dashed border-[#B2C9A8] bg-[#FAFDF8] p-5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#B2C9A8] bg-[#EDF4E8] text-[#187347]">
                      <Compass className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="text-sm leading-relaxed text-[#596556]">
                      Tools you bookmark in the AI Ethics Dashboard will appear
                      here.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <SafeLink
                        to="/ai-ethics-dashboard"
                        className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#3F673C] bg-white px-4 py-1.5 text-xs font-semibold text-[#284B26] transition-colors hover:bg-[#EDF4E8]"
                      >
                        Explore AI Ethics Dashboard
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </SafeLink>
                      <SafeLink
                        to="/case-studies"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#B2C9A8] bg-[#F2F6EF] px-4 py-1.5 text-xs font-medium text-[#284B26] transition-colors hover:border-[#3F673C]"
                      >
                        Browse Case Studies
                      </SafeLink>
                    </div>
                  </div>
                ) : (
                  <ul className="mt-4 divide-y divide-[#E3EBDE]">
                    {tools.map((tool) => (
                      <li
                        key={tool.documentId}
                        className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-0"
                      >
                        <span className="text-sm font-medium text-[#202B20]">
                          {tool.name}
                        </span>
                        <BookmarkButton
                          kind="tools"
                          itemId={tool.documentId}
                          label={tool.name}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </AccountReveal>
          </div>
        </div>
      </EditorialSection>
    </div>
  );
}
