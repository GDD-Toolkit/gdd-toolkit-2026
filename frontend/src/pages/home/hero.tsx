import { ArrowRight, Play } from "lucide-react";
import gddHeroPoster from "@/assets/images/gdd-hero.jpg";
import { HERO_KPIS } from "./data/moduleTeams";

export default function Hero() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      aria-label="Development Ethics Toolkit introduction"
      className="relative w-full overflow-hidden bg-[#3F673C] text-white"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
        {/* Left Copy Column */}
        <div className="flex flex-col items-start gap-6 lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center rounded-full border border-[#9AB887] bg-[#2E502B] px-3.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#E9E6B2]">
              UMD FIRE · Global Development &amp; Design
            </span>
            <span className="inline-flex items-center rounded-full border border-[#9AB887]/60 bg-[#355832] px-3.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#EDF4E8]">
              Free &amp; Open Access
            </span>
          </div>

          <h1
            className="text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]"
            style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
          >
            Ethical Tools for{" "}
            <em className="font-normal italic text-[#E9E6B2]">Worthwhile</em>{" "}
            Global Development.
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-[#E8F0E5] sm:text-lg">
            A free, open-access platform uniting practical tools, AI-guided
            proposal generation, and student-led global development
            research—built to expand human capabilities and prevent
            maldevelopment.
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => scrollToSection("tools")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#E9E6B2] px-7 py-3.5 text-sm font-semibold text-[#202B20] shadow-sm transition-all duration-200 hover:bg-[#f2efbf] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C]"
            >
              Explore All 7 Tools
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("explainer-video")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#9AB887] bg-[#2E502B] px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-[#254223] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C]"
            >
              <Play
                className="h-3.5 w-3.5 fill-current text-[#E9E6B2]"
                aria-hidden="true"
              />
              Watch Explainer
            </button>
          </div>

          <div className="w-full border-t border-[#9AB887]/40 pt-4">
            <p className="text-xs font-medium leading-relaxed text-[#E9E6B2]/95">
              University of Maryland FIRE &middot; Dr. Ben Huffman &amp; Dr.
              Stacy Kosko &middot; DICT Philippines &middot; OWLI Kenya
            </p>
          </div>
        </div>

        {/* Right Framed Visual Card + Floating KPI Strip */}
        <div className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-2xl border-[1.5px] border-[#E9E6B2] bg-[#202B20] shadow-xl">
            <div className="relative aspect-[5/4] w-full">
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={gddHeroPoster}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                src="/hero.mp4"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#192419]/90 via-[#192419]/30 to-transparent"
                aria-hidden="true"
              />

              {/* Floating Green-Outlined White KPI Card */}
              <div className="absolute inset-x-4 bottom-4 grid grid-cols-2 gap-4 rounded-xl border-[1.5px] border-[#94B985] bg-white/95 px-5 py-4 text-[#202B20] shadow-md backdrop-blur-sm sm:grid-cols-4">
                {HERO_KPIS.map((kpi) => (
                  <div key={kpi.label} className="flex flex-col">
                    <span
                      className="text-2xl font-bold leading-tight text-[#187347]"
                      style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
                    >
                      {kpi.value}
                    </span>
                    <span className="mt-0.5 text-[11px] font-medium text-[#394838]">
                      {kpi.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
