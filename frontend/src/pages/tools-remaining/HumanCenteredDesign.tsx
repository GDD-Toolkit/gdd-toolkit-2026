import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import achiengPortrait from "@/assets/images/human-centred-innovation/achieng-nyambura.png";
import achiengInfluencers from "@/assets/images/human-centred-innovation/achieng-influencers.png";
import "../development-ethics/humanCentredInnovation.css";

const steps = [
  { name: "Empathize" },
  { name: "Define" },
  { name: "Ideate" },
  { name: "Prototype" },
  { name: "Test" },
];

const commonFields = [
  {
    title: "Technology",
    description:
      "Designing user-friendly apps, websites, and digital tools that people can navigate without frustration.",
  },
  {
    title: "Education",
    description:
      "Creating curricula, learning materials, and classroom practices that meet learners where they are and support diverse learning needs.",
  },
  {
    title: "Public Policy",
    description:
      "Crafting policies and services that reflect how people actually live, and that reduce barriers to access and participation.",
  },
  {
    title: "Manufacturing & Product Design",
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

function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H6m5-6-6 6 6 6" />
    </svg>
  );
}

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
    <div className="hcd-meter">
      <div>
        <span>{label}</span>
        {endLabel && <span>{endLabel}</span>}
      </div>
      <span className="hcd-meter-track">
        <span style={{ width: `${value}%` }} />
      </span>
    </div>
  );
}

function EmpathizeDetails() {
  return (
    <div className="hcd-empathize-content">
      <p className="hcd-stage-lead">
        In order to properly implement Human-Centered Design principles, it is
        essential to understand and empathize with end users by knowing their
        background and their needs.
      </p>

      <div className="hcd-persona-title">Achieng Nyambura</div>
      <div className="hcd-persona-layout">
        <aside className="hcd-persona-sidebar">
          <img src={achiengPortrait} alt="Portrait of Achieng Nyambura" />
          <blockquote>
            “I am ready and excited to make an impact efficiently and
            ethically.”
          </blockquote>
          <dl>
            <div>
              <dt>Age</dt>
              <dd>40</dd>
            </div>
            <div>
              <dt>Company</dt>
              <dd>United Nations</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>Project Manager</dd>
            </div>
            <div>
              <dt>Family</dt>
              <dd>Married</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>Kisumu, Kenya</dd>
            </div>
            <div>
              <dt>Character</dt>
              <dd>Confident, Kind</dd>
            </div>
          </dl>
          <div className="hcd-traits">
            <Meter label="Introvert" endLabel="Extrovert" value={92} />
            <Meter label="Feeling" endLabel="Thinking" value={12} />
            <Meter label="Sensing" endLabel="Intuition" value={86} />
            <Meter label="Judging" endLabel="Perceiving" value={82} />
            <Meter label="Liberal" endLabel="Conservative" value={8} />
            <Meter label="Creative" endLabel="Analytical" value={48} />
            <Meter label="Type B" endLabel="Type A" value={94} />
          </div>
        </aside>

        <div className="hcd-persona-main">
          <section>
            <h4>Goals</h4>
            <ul>
              <li>Improve a development project</li>
              <li>
                Implement a more effective agriculture system while protecting
                endangered species in Kenya
              </li>
              <li>Apply those development ethic skills to their project.</li>
            </ul>
          </section>
          <section>
            <h4>Frustrations</h4>
            <ul>
              <li>Lack of development ethics resources currently available</li>
              <li>Lack of funding in development field</li>
              <li>Weather inhibiting ability to get to work</li>
              <li>Mosquitoes</li>
            </ul>
          </section>
          <section className="hcd-persona-bio">
            <h4>Bio</h4>
            <p>
              Hello! I am Achieng Nyambura, a project manager working for the
              UN! I have a masters in Operations Management and Business
              Analytics, and graduated from the University of Maryland. Before
              working with the UN, I worked at the World Bank as a manager of a
              project to protect the Black Rhino species from extinction. I use
              Facebook to communicate my ideas. I am looking to refine a
              development project that I have been working on. I am a very
              people-oriented person, I am a leader, and I am extremely
              hardworking, and I care a lot about what I do. I am excited to
              gain skills and knowledge in development ethics and apply them. I
              am ready to combat the lack of resources and help underdeveloped
              countries. I am very interested in agriculture and wish to improve
              the agriculture infrastructure in Kenya.
            </p>
          </section>
        </div>

        <aside className="hcd-persona-insights">
          <div className="hcd-motivations">
            <Meter label="Incentive" value={84} />
            <Meter label="Curiosity" value={25} />
            <Meter label="Growth" value={62} />
            <Meter label="Power" value={60} />
            <Meter label="Development ethics" value={89} />
          </div>
          <h4>
            Brands <small>(World Bank, UN)</small>
          </h4>
          <h4>Influencers</h4>
          <img
            src={achiengInfluencers}
            alt="World Bank, United Nations, Facebook, and Greta Thunberg"
          />
          <div className="hcd-channels">
            <Meter label="Traditional Ads" value={6} />
            <Meter label="Online & Social Media" value={58} />
            <Meter label="Referral" value={34} />
            <Meter label="Guerilla Efforts & PR" value={12} />
          </div>
        </aside>
      </div>

      <div className="hcd-persona-tags">
        <span>People-oriented</span>
        <span>Leader</span>
        <span>Hardworking</span>
      </div>
      <p className="hcd-stage-outro">
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
    <div className="hcd-native-card">
      <p className="hcd-stage-lead">
        Analyze data gathered from empathizing with the population and identify
        an underlying issue.
      </p>
      <div className="hcd-survey">
        <h4>Do you have any feedback on the class?</h4>
        <span>6 responses</span>
        <ul>
          {responses.map((response) => (
            <li key={response}>{response}</li>
          ))}
        </ul>
      </div>
      <p>
        To understand how he could improve his class, a professor sent out a
        survey to his students. Can you determine a trend in the responses and
        define a problem the students are experiencing?
      </p>
      <p>
        Though there are multiple problems, the main one expressed was the pace
        of the professor.
      </p>
    </div>
  );
}

