import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./humanCentredInnovation.css";

interface TopicArticle {
  number: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  theme: "secondary" | "tertiary" | "neutral" | "primary";
  to: string;
}

const articles: TopicArticle[] = [
  {
    number: "01",
    title: "Worthwhile Development",
    description:
      "A people-centred approach that seeks to avoid disempowerment, reduce inequality, and strengthen communities. Its seven core values help keep development equitable, ethically grounded, and focused on human well-being.",
    image:
      "https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?auto=format&fit=crop&w=1600&q=85",
    alt: "A community group gathered around a table in conversation",
    theme: "secondary",
    to: "/worthwhile-development",
  },
  {
    number: "02",
    title: "The Capability Approach",
    description:
      "Developed in the 1980s, the capability approach offers a way to understand human development beyond economic measures. The work of Amartya Sen and Martha Nussbaum provides the foundation for this approach.",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1600&q=85",
    alt: "People exchanging ideas in a bright meeting room",
    theme: "tertiary",
    to: "/capability-approach",
  },
  {
    number: "03",
    title: "Ethics of Innovation",
    description:
      "Explore how the nine Principles of Digital Design can bring ethics into the way a project is planned and delivered. They cover designing with users, understanding existing ecosystems, sustainability, privacy, open standards, and collaboration.",
    image:
      "https://images.unsplash.com/photo-1623652554515-91c833e3080e?auto=format&fit=crop&w=1600&q=85",
    alt: "Hands arranging notes during a collaborative design workshop",
    theme: "neutral",
    to: "/ethics-of-innovation",
  },
  {
    number: "04",
    title: "Human Centred Design",
    description:
      "Human-centred design begins by getting close to users and observing their activities. By prioritizing empathy, feedback, and collaboration, it helps designers consider functionality, usability, and the effects of their choices on all kinds of end users.",
    image:
      "https://images.unsplash.com/photo-1578401056371-96e0b72cffd5?auto=format&fit=crop&w=1600&q=85",
    alt: "A designer sketching ideas and simple house shapes on paper",
    theme: "primary",
    to: "/human-centered-design",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

export default function DevelopmentEthics() {
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  const scrollToTopics = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById("explore");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="hci-scope">
      <div className="site-shell">
        <div id="top">
          <section className="hero" aria-labelledby="page-title">
            <div className="hero-copy">
              <h1 id="page-title">
                Human centred{" "}
                <br />
                <em>innovation</em>
              </h1>
              <p className="hero-intro">
                A starting point for ideas that expand human freedom, honour
                lived experience, and create change worth making.
              </p>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="hero-photo">
                <img
                  src="https://images.unsplash.com/photo-1560831340-b9679dc9e9f0?auto=format&fit=crop&w=1600&q=85"
                  alt=""
                />
              </div>
              <span className="visual-word word-one">people</span>
              <span className="visual-word word-two">purpose</span>
              <span className="visual-word word-three">possibility</span>
            </div>

            <a
              className="scroll-cue"
              href="#explore"
              onClick={scrollToTopics}
            >
              <span>Explore the four topics</span>
              <span className="scroll-line" />
            </a>
          </section>

          <section
            className="articles"
            id="explore"
            aria-label="Development Ethics topics"
          >
            {articles.map((article) => (
              <article
                className={`article-card ${article.theme}`}
                key={article.title}
              >
                <div className="article-image">
                  <img src={article.image} alt={article.alt} />
                  <span className="article-number">{article.number}</span>
                </div>
                <div className="article-copy">
                  <h2>{article.title}</h2>
                  <p className="article-description">{article.description}</p>
                  <Link to={article.to} aria-label={`Read ${article.title}`}>
                    <span>Read more</span>
                    <span className="arrow-circle">
                      <ArrowIcon />
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
