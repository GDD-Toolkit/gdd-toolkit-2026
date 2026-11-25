import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Globe2,
  GraduationCap,
  Layers,
  Search,
  Users,
  X,
} from "lucide-react";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialReveal,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import { cn } from "@/lib/utils";
import "./Acknowledgements.css";

type Module = {
  name: string;
  students: string[];
};

const cohorts: Record<string, Module[]> = {
  "Cohort 2020": [
    { name: "Development Ethics", students: ["Vera Gbedemah", "Ethan Paul"] },
    {
      name: "Ethics of Innovation",
      students: ["Ange Guianin", "Natasha Panduwawala", "Raya Seid"],
    },
    {
      name: "Human Centered Design",
      students: ["Amarachi Joe-Nweke", "Arrington Lancaster"],
    },
    {
      name: "Human Rights and Capabilities",
      students: ["Maria Castro-Rodriguez", "John Lin", "Roma Seth"],
    },
    {
      name: "Infrastructure and Interface",
      students: ["Manasvi Chegu", "Jalen Coles", "Shivasree Margam"],
    },
    {
      name: "Marketing and Outreach",
      students: [
        "Connie Cheung",
        "Madeline Merrill",
        "Anna Patterson",
        "Sofia Retamal",
      ],
    },
    {
      name: "Project Planning",
      students: ["Mikhaela-Mari Cuadera", "Mahlet Dagne", "Rachel Silberg"],
    },
  ],
  "Cohort 2021": [
    {
      name: "Development Ethics",
      students: [
        "PRM: Cameron Busser",
        "Jessica Chernoff",
        "Samira Mirza",
        "Juliana Woods",
        "Anastasia Katsafanas",
        "Nadia Panni",
        "Madeline Keen",
        "Isaiah Winger",
      ],
    },
    {
      name: "Ethics of Innovation",
      students: [
        "PRM: Raya Seid",
        "Ryan Bassett",
        "Steven Berit",
        "Mirabella Hitzges",
        "Petra Zika",
      ],
    },
    {
      name: "Human Centered Design",
      students: ["PRM: Courtney Davidson", "Tara Lui", "Madeline Omu-Ray"],
    },
    {
      name: "Human Rights & Capabilities",
      students: [
        "PRM: Roma Sheth",
        "Jeremy Christian Mccallum",
        "Daniela Nemi",
        "Jada Smallwood",
        "Olivia Wolfson",
      ],
    },
    {
      name: "Infrastructure and Interface",
      students: [
        "PRM: Shivasree Margam",
        "Brett Caplan",
        "Blen Mulugeta",
        "Sharon Zhang",
      ],
    },
    {
      name: "Marketing & Outreach",
      students: [
        "PRM: Madeline Merrill",
        "Nikita Bandarupalli",
        "Sophia Eitel",
        "Ava Reiner",
        "Alexandra Rogan",
        "Khushi Shah",
      ],
    },
    {
      name: "Project Planning",
      students: [
        "PRM: Mikhaela Mari Cuadera",
        "Emma Orange",
        "Kelan Shah",
        "Zoe Singer",
        "Joseph Udovich",
      ],
    },
  ],
  "Cohort 2022": [
    {
      name: "Development Ethics",
      students: [
        "PRM: Zayna",
        "Tomomi Hayashi",
        "Andrew Wallen",
        "Morgan Borders",
        "Rohin Mishra",
        "Juliette Corseri",
      ],
    },
    {
      name: "Ethics of Innovation",
      students: [
        "PRM: Steven",
        "Henry Matthew Birger",
        "Drew Roland Durst",
        "Edward Rizkilla",
        "Christopher Li",
      ],
    },
    {
      name: "Human Centered Design",
      students: [
        "PRM: Tara Lui",
        "Ashley Chau",
        "Jennifer Chiang",
        "Jenna Nagie",
        "Fe Eugenie Batoon",
      ],
    },
    {
      name: "Maldevelopment",
      students: [
        "PRM: Ethan",
        "Bailey Sullivan",
        "Frances Chen",
        "Joseph Diaz",
        "Sophie Garcia",
      ],
    },
    {
      name: "Infrastructure and Interface",
      students: [
        "PRM: Shiv",
        "Jessica Nguyen",
        "Zoe Cheng",
        "Evan Hardy",
        "Rory Rutledge",
        "Joshua Gabriel Fitch",
      ],
    },
    {
      name: "Marketing & Outreach",
      students: [
        "PRM: Rylan",
        "Ezinne Uzoho",
        "Nick Murray",
        "Emily Chung",
        "Sarah Meklir",
      ],
    },
    {
      name: "Project Planning",
      students: [
        "PRM: Mikhaela",
        "Sarah Dominguez",
        "Haley Robinson",
        "Jordan Snarski",
      ],
    },
  ],
  "Cohort 2023": [
    {
      name: "Development Ethics",
      students: [
        "PRM: Bailey Sullivan",
        "Mayank Barnwal",
        "Christian Galeano Ramos",
        "Anderson Lemus-Del Cid",
        "Ananya Malipeddi",
      ],
    },
    {
      name: "Operational Protocols",
      students: [
        "PRM: Miral Mohammed",
        "Swaminathan Gayatri Lnu",
        "Colin Freas",
        "Alex Krucoff",
        "Miguel Queen",
      ],
    },
    {
      name: "Human Centered Design",
      students: [
        "PRM: Ashley Chau",
        "Wending Zhang",
        "Rachel Odumade",
        "Grace Liao",
      ],
    },
    {
      name: "Project Evaluation",
      students: [
        "PRM: Angie Nguyen",
        "Emilia Guzman",
        "Tobias West",
        "Regina Noel Kelly Hrabinski",
      ],
    },
    {
      name: "Infrastructure and Interface",
      students: [
        "PRM: Jessica Nguyen",
        "Oluwatobiloba Adegbaju",
        "Ojie Okodogbe",
        "Neha Veeragandham",
        "Khardiatou Wane",
        "Bodhi Getsug",
      ],
    },
    {
      name: "Marketing & Outreach",
      students: [
        "PRM: Emily Chung",
        "Ozioma Farrah Chigbo",
        "Lakayla James",
        "Caroline Meury",
        "Isaiah Ragsdale",
      ],
    },
    {
      name: "Project Planning",
      students: [
        "PRM: Quentin Hoglund",
        "Amisiyas Seyoum",
        "Niharika Sur",
        "Guhan Pradeep",
        "Julieanna Burke",
        "Peter Delalio",
      ],
    },
  ],
  "Cohort 2024": [
    {
      name: "Development Ethics",
      students: [
        "PRM: Regina Hrabinski",
        "Ishan Ho",
        "Manuela Prieto",
        "Rishit Roy",
        "Sara Saleh",
      ],
    },
    {
      name: "Human Centered Design",
      students: [
        "PRM: Khadija Wane",
        "Alyssa Moreno",
        "Ariana Urbano Veliz",
        "Ishani Ghosh",
        "Maanya Upadhyay",
        "Margaret Senturia",
        "Ohan Semirjyan",
        "Ruth Whitehous",
        "Sarah Borgos",
        "Tami Mumuney",
      ],
    },
    {
      name: "Infrastructure and Interface",
      students: [
        "PRM: Jessica Nguyen",
        "PRM: Somil Varshney",
        "Ainsley Jacobsen",
        "Rohan Tadisetty",
        "Saisidharth Seyyadri",
        "Sarah King",
        "Sequoia Santoro",
      ],
    },
    {
      name: "Operational Protocols",
      students: [
        "PRM: Gayatri Lnu",
        "Milenko Stojkovic",
        "Rowan Kuske",
        "Stella Kahric",
        "Timothy Fasold",
      ],
    },
    {
      name: "Project Evaluation",
      students: [
        "PRM: Emilia Guzman",
        "Alexandra Jordan",
        "Jiun Park",
        "Miles Taylor",
        "Riley Revilla",
      ],
    },
    {
      name: "Project Planning",
      students: [
        "PRM: Julie Burke",
        "Jack Noyes",
        "Krishnan Tholkappian",
        "Lila Sheingate",
        "Lilia Shahal",
        "Sabeen Kirwi",
      ],
    },
    {
      name: "Public Policy",
      students: [
        "PRM: Alex Krucoff",
        "Aryaan Ahmed",
        "Cameron Deocampo",
        "Eugene Choi",
        "Gideon Eichenwald",
        "Justin Jones",
        "Natalie Shiloni",
        "Shirin Saberi",
        "Wallace Savoy",
      ],
    },
    {
      name: "Training and Knowledge Development",
      students: [
        "PRM: Rachel Odumade",
        "Aidyn Phillips",
        "Emanuella Chiemeka",
        "Javon Lecky",
      ],
    },
  ],
  "Cohort 2025": [
    {
      name: "AI Development",
      students: [
        "PRM: Krishnan Tholkappian",
        "Youssef Ali Ahmed",
        "Nakshatra Hiray",
        "Siddhant Jain",
        "Richard Thomas",
        "Esha Vigneswaran",
      ],
    },
    {
      name: "AI Ethics",
      students: [
        "PRM: Justin Jones",
        "William Bachran",
        "Zoey Katz",
        "Ashlyn Wu",
        "Anna Howell",
      ],
    },
    {
      name: "Human Centered Design",
      students: [
        "PRM: Rowan Kuske",
        "Donovan Campos",
        "Isabella Canlas",
        "Sumer Elsalawi",
        "Arvind Kakanavaram",
        "Madeline Namias",
      ],
    },
    {
      name: "Infrastructure and Interface",
      students: [
        "PRM: Rohan Tadisetty",
        "Saikousil Tirumalasetty",
        "Inemesit Udo-Akang",
        "Raymond Wu",
      ],
    },
    {
      name: "Maldevelopment",
      students: [
        "PRM: Eugene Choi",
        "Emelia Adler",
        "Lexi Bernstein",
        "Daniella Hikin",
        "Grace Wieber",
      ],
    },
    {
      name: "Marketing and Outreach",
      students: [
        "PRM: Sabeen Kirwi",
        "Rory Gilmore",
        "Nolan Rogalski",
        "Darian Tamami",
        "Sophia Tamayo",
        "Nevan Vando",
      ],
    },
    {
      name: "Project Evaluation",
      students: ["PRM: Jiun Park", "Avery Demarco", "Alia Mubagal"],
    },
    {
      name: "Project Planning",
      students: [
        "PRM: Ruth Whitehouse",
        "Jaspreet Sonu",
        "Grace Wieber",
        "Neeraja Yasam",
      ],
    },
    {
      name: "Pro Public Policy",
      students: [
        "PRM: Shirin Saberi",
        "Antonella Almendariz",
        "Mitchell Kuta",
        "Lexi Schwartz",
        "Nola Tischler",
      ],
    },
    {
      name: "Training and Knowledge Development",
      students: [
        "PRM: Javon Lecky",
        "MeiMei Castranova",
        "Nora Grennon",
        "Eric Li",
      ],
    },
  ],
};

