import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FEATURED_CASE_STUDIES, RESEARCH_PILLARS } from "../data/moduleTeams";

export default function ResearchAndCaseStudies() {
  return (
    <section
      id="research"
      aria-labelledby="research-heading"
      className="w-full bg-[#09090B] py-20 text-white md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-[#A07CFF]">
              03 // Student-Led Research &amp; Global Case Studies
            </p>
            <h2
              id="research-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Learn From Real Projects &amp; Ethical Scholarship
            </h2>
          </div>

          <Link
            to="/case-studies"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#A07CFF] to-[#6D83F2] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            Browse All Case Studies
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Split Layout: 3 Research Foundations Left + 2 Photo Case Studies Right */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: 3 Ethical Foundations */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            {RESEARCH_PILLARS.map((pillar) => (
              <Link
                key={pillar.code}
                to={pillar.href}
                className="group flex flex-1 flex-col justify-between rounded-2xl border border-white/10 bg-[#12141E] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A07CFF]/45"
              >
                <div>
                  <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#A07CFF]">
                    {pillar.code}
                  </span>
                  <h3 className="mt-2 flex items-center justify-between text-lg font-semibold text-white group-hover:text-[#C4B5FD]">
                    <span>{pillar.title}</span>
                    <ArrowRight
                      className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-[#A07CFF]"
                      aria-hidden="true"
                    />
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    {pillar.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Right: 2 Full-Bleed Case Study Photo Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
            {FEATURED_CASE_STUDIES.map((cs) => (
              <motion.div
                key={cs.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Link
                  to={cs.href}
                  aria-label={cs.title}
                  className="group relative flex min-h-[380px] h-full flex-col justify-end overflow-hidden rounded-2xl border border-white/15 bg-[#12141E] p-6 focus:outline-none focus:ring-2 focus:ring-[#A07CFF]"
                >
                  <img
                    src={cs.image}
                    alt={cs.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#09090B]/95 via-[#09090B]/55 to-[#09090B]/15"
                    aria-hidden="true"
                  />
                  <div className="relative z-10 flex flex-col gap-2.5">
                    <span className="w-fit rounded-full border border-[#6D83F2]/50 bg-[#181A24]/90 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#C4B5FD] backdrop-blur-sm">
                      {cs.tag}
                    </span>
                    <h3 className="text-xl font-bold leading-snug text-white">
                      {cs.title}
                    </h3>
                    <p className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                      <span>{cs.summary}</span>
                      <ArrowRight
                        className="h-3.5 w-3.5 text-[#A07CFF] transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
