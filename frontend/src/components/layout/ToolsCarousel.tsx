import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
type Tool = {
  title: string;
  subtitle: string;
  href: string;
  icon?: React.ReactNode;
};

const tools: Tool[] = [
  {
    title: "Ethics Canvas",
    subtitle: "AI-Enabled Business Innovation Tool",
    href: "/ethics-canvas",
  },
  {
    title: "Ethics of Innovation",
    subtitle: "Interactive Global Dev Explorer",
    href: "/worldwise",
  },
  {
    title: "Worthwhile Development",
    subtitle: "Guides, cases, and frameworks",
    href: "/development-ethics",
  },
  {
    title: "Human Centered Design",
    subtitle: "Real projects, real impact",
    href: "/case-studies",
  },
];

export default function ToolsCarousel() {
  const [idx, setIdx] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // optional auto-advance (every 6s). Remove if you don’t want it.
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIdx((i) => (i + 1) % tools.length);
    }, 6000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [idx]);

  const prev = () => setIdx((i) => (i - 1 + tools.length) % tools.length);
  const next = () => setIdx((i) => (i + 1) % tools.length);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight text-emerald-700">
          Explore Our Tools
        </h2>

        <div className="relative mt-10">
          {/* card */}
          <div className="relative mx-auto max-w-2xl h-[260px] overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 100 }}
           animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="rounded-2xl border border-gray-200 bg-white p-10 shadow-md w-full flex flex-col items-center gap-4 text-center absolute"
          >
      {/* icon */}
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50">
          <span className="text-2xl" role="img" aria-label="tool">
          🧭
          </span>
        </div>

      {/* title & subtitle */}
      <a
        href={tools[idx].href}
        className="text-lg md:text-xl font-semibold text-emerald-800 underline underline-offset-4 hover:text-emerald-600"
      >
        {tools[idx].title}
      </a>
      <p className="text-sm md:text-base text-gray-600">
        {tools[idx].subtitle}
      </p>
    </motion.div>
    </AnimatePresence>
    </div>

          {/* arrows */}
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-lg bg-white/80 px-3 py-2 shadow ring-1 ring-gray-200 hover:bg-white"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-lg bg-white/80 px-3 py-2 shadow ring-1 ring-gray-200 hover:bg-white"
          >
            ›
          </button>

          {/* dots */}
          <div className="mt-10 flex items-center justify-center gap-3">
            {tools.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={[
                  "h-3.5 w-3.5 rounded-full transition-all flex items-center justify-center",
                  i === idx
                    ? "bg-gray-400 border border-gray-400"
                    : "bg-transparent border border-black/80",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}