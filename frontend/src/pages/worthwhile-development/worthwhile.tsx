import { useRef, useEffect, useState } from "react";
import {
  HeartPulse,
  Scale,
  Zap,
  ShieldCheck,
  Palette,
  CheckCircle2,
  Leaf,
  ArrowUp,
} from "lucide-react";
import { motion, useInView, easeOut } from "framer-motion";

// Floating keyframes for icons
const floating = {
  animation: "floating 3.5s ease-in-out infinite",
};

// Add keyframes to global style
const FloatingKeyframes = () => (
    <style>{`
    @keyframes floating {
      0% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    }
  
    .gradient-text {
      background: linear-gradient(
        90deg,
        #A07CFF,
        #6D83F2,
        #A07CFF
      );
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradient-sweep 5s linear infinite;
    }
  
    @keyframes gradient-sweep {
      0% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
  
    .underline-grow {
      position: relative;
      overflow: hidden;
    }
  
    .underline-grow::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 0;
      width: 0;
      height: 3px;
      background: linear-gradient(90deg, #A07CFF, #6D83F2);
      transition: width 0.5s cubic-bezier(.4,0,.2,1),
                  left 0.5s cubic-bezier(.4,0,.2,1);
      border-radius: 2px;
      transform: translateX(-50%);
    }
  
    .underline-grow.visible::after {
      width: 80%;
      left: 10%;
    }
  
    .pulse-glow {
      position: relative;
    }
  
    .pulse-glow::before {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: 120%;
      height: 60px;
      background: radial-gradient(
        circle,
        rgba(160,124,255,0.35) 0%,
        transparent 70%
      );
      transform: translate(-50%, -50%);
      filter: blur(14px);
      animation: pulse-glow 2.5s ease-in-out infinite;
      z-index: 0;
    }
  
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.65; }
      50% { opacity: 1; }
    }
  
    .gradient-bg {
      background: linear-gradient(
        90deg,
        rgba(160,124,255,0.12),
        rgba(109,131,242,0.18),
        rgba(160,124,255,0.12)
      );
      background-size: 200% 200%;
      animation: gradient-bg-shift 8s linear infinite;
    }
  
    @keyframes gradient-bg-shift {
      0% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
  `}</style>  
);

const goals = [
  {
    title: "Well-Being",
    desc:
      "Prioritize physical, mental, and social well-being. Programs should measurably improve quality of life, reduce preventable harm, and expand access to essential services such as healthcare, nutrition, and safe environments.",
    icon: HeartPulse,
  },
  {
    title: "Equality",
    desc:
      "Design and evaluate interventions to close gaps in outcomes and opportunity. Address structural barriers that disproportionately affect marginalized groups and track distributional effects—not only averages.",
    icon: Scale,
  },
  {
    title: "Empowerment",
    desc:
      "Increase people’s ability to define priorities and influence decisions that affect their lives. Support local leadership, transparent information, and participatory processes rather than external control.",
    icon: Zap,
  },
  {
    title: "Human Rights",
    desc:
      "Ensure all efforts respect and strengthen internationally recognized rights and dignities. Build safeguards against coercion, discrimination, and abuse, with clear accountability when harms occur.",
    icon: ShieldCheck,
  },
  {
    title: "Cultural Freedom",
    desc:
      "Protect the ability of communities to sustain, adapt, and express their cultures. Development should never erase identity; it should resource local knowledge, languages, and practices.",
    icon: Palette,
  },
  {
    title: "Responsibility",
    desc:
      "Act with integrity, transparency, and stewardship of resources. Establish clear governance, auditability, and feedback loops. Publish decisions and results. Admit and correct mistakes.",
    icon: CheckCircle2,
  },
  {
    title: "Sustainability",
    desc:
      "Deliver benefits that last without degrading environmental or social systems. Plan for maintenance, financing, and local capacity. Reduce emissions and waste. Steward land, water, and biodiversity.",
    icon: Leaf,
  },
];

