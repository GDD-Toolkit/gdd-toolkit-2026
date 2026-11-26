import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../development-ethics/humanCentredInnovation.css";

const values = [
  {
    title: "Well-Being",
    description:
      "Prioritize physical, mental, and social well-being. Programs should measurably improve quality of life, reduce preventable harm, and expand access to essential services such as healthcare, nutrition, and safe environments.",
    icon: "wellbeing",
  },
  {
    title: "Equality",
    description:
      "Design and evaluate interventions to close gaps in outcomes and opportunity. Address structural barriers that disproportionately affect marginalized groups and track distributional effects, not only averages.",
    icon: "equality",
  },
  {
    title: "Empowerment",
    description:
      "Increase people’s ability to define priorities and influence decisions that affect their lives. Support local leadership, transparent information, and participatory processes rather than external control.",
    icon: "empowerment",
  },
  {
    title: "Human Rights",
    description:
      "Ensure all efforts respect and strengthen internationally recognized rights and dignities. Build safeguards against coercion, discrimination, and abuse, with clear accountability when harms occur.",
    icon: "rights",
  },
  {
    title: "Cultural Freedom",
    description:
      "Protect the ability of communities to sustain, adapt, and express their cultures. Development should never erase identity; it should resource local knowledge, languages, and practices.",
    icon: "culture",
  },
  {
    title: "Responsibility",
    description:
      "Act with integrity, transparency, and stewardship of resources. Establish clear governance, auditability, and feedback loops. Publish decisions and results. Admit and correct mistakes.",
    icon: "responsibility",
  },
  {
    title: "Sustainability",
    description:
      "Deliver benefits that last without degrading environmental or social systems. Plan for maintenance, financing, and local capacity. Reduce emissions and waste. Steward land, water, and biodiversity.",
    icon: "sustainability",
  },
] as const;

function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H6m5-6-6 6 6 6" />
    </svg>
  );
}

function CarouselArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {direction === "left" ? (
        <path d="M19 12H5m6-6-6 6 6 6" />
      ) : (
        <path d="M5 12h14m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}

function ValueIcon({ name }: { name: (typeof values)[number]["icon"] }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.7,
  };

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...common}>
      {name === "wellbeing" && (
        <>
          <path d="M24 38S9 30 9 19c0-6 7-9 11-5l4 4 4-4c4-4 11-1 11 5 0 11-15 19-15 19Z" />
          <path d="M15 25h6l3-6 4 11 3-5h4" />
        </>
      )}
      {name === "equality" && (
        <>
          <path d="M24 9v30M14 13h20M18 13l-7 15M30 13l7 15" />
          <path d="M6 28h10c0 4-2 6-5 6s-5-2-5-6ZM32 28h10c0 4-2 6-5 6s-5-2-5-6ZM16 39h16" />
        </>
      )}
      {name === "empowerment" && (
        <path d="m28 6-16 22h12l-4 14 16-23H25l3-13Z" />
      )}
      {name === "rights" && (
        <>
          <path d="M24 6c5 4 10 5 15 6v10c0 10-6 17-15 21-9-4-15-11-15-21V12c5-1 10-2 15-6Z" />
          <path d="m17 24 5 5 10-11" />
        </>
      )}
      {name === "culture" && (
        <>
          <path d="M24 7a17 17 0 1 0 0 34h3c3 0 4-4 1-6l-1-1c-2-2-1-5 2-6h7c3 0 5-2 5-5A17 17 0 0 0 24 7Z" />
          <circle cx="16" cy="19" r="1.5" />
          <circle cx="22" cy="14" r="1.5" />
          <circle cx="30" cy="16" r="1.5" />
          <circle cx="33" cy="23" r="1.5" />
        </>
      )}
      {name === "responsibility" && (
        <>
          <circle cx="24" cy="24" r="17" />
          <path d="m16 24 5 5 11-12" />
        </>
      )}
      {name === "sustainability" && (
        <>
          <path d="M11 34c2-17 12-23 27-24 0 15-6 25-21 25" />
          <path d="M12 39c5-10 12-16 21-22" />
        </>
      )}
    </svg>
  );
}

export default function Worthwhile() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeValue = values[activeIndex];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const move = (direction: number) => {
    setActiveIndex(
      (current) => (current + direction + values.length) % values.length,
    );
  };

  return (
    <div className="hci-scope">
      <div className="wd-page">
        <section className="wd-hero" aria-labelledby="wd-title">
          <Link className="wd-back" to="/development-ethics">
            <BackArrow />
            Human Centred Innovation
          </Link>
          <div className="wd-hero-copy">
            <h1 id="wd-title">
              Worthwhile{" "}
              <br />
              <em>Development</em>
            </h1>
          </div>
          <div className="wd-hero-graphic" aria-hidden="true">
            <span className="wd-ring wd-ring-one" />
            <span className="wd-ring wd-ring-two" />
            <span className="wd-hero-disc">7</span>
            <span className="wd-hero-note">core values</span>
          </div>
        </section>

        <section className="wd-introduction">
          <div className="wd-intro-heading">
            <h2>
              A people-centered approach to development that avoids
              disempowerment, reduces inequality, and strengthens communities,
              guided by seven key values.
            </h2>
          </div>
          <div className="wd-intro-copy">
            <p>
              At the heart of the Development Ethics Toolkit are seven core
              values of worthwhile development, drawn from the Routledge
              Handbook of Development Ethics. These values guide every tool,
              evaluation framework, and recommendation within this platform,
              ensuring that development efforts are not only effective but also
              equitable, human-centred, and ethically grounded.
            </p>
            <p>
              By centralizing these values, the Development Ethics Toolkit helps
              development practitioners, policymakers, and scholars navigate
              towards thoughtful decisions that prioritize human well-being and
              guard against the pitfalls of maldevelopment.
            </p>
            <p>
              When planning or evaluating development work, use these goals as
              checkpoints. Each initiative should contribute measurably to at
              least one goal while avoiding tradeoffs that undermine others.
            </p>
          </div>
        </section>

        <section className="wd-values" aria-labelledby="values-title">
          <div className="wd-section-heading">
            <h2 id="values-title">
              The Seven <em>Values</em>
            </h2>
          </div>

          <div
            className="wd-carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label="Seven values of worthwhile development"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                move(-1);
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                move(1);
              }
            }}
          >
            <button
              className="wd-carousel-button wd-previous"
              type="button"
              onClick={() => move(-1)}
              aria-label="Show previous value"
            >
              <CarouselArrow direction="left" />
            </button>

            <article
              className="wd-value-card"
              key={activeValue.title}
              aria-live="polite"
            >
              <span className="wd-card-number">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <div className="wd-icon">
                <ValueIcon name={activeValue.icon} />
              </div>
              <div className="wd-value-copy">
                <p>
                  {activeIndex + 1} of {values.length}
                </p>
                <h3>{activeValue.title}</h3>
                <p>{activeValue.description}</p>
              </div>
            </article>

            <button
              className="wd-carousel-button wd-next"
              type="button"
              onClick={() => move(1)}
              aria-label="Show next value"
            >
              <CarouselArrow direction="right" />
            </button>
          </div>

          <div className="wd-pagination" aria-label="Choose a value">
            {values.map((value, index) => (
              <button
                type="button"
                key={value.title}
                className={index === activeIndex ? "active" : ""}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${value.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
