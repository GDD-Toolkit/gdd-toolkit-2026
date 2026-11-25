import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DIGITAL_PRINCIPLES,
  getPrincipleBySlug,
  type DigitalPrincipleDetail,
} from "./principlesData";
import "../../development-ethics/humanCentredInnovation.css";

function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H6m5-6-6 6 6 6" />
    </svg>
  );
}

function ForwardArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function ExternalArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}

export default function PrincipleDetailPage({
  slug,
}: {
  slug: DigitalPrincipleDetail["slug"];
}) {
  const principle = getPrincipleBySlug(slug);
  const currentIndex = DIGITAL_PRINCIPLES.findIndex(
    (item) => item.slug === slug,
  );
  const previousPrinciple =
    currentIndex > 0 ? DIGITAL_PRINCIPLES[currentIndex - 1] : null;
  const nextPrinciple =
    currentIndex < DIGITAL_PRINCIPLES.length - 1
      ? DIGITAL_PRINCIPLES[currentIndex + 1]
      : null;

  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCheckedItems([]);
  }, [slug]);

  const toggleItem = (index: number) => {
    setCheckedItems((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  };

  return (
    <div className="hci-scope">
      <div className="eoi-detail-page">
        <section className="eoi-hero" aria-labelledby="eoi-detail-title">
          <Link className="wd-back" to="/ethics-of-innovation">
            <BackArrow />
            Ethics of Innovation
          </Link>

          <div className="eoi-hero-copy">
            <p className="eoi-detail-eyebrow">
              Principle {principle.number} of{" "}
              {String(DIGITAL_PRINCIPLES.length).padStart(2, "0")}
            </p>
            <h1 id="eoi-detail-title">
              {principle.heroPrimary}{" "}
              <br />
              <em>{principle.heroEmphasis}</em>
            </h1>
          </div>

          <div className="eoi-hero-graphic" aria-hidden="true">
            <span className="wd-ring wd-ring-one" />
            <span className="wd-ring wd-ring-two" />
            <span className="eoi-hero-disc">{principle.number}</span>
            <span className="eoi-hero-note">of 09</span>
          </div>
        </section>

        <section
          className="eoi-detail-summary"
          aria-labelledby="eoi-summary-title"
        >
          <div className="eoi-detail-media">
            <img src={principle.img} alt={principle.imgAlt} />
          </div>

          <div className="eoi-detail-summary-copy">
            <span>Principle overview</span>
            <h2 id="eoi-summary-title">
              <em>Summary</em>
            </h2>
            <p>{principle.summary}</p>
          </div>
        </section>

        <section
          className="eoi-detail-checklist"
          aria-labelledby="eoi-checklist-title"
        >
          <div className="eoi-detail-checklist-inner">
            <div className="eoi-detail-checklist-header">
              <div>
                <span>Project review checkpoint</span>
                <h2 id="eoi-checklist-title">
                  Checklist <em>Questions</em>
                </h2>
              </div>

              <div className="eoi-checklist-status">
                <span aria-live="polite">
                  {checkedItems.length} / {principle.checklist.length} checked
                </span>
                {checkedItems.length > 0 && (
                  <button
                    type="button"
                    className="eoi-checklist-reset"
                    onClick={() => setCheckedItems([])}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <ul className="eoi-checklist-list">
              {principle.checklist.map((item, index) => {
                const isChecked = checkedItems.includes(index);
                return (
                  <li key={item.question}>
                    <button
                      type="button"
                      className={`eoi-checklist-item${isChecked ? " is-checked" : ""}`}
                      onClick={() => toggleItem(index)}
                      aria-pressed={isChecked}
                    >
                      <span className="eoi-check-box" aria-hidden="true">
                        {isChecked && <CheckIcon />}
                      </span>
                      <span className="eoi-check-text">
                        {item.label && <strong>{item.label}: </strong>}
                        {item.question}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section
          className="eoi-detail-resources"
          aria-labelledby="eoi-resources-title"
        >
          <div className="eoi-detail-resources-inner">
            <div className="eoi-section-title">
              <span>Further reading</span>
              <h2 id="eoi-resources-title">
                Additional <em>Resources</em>
              </h2>
            </div>

            <ul className="eoi-resource-list">
              {principle.resources.map((resource) => (
                <li key={resource.href} className="eoi-resource-item">
                  {resource.citationPrefix && (
                    <p className="eoi-resource-citation">
                      {resource.citationPrefix}
                    </p>
                  )}
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="eoi-resource-link"
                  >
                    <span>{resource.title}</span>
                    <span className="arrow-circle">
                      <ExternalArrow />
                    </span>
                  </a>
                  {resource.description && (
                    <p className="eoi-resource-description">
                      {resource.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {principle.caseStudies && principle.caseStudies.length > 0 && (
          <section
            className="eoi-detail-cases"
            aria-labelledby="eoi-cases-title"
          >
            <div className="eoi-detail-cases-inner">
              <div className="eoi-principles-heading">
                <span>In practice</span>
                <h2 id="eoi-cases-title">
                  Case Studies &amp; <em>Guides</em>
                </h2>
              </div>

              <div className="eoi-case-stack">
                {principle.caseStudies.map((study) => (
                  <article key={study.heading} className="eoi-case-card">
                    <div className="eoi-case-copy">
                      {study.eyebrow && (
                        <span className="eoi-case-eyebrow">
                          {study.eyebrow}
                        </span>
                      )}
                      <h3>{study.heading}</h3>
                      {study.linkHref && study.linkLabel && (
                        <p className="eoi-case-source">
                          {study.citationPrefix}
                          <a
                            href={study.linkHref}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {study.linkLabel}
                          </a>
                          {study.citationSuffix}
                        </p>
                      )}
                      <p className="eoi-case-description">
                        {study.description}
                      </p>
                    </div>

                    {study.embedUrl && (
                      <div className="eoi-case-video">
                        <iframe
                          src={study.embedUrl}
                          title={study.embedTitle ?? study.heading}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <nav
          className="eoi-detail-pager"
          aria-label="Principle pagination"
        >
          <div className="eoi-detail-pager-inner">
            {previousPrinciple ? (
              <Link
                to={previousPrinciple.path}
                className="eoi-pager-link eoi-pager-prev"
              >
                <span className="arrow-circle">
                  <BackArrow />
                </span>
                <span>
                  <small>Previous · {previousPrinciple.number}</small>
                  <strong>{previousPrinciple.title}</strong>
                </span>
              </Link>
            ) : (
              <Link
                to="/ethics-of-innovation"
                className="eoi-pager-link eoi-pager-prev"
              >
                <span className="arrow-circle">
                  <BackArrow />
                </span>
                <span>
                  <small>Overview</small>
                  <strong>All 9 Principles</strong>
                </span>
              </Link>
            )}

            {nextPrinciple ? (
              <Link
                to={nextPrinciple.path}
                className="eoi-pager-link eoi-pager-next"
              >
                <span>
                  <small>Next · {nextPrinciple.number}</small>
                  <strong>{nextPrinciple.title}</strong>
                </span>
                <span className="arrow-circle">
                  <ForwardArrow />
                </span>
              </Link>
            ) : (
              <Link
                to="/ethics-of-innovation"
                className="eoi-pager-link eoi-pager-next"
              >
                <span>
                  <small>Back to overview</small>
                  <strong>All 9 Principles</strong>
                </span>
                <span className="arrow-circle">
                  <ForwardArrow />
                </span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