export default function Worthwhile() {
  // Scroll-to-top button
  const [showScroll, setShowScroll] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setShowScroll(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Underline animation for Seven Goals
  const sevenGoalsRef = useRef<HTMLHeadingElement>(null);
  const [, setUnderlineVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (sevenGoalsRef.current) {
        const rect = sevenGoalsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
          setUnderlineVisible(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Framer Motion variants
  const bannerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
  };
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easeOut } },
  };
  const calloutVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: easeOut } },
  };

  // InView hooks for sections
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-100px" });
  const calloutRef = useRef<HTMLDivElement>(null);
  const calloutInView = useInView(calloutRef, { once: true, margin: "-80px" });

  return (
    <div className="w-full bg-white text-gray-900 relative">
      <FloatingKeyframes />
      {/* ===== Header ===== */}
      <section className="w-full bg-gradient-to-r from-[#A07CFF] to-[#6D83F2] py-14 text-center text-white">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-white"
          initial="hidden"
          animate="visible"
          variants={bannerVariants}
        >
          Worthwhile Development
        </motion.h1>
        <motion.p
          className="mx-auto mt-4 max-w-3xl text-base md:text-lg text-white/90 leading-relaxed"
          initial="hidden"
          animate="visible"
          variants={bannerVariants}
          transition={{ delay: 0.2, duration: 0.45, ease: easeOut }}
        >
          A people-centered approach to development that avoids disempowerment,
          reduces inequality, and strengthens communities — guided by seven key values.
        </motion.p>
      </section>

      {/* ===== Intro ===== */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="relative -mt-8 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 md:p-8">
          <h2
            ref={sevenGoalsRef}
            className="text-2xl md:text-3xl font-semibold text-[#6D83F2] text-center"
          >
            The Seven Values
          </h2>
          <motion.p
            className="mt-3 text-gray-700 leading-relaxed text-[15px] md:text-base text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            At the heart of the Development Ethics Toolkit are seven core values of worthwhile development, drawn from the Routledge Handbook of Development Ethics. These values guide every tool, evaluation framework, and recommendation within this platform, ensuring that development efforts are not only effective but also equitable, human-centered, and ethically grounded. By centralizing these values, the Development Ethics Toolkit helps development practitioners, policymakers, and scholars navigate towards thoughtful decisions that prioritize human well-being and guard against the pitfalls of maldevelopment.
          </motion.p>
        </div>
      </section>

      {/* ===== Icon Cards ===== */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div ref={cardsRef} className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {goals.map(({ title, desc, icon: Icon }, idx) => (
            <motion.article
              key={title}
              initial="hidden"
              animate={cardsInView ? "visible" : "hidden"}
              variants={cardVariants}
              transition={{ delay: idx * 0.09 + 0.1, duration: 0.45, ease: easeOut }}
              className={`rounded-2xl border border-gray-200 bg-white p-8 shadow-sm
                hover:shadow-[0_10px_30px_rgba(160,124,255,0.25)]
                hover:scale-105 transition-all duration-300
                flex flex-col items-center text-center
                ${idx === 6 ? "md:col-span-2 md:mx-auto md:w-1/2" : ""}`}
                whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 0 4px rgba(160,124,255,0.25)"
                  }}
                  
            >
              <motion.div
                initial="hidden"
                animate={cardsInView ? "visible" : "hidden"}
                variants={iconVariants}
                transition={{ delay: idx * 0.09 + 0.18, duration: 0.4, ease: easeOut }}
                style={floating}
                className="flex h-20 w-20 items-center justify-center rounded-full
                bg-[#F1EEFF] mb-6 relative"
                >
                <Icon className="h-10 w-10 text-[#5B5FEF]" />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                {title}
              </h3>
              <p className="text-[15px] md:text-base leading-7 text-gray-700">
                {desc}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ===== Centered Callout ===== */}
      <section className="flex justify-center pb-20 px-6">
        <motion.div
          ref={calloutRef}
          initial="hidden"
          animate={calloutInView ? "visible" : "hidden"}
          variants={calloutVariants}
          className="max-w-3xl rounded-2xl gradient-bg
            border border-[#E4E0FF]
            p-8 text-center shadow-sm mx-auto"
        >
          <h4 className="text-black font-semibold text-lg mb-3 relative z-10">
            Applying These Principles
          </h4>
          <p className="text-emerald-900 text-sm md:text-base leading-relaxed">
            When planning or evaluating development work, use these goals as checkpoints.
            Each initiative should contribute measurably to at least one goal while avoiding
            tradeoffs that undermine others.
          </p>
        </motion.div>
      </section>

      {/* ===== Scroll-to-Top Button ===== */}
      {showScroll && (
        <button
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50
            bg-[#6D83F2] hover:bg-[#5B5FEF]
            text-white rounded-full p-3 shadow-lg
            transition duration-300 flex items-center justify-center"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
