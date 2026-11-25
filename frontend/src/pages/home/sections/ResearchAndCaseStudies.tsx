import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FEATURED_CASE_STUDIES, RESEARCH_PILLARS } from "../data/moduleTeams";

export default function ResearchAndCaseStudies() {
  return (
    <section
      id="research"
      aria-labelledby="research-heading"
      className="w-full bg-white py-20 text-[#202B20] md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#187347]">
              03 / Student-Led Research &amp; Global Case Studies
            </p>
            <h2
              id="research-heading"
              className="mt-2 text-3xl font-semibold tracking-tight text-[#202B20] sm:text-4xl"
              style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
            >
              Grounded in Scholarship, Proven in Real Projects
            </h2>
          </div>

          <Link
            to="/case-studies"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            Browse All Case Studies
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Split: 3 Green-Outlined Foundation Cards Left + 2 Photo Case Studies Right */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            {RESEARCH_PILLARS.map((pillar) => (
              <Link
                key={pillar.code}
                to={pillar.href}
                className="group flex flex-1 flex-col justify-between rounded-xl border-[1.5px] border-[#B2C9A8] bg-[#FAFDF8] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3F673C] hover:bg-[#F2F6EF]"
              >
                <div>
                  <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                    {pillar.code}
                  </span>
                  <h3
                    className="mt-2 flex items-center justify-between text-xl font-semibold text-[#202B20] group-hover:text-[#187347]"
                    style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
                  >
                    <span>{pillar.title}</span>
                    <ArrowRight
                      className="h-4 w-4 text-[#596556] transition-transform group-hover:translate-x-1 group-hover:text-[#187347]"
                      aria-hidden="true"
                    />
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#596556]">
                    {pillar.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

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
                  className="group relative flex h-full min-h-[380px] flex-col justify-end overflow-hidden rounded-2xl border-[1.5px] border-[#94B985] bg-[#202B20] p-6 focus:outline-none focus:ring-2 focus:ring-[#3F673C]"
                >
                  <img
                    src={cs.image}
                    alt={cs.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#192419]/95 via-[#192419]/50 to-[#192419]/15"
                    aria-hidden="true"
                  />
                  <div className="relative z-10 flex flex-col gap-2.5">
                    <span className="w-fit rounded-full bg-[#E9E6B2] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#202B20]">
                      {cs.tag}
                    </span>
                    <h3
                      className="text-xl font-semibold leading-snug text-white"
                      style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
                    >
                      {cs.title}
                    </h3>
                    <p className="inline-flex items-center gap-1.5 text-xs text-[#E8F0E5]">
                      <span>{cs.summary}</span>
                      <ArrowRight
                        className="h-3.5 w-3.5 text-[#E9E6B2] transition-transform group-hover:translate-x-1"
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