function StageDetails({ activeStep }: { activeStep: number }) {
  if (activeStep === 0) return <EmpathizeDetails />;
  if (activeStep === 1) return <DefineDetails />;

  if (activeStep === 2) {
    return (
      <div className="hcd-native-card">
        <p className="hcd-stage-lead">
          Develop solutions that meet specified needs.
        </p>
        <p>
          In order for us to better properly empathize with end users, we
          created a persona and analyzed how we can meet their needs.
        </p>
        <ul>
          <li>Brainstorm various ideas and decide on the best route.</li>
          <li>Begin stages of designs, development, and prototypes.</li>
          <li>Test out various ideas and prototypes.</li>
          <li>Utilize feedback in order to improve ideas and prototypes.</li>
        </ul>
      </div>
    );
  }

  if (activeStep === 3) {
    return (
      <div className="hcd-native-card">
        <p className="hcd-stage-lead">
          Create versions of your ideas so they can be evaluated before
          finalizing a solution.
        </p>
        <ul>
          <li>Low fidelity prototypes (such as sketches and storyboards).</li>
          <li>Role-player simulations.</li>
          <li>Physical prototypes (such as clay, cardboard, 3D printing).</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="hcd-native-card">
      <p className="hcd-stage-lead">
        Present the end-user with a high-fidelity prototype. Listen to user
        feedback and reiterate the process if needed.
      </p>
      <ul>
        <li>Conduct focus groups with end-users.</li>
        <li>Send out a survey.</li>
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

  return (
    <div className="hci-scope">
      <div className="hcd-page">
        <section className="hcd-hero" aria-labelledby="hcd-title">
          <Link className="wd-back" to="/development-ethics">
            <BackArrow />
            Human Centred Innovation
          </Link>

          <div className="hcd-hero-copy">
            <h1 id="hcd-title">
              Human Centred{" "}
              <br />
              <em>Design</em>
            </h1>
          </div>

          <blockquote>
            “Human-centered design is a philosophy, not a precise set of
            methods, but one that assumes that innovation should start by
            getting close to users and observing their activities.”
            <cite>Donald A. Norman, co-founder of Nielsen Norman Group</cite>
          </blockquote>

          <div className="hcd-hero-graphic" aria-hidden="true">
            <span className="hcd-orbit hcd-orbit-one" />
            <span className="hcd-orbit hcd-orbit-two" />
          </div>
        </section>

        <section
          className="hcd-introduction"
          aria-labelledby="hcd-intro-title"
        >
          <div className="hcd-section-title">
            <span>Understanding the approach</span>
            <h2 id="hcd-intro-title">
              What is Human Centred <em>Design?</em>
            </h2>
          </div>

          <div className="hcd-intro-copy">
            <p>
              <strong>Human-Centered Design (HCD)</strong> is an approach to
              creating projects, products, and policies that starts with people
              and stays with them throughout the entire design process. Instead
              of designing for communities from a distance, HCD focuses on
              designing with them, listening to their experiences, inviting their
              input, and treating them as experts in their own lives.
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
          </div>
        </section>

        <section className="hcd-model" aria-labelledby="hcd-model-title">
          <div className="hcd-model-heading">
            <span>Iterative by design</span>
            <h2 id="hcd-model-title">
              5-Step <em>D.School Model</em>
            </h2>
            <p>
              The d.School model, also known as the Design Thinking model, is a
              training tool to teach users about Design Thinking. It is a
              process that focuses on problem-solving. It is divided into five
              categories: Empathize, Define, Ideate, Prototype, and Test. The
              Global Development and Design FIRE stream has worked closely with
              this model, as has the Human-Centered Design module team. The
              learning objectives for the d.school model focus on different
              tools to improve design thinking, such as human-centered design
              and accessibility, develop user understanding and perspective,
              generate solutions, test ideas, and more. The practical
              applications for the d.school model include active
              problem-solving, collaboration, and project management. Learning
              is being evaluated through project-based learning. More
              specifically, it is shown by demonstrating the five skills through
              feedback and flexibility.
            </p>
          </div>

          <div className="hcd-process">
            <div
              className="hcd-step-controls"
              role="group"
              aria-label="Design thinking stages"
            >
              {steps.map((step, index) => (
                <div
                  className={`hcd-hexagon-shell${activeStep === index ? " active" : ""}`}
                  key={step.name}
                >
                  <button
                    className={`hcd-hexagon hcd-hexagon-${index + 1}${
                      activeStep === index ? " active" : ""
                    }`}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    aria-pressed={activeStep === index}
                    aria-controls="hcd-step-detail"
                  >
                    <span>{step.name}</span>
                  </button>
                </div>
              ))}
            </div>

            <article
              className={`hcd-step-detail hcd-detail-${activeStep + 1}`}
              id="hcd-step-detail"
              aria-live="polite"
              key={steps[activeStep].name}
            >
              <div className="hcd-detail-heading">
                <span>
                  Step {String(activeStep + 1).padStart(2, "0")} of 05
                </span>
                <h3>{steps[activeStep].name}</h3>
              </div>
              <div className="hcd-detail-body">
                <StageDetails activeStep={activeStep} />
              </div>
            </article>
          </div>

          <p className="hcd-model-note">
            Learn more in depth about each step of Stanford’s iterative d.school
            model by exploring their respective stages.
          </p>
        </section>

        <section className="hcd-fields" aria-labelledby="hcd-fields-title">
          <div className="hcd-fields-heading">
            <span>Where the approach is used</span>
            <h2 id="hcd-fields-title">
              Common Fields That We Use <em>Human Centred Design</em>
            </h2>
            <p>Select a card to reveal more information.</p>
          </div>

          <div className="hcd-field-grid">
            {commonFields.map((field, index) => {
              const isFlipped = flippedFields.includes(field.title);

              return (
                <button
                  className={`hcd-field-card hcd-field-card-${index + 1}${
                    isFlipped ? " flipped" : ""
                  }`}
                  type="button"
                  key={field.title}
                  onClick={() => toggleField(field.title)}
                  aria-pressed={isFlipped}
                  aria-label={`${isFlipped ? "Hide" : "Show"} more information about ${field.title}`}
                >
                  <span className="hcd-field-card-inner">
                    <span className="hcd-field-face hcd-field-front">
                      <span className="hcd-field-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <strong>{field.title}</strong>
                      <span className="hcd-flip-cue">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20 7v5h-5M4 17v-5h5" />
                          <path d="M18.5 12A7 7 0 0 0 6 8M5.5 12A7 7 0 0 0 18 16" />
                        </svg>
                        Click to flip
                      </span>
                    </span>

                    <span className="hcd-field-face hcd-field-back">
                      <strong>{field.title}</strong>
                      <span>{field.description}</span>
                      <span className="hcd-flip-cue">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20 7v5h-5M4 17v-5h5" />
                          <path d="M18.5 12A7 7 0 0 0 6 8M5.5 12A7 7 0 0 0 18 16" />
                        </svg>
                        Click to return
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="hcd-quiz" aria-labelledby="hcd-quiz-title">
          <div className="hcd-quiz-heading">
            <span>Check your understanding</span>
            <h2 id="hcd-quiz-title">
              Want to test your <em>HCD knowledge?</em>
            </h2>
          </div>

          <div className="hcd-quiz-shell">
            <div className="hcd-quiz-progress" aria-label="Quiz progress">
              <div>
                <span>
                  Question {currentQuizQuestion + 1} of {quizQuestions.length}
                </span>
                <span>{correctCount} correct</span>
              </div>
              <span className="hcd-quiz-progress-track">
                <span
                  style={{
                    width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%`,
                  }}
                />
              </span>
            </div>

            <div className="hcd-question-card" key={currentQuizQuestion}>
              <div className="hcd-question-heading">
                <span>{String(currentQuizQuestion + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{currentQuestion.question}</h3>
                  <p>Select the correct answer below</p>
                </div>
              </div>

              <div className="hcd-answer-list">
                {currentQuestion.answers.map((answer, answerIndex) => {
                  const hasAnswered = selectedQuizAnswer !== null;
                  const isCorrect =
                    answerIndex === currentQuestion.correctAnswer;
                  const isSelected = answerIndex === selectedQuizAnswer;
                  const answerState = hasAnswered
                    ? isCorrect
                      ? " correct"
                      : isSelected
                        ? " incorrect"
                        : ""
                    : "";

                  return (
                    <button
                      className={`hcd-answer${answerState}`}
                      type="button"
                      key={answer}
                      onClick={() => selectQuizAnswer(answerIndex)}
                      disabled={hasAnswered}
                      aria-label={`${String.fromCharCode(65 + answerIndex)}. ${answer}`}
                    >
                      <strong>{String.fromCharCode(65 + answerIndex)}.</strong>
                      <span>{answer}</span>
                      {hasAnswered && isCorrect && (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="m5 12 4 4L19 6" />
                        </svg>
                      )}
                      {hasAnswered && isSelected && !isCorrect && (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="m7 7 10 10M17 7 7 17" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedQuizAnswer !== null && (
                <div
                  className={`hcd-quiz-feedback ${
                    selectedQuizAnswer === currentQuestion.correctAnswer
                      ? "correct"
                      : "incorrect"
                  }`}
                  role="status"
                >
                  <strong>
                    {selectedQuizAnswer === currentQuestion.correctAnswer
                      ? "Correct!"
                      : "Not quite."}
                  </strong>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}

              {allAnswered &&
                currentQuizQuestion === quizQuestions.length - 1 && (
                  <div className="hcd-quiz-summary" role="status">
                    <strong>
                      Quiz complete: {correctCount} / {quizQuestions.length}{" "}
                      correct
                    </strong>
                    <p>
                      Review any previous question or restart to test your
                      knowledge again.
                    </p>
                  </div>
                )}

              <div className="hcd-quiz-navigation">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentQuizQuestion((current) =>
                      Math.max(0, current - 1),
                    )
                  }
                  disabled={currentQuizQuestion === 0}
                >
                  Previous
                </button>

                {currentQuizQuestion < quizQuestions.length - 1 ? (
                  <button
                    type="button"
                    className="primary"
                    onClick={() =>
                      setCurrentQuizQuestion((current) =>
                        Math.min(quizQuestions.length - 1, current + 1),
                      )
                    }
                    disabled={selectedQuizAnswer === null}
                  >
                    Next question
                  </button>
                ) : (
                  <button
                    type="button"
                    className="primary"
                    onClick={restartQuiz}
                    disabled={selectedQuizAnswer === null}
                  >
                    Restart quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