const COHORT_KEYS = Object.keys(cohorts);

function partitionMembers(students: string[]) {
  const prms: string[] = [];
  const researchers: string[] = [];
  for (const entry of students) {
    if (/^PRM:\s*/i.test(entry)) {
      prms.push(entry.replace(/^PRM:\s*/i, "").trim());
    } else {
      researchers.push(entry);
    }
  }
  return { prms, researchers };
}

function ModuleRosterCard({
  module,
  cohortLabel,
}: {
  module: Module;
  cohortLabel?: string;
}) {
  const { prms, researchers } = partitionMembers(module.students);

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
              {module.students.length}{" "}
              {module.students.length === 1 ? "member" : "members"}
            </span>
          </div>
        </div>

        {/* PRM Lead Mentor Badges */}
        {prms.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {prms.map((prm) => (
              <span
                key={`prm-${prm}`}
                className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#94B985] bg-[#F6F4D8] px-3 py-1 text-xs font-semibold text-[#284B26]"
              >
                <GraduationCap
                  className="size-3.5 shrink-0 text-[#187347]"
                  aria-hidden="true"
                />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#187347]">
                  PRM
                </span>
                <span>{prm}</span>
              </span>
            ))}
          </div>
        )}

        {/* Researching Students Pills */}
        {researchers.length > 0 && (
          <div className="mt-4">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#596556]">
              Researching Students
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {researchers.map((student, idx) => (
                <li
                  key={`${student}-${idx}`}
                  className="rounded-full border border-[#B2C9A8] bg-white px-3 py-1 text-xs font-medium text-[#202B20]"
                >
                  {student}
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
  const [selectedCohort, setSelectedCohort] = useState("Cohort 2025");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = useMemo(() => {
    const allModules = Object.values(cohorts).flat();
    const totalStudents = allModules.reduce(
      (sum, mod) => sum + mod.students.length,
      0,
    );
    const totalPrms = allModules.reduce(
      (sum, mod) =>
        sum + mod.students.filter((s) => /^PRM:\s*/i.test(s)).length,
      0,
    );
    return {
      cohortCount: COHORT_KEYS.length,
      moduleCount: allModules.length,
      studentCount: totalStudents,
      prmCount: totalPrms,
    };
  }, []);

  const trimmedQuery = searchQuery.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!trimmedQuery) return [];
    const results: Array<{ cohort: string; module: Module }> = [];
    for (const [cohortName, mods] of Object.entries(cohorts)) {
      for (const mod of mods) {
        const matchesModule = mod.name.toLowerCase().includes(trimmedQuery);
        const matchesCohort = cohortName.toLowerCase().includes(trimmedQuery);
        const matchesMember = mod.students.some((s) =>
          s.toLowerCase().includes(trimmedQuery),
        );
        if (matchesModule || matchesCohort || matchesMember) {
          results.push({ cohort: cohortName, module: mod });
        }
      }
    }
    return results;
  }, [trimmedQuery]);

  const activeCohortModules = cohorts[selectedCohort] ?? [];
  const activeCohortMemberCount = activeCohortModules.reduce(
    (sum, mod) => sum + mod.students.length,
    0,
  );

  return (
    <div className="acknowledgements-editorial-page min-h-screen bg-white text-[#202B20]">

      <EditorialPageHero
        ariaLabel="Community and Acknowledgements"
        badges={[
          { label: "UMD FIRE · 2020–2025", tone: "cream" },
          { label: `${stats.cohortCount} Research Cohorts`, tone: "sage" },
        ]}
        title={
          <>
            Community &amp;{" "}
            <em className="font-normal italic text-[#E9E6B2]">
              Acknowledgements
            </em>
          </>
        }
        subtitle="Celebrating the University of Maryland FIRE Global Development & Design student researchers, Peer Research Mentors, faculty leaders, and international partners who built this open-access toolkit across six cohorts."
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
                  {stats.cohortCount}
                </p>
                <p className="mt-1.5 text-[11px] font-medium text-[#394838]">
                  FIRE Cohorts (2020–2025)
                </p>
              </div>
              <div className="rounded-xl border border-[#D6CE8A] bg-[#FAF8E4] p-3.5 text-[#202B20]">
                <p
                  className="text-2xl font-bold leading-none text-[#284B26] tabular-nums"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {stats.studentCount}
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
                  {stats.moduleCount}
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
              Browse every UMD FIRE research cohort from 2020 to 2025—featuring{" "}
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

        {/* Cohort Selector Tabs + Quick Contributor Search */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div
            role="tablist"
            aria-label="Select a research cohort"
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {COHORT_KEYS.map((cohort) => {
              const isActive = !trimmedQuery && selectedCohort === cohort;
              return (
                <button
                  key={cohort}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setSelectedCohort(cohort);
                    if (trimmedQuery) setSearchQuery("");
                  }}
                  className={cn(
                    "cursor-pointer rounded-full px-4 py-1.5 text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C] focus-visible:ring-offset-2",
                    isActive
                      ? "bg-gradient-to-r from-[#3F673C] to-[#187347] font-semibold text-white shadow-sm"
                      : "border border-[#94B985] bg-white font-medium text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8]",
                  )}
                >
                  {cohort}
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
              matching {searchResults.length === 1 ? "module" : "modules"} for{" "}
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
                {selectedCohort}
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#94B985] bg-white px-3 py-1 font-mono text-[11px] font-medium text-[#284B26]">
                <Layers className="size-3 text-[#187347]" aria-hidden="true" />
                {activeCohortModules.length} Modules
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#94B985] bg-white px-3 py-1 font-mono text-[11px] font-medium text-[#284B26]">
                <Users className="size-3 text-[#187347]" aria-hidden="true" />
                {activeCohortMemberCount} Contributors
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-[#596556]">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#94B985] bg-[#F6F4D8] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#284B26]">
              <GraduationCap className="size-3 text-[#187347]" aria-hidden="true" />
              PRM = Peer Research Mentor
            </span>
          </div>
        </div>

        {/* Modules Grid with Smooth AnimatePresence */}
        {trimmedQuery ? (
          searchResults.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {searchResults.map(({ cohort, module }, idx) => (
                <ModuleRosterCard
                  key={`${cohort}-${module.name}-${idx}`}
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
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selectedCohort}
              role="tabpanel"
              aria-label={selectedCohort}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: EDITORIAL_EASE }}
              className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              {activeCohortModules.map((module, idx) => (
                <ModuleRosterCard
                  key={`${selectedCohort}-${module.name}-${idx}`}
                  module={module}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </EditorialSection>
    </div>
  );
};

export default Acknowledgements;
