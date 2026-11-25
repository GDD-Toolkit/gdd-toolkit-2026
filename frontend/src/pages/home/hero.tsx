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
      className="relative w-full overflow-hidden bg-[#09090B] text-white"
    >
      {/* Background Video + Poster Fallback */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={gddHeroPoster}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
        src="/hero.mp4"
      />

      {/* Obsidian Gradient Scrim */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#09090B]/80 via-[#09090B]/85 to-[#09090B]"
        aria-hidden="true"
      />

      {/* Ambient Violet Glow Orb */}
      <div
        className="pointer-events-none absolute left-1/2 top-12 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-[#A07CFF]/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-28">
        {/* Eyebrow Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <span className="inline-flex items-center rounded-full border border-[#6D83F2]/40 bg-[#181A24]/90 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-[#C4B5FD]">
            UMD FIRE · Global Development &amp; Design
          </span>
          <span className="inline-flex items-center rounded-full border border-white/10 bg-[#12141C]/90 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-slate-300">
            Free &amp; Open Access
          </span>
        </div>

        {/* Display Headline */}
        <h1 className="mt-7 max-w-4xl bg-gradient-to-r from-[#A07CFF] via-[#8E8DFB] to-[#6D83F2] bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-[4rem] lg:leading-[1.08]">
          Design Ethical Social Impact at Global Scale.
        </h1>

        {/* Subheading */}
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          A free, open-access platform combining 7 practical tools, AI-powered
          ethical proposal generation, and student-led global development
          research—built to advance worthwhile development and prevent
          maldevelopment.
        </p>

        {/* Dual CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={() => scrollToSection("tools")}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#A07CFF] to-[#6D83F2] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#6D83F2]/20 transition-all duration-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#A07CFF] focus:ring-offset-2 focus:ring-offset-[#09090B]"
          >
            Explore 7 Tools
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("explainer-video")}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-[#181A24]/90 px-6 py-3.5 text-sm font-medium text-slate-100 transition-all duration-200 hover:border-[#A07CFF]/50 hover:bg-[#1E2130] focus:outline-none focus:ring-2 focus:ring-[#6D83F2] focus:ring-offset-2 focus:ring-offset-[#09090B]"
          >
            <Play className="h-3.5 w-3.5 fill-current text-[#A07CFF]" aria-hidden="true" />
            Watch Explainer
          </button>
        </div>

        {/* Sleek 4-Column Glass KPI Bar */}
        <div className="mt-14 grid w-full max-w-5xl grid-cols-2 gap-6 rounded-2xl border border-white/10 bg-[#11131B]/90 px-6 py-5 text-left backdrop-blur-md sm:px-9 md:grid-cols-4">
          {HERO_KPIS.map((kpi) => (
            <div key={kpi.label} className="flex flex-col gap-0.5">
              <span className="text-2xl font-bold tracking-tight text-[#A07CFF]">
                {kpi.value}
              </span>
              <span className="text-sm font-semibold text-slate-50">
                {kpi.label}
              </span>
              <span className="text-xs text-slate-400">{kpi.sublabel}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
