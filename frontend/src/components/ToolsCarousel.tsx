import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export type ToolSlide = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
};

interface ToolsCarouselProps {
  slides: ToolSlide[];
  autoPlayInterval?: number;
}

export default function ToolsCarousel({
  slides,
  autoPlayInterval = 7000,
}: ToolsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isPaused || slides.length === 0) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeIndex, isPaused, autoPlayInterval, slides.length]);

  if (slides.length === 0) return null;
  const currentSlide = slides[activeIndex];

  return (
    <div
      className="relative max-w-6xl mx-auto w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="relative bg-white/5 border border-white/10 backdrop-blur-xl
              shadow-[0_24px_60px_rgba(0,0,0,0.65)]
              rounded-3xl px-6 md:px-10 py-10 md:py-12
              flex flex-col items-center gap-6 md:gap-8
              min-h-[400px] md:min-h-[450px]"
          >
            {/* Inner gradient overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#6D83F2]/15 via-transparent to-[#A07CFF]/15 pointer-events-none" />

            {/* Icon */}
            <div className="relative flex items-center justify-center z-10">
              <div className="absolute -inset-4 rounded-full bg-[#6D83F2]/25 blur-xl opacity-70" />
              <motion.div
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl
                  bg-slate-950/80 border border-[#6D83F2]/40 shadow-lg"
                animate={{ y: [0, -4, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                {currentSlide.icon}
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center gap-4 z-10">
              {/* Label pill */}
              <div
                className="inline-flex items-center gap-2 rounded-full
                border border-[#6D83F2]/40 bg-[#6D83F2]/15
                px-3 py-1 text-xs font-medium uppercase tracking-[0.2em]
                text-[#A07CFF]"
              >
                {currentSlide.label}
              </div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white text-center">
                {currentSlide.title}
              </h3>

              {/* Subtitle */}
              <p className="mt-2 text-sm md:text-base text-slate-200/80 text-center max-w-xl">
                {currentSlide.subtitle}
              </p>

              {/* CTA */}
              <Link
                to={currentSlide.href}
                className="mt-4 inline-flex items-center gap-2 rounded-full
                  border border-[#6D83F2]/50 bg-[#6D83F2]/15
                  px-4 py-2 text-sm font-medium text-[#A07CFF]
                  hover:bg-[#6D83F2]/25 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-[#6D83F2]
                  focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Learn more
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Left arrow */}
        <motion.button
          onClick={() => setActiveIndex((i) => (i - 1 + slides.length) % slides.length)}
          aria-label="Previous tool"
          className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2
            inline-flex h-9 w-9 items-center justify-center rounded-full
            border border-white/20 bg-slate-950/80 backdrop-blur
            hover:bg-[#6D83F2]/25 hover:border-[#6D83F2]/60 transition-colors
            z-20 focus:outline-none focus:ring-2 focus:ring-[#6D83F2]
            focus:ring-offset-2 focus:ring-offset-slate-950"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="h-4 w-4 text-slate-50" />
        </motion.button>

        {/* Right arrow */}
        <motion.button
          onClick={() => setActiveIndex((i) => (i + 1) % slides.length)}
          aria-label="Next tool"
          className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2
            inline-flex h-9 w-9 items-center justify-center rounded-full
            border border-white/20 bg-slate-950/80 backdrop-blur
            hover:bg-[#6D83F2]/25 hover:border-[#6D83F2]/60 transition-colors
            z-20 focus:outline-none focus:ring-2 focus:ring-[#6D83F2]
            focus:ring-offset-2 focus:ring-offset-slate-950"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="h-4 w-4 text-slate-50" />
        </motion.button>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {slides.map((slide, i) => (
          <motion.button
            key={slide.id}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="relative h-2.5 w-2.5 rounded-full
              focus:outline-none focus:ring-2 focus:ring-[#6D83F2]
              focus:ring-offset-2 focus:ring-offset-slate-950"
            animate={i === activeIndex ? { scale: 1.4 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span
              className={`absolute inset-0 rounded-full transition-all ${
                i === activeIndex
                  ? "bg-[#6D83F2] shadow-[0_0_0_6px_rgba(109,131,242,0.3)]"
                  : "bg-[#5D5D5D]/70"
              }`}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
