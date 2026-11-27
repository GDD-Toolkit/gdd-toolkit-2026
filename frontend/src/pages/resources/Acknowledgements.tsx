import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Globe2,
  GraduationCap,
  Layers,
  Loader2,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";
import {
  getCohortsWithTeams,
  resolveStrapiMediaUrl,
  type StrapiCohort,
  type StrapiMedia,
  type StrapiTeam,
  type StrapiTeammate,
} from "@/api/strapi";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialReveal,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import { cn } from "@/lib/utils";
import type {
  AcknowledgementCohort,
  AcknowledgementMember,
  AcknowledgementModule,
} from "@/types/acknowledgements";
import "./Acknowledgements.css";

function unwrapStrapiTeams(
  raw: StrapiTeam[] | { data?: StrapiTeam[] } | null | undefined,
): StrapiTeam[] {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  return [];
}

function normalizeLinkedinUrl(raw?: string | null): string | undefined {
  const trimmed = raw?.trim();
  if (!trimmed) return undefined;

  const candidate = /^(https?:)?\/\//i.test(trimmed)
    ? trimmed.startsWith("//")
      ? `https:${trimmed}`
      : trimmed
    : /^(www\.)?linkedin\.com\//i.test(trimmed)
      ? `https://${trimmed}`
      : trimmed;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return undefined;
    }
    return parsed.toString();
  } catch {
    return undefined;
  }
}

function extractAvatarMedia(media: StrapiMedia | null | undefined): {
  url?: string;
  alt?: string;
} {
  if (!media) return {};
  const source = media.data?.attributes ?? media;
  const formats = source.formats;
  const rawUrl =
    formats?.thumbnail?.url ??
    formats?.small?.url ??
    formats?.medium?.url ??
    source.url;

  return {
    url: resolveStrapiMediaUrl(rawUrl),
    alt: source.alternativeText?.trim() || undefined,
  };
}

function normalizeStrapiAcknowledgementCohorts(
  rawCohorts: StrapiCohort[],
): AcknowledgementCohort[] {
  const result: AcknowledgementCohort[] = [];

  for (const entry of rawCohorts) {
    const rawYear = entry.year ?? entry.attributes?.year;
    const year = typeof rawYear === "number" ? rawYear : Number(rawYear);
    if (!Number.isFinite(year) || year <= 0) continue;

    const rawTeams = unwrapStrapiTeams(entry.teams ?? entry.attributes?.teams);
    const modules: AcknowledgementModule[] = [];

    for (let teamIdx = 0; teamIdx < rawTeams.length; teamIdx += 1) {
      const team = rawTeams[teamIdx];
      const teamName = (
        team.Team_name ??
        team.attributes?.Team_name ??
        ""
      ).trim();
      if (!teamName) continue;

      const teamId =
        team.documentId ??
        (team.id !== undefined ? `${year}-team-${team.id}` : `${year}-${teamIdx}`);

      const rawTeammates = team.teammates ?? team.attributes?.teammates;
      const teammates: StrapiTeammate[] = Array.isArray(rawTeammates)
        ? rawTeammates
        : [];

      const prms: AcknowledgementMember[] = [];
      const researchers: AcknowledgementMember[] = [];

      teammates.forEach((member, memberIdx) => {
        const rawName = (member?.member_name ?? "").trim();
        if (!rawName) return;

        const prmMatch = rawName.match(/^PRM\s*[:\-–]\s*(.+)$/i);
        const name = prmMatch && prmMatch[1] ? prmMatch[1].trim() : rawName;
        const isPrm = member?.is_prm === true || Boolean(prmMatch);
        const headshot = extractAvatarMedia(member?.headshot);
        const fullBody = extractAvatarMedia(member?.full_body_photo);

        const record: AcknowledgementMember = {
          id:
            member?.id !== undefined
              ? `${teamId}-m-${member.id}`
              : `${teamId}-m-${memberIdx}-${name}`,
          name,
          isPrm,
          linkedinUrl: normalizeLinkedinUrl(member?.linkedin_url),
          headshotUrl: headshot.url ?? fullBody.url,
          headshotAlt: headshot.alt ?? `${name} headshot`,
        };

        if (isPrm) {
          prms.push(record);
        } else {
          researchers.push(record);
        }
      });

      modules.push({
        id: teamId,
        name: teamName,
        prms,
        researchers,
        totalMembers: prms.length + researchers.length,
      });
    }

    modules.sort((a, b) => a.name.localeCompare(b.name));

    result.push({
      id: entry.documentId ?? (entry.id !== undefined ? String(entry.id) : String(year)),
      year,
      label: `Cohort ${year}`,
      modules,
    });
  }

  return result.sort((a, b) => b.year - a.year);
}

