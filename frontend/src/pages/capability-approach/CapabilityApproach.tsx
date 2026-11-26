import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import amartyaSen from "@/assets/images/human-centred-innovation/amartya-sen.png";
import marthaNussbaum from "@/assets/images/human-centred-innovation/martha-nussbaum.png";
import "../development-ethics/humanCentredInnovation.css";

const pioneers = [
  {
    name: "Amartya Sen",
    image: amartyaSen,
    alt: "Portrait of Amartya Sen",
    details: [
      "His research focused on societal inequalities.",
      "He views poverty and underdeveloped communities as a consequence of capability deprivations.",
      "He believed development was too complex for a single path to improve everyone’s lives.",
    ],
  },
  {
    name: "Martha Nussbaum",
    image: marthaNussbaum,
    alt: "Portrait of Martha Nussbaum",
    details: [
      "Helped form the two major schools of thought in the human development and capabilities field.",
      "Her philosophy is rooted in ten explicitly stated central capabilities needed for development.",
      "She believed that satisfying these central capabilities, which are physical, social, and emotional, can be a way to achieve justice.",
    ],
  },
];

const timelineEvents = [
  {
    year: "1948",
    title: "International Manuscript",
    description:
      "The UN publishes the Universal Declaration of Human Rights — a global standard for equality and dignity. This document was called the “Universal Declaration of Human Rights” and merely outlined standards for human rights from an international perspective.",
  },
  {
    year: "1997",
    title: "Reform",
    description:
      "The UN redefines its development model, shifting from basic needs to a Human Rights–Based Approach (HRBA). This effectively switched the focus of global development from the beneficiaries to the general human population.",
  },
  {
    year: "2003",
    title: "Adopted Globally",
    description:
      "The UN Common Understanding on a Human-Rights-Based Approach (HRBA) to Development Cooperation was adopted. In this document, the UN sets forth elements such as recognition of human rights that ensure proper consideration of human rights when developing a nation.",
  },
  {
    year: "2004",
    title: "HDCA",
    description:
      "The Human Development and Capability Association (HDCA) was established by Nobel laureate Amartya Sen. It was formally launched at a conference in Pavia, Italy, to promote research and discussion on human development and the capability approach.",
  },
];

function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H6m5-6-6 6 6 6" />
    </svg>
  );
}

export default function CapabilityApproach() {
  const [flippedPioneers, setFlippedPioneers] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const togglePioneer = (name: string) => {
    setFlippedPioneers((current) =>
      current.includes(name)
        ? current.filter((pioneerName) => pioneerName !== name)
        : [...current, name],
    );
  };

  return (
    <div className="hci-scope">
      <div className="ca-page">
        <section className="ca-hero" aria-labelledby="ca-title">
          <Link className="wd-back" to="/development-ethics">
            <BackArrow />
            Human Centred Innovation
          </Link>

          <div className="ca-hero-copy">
            <h1 id="ca-title">
              The Capability{" "}
              <br />
              <em>Approach</em>
            </h1>
          </div>

          <p className="ca-hero-intro">
            The Capability Approach to human development was developed in the
            1980’s as a way to look at development beyond economic measures.
          </p>

          <div className="ca-hero-graphic" aria-hidden="true">
            <span className="ca-orbit ca-orbit-one" />
            <span className="ca-orbit ca-orbit-two" />
          </div>
        </section>

        <section className="ca-explained" aria-labelledby="ca-explained-title">
          <div className="ca-section-heading">
            <span>Training &amp; Knowledge Module Team</span>
            <h2 id="ca-explained-title">
              Capability Approach <em>Explained</em>
            </h2>
            <p>
              The following video helps explain the definition of Capability
              Approach along with examples.
            </p>
          </div>

          <div className="ca-video-frame">
            <video controls preload="metadata">
              <source
                src="/assets/Cabability-approach-video.mp4"
                type="video/mp4"
              />
              Your browser does not support the video element.
            </video>
          </div>
        </section>

        <section className="ca-pioneers" aria-labelledby="ca-pioneers-title">
          <div className="ca-pioneers-heading">
            <h2 id="ca-pioneers-title">
              Pioneers of the <em>Capability Approach</em>
            </h2>
            <p>Click a card to learn more about each pioneer.</p>
          </div>

          <div className="ca-pioneer-grid">
            {pioneers.map((pioneer, index) => {
              const isFlipped = flippedPioneers.includes(pioneer.name);

              return (
                <button
                  className={`ca-pioneer-card ca-pioneer-card-${index + 1}${isFlipped ? " is-flipped" : ""}`}
                  type="button"
                  key={pioneer.name}
                  aria-label={`${isFlipped ? "Hide details about" : "Learn more about"} ${pioneer.name}`}
                  aria-pressed={isFlipped}
                  onClick={() => togglePioneer(pioneer.name)}
                >
                  <span className="ca-pioneer-card-inner">
                    <span className="ca-pioneer-face ca-pioneer-front">
                      <strong>{pioneer.name}</strong>
                      <img src={pioneer.image} alt={pioneer.alt} />
                      <span className="ca-pioneer-cue">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20 7v5h-5M4 17v-5h5" />
                          <path d="M18.5 12A7 7 0 0 0 6 8M5.5 12A7 7 0 0 0 18 16" />
                        </svg>
                        Click to learn more
                      </span>
                    </span>

                    <span className="ca-pioneer-face ca-pioneer-back">
                      <span>Capability Approach pioneer</span>
                      <strong>{pioneer.name}</strong>
                      <ul>
                        {pioneer.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                      <span className="ca-pioneer-cue">
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

        <section
          className="ca-human-rights"
          aria-labelledby="ca-human-rights-title"
        >
          <div className="ca-human-rights-copy">
            <h2 id="ca-human-rights-title">
              Human Rights <em>Approach</em>
            </h2>
            <p>
              This approach to global development, a subset to the Capability
              Approach, aims to ensure that human rights are considered and
              respected when a country undergoes development. Below is a small
              timeline illustrating how this approach came to be.
            </p>
          </div>

          <div className="ca-human-rights-media">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85"
              alt="Diverse group of people standing together in solidarity"
            />
          </div>

          <ol
            className="ca-timeline"
            aria-label="Human Rights Approach timeline"
          >
            {timelineEvents.map((event) => (
              <li key={event.year}>
                <article>
                  <time>{event.year}</time>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </article>
                <span aria-hidden="true" />
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
