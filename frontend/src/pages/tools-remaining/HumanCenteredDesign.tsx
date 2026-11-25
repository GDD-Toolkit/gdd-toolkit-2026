import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Check,
  Cpu,
  Factory,
  FlaskConical,
  Heart,
  Lightbulb,
  Quote,
  RotateCcw,
  RotateCw,
  Search,
  Wrench,
  X,
} from "lucide-react";
import achiengPortrait from "@/assets/images/human-centred-innovation/achieng-nyambura.png";
import achiengInfluencers from "@/assets/images/human-centred-innovation/achieng-influencers.png";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import "../development-ethics/humanCentredInnovation.css";

function EditorialReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced || typeof IntersectionObserver === "undefined") {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, delay, ease: EDITORIAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const steps = [
  {
    name: "Empathize",
    tagline: "Observe & listen deeply",
    accentBg: "bg-[#3F673C]",
    barColor: "bg-[#3F673C]",
    Icon: Heart,
  },
  {
    name: "Define",
    tagline: "Synthesize real needs",
    accentBg: "bg-[#187347]",
    barColor: "bg-[#187347]",
    Icon: Search,
  },
  {
    name: "Ideate",
    tagline: "Explore bold pathways",
    accentBg: "bg-[#284B26]",
    barColor: "bg-[#284B26]",
    Icon: Lightbulb,
  },
  {
    name: "Prototype",
    tagline: "Build to learn early",
    accentBg: "bg-[#4A6F3A]",
    barColor: "bg-[#4A6F3A]",
    Icon: Wrench,
  },
  {
    name: "Test",
    tagline: "Co-evaluate & iterate",
    accentBg: "bg-[#2E502B]",
    barColor: "bg-[#2E502B]",
    Icon: FlaskConical,
  },
] as const;

const commonFields = [
  {
    title: "Technology",
    Icon: Cpu,
    description:
      "Designing user-friendly apps, websites, and digital tools that people can navigate without frustration.",
  },
  {
    title: "Education",
    Icon: BookOpen,
    description:
      "Creating curricula, learning materials, and classroom practices that meet learners where they are and support diverse learning needs.",
  },
  {
    title: "Public Policy",
    Icon: Building2,
    description:
      "Crafting policies and services that reflect how people actually live, and that reduce barriers to access and participation.",
  },
  {
    title: "Manufacturing & Product Design",
    Icon: Factory,
    description:
      "Developing physical products that solve everyday problems, fit into real routines, and can be used safely and comfortably.",
  },
];

const quizQuestions = [
  {
    question: "What is not a key principle of human centered design?",
    answers: [
      "Understanding end users of a product",
      "Empathy, Inclusion, Collaboration",
      "Involving users throughout design process",
      "Focusing on just technology, not humans",
    ],
    correctAnswer: 3,
    explanation:
      "Human-centered design does not focus solely on developing technology; considering human opinions is the most important part of the mindset.",
  },
  {
    question:
      "Which is not a difference between human-centered design and design thinking?",
    answers: [
      "Human-centered design is focused on improving usability of a product, while design thinking can be used to improve a larger problem",
      "There is no difference between human-centered design and design thinking",
      "Design thinking leans more on ambiguity to explore more solutions, while human-centered design seeks to find a specific solution to a problem",
      "Human-centered design is a mindset, while design thinking is a process",
    ],
    correctAnswer: 1,
    explanation:
      "Design thinking and human-centered design are not the same thing. People use the design thinking process to develop ideas relating to human-centered design, but human-centered design is its own view on looking at problems.",
  },
  {
    question: "Which of the following is NOT part of the 5-Step D.School model?",
    answers: ["Define", "Discuss", "Prototype", "Ideate"],
    correctAnswer: 1,
    explanation: "The 5 steps are: Empathize, Define, Ideate, Prototype, Test.",
  },
  {
    question: "In the “Empathize” phase, designers primarily focus on:",
    answers: [
      "Testing prototypes",
      "Understanding users' experiences and needs",
      "Brainstorming solution ideas",
      "Measuring project success",
    ],
    correctAnswer: 1,
    explanation:
      "Understanding is the key of empathizing: all the other responses relate to human-centered design, but they have nothing to do with empathy.",
  },
  {
    question: "Which of the following is NOT a benefit of prototyping?",
    answers: [
      "Identifying design flaws early",
      "Saving development time",
      "Replacing the need for user research",
      "Gathering user feedback",
    ],
    correctAnswer: 2,
    explanation:
      "Prototyping helps test ideas and receive feedback at an early stage, so it supports the research process rather than replacing it.",
  },
  {
    question:
      "A team is designing a new digital ID system for cash transfers. Which action BEST reflects a development ethics approach?",
    answers: [
      "Launching the system as quickly as possible to reach more users.",
      "Collecting as much personal data as possible 'just in case' it is useful later.",
      "Involving community members in discussions about risks (like data misuse or exclusion), adjusting the design based on their concerns, and clearly explaining their rights.",
      "Letting the technology vendor make all key decisions since they are the technical experts.",
    ],
    correctAnswer: 2,
    explanation:
      "A development ethics approach emphasizes agency, justice, and “do no harm.” Involving community members in identifying risks, making design trade-offs transparent, and clarifying rights shows respect for dignity and helps prevent harm. Speed, data hoarding, or top-down decisions may increase efficiency but undermine ethical quality.",
  },
];

function Meter({
  label,
  value,
  endLabel,
}: {
  label: string;
  value: number;
  endLabel?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] font-medium text-[#394838]">
        <span>{label}</span>
        {endLabel && <span className="text-[#596556]">{endLabel}</span>}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#EDF4E8]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function EmpathizeDetails() {
  return (
    <div className="space-y-6">
      <p className="text-base leading-relaxed text-[#394838]">
        In order to properly implement Human-Centered Design principles, it is
        essential to understand and empathize with end users by knowing their
        background and their needs.
      </p>

      {/* Editorial Persona Dossier */}
      <div className="overflow-hidden rounded-2xl border-[1.5px] border-[#94B985] bg-[#FAFDF8]">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#3F673C] px-5 py-3.5 text-white">
          <div
            className="text-xl font-semibold text-[#E9E6B2] sm:text-2xl"
            style={EDITORIAL_SERIF_STYLE}
          >
            Achieng Nyambura
          </div>
          <span className="rounded-full border border-[#9AB887] bg-[#2E502B] px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#EDF4E8]">
            User Persona Example
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-12 lg:p-6">
          {/* Left Column: Portrait, Quote, Metadata, Traits */}
          <aside className="space-y-4 lg:col-span-4">
            <div className="overflow-hidden rounded-xl border border-[#B2C9A8] bg-white p-2">
              <img
                src={achiengPortrait}
                alt="Portrait of Achieng Nyambura"
                className="mx-auto aspect-[3/4] max-h-56 w-auto rounded-lg object-cover"
              />
            </div>

            <blockquote
              className="rounded-xl border border-[#D6CE8A] bg-[#F6F4D8] p-3.5 text-center text-xs italic leading-relaxed text-[#202B20]"
              style={EDITORIAL_SERIF_STYLE}
            >
              “I am ready and excited to make an impact efficiently and
              ethically.”
            </blockquote>

            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl border border-[#B2C9A8] bg-white p-4 text-xs">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#596556]">
                  Age
                </dt>
                <dd className="font-semibold text-[#202B20]">40</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#596556]">
                  Company
                </dt>
                <dd className="font-semibold text-[#202B20]">United Nations</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#596556]">
                  Role
                </dt>
                <dd className="font-semibold text-[#202B20]">Project Manager</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#596556]">
                  Family
                </dt>
                <dd className="font-semibold text-[#202B20]">Married</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#596556]">
                  Location
                </dt>
                <dd className="font-semibold text-[#202B20]">Kisumu, Kenya</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#596556]">
                  Character
                </dt>
                <dd className="font-semibold text-[#202B20]">Confident, Kind</dd>
              </div>
            </dl>

            <div className="space-y-2.5 rounded-xl border border-[#B2C9A8] bg-white p-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#187347]">
                Personality Spectrum
              </p>
              <Meter label="Introvert" endLabel="Extrovert" value={92} />
              <Meter label="Feeling" endLabel="Thinking" value={12} />
              <Meter label="Sensing" endLabel="Intuition" value={86} />
              <Meter label="Judging" endLabel="Perceiving" value={82} />
              <Meter label="Liberal" endLabel="Conservative" value={8} />
              <Meter label="Creative" endLabel="Analytical" value={48} />
              <Meter label="Type B" endLabel="Type A" value={94} />
            </div>
          </aside>

          {/* Center Column: Goals, Frustrations, Bio */}
          <div className="space-y-5 lg:col-span-5">
            <section className="rounded-xl border border-[#B2C9A8] bg-white p-4">
              <h4
                className="text-lg font-semibold text-[#284B26]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Goals
              </h4>
              <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-[#394838]">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#187347]" />
                  <span>Improve a development project</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#187347]" />
                  <span>
                    Implement a more effective agriculture system while
                    protecting endangered species in Kenya
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#187347]" />
                  <span>
                    Apply those development ethic skills to their project.
                  </span>
                </li>
              </ul>
            </section>

            <section className="rounded-xl border border-[#B2C9A8] bg-white p-4">
              <h4
                className="text-lg font-semibold text-[#284B26]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Frustrations
              </h4>
              <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-[#394838]">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6F6057]" />
                  <span>
                    Lack of development ethics resources currently available
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6F6057]" />
                  <span>Lack of funding in development field</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6F6057]" />
                  <span>Weather inhibiting ability to get to work</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6F6057]" />
                  <span>Mosquitoes</span>
                </li>
              </ul>
            </section>

            <section className="rounded-xl border border-[#B2C9A8] bg-[#F2F6EF] p-4">
              <h4
                className="text-lg font-semibold text-[#284B26]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Bio
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-[#394838]">
                Hello! I am Achieng Nyambura, a project manager working for the
                UN! I have a masters in Operations Management and Business
                Analytics, and graduated from the University of Maryland. Before
                working with the UN, I worked at the World Bank as a manager of
                a project to protect the Black Rhino species from extinction. I
                use Facebook to communicate my ideas. I am looking to refine a
                development project that I have been working on. I am a very
                people-oriented person, I am a leader, and I am extremely
                hardworking, and I care a lot about what I do. I am excited to
                gain skills and knowledge in development ethics and apply them.
                I am ready to combat the lack of resources and help
                underdeveloped countries. I am very interested in agriculture
                and wish to improve the agriculture infrastructure in Kenya.
              </p>
            </section>
          </div>

          {/* Right Column: Motivations, Influencers, Channels */}
          <aside className="space-y-4 lg:col-span-3">
            <div className="space-y-2.5 rounded-xl border border-[#B2C9A8] bg-white p-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#187347]">
                Motivations
              </p>
              <Meter label="Incentive" value={84} />
              <Meter label="Curiosity" value={25} />
              <Meter label="Growth" value={62} />
              <Meter label="Power" value={60} />
              <Meter label="Development ethics" value={89} />
            </div>

            <div className="rounded-xl border border-[#B2C9A8] bg-white p-4">
              <h4
                className="text-base font-semibold text-[#284B26]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Brands{" "}
                <small className="font-sans text-xs font-normal text-[#596556]">
                  (World Bank, UN)
                </small>
              </h4>
              <h4
                className="mt-3 text-base font-semibold text-[#284B26]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Influencers
              </h4>
              <img
                src={achiengInfluencers}
                alt="World Bank, United Nations, Facebook, and Greta Thunberg"
                className="mt-2 w-full rounded-lg border border-[#D5E3D9] object-contain"
              />
            </div>

            <div className="space-y-2.5 rounded-xl border border-[#B2C9A8] bg-white p-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#187347]">
                Preferred Channels
              </p>
              <Meter label="Traditional Ads" value={6} />
              <Meter label="Online & Social Media" value={58} />
              <Meter label="Referral" value={34} />
              <Meter label="Guerilla Efforts & PR" value={12} />
            </div>
          </aside>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-[#D5E3D9] bg-white px-5 py-3.5">
          {["People-oriented", "Leader", "Hardworking"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#94B985] bg-[#EDF4E8] px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#284B26]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className="border-t border-[#D5E3D9] pt-4 text-sm leading-relaxed text-[#596556]">
        In order for us to better properly empathize with end users, we created
        a persona and analyzed how we can meet their needs.
      </p>
    </div>
  );
}

function DefineDetails() {
  const responses = [
    "The pace is too fast",
    "The professor skips information a lot",
    "I am unable to take proper notes because the professor talks so fast",
    "The lecture is unorganized",
    "The assignments are very hard",
    "The structure of the class is not effective and concepts are not easily attainable",
  ];

  return (
    <div className="space-y-6">
      <p className="text-base leading-relaxed text-[#394838]">
        Analyze data gathered from empathizing with the population and identify
        an underlying issue.
      </p>

      <div className="rounded-2xl border-[1.5px] border-[#94B985] bg-[#F2F6EF] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4
            className="text-lg font-semibold text-[#202B20]"
            style={EDITORIAL_SERIF_STYLE}
          >
            Do you have any feedback on the class?
          </h4>
          <span className="rounded-full border border-[#94B985] bg-white px-3 py-0.5 font-mono text-[11px] font-medium text-[#187347]">
            6 responses
          </span>
        </div>

        <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {responses.map((response) => (
            <li
              key={response}
              className="rounded-xl border border-[#B2C9A8] border-l-4 border-l-[#3F673C] bg-white px-4 py-3 text-sm text-[#202B20]"
            >
              {response}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm leading-relaxed text-[#394838] sm:text-base">
        To understand how he could improve his class, a professor sent out a
        survey to his students. Can you determine a trend in the responses and
        define a problem the students are experiencing?
      </p>
      <div className="rounded-xl border border-[#D6CE8A] bg-[#F6F4D8] p-4 text-sm font-medium leading-relaxed text-[#202B20]">
        Though there are multiple problems, the main one expressed was the pace
        of the professor.
      </div>
    </div>
  );
}

function StageDetails({ activeStep }: { activeStep: number }) {
  if (activeStep === 0) return <EmpathizeDetails />;
  if (activeStep === 1) return <DefineDetails />;

  if (activeStep === 2) {
    return (
      <div className="space-y-5">
        <p className="text-base leading-relaxed text-[#394838]">
          Develop solutions that meet specified needs.
        </p>
        <p className="text-sm leading-relaxed text-[#596556] sm:text-base">
          In order for us to better properly empathize with end users, we
          created a persona and analyzed how we can meet their needs.
        </p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            "Brainstorm various ideas and decide on the best route.",
            "Begin stages of designs, development, and prototypes.",
            "Test out various ideas and prototypes.",
            "Utilize feedback in order to improve ideas and prototypes.",
          ].map((item, idx) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-[#B2C9A8] bg-[#FAFDF8] p-4 text-sm leading-relaxed text-[#202B20]"
            >
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3F673C] font-mono text-[10px] font-semibold text-[#E9E6B2]">
                0{idx + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (activeStep === 3) {
    return (
      <div className="space-y-5">
        <p className="text-base leading-relaxed text-[#394838]">
          Create versions of your ideas so they can be evaluated before
          finalizing a solution.
        </p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            "Low fidelity prototypes (such as sketches and storyboards).",
            "Role-player simulations.",
            "Physical prototypes (such as clay, cardboard, 3D printing).",
          ].map((item, idx) => (
            <li
              key={item}
              className="flex flex-col gap-2 rounded-xl border border-[#B2C9A8] bg-[#FAFDF8] p-4 text-sm leading-relaxed text-[#202B20]"
            >
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#187347]">
                Method 0{idx + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-base leading-relaxed text-[#394838]">
        Present the end-user with a high-fidelity prototype. Listen to user
        feedback and reiterate the process if needed.
      </p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          "Conduct focus groups with end-users.",
          "Send out a survey.",
        ].map((item, idx) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-xl border border-[#B2C9A8] bg-[#FAFDF8] p-4 text-sm leading-relaxed text-[#202B20]"
          >
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3F673C] font-mono text-[10px] font-semibold text-[#E9E6B2]">
              0{idx + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HumanCenteredDesign() {
  const [activeStep, setActiveStep] = useState(0);
  const [flippedFields, setFlippedFields] = useState<string[]>([]);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(
    quizQuestions.map(() => null),
  );
  const reduced = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleField = (title: string) => {
    setFlippedFields((current) =>
      current.includes(title)
        ? current.filter((field) => field !== title)
        : [...current, title],
    );
  };

  const currentQuestion = quizQuestions[currentQuizQuestion];
  const selectedQuizAnswer = quizAnswers[currentQuizQuestion];
  const correctCount = quizAnswers.filter(
    (answer, index) =>
      answer !== null && answer === quizQuestions[index].correctAnswer,
  ).length;
  const allAnswered = quizAnswers.every((answer) => answer !== null);

  const selectQuizAnswer = (answerIndex: number) => {
    if (selectedQuizAnswer !== null) return;

    setQuizAnswers((current) =>
      current.map((answer, index) =>
        index === currentQuizQuestion ? answerIndex : answer,
      ),
    );
  };

  const restartQuiz = () => {
    setQuizAnswers(quizQuestions.map(() => null));
    setCurrentQuizQuestion(0);
  };

  const currentStepMeta = steps[activeStep];

  return (
    <div className="hci-scope">

      <EditorialPageHero
        titleId="hcd-title"
        backLink={{
          label: "Human Centred Innovation",
          to: "/development-ethics",
        }}
        badges={[
          { label: "04 · Design Methods", tone: "cream" },
          { label: "5-Step D.School Model", tone: "sage" },
        ]}
        title={
          <>
            Human Centred{" "}
            <em className="font-normal italic text-[#E9E6B2]">Design</em>
          </>
        }
        subtitle="Start with people, listen to lived experience, and co-create accessible solutions throughout every stage of the design process."
        aside={
          <blockquote className="rounded-2xl border-[1.5px] border-[#E9E6B2]/75 bg-[#2E502B]/90 p-6 shadow-xl">
            <Quote className="h-6 w-6 text-[#E9E6B2]" aria-hidden="true" />
            <p
              className="mt-3 text-base italic leading-relaxed text-white sm:text-lg"
              style={EDITORIAL_SERIF_STYLE}
            >
              “Human-centered design is a philosophy, not a precise set of
              methods, but one that assumes that innovation should start by
              getting close to users and observing their activities.”
            </p>
            <cite className="mt-4 block border-t border-[#9AB887]/40 pt-3 font-mono text-[11px] not-italic uppercase tracking-wider text-[#E9E6B2]">
              Donald A. Norman, co-founder of Nielsen Norman Group
            </cite>
          </blockquote>
        }
      />

      {/* Section 1: Understanding HCD */}
      <EditorialSection tone="white" ariaLabelledBy="hcd-intro-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <EditorialReveal className="lg:col-span-5">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#187347]">
              01 / Understanding the approach
            </p>
            <h2
              id="hcd-intro-title"
              className="mt-2.5 text-3xl font-semibold tracking-tight text-[#202B20] sm:text-4xl"
              style={EDITORIAL_SERIF_STYLE}
            >
              What is Human Centred{" "}
              <em className="font-normal italic text-[#187347]">Design?</em>
            </h2>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Empathy", "Inclusion", "Co-Creation", "Shared Ownership"].map(
                (pillar) => (
                  <span
                    key={pillar}
                    className="rounded-full border border-[#B2C9A8] bg-[#F2F6EF] px-3.5 py-1 text-xs font-semibold text-[#284B26]"
                  >
                    {pillar}
                  </span>
                ),
              )}
            </div>
          </EditorialReveal>

          <EditorialReveal
            delay={0.08}
            className="space-y-4 border-t-[1.5px] border-[#3F673C] pt-6 text-base leading-relaxed text-[#394838] lg:col-span-7"
          >
            <p>
              <strong className="font-semibold text-[#202B20]">
                Human-Centered Design (HCD)
              </strong>{" "}
              is an approach to creating projects, products, and policies that
              starts with people and stays with them throughout the entire
              design process. Instead of designing for communities from a
              distance, HCD focuses on designing with them—listening to their
              experiences, inviting their input, and treating them as experts in
              their own lives.
            </p>
            <p>
              In practice, this means that once a problem is identified,
              designers begin by learning directly from the people affected.
              Through conversations, observations, and other forms of
              engagement, they surface real needs, everyday challenges, and
              existing strengths. These insights shape how the problem is framed
              and what directions are explored. As ideas are generated and
              tested, community members continue to react, critique, and
              co-create, helping refine solutions so they are understandable,
              usable, and genuinely helpful.
            </p>
            <p>
              Done well, HCD can make material more accessible, build trust, and
              create a sense of shared ownership over the outcome. It doesn’t
              guarantee perfect solutions, but it does ensure that people’s
              voices, contexts, and constraints are central rather than an
              afterthought.
            </p>
          </EditorialReveal>
        </div>
      </EditorialSection>

      {/* Section 2: Interactive 5-Step D.School Model */}
      <EditorialSection tone="sage" ariaLabelledBy="hcd-model-title">
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="02 / Iterative by design"
            titleId="hcd-model-title"
            align="center"
            title={
              <>
                5-Step{" "}
                <em className="font-normal italic text-[#187347]">
                  D.School Model
                </em>
              </>
            }
          />
          <p className="mx-auto mt-5 max-w-4xl text-center text-sm leading-relaxed text-[#394838] sm:text-base">
            The d.School model, also known as the Design Thinking model, is a
            training tool to teach users about Design Thinking. It is a process
            that focuses on problem-solving. It is divided into five categories:
            Empathize, Define, Ideate, Prototype, and Test. The Global
            Development and Design FIRE stream has worked closely with this
            model, as has the Human-Centered Design module team. The learning
            objectives for the d.school model focus on different tools to
            improve design thinking, such as human-centered design and
            accessibility, develop user understanding and perspective, generate
            solutions, test ideas, and more. The practical applications for the
            d.school model include active problem-solving, collaboration, and
            project management. Learning is being evaluated through
            project-based learning. More specifically, it is shown by
            demonstrating the five skills through feedback and flexibility.
          </p>
        </EditorialReveal>

        {/* Interactive 5-Step Selector */}
        <div
          role="group"
          aria-label="Design thinking stages"
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {steps.map((step, index) => {
            const isActive = activeStep === index;
            const StepIcon = step.Icon;

            return (
              <button
                key={step.name}
                type="button"
                aria-label={step.name}
                aria-pressed={isActive}
                aria-controls="hcd-step-detail"
                onClick={() => setActiveStep(index)}
                className={`relative flex cursor-pointer flex-col items-center rounded-2xl border-[1.5px] p-4 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C] focus-visible:ring-offset-2 ${
                  isActive
                    ? "border-[#3F673C] bg-[#3F673C] text-white shadow-md"
                    : "border-[#B2C9A8] bg-white text-[#202B20] hover:border-[#3F673C] hover:bg-[#FAFDF8]"
                }`}
              >
                {isActive && !reduced && (
                  <motion.span
                    layoutId="hcd-active-step-ring"
                    aria-hidden="true"
                    transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    className="pointer-events-none absolute -inset-[2px] rounded-2xl border-2 border-[#E9E6B2]"
                  />
                )}

                <span
                  aria-hidden="true"
                  className={`hci-hex-badge flex h-12 w-14 items-center justify-center transition-colors ${
                    isActive
                      ? "bg-[#E9E6B2] text-[#202B20]"
                      : "bg-[#EDF4E8] text-[#187347]"
                  }`}
                >
                  <StepIcon className="h-5 w-5" />
                </span>

                <span
                  aria-hidden="true"
                  className={`mt-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                    isActive ? "text-[#E9E6B2]" : "text-[#187347]"
                  }`}
                >
                  Step 0{index + 1}
                </span>

                <span
                  className="mt-0.5 text-base font-semibold"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {step.name}
                </span>

                <span
                  aria-hidden="true"
                  className={`mt-1 text-[11px] ${
                    isActive ? "text-[#EDF4E8]" : "text-[#596556]"
                  }`}
                >
                  {step.tagline}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Step Detail Panel */}
        <motion.article
          key={currentStepMeta.name}
          id="hcd-step-detail"
          aria-live="polite"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
          className="mt-6 overflow-hidden rounded-2xl border-[1.5px] border-[#3F673C] bg-white shadow-md"
        >
          <div className={`h-1.5 w-full ${currentStepMeta.barColor}`} />
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D5E3D9] bg-[#FAFDF8] px-6 py-5 sm:px-8">
            <div>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#187347]">
                Step {String(activeStep + 1).padStart(2, "0")} of 05
              </span>
              <h3
                className="mt-1 text-2xl font-semibold text-[#202B20] sm:text-3xl"
                style={EDITORIAL_SERIF_STYLE}
              >
                {currentStepMeta.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                aria-label="Previous D.School stage"
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#B2C9A8] bg-white text-[#284B26] transition-colors hover:border-[#3F673C] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                disabled={activeStep === steps.length - 1}
                onClick={() =>
                  setActiveStep((s) => Math.min(steps.length - 1, s + 1))
                }
                aria-label="Next D.School stage"
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#B2C9A8] bg-white text-[#284B26] transition-colors hover:border-[#3F673C] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <StageDetails activeStep={activeStep} />
          </div>
        </motion.article>

        <p className="mt-6 text-center text-sm text-[#596556]">
          Learn more in depth about each step of Stanford’s iterative d.school
          model by exploring their respective stages.
        </p>
      </EditorialSection>

      {/* Section 3: Common Fields Flippable Cards */}
      <EditorialSection tone="white" ariaLabelledBy="hcd-fields-title">
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="03 / Where the approach is used"
            titleId="hcd-fields-title"
            align="center"
            title={
              <>
                Common Fields That We Use{" "}
                <em className="font-normal italic text-[#187347]">
                  Human Centred Design
                </em>
              </>
            }
            description="Select a card to reveal more information."
          />
        </EditorialReveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {commonFields.map((field, index) => {
            const isFlipped = flippedFields.includes(field.title);
            const FieldIcon = field.Icon;

            return (
              <EditorialReveal key={field.title} delay={index * 0.06}>
                <button
                  type="button"
                  onClick={() => toggleField(field.title)}
                  aria-pressed={isFlipped}
                  aria-label={`${isFlipped ? "Hide" : "Show"} more information about ${field.title}`}
                  className="hci-flip-scene group block min-h-[18.5rem] w-full cursor-pointer rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C] focus-visible:ring-offset-4"
                >
                  <span
                    className={`hci-flip-inner${isFlipped ? " is-flipped" : ""}`}
                  >
                    {/* Front Face */}
                    <span className="hci-flip-face hci-flip-front flex flex-col justify-between rounded-2xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-6 transition-colors duration-200 group-hover:border-[#3F673C] group-hover:bg-white">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#94B985] bg-white font-mono text-xs font-semibold text-[#187347]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF4E8] text-[#3F673C]">
                          <FieldIcon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>

                      <strong
                        className="my-5 block text-xl font-semibold leading-snug text-[#202B20]"
                        style={EDITORIAL_SERIF_STYLE}
                      >
                        {field.title}
                      </strong>

                      <span className="inline-flex items-center justify-between border-t border-[#D5E3D9] pt-3.5 text-xs font-semibold uppercase tracking-wider text-[#3F673C]">
                        <span>Click to flip</span>
                        <RotateCw
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45"
                          aria-hidden="true"
                        />
                      </span>
                    </span>

                    {/* Back Face */}
                    <span className="hci-flip-face hci-flip-back flex flex-col justify-between rounded-2xl border-[1.5px] border-[#E9E6B2] bg-[#3F673C] p-6 text-white shadow-md">
                      <div>
                        <strong
                          className="block text-lg font-semibold text-[#E9E6B2]"
                          style={EDITORIAL_SERIF_STYLE}
                        >
                          {field.title}
                        </strong>
                        <span className="mt-3 block text-sm leading-relaxed text-[#EDF4E8]">
                          {field.description}
                        </span>
                      </div>

                      <span className="mt-5 inline-flex items-center justify-between border-t border-[#9AB887]/40 pt-3.5 text-xs font-semibold uppercase tracking-wider text-[#E9E6B2]">
                        <span>Click to return</span>
                        <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </span>
                  </span>
                </button>
              </EditorialReveal>
            );
          })}
        </div>
      </EditorialSection>

      {/* Section 4: Interactive 6-Question HCD Quiz */}
      <EditorialSection tone="sage" ariaLabelledBy="hcd-quiz-title">
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="04 / Check your understanding"
            titleId="hcd-quiz-title"
            align="center"
            title={
              <>
                Want to test your{" "}
                <em className="font-normal italic text-[#187347]">
                  HCD knowledge?
                </em>
              </>
            }
          />
        </EditorialReveal>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border-[1.5px] border-[#3F673C] bg-white p-6 shadow-md sm:p-8">
          {/* Animated Quiz Progress */}
          <div aria-label="Quiz progress" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
              <span className="font-mono uppercase tracking-wider text-[#284B26]">
                Question {currentQuizQuestion + 1} of {quizQuestions.length}
              </span>
              <span className="rounded-full border border-[#94B985] bg-[#EDF4E8] px-3 py-0.5 font-mono text-[11px] text-[#187347]">
                {correctCount} correct
              </span>
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EDF4E8]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347]"
                initial={false}
                animate={{
                  width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%`,
                }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 0.35, ease: EDITORIAL_EASE }
                }
              />
            </div>

            {/* Per-Question Indicator Pips */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {quizQuestions.map((q, idx) => {
                const ans = quizAnswers[idx];
                const isCurrent = idx === currentQuizQuestion;
                const isRight = ans !== null && ans === q.correctAnswer;
                const isWrong = ans !== null && ans !== q.correctAnswer;
                return (
                  <span
                    key={q.question}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      isRight
                        ? "bg-[#187347]"
                        : isWrong
                          ? "bg-[#C6362F]"
                          : isCurrent
                            ? "bg-[#3F673C]"
                            : "bg-[#D5E3D9]"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQuizQuestion}
            initial={reduced ? false : { opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
            className="mt-7"
          >
            <div className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3F673C] font-mono text-sm font-semibold text-[#E9E6B2]">
                {String(currentQuizQuestion + 1).padStart(2, "0")}
              </span>
              <div>
                <h3
                  className="text-xl font-semibold leading-snug text-[#202B20] sm:text-2xl"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {currentQuestion.question}
                </h3>
                <p className="mt-1 text-xs font-medium text-[#596556]">
                  Select the correct answer below
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {currentQuestion.answers.map((answer, answerIndex) => {
                const hasAnswered = selectedQuizAnswer !== null;
                const isCorrect = answerIndex === currentQuestion.correctAnswer;
                const isSelected = answerIndex === selectedQuizAnswer;
                const letter = String.fromCharCode(65 + answerIndex);

                let styleClasses =
                  "border-[#B2C9A8] bg-white text-[#202B20] hover:border-[#3F673C] hover:bg-[#FAFDF8]";
                if (hasAnswered && isCorrect) {
                  styleClasses =
                    "border-[#187347] bg-[#EDF4E8] text-[#202B20]";
                } else if (hasAnswered && isSelected && !isCorrect) {
                  styleClasses =
                    "border-[#C6362F] bg-[#FDF2F2] text-[#202B20]";
                } else if (hasAnswered) {
                  styleClasses =
                    "border-[#D5E3D9] bg-white/70 text-[#596556] opacity-75";
                }

                return (
                  <motion.button
                    key={answer}
                    type="button"
                    whileTap={
                      reduced || hasAnswered ? undefined : { scale: 0.99 }
                    }
                    onClick={() => selectQuizAnswer(answerIndex)}
                    disabled={hasAnswered}
                    aria-label={`${letter}. ${answer}`}
                    className={`flex w-full cursor-pointer items-center gap-3.5 rounded-xl border-[1.5px] px-4 py-3.5 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C] focus-visible:ring-offset-2 disabled:cursor-default ${styleClasses}`}
                  >
                    <strong className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current/25 bg-white/80 font-mono text-xs font-semibold text-[#284B26]">
                      {letter}.
                    </strong>
                    <span className="flex-1 leading-relaxed">{answer}</span>
                    {hasAnswered && isCorrect && (
                      <motion.span
                        initial={reduced ? false : { scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 22,
                        }}
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#187347] text-white"
                      >
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </motion.span>
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <motion.span
                        initial={reduced ? false : { scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 22,
                        }}
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C6362F] text-white"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {selectedQuizAnswer !== null && (
              <motion.div
                role="status"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                className={`mt-5 rounded-xl border-[1.5px] p-4 text-sm leading-relaxed ${
                  selectedQuizAnswer === currentQuestion.correctAnswer
                    ? "border-[#94B985] bg-[#EDF4E8] text-[#202B20]"
                    : "border-[#E5B3B0] bg-[#FDF2F2] text-[#202B20]"
                }`}
              >
                <strong
                  className={`block font-semibold ${
                    selectedQuizAnswer === currentQuestion.correctAnswer
                      ? "text-[#187347]"
                      : "text-[#C6362F]"
                  }`}
                >
                  {selectedQuizAnswer === currentQuestion.correctAnswer
                    ? "Correct!"
                    : "Not quite."}
                </strong>
                <p className="mt-1 text-[#394838]">
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}

            {allAnswered &&
              currentQuizQuestion === quizQuestions.length - 1 && (
                <motion.div
                  role="status"
                  initial={reduced ? false : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
                  className="mt-5 flex items-start gap-4 rounded-2xl border-[1.5px] border-[#3F673C] bg-[#F6F4D8] p-5"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#3F673C] text-[#E9E6B2]">
                    <Award className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <strong
                      className="block text-lg font-semibold text-[#202B20]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      Quiz complete: {correctCount} / {quizQuestions.length}{" "}
                      correct
                    </strong>
                    <p className="mt-1 text-sm text-[#394838]">
                      Review any previous question or restart to test your
                      knowledge again.
                    </p>
                  </div>
                </motion.div>
              )}

            <div className="mt-7 flex items-center justify-between gap-3 border-t border-[#D5E3D9] pt-5">
              <button
                type="button"
                onClick={() =>
                  setCurrentQuizQuestion((current) => Math.max(0, current - 1))
                }
                disabled={currentQuizQuestion === 0}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-[#B2C9A8] bg-white px-5 py-2.5 text-sm font-semibold text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#FAFDF8] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Previous
              </button>

              {currentQuizQuestion < quizQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentQuizQuestion((current) =>
                      Math.min(quizQuestions.length - 1, current + 1),
                    )
                  }
                  disabled={selectedQuizAnswer === null}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Next question
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={restartQuiz}
                  disabled={selectedQuizAnswer === null}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Restart quiz
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </EditorialSection>
    </div>
  );
}
