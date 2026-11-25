import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Compass, HeartHandshake, Scale, Sparkles } from "lucide-react";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import "./humanCentredInnovation.css";

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

interface TopicArticle {
  number: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  to: string;
  Icon: typeof HeartHandshake;
}

const articles: TopicArticle[] = [
  {
    number: "01",
    tag: "7 Core Values",
    title: "Worthwhile Development",
    description:
      "A people-centred approach that seeks to avoid disempowerment, reduce inequality, and strengthen communities. Its seven core values help keep development equitable, ethically grounded, and focused on human well-being.",
    image:
      "https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?auto=format&fit=crop&w=1600&q=85",
    alt: "A community group gathered around a table in conversation",
    to: "/worthwhile-development",
    Icon: HeartHandshake,
  },
  {
    number: "02",
    tag: "Human Freedom",
    title: "The Capability Approach",
    description:
      "Developed in the 1980s, the capability approach offers a way to understand human development beyond economic measures. The work of Amartya Sen and Martha Nussbaum provides the foundation for this approach.",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1600&q=85",
    alt: "People exchanging ideas in a bright meeting room",
    to: "/capability-approach",
    Icon: Scale,
  },
  {
    number: "03",
    tag: "9 Digital Principles",
    title: "Ethics of Innovation",
    description:
      "Explore how the nine Principles of Digital Design can bring ethics into the way a project is planned and delivered. They cover designing with users, understanding existing ecosystems, sustainability, privacy, open standards, and collaboration.",
    image:
      "https://images.unsplash.com/photo-1623652554515-91c833e3080e?auto=format&fit=crop&w=1600&q=85",
    alt: "Hands arranging notes during a collaborative design workshop",
    to: "/ethics-of-innovation",
    Icon: Compass,
  },
  {
    number: "04",
    tag: "5-Step D.School Model",
    title: "Human Centred Design",
    description:
      "Human-centred design begins by getting close to users and observing their activities. By prioritizing empathy, feedback, and collaboration, it helps designers consider functionality, usability, and the effects of their choices on all kinds of end users.",
    image:
      "https://images.unsplash.com/photo-1578401056371-96e0b72cffd5?auto=format&fit=crop&w=1600&q=85",
    alt: "A designer sketching ideas and simple house shapes on paper",
    to: "/human-centered-design",
    Icon: Sparkles,
  },
];