function MemberThumb({ member }: { member: AcknowledgementMember }) {
  const [failed, setFailed] = useState(false);
  if (!member.headshotUrl || failed) return null;

  return (
    <img
      src={member.headshotUrl}
      alt={member.headshotAlt ?? `${member.name} headshot`}
      decoding="async"
      onError={() => setFailed(true)}
      className="size-4 shrink-0 rounded-full object-cover ring-1 ring-[#94B985]"
    />
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z" />
    </svg>
  );
}

function ModuleRosterCard({
  module,
  cohortLabel,
}: {
  module: AcknowledgementModule;
  cohortLabel?: string;
}) {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-5 transition-all duration-200 hover:border-[#3F673C] hover:bg-[#FAFDF8] hover:shadow-md sm:p-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3
            className="text-lg font-semibold leading-snug text-[#202B20]"
            style={EDITORIAL_SERIF_STYLE}
          >
            {module.name}
          </h3>
          <div className="flex items-center gap-1.5">
            {cohortLabel && (
              <span className="rounded-full border border-[#94B985] bg-[#EDF4E8] px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26]">
                {cohortLabel}
              </span>
            )}
            <span className="rounded-full border border-[#D5E3D9] bg-[#F2F6EF] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#596556] tabular-nums">
              {module.totalMembers}{" "}
              {module.totalMembers === 1 ? "member" : "members"}
            </span>
          </div>
        </div>

        {/* PRM Lead Mentor Badges */}
        {module.prms.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {module.prms.map((prm) => {
              const badgeContent = (
                <>
                  <MemberThumb member={prm} />
                  <GraduationCap
                    className="size-3.5 shrink-0 text-[#187347]"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#187347]">
                    PRM
                  </span>
                  <span>{prm.name}</span>
                  {prm.linkedinUrl && (
                    <LinkedInIcon className="size-3 shrink-0 text-[#187347]" />
                  )}
                </>
              );

              return prm.linkedinUrl ? (
                <a
                  key={prm.id}
                  href={prm.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`PRM ${prm.name} on LinkedIn`}
                  className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#94B985] bg-[#F6F4D8] px-3 py-1 text-xs font-semibold text-[#284B26] transition-colors hover:border-[#0A66C2] hover:bg-[#EEF6FD] hover:text-[#0A66C2]"
                >
                  {badgeContent}
                </a>
              ) : (
                <span
                  key={prm.id}
                  className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#94B985] bg-[#F6F4D8] px-3 py-1 text-xs font-semibold text-[#284B26]"
                >
                  {badgeContent}
                </span>
              );
            })}
          </div>
        )}

        {/* Researching Students Pills */}
        {module.researchers.length > 0 && (
          <div className="mt-4">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#596556]">
              Researching Students
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {module.researchers.map((student) => (
                <li key={student.id}>
                  {student.linkedinUrl ? (
                    <a
                      href={student.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${student.name} on LinkedIn`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#B2C9A8] bg-white px-3 py-1 text-xs font-medium text-[#202B20] transition-colors hover:border-[#0A66C2] hover:bg-[#EEF6FD] hover:text-[#0A66C2]"
                    >
                      <MemberThumb member={student} />
                      <span>{student.name}</span>
                      <LinkedInIcon className="size-3 shrink-0 text-[#187347]" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B2C9A8] bg-white px-3 py-1 text-xs font-medium text-[#202B20]">
                      <MemberThumb member={student} />
                      <span>{student.name}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

const Acknowledgements: React.FC = () => {
  const reduced = useReducedMotion();
  const [cohorts, setCohorts] = useState<AcknowledgementCohort[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadCohorts() {
      setLoading(true);
      setError("");
      try {
        const raw = await getCohortsWithTeams(controller.signal);
        if (!active || controller.signal.aborted) return;

        const normalized = normalizeStrapiAcknowledgementCohorts(raw);
        setCohorts(normalized);

        const firstPopulated =
          normalized.find((c) => c.modules.length > 0) ?? normalized[0] ?? null;
        setSelectedYear((current) =>
          current !== null && normalized.some((c) => c.year === current)
            ? current
            : (firstPopulated?.year ?? null),
        );
      } catch (err: unknown) {
        if (!active || (err instanceof DOMException && err.name === "AbortError")) {
          return;
        }
        setError("Unable to load cohorts and teams from the CMS. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCohorts();
    return () => {
      active = false;
      controller.abort();
    };
  }, [retryCount]);

  const stats = useMemo(() => {
    const allModules = cohorts.flatMap((cohort) => cohort.modules);
    const totalStudents = allModules.reduce(
      (sum, mod) => sum + mod.totalMembers,
      0,
    );
    const totalPrms = allModules.reduce((sum, mod) => sum + mod.prms.length, 0);
    const years = cohorts.map((cohort) => cohort.year);
    const minYear = years.length > 0 ? Math.min(...years) : null;
    const maxYear = years.length > 0 ? Math.max(...years) : null;
    const yearRange =
      minYear !== null && maxYear !== null
        ? minYear === maxYear
          ? String(maxYear)
          : `${minYear}–${maxYear}`
        : null;

    return {
      cohortCount: cohorts.length,
      moduleCount: allModules.length,
      studentCount: totalStudents,
      prmCount: totalPrms,
      minYear,
      maxYear,
      yearRange,
    };
  }, [cohorts]);

  const trimmedQuery = searchQuery.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!trimmedQuery) return [];
    const results: Array<{ cohort: string; module: AcknowledgementModule }> = [];
    for (const cohort of cohorts) {
      for (const mod of cohort.modules) {
        const matchesModule = mod.name.toLowerCase().includes(trimmedQuery);
        const matchesCohort = cohort.label.toLowerCase().includes(trimmedQuery);
        const matchesMember =
          mod.prms.some(
            (m) =>
              m.name.toLowerCase().includes(trimmedQuery) ||
              `prm: ${m.name}`.toLowerCase().includes(trimmedQuery),
          ) ||
          mod.researchers.some((m) =>
            m.name.toLowerCase().includes(trimmedQuery),
          );
        if (matchesModule || matchesCohort || matchesMember) {
          results.push({ cohort: cohort.label, module: mod });
        }
      }
    }
    return results;
  }, [cohorts, trimmedQuery]);

  const activeCohort = useMemo(
    () => cohorts.find((cohort) => cohort.year === selectedYear) ?? cohorts[0] ?? null,
    [cohorts, selectedYear],
  );
  const activeCohortModules = activeCohort?.modules ?? [];
  const activeCohortMemberCount = activeCohortModules.reduce(
    (sum, mod) => sum + mod.totalMembers,
    0,
  );

  const heroBadges: Array<{ label: string; tone: "cream" | "sage" }> = [
    {
      label: stats.yearRange ? `UMD FIRE · ${stats.yearRange}` : "UMD FIRE",
      tone: "cream",
    },
    ...(stats.cohortCount > 0
      ? [
          {
            label: `${stats.cohortCount} Research ${
              stats.cohortCount === 1 ? "Cohort" : "Cohorts"
            }`,
            tone: "sage" as const,
          },
        ]
      : []),
  ];

  return (
    <div className="acknowledgements-editorial-page min-h-screen bg-white text-[#202B20]">
      <EditorialPageHero
        ariaLabel="Community and Acknowledgements"
        badges={heroBadges}
        title={
          <>
            Community &amp;{" "}
            <em className="font-normal italic text-[#E9E6B2]">
              Acknowledgements
            </em>
          </>
        }
        subtitle={
          stats.cohortCount > 0
            ? `Celebrating the University of Maryland FIRE Global Development & Design student researchers, Peer Research Mentors, faculty leaders, and international partners who built this open-access toolkit across ${stats.cohortCount} ${stats.cohortCount === 1 ? "cohort" : "cohorts"}.`
            : "Celebrating the University of Maryland FIRE Global Development & Design student researchers, Peer Research Mentors, faculty leaders, and international partners who built this open-access toolkit."
        }
        footnote="University of Maryland FIRE · Dr. Ben Huffman & Dr. Stacy Kosko · DICT Philippines · OWLI Kenya"
        aside={
          <div className="rounded-2xl border-[1.5px] border-[#E9E6B2] bg-[#2E502B]/85 p-5 text-white shadow-xl backdrop-blur-sm sm:p-6">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#E9E6B2]">
              Community by the Numbers
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#94B985] bg-white/95 p-3.5 text-[#202B20]">
                <p
                  className="text-2xl font-bold leading-none text-[#187347] tabular-nums"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {loading ? "…" : stats.cohortCount}
                </p>
                <p className="mt-1.5 text-[11px] font-medium text-[#394838]">
                  {stats.yearRange
                    ? `FIRE Cohorts (${stats.yearRange})`
                    : "FIRE Cohorts"}
                </p>
              </div>
              <div className="rounded-xl border border-[#D6CE8A] bg-[#FAF8E4] p-3.5 text-[#202B20]">
                <p
                  className="text-2xl font-bold leading-none text-[#284B26] tabular-nums"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {loading ? "…" : stats.studentCount}
                </p>
                <p className="mt-1.5 text-[11px] font-medium text-[#394838]">
                  Student &amp; PRM Roles
                </p>
              </div>
              <div className="rounded-xl border border-[#94B985] bg-[#EDF4E8] p-3.5 text-[#202B20]">
                <p
                  className="text-2xl font-bold leading-none text-[#284B26] tabular-nums"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {loading ? "…" : stats.moduleCount}
                </p>
                <p className="mt-1.5 text-[11px] font-medium text-[#394838]">
                  Module Teams Built
                </p>
              </div>
              <div className="rounded-xl border border-[#94B985] bg-white/95 p-3.5 text-[#202B20]">
                <p
                  className="text-2xl font-bold leading-none text-[#187347] tabular-nums"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  2
                </p>
                <p className="mt-1.5 text-[11px] font-medium text-[#394838]">
                  Global Partners (DICT &amp; OWLI)
                </p>
              </div>
            </div>
          </div>
        }
      />

      {/* Section 1: Faculty Mentors & International Partners */}
      <EditorialSection tone="white" ariaLabelledBy="leadership-heading">
        <EditorialSectionHeader
          eyebrow="01 / Leadership & Partnerships"
          title="Faculty Mentors & Global Counterparts"
          titleId="leadership-heading"
        />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main narrative + Faculty Mentors */}
          <EditorialReveal className="lg:col-span-7">
            <div className="flex h-full flex-col justify-between rounded-2xl border-[1.5px] border-[#94B985] bg-[#F6F4D8] p-6 sm:p-7">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3F673C] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#E9E6B2]">
                  <GraduationCap className="size-3.5" aria-hidden="true" />
                  UMD FIRE Faculty Mentorship
                </span>
                <p className="mt-4 text-sm leading-relaxed text-[#202B20] sm:text-base">
                  The University of Maryland&rsquo;s FIRE program provides
                  student researchers with an inclusive faculty-mentored
                  research experience. Led by{" "}
                  <a
                    href="https://www.fire.umd.edu/ben-huffman"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#187347] underline decoration-[#94B985] underline-offset-4 transition-colors hover:text-[#105C37] hover:decoration-[#187347]"
                  >
                    Dr. Ben Huffman
                  </a>{" "}
                  along with founding research designer and faculty collaborator{" "}
                  <a
                    href="https://gvpt.umd.edu/facultyprofile/kosko/stacy-j"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#187347] underline decoration-[#94B985] underline-offset-4 transition-colors hover:text-[#105C37] hover:decoration-[#187347]"
                  >
                    Dr. Stacy Kosko
                  </a>
                  . Together, students have worked to develop this toolkit.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href="https://www.fire.umd.edu/ben-huffman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-[#B2C9A8] bg-white px-4 py-3 transition-all hover:border-[#3F673C] hover:shadow-xs"
                >
                  <div>
                    <p
                      className="text-sm font-semibold text-[#202B20] group-hover:text-[#187347]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      Dr. Ben Huffman
                    </p>
                    <p className="text-xs text-[#596556]">
                      FIRE Faculty Mentor &amp; Lead
                    </p>
                  </div>
                  <ArrowUpRight
                    className="size-4 text-[#187347] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>

                <a
                  href="https://gvpt.umd.edu/facultyprofile/kosko/stacy-j"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-[#B2C9A8] bg-white px-4 py-3 transition-all hover:border-[#3F673C] hover:shadow-xs"
                >
                  <div>
                    <p
                      className="text-sm font-semibold text-[#202B20] group-hover:text-[#187347]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      Dr. Stacy Kosko
                    </p>
                    <p className="text-xs text-[#596556]">
                      Founding Designer &amp; Collaborator
                    </p>
                  </div>
                  <ArrowUpRight
                    className="size-4 text-[#187347] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </EditorialReveal>

          {/* International Counterparts Card */}
          <EditorialReveal delay={0.08} className="lg:col-span-5">
            <div className="flex h-full flex-col justify-between rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#F2F6EF] p-6 sm:p-7">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#94B985] bg-white px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                  <Globe2 className="size-3.5" aria-hidden="true" />
                  International Counterparts
                </span>
                <p className="mt-4 text-sm leading-relaxed text-[#394838]">
                  Special thanks to our international counterparts who ground
                  our research in community-led practice across the Philippines
                  and Kenya.
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <a
                  href="https://dict.gov.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-[#B2C9A8] bg-white px-4 py-3 transition-all hover:border-[#3F673C] hover:shadow-xs"
                >
                  <div>
                    <p
                      className="text-sm font-semibold text-[#202B20] group-hover:text-[#187347]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      DICT Philippines
                    </p>
                    <p className="text-xs text-[#596556]">
                      Director Rik Amores
                    </p>
                  </div>
                  <ArrowUpRight
                    className="size-4 text-[#187347] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>

                <a
                  href="https://oneworldleadership.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-[#B2C9A8] bg-white px-4 py-3 transition-all hover:border-[#3F673C] hover:shadow-xs"
                >
                  <div>
                    <p
                      className="text-sm font-semibold text-[#202B20] group-hover:text-[#187347]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      OWLI Kenya
                    </p>
                    <p className="text-xs text-[#596556]">
                      Executive Director Joseph Odhiambo
                    </p>
                  </div>
                  <ArrowUpRight
                    className="size-4 text-[#187347] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </EditorialReveal>
        </div>
      </EditorialSection>

      {/* Section 2: Interactive Cohort Selector & Module Teams */}
      <EditorialSection tone="sage" ariaLabelledBy="cohorts-heading">
        <EditorialSectionHeader
          eyebrow="02 / Student Research Cohorts"
          title="Peer Research Mentors & Researching Students"
          titleId="cohorts-heading"
          align="center"
          description={
            <>
              Browse every UMD FIRE research cohort
              {stats.minYear !== null && stats.maxYear !== null
                ? stats.minYear === stats.maxYear
                  ? ` from ${stats.maxYear}`
                  : ` from ${stats.minYear} to ${stats.maxYear}`
                : ""}
              , featuring{" "}
              <span className="font-semibold text-[#284B26]">
                Peer Research Mentors (PRMs)
              </span>{" "}
              in warm cream badges alongside{" "}
              <span className="font-semibold text-[#284B26]">
                undergraduate researching students
              </span>
              .
            </>
          }
        />

        {loading && (
          <div
            role="status"
            className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-10 text-center"
          >
            <Loader2
              className="size-6 animate-spin text-[#187347]"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-[#394838]">
              Loading research cohorts and module teams…
            </p>
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="mt-8 rounded-2xl border-[1.5px] border-dashed border-[#B91C1C]/40 bg-white p-10 text-center"
          >
            <p
              className="text-lg font-semibold text-[#202B20]"
              style={EDITORIAL_SERIF_STYLE}
            >
              Could not load cohorts
            </p>
            <p className="mt-1.5 text-sm text-[#596556]">{error}</p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] border-[#3F673C] bg-white px-5 py-2 text-xs font-semibold text-[#284B26] hover:bg-[#EDF4E8]"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Try again
            </button>
          </div>
        )}

        {!loading && !error && cohorts.length === 0 && (
          <div
            role="status"
            className="mt-8 rounded-2xl border-[1.5px] border-dashed border-[#94B985] bg-white p-10 text-center"
          >
            <p
              className="text-lg font-semibold text-[#202B20]"
              style={EDITORIAL_SERIF_STYLE}
            >
              No research cohorts available yet.
            </p>
            <p className="mt-1.5 text-sm text-[#596556]">
              Cohort rosters will appear here once published in Strapi.
            </p>
          </div>
        )}

        {!loading && !error && activeCohort && (
          <>
            {/* Cohort Selector Tabs + Quick Contributor Search */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <div
                role="tablist"
                aria-label="Select a research cohort"
                className="flex flex-wrap items-center justify-center gap-2"
              >
                {cohorts.map((cohort) => {
                  const isActive =
                    !trimmedQuery && activeCohort.year === cohort.year;
                  return (
                    <button
                      key={cohort.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        setSelectedYear(cohort.year);
                        if (trimmedQuery) setSearchQuery("");
                      }}
                      className={cn(
                        "cursor-pointer rounded-full px-4 py-1.5 text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C] focus-visible:ring-offset-2",
                        isActive
                          ? "bg-gradient-to-r from-[#3F673C] to-[#187347] font-semibold text-white shadow-sm"
                          : "border border-[#94B985] bg-white font-medium text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8]",
                      )}
                    >
                      {cohort.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full max-w-md">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#596556]"
                />
                <input
                  type="search"
                  aria-label="Search students, mentors, or modules across all cohorts"
                  placeholder="Search any student, PRM, or module across cohorts…"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-10 w-full rounded-full border-[1.5px] border-[#94B985] bg-white pr-9 pl-10 text-sm text-[#202B20] shadow-xs placeholder:text-[#596556] focus:border-[#3F673C] focus:outline-none focus:ring-2 focus:ring-[#3F673C]/25"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchQuery("")}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full p-1 text-[#596556] hover:bg-[#EDF4E8] hover:text-[#202B20]"
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* Cohort Header Strip or Search Results Header */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#D5E3D9] pb-3.5">
              {trimmedQuery ? (
                <p className="text-sm text-[#394838]">
                  Found{" "}
                  <span className="font-semibold text-[#202B20] tabular-nums">
                    {searchResults.length}
                  </span>{" "}
                  matching {searchResults.length === 1 ? "module" : "modules"}{" "}
                  for{" "}
                  <span className="font-semibold text-[#187347]">
                    &ldquo;{searchQuery.trim()}&rdquo;
                  </span>
                </p>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <h3
                    className="text-2xl font-semibold text-[#202B20]"
                    style={EDITORIAL_SERIF_STYLE}
                  >
                    {activeCohort.label}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#94B985] bg-white px-3 py-1 font-mono text-[11px] font-medium text-[#284B26]">
                    <Layers
                      className="size-3 text-[#187347]"
                      aria-hidden="true"
                    />
                    {activeCohortModules.length}{" "}
                    {activeCohortModules.length === 1 ? "Module" : "Modules"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#94B985] bg-white px-3 py-1 font-mono text-[11px] font-medium text-[#284B26]">
                    <Users
                      className="size-3 text-[#187347]"
                      aria-hidden="true"
                    />
                    {activeCohortMemberCount}{" "}
                    {activeCohortMemberCount === 1
                      ? "Contributor"
                      : "Contributors"}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-[#596556]">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#94B985] bg-[#F6F4D8] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#284B26]">
                  <GraduationCap
                    className="size-3 text-[#187347]"
                    aria-hidden="true"
                  />
                  PRM = Peer Research Mentor
                </span>
              </div>
            </div>

            {/* Modules Grid with Smooth AnimatePresence */}
            {trimmedQuery ? (
              searchResults.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {searchResults.map(({ cohort, module }) => (
                    <ModuleRosterCard
                      key={`${cohort}-${module.id}`}
                      module={module}
                      cohortLabel={cohort}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border-[1.5px] border-dashed border-[#94B985] bg-white p-10 text-center">
                  <p
                    className="text-lg font-semibold text-[#202B20]"
                    style={EDITORIAL_SERIF_STYLE}
                  >
                    No matching contributors or modules found.
                  </p>
                  <p className="mt-1.5 text-sm text-[#596556]">
                    Try searching by a first name, last name, or module title.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] border-[#3F673C] bg-white px-5 py-2 text-xs font-semibold text-[#284B26] hover:bg-[#EDF4E8]"
                  >
                    Clear search
                  </button>
                </div>
              )
            ) : activeCohortModules.length > 0 ? (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeCohort.label}
                  role="tabpanel"
                  aria-label={activeCohort.label}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.24, ease: EDITORIAL_EASE }}
                  className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
                >
                  {activeCohortModules.map((module) => (
                    <ModuleRosterCard key={module.id} module={module} />
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div
                role="status"
                className="mt-6 rounded-2xl border-[1.5px] border-dashed border-[#94B985] bg-white p-10 text-center"
              >
                <p
                  className="text-lg font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  No module teams listed for {activeCohort.label} yet.
                </p>
              </div>
            )}
          </>
        )}
      </EditorialSection>
    </div>
  );
};

export default Acknowledgements;
