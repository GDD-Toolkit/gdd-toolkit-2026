import { useEffect } from "react";
import { Link } from "react-router-dom";
import { DIGITAL_PRINCIPLES } from "./principlesData";
import "../../development-ethics/humanCentredInnovation.css";

function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H6m5-6-6 6 6 6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export default function EthicsOfInnovation() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="hci-scope">
      <div className="eoi-page">
        <section className="eoi-hero" aria-labelledby="eoi-title">
          <Link className="wd-back" to="/development-ethics">
            <BackArrow />
            Human Centred Innovation
          </Link>

          <div className="eoi-hero-copy">
            <h1 id="eoi-title">
              Ethics of{" "}
              <br />
              <em>Innovation</em>
            </h1>
          </div>

          <div className="eoi-hero-graphic" aria-hidden="true">
            <span className="wd-ring wd-ring-one" />
            <span className="wd-ring wd-ring-two" />
            <span className="eoi-hero-disc">9</span>
            <span className="eoi-hero-note">digital principles</span>
          </div>
        </section>

        <section
          className="eoi-simulation"
          aria-labelledby="eoi-simulation-title"
        >
          <div className="eoi-section-title">
            <span>Interactive scenario</span>
            <h2 id="eoi-simulation-title">
              Ethics of Innovation <em>Simulation</em>
            </h2>
          </div>

          <div className="eoi-simulation-copy">
            <p>
              By utilizing the 9 Principles of Digital Design and incorporating
              ethics of innovation, you can effectively lead a project as a
              program manager in this simulation. In this role, you’ll have to
              decide how best to design your project while keeping ethics of
              innovation in mind. Try it out for yourself.
            </p>
            <a
              className="eoi-sim-cta"
              href="https://umdsurvey.umd.edu/jfe/form/SV_6tAE6MSIm6aExU2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Launch Simulation</span>
              <ExternalArrowIcon />
            </a>
          </div>
        </section>

        <section
          className="eoi-principles"
          aria-labelledby="eoi-principles-title"
        >
          <div className="eoi-principles-heading">
            <span>Digital design framework</span>
            <h2 id="eoi-principles-title">
              9 Principles of <em>Digital Design</em>
            </h2>
            <p>
              Explore each of the nine digital design principles to learn how to
              incorporate them into your project. Every principle includes an
              interactive checklist to verify that ethical innovation criteria
              were met.
            </p>
          </div>

          <div className="eoi-grid">
            {DIGITAL_PRINCIPLES.map((item) => (
              <Link
                key={item.slug}
                to={item.path}
                className="eoi-card"
                aria-label={`Explore ${item.title}`}
              >
                <div className="eoi-card-media">
                  <img src={item.img} alt={item.imgAlt} />
                  <span className="eoi-card-number">{item.number}</span>
                </div>
                <div className="eoi-card-body">
                  <h3>{item.title}</h3>
                  <p>{item.cardSummary}</p>
                  <div className="eoi-card-footer">
                    <span>Explore principle</span>
                    <span className="arrow-circle">
                      <ArrowIcon />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