export default function DevelopmentEthics() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  const scrollToTopics = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById("explore");
    if (target) {
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <div className="hci-scope">

      {/* Forest Green Editorial Hero */}
      <section
        id="top"
        aria-labelledby="page-title"
        className="relative w-full overflow-hidden bg-[#3F673C] text-white"
      >
        <div
          aria-hidden="true"
          className="editorial-grid-texture pointer-events-none absolute inset-0 opacity-60"
        />
        <motion.div
          aria-hidden="true"
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EDITORIAL_EASE }}
          className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full border border-[#9AB887]/25 bg-[#2E502B]/35 blur-2xl"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
          {/* Left Copy Column */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EDITORIAL_EASE }}
            className="flex flex-col items-start gap-6 lg:col-span-6"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-full border border-[#9AB887] bg-[#2E502B] px-3.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#E9E6B2]">
                Development Ethics Hub
              </span>
              <span className="inline-flex items-center rounded-full border border-[#9AB887]/60 bg-[#355832] px-3.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#EDF4E8]">
                4 Foundational Pillars
              </span>
            </div>

            <h1
              id="page-title"
              className="text-4xl font-semibold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]"
              style={EDITORIAL_SERIF_STYLE}
            >
              Human Centred{" "}
              <br />
              <em className="font-normal italic text-[#E9E6B2]">Innovation</em>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-[#E8F0E5] sm:text-lg">
              A starting point for ideas that expand human freedom, honour lived
              experience, and create change worth making.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="#explore"
                onClick={scrollToTopics}
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#E9E6B2] px-6 py-3.5 text-sm font-semibold text-[#202B20] shadow-sm transition-all duration-200 hover:bg-[#f2efbf] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C]"
              >
                <span>Explore the four topics</span>
                <ArrowDown
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>

            <div className="w-full border-t border-[#9AB887]/40 pt-4">
              <p className="text-xs font-medium leading-relaxed text-[#E9E6B2]/95">
                Worthwhile Development &middot; The Capability Approach &middot;
                Ethics of Innovation &middot; Human Centred Design
              </p>
            </div>
          </motion.div>

          {/* Right Orbiting Visual Orb & Floating Words */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.96 }}
            animate={reduced ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EDITORIAL_EASE }}
            className="relative mx-auto flex h-[20rem] w-full max-w-[26rem] items-center justify-center sm:h-[24rem] lg:col-span-6 lg:max-w-none"
            aria-hidden="true"
          >
            {/* Outer rotating ring */}
            <motion.div
              animate={reduced ? undefined : { rotate: 360 }}
              transition={{ duration: 64, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute h-[18rem] w-[18rem] rounded-full border border-dashed border-[#E9E6B2]/35 sm:h-[22rem] sm:w-[22rem]"
            />
            {/* Secondary counter-rotating ring */}
            <motion.div
              animate={reduced ? undefined : { rotate: -360 }}
              transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute h-[15rem] w-[15rem] rounded-full border border-[#9AB887]/45 sm:h-[18.5rem] sm:w-[18.5rem]"
            />

            {/* Central Circular Framed Photo Orb */}
            <motion.div
              animate={reduced ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-52 w-52 overflow-hidden rounded-full border-2 border-[#E9E6B2] bg-[#202B20] shadow-2xl sm:h-64 sm:w-64"
            >
              <img
                src="https://images.unsplash.com/photo-1560831340-b9679dc9e9f0?auto=format&fit=crop&w=1600&q=85"
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#284B26]/55 via-transparent to-[#E9E6B2]/15" />
            </motion.div>

            {/* Floating Editorial Word Medallions */}
            <motion.span
              animate={reduced ? undefined : { y: [0, -7, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-3 top-4 inline-flex items-center rounded-full border border-[#E9E6B2] bg-[#E9E6B2] px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#202B20] shadow-md sm:left-8 sm:top-6"
            >
              people
            </motion.span>
            <motion.span
              animate={reduced ? undefined : { y: [0, 7, 0] }}
              transition={{
                duration: 5.4,
                delay: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-5 left-6 inline-flex items-center rounded-full border border-[#9AB887] bg-[#2E502B] px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#E9E6B2] shadow-md sm:bottom-6 sm:left-12"
            >
              purpose
            </motion.span>
            <motion.span
              animate={reduced ? undefined : { y: [0, -6, 0] }}
              transition={{
                duration: 5.1,
                delay: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center rounded-full border border-[#94B985] bg-white px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#202B20] shadow-md sm:right-6"
            >
              possibility
            </motion.span>
          </motion.div>
        </div>
      </section>

      {/* Four Editorial Topic Cards */}
      <EditorialSection
        id="explore"
        tone="white"
        ariaLabel="Development Ethics topics"
        className="scroll-mt-20"
      >
        <EditorialSectionHeader
          eyebrow="01 / Core Curriculum"
          title={
            <>
              Four Pillars of{" "}
              <em className="font-normal italic text-[#187347]">
                Ethical Practice
              </em>
            </>
          }
          description="Move from values and human capabilities to digital design principles and participatory field methods."
        />

        <div className="mt-10 grid grid-cols-1 gap-7 lg:grid-cols-2">
          {articles.map((article, index) => {
            const Icon = article.Icon;
            return (
              <EditorialReveal key={article.title} delay={index * 0.06}>
                <motion.article
                  whileHover={reduced ? undefined : { y: -4 }}
                  transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white transition-colors duration-200 hover:border-[#3F673C] hover:bg-[#FAFDF8]"
                >
                  {/* Top Media Frame */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#202B20]">
                    <img
                      src={article.image}
                      alt={article.alt}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#192419]/65 via-[#192419]/15 to-transparent"
                    />
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-[#E9E6B2] bg-[#2E502B]/95 font-mono text-xs font-semibold tracking-wider text-[#E9E6B2] shadow-sm backdrop-blur-xs">
                        {article.number}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9AB887]/80 bg-[#202B20]/80 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#EDF4E8] backdrop-blur-xs">
                        <Icon className="h-3 w-3 text-[#E9E6B2]" aria-hidden="true" />
                        {article.tag}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h2
                      className="text-2xl font-semibold tracking-tight text-[#202B20] sm:text-[1.7rem]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {article.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#394838] sm:text-[0.95rem]">
                      {article.description}
                    </p>

                    <div className="mt-6 border-t border-[#D5E3D9] pt-4">
                      <Link
                        to={article.to}
                        aria-label={`Read ${article.title}`}
                        className="inline-flex w-full items-center justify-between text-sm font-semibold text-[#3F673C] transition-colors hover:text-[#187347] focus:outline-none focus-visible:underline"
                      >
                        <span>Read more</span>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-[#94B985] bg-[#F2F6EF] text-[#284B26] transition-all duration-200 group-hover:translate-x-1 group-hover:border-[#3F673C] group-hover:bg-[#3F673C] group-hover:text-[#E9E6B2]">
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              </EditorialReveal>
            );
          })}
        </div>
      </EditorialSection>

      {/* Soft Sage Editorial Bridge Band */}
      <EditorialSection tone="sage" compact ariaLabel="From theory to toolkit">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border-[1.5px] border-[#94B985] bg-white p-6 sm:p-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#187347]">
              From Theory to Practice
            </p>
            <h2
              className="mt-2 text-xl font-semibold text-[#202B20] sm:text-2xl"
              style={EDITORIAL_SERIF_STYLE}
            >
              Apply these frameworks across every stage of your project
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#596556]">
              Each foundational topic connects directly to the toolkit’s
              planning rubrics, AI ethics comparisons, and project evaluation
              guides.
            </p>
          </div>
          <Link
            to="/project-evaluation"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110"
          >
            <span>Evaluate a Project</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </EditorialSection>
    </div>
  );
}
