import { SlideInLeft, SlideInRight } from "@/components/animations/Reveal";
import { motion } from "framer-motion";

export default function CaseStudies() {
  return (
    <section aria-labelledby="case-title" className="py-20 md:py-28 bg-black border-t border-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <div className="max-w-2xl">
          <h2 id="case-title" className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Learn From Real Projects
          </h2>
          <p className="mt-3 text-gray-300">
            Brief, practical case studies showing what worked, what didn’t, and how ethics shaped outcomes.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-12 gap-6 md:gap-8">
          {/* Left feature */}
          <SlideInLeft className="col-span-12 md:col-span-7">
            <a href="/case-studies?id=452a4ce6-286e-4903-87ea-63477f0841cd" aria-label="Smart Nation Singapore case" className="group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-emerald-600/60">
              <img src="/singapore.jpg" alt="Smart Nation Singapore skyline" width={1400} height={900} className="h-64 md:h-80 w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <div className="text-xs uppercase tracking-wide text-white/80">Singapore • Smart Nation</div>
                <div className="mt-1 text-white font-semibold text-xl md:text-2xl">Harnessing ICTs for Efficient and Innovative Development in Smart Nation Singapore</div>
              </div>
            </a>
          </SlideInLeft>

          {/* CTA under left feature */}
          <div className="col-span-12 md:col-span-7">
            <motion.a
              href="/case-studies"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-white font-medium shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/60"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Browse All Case Studies <span aria-hidden="true">→</span>
            </motion.a>
          </div>

          {/* Right column */}
          <div className="col-span-12 md:col-span-5 space-y-6 md:-mt-12">
            <SlideInRight delay={0.06}>
              <a href="/case-studies?id=eec11844-bf7c-4dec-9c9c-f28666a9076c" aria-label="Health Professional Education and Training case" className="group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-md transition-shadow block focus:outline-none focus:ring-2 focus:ring-emerald-600/60">
                <img src="/healthtraining-1.png" alt="Health Professional Education and Training" width={1200} height={800} className="h-64 w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <div className="text-xs uppercase tracking-wide text-white/70">Education • South Asia</div>
                  <div className="mt-1 text-white font-semibold text-lg md:text-xl">Health Professional Education and Training</div>
                </div>
              </a>
            </SlideInRight>
          </div>
        </div>

        {/* CTA moved under left feature */}
      </div>
    </section>
  );
}


