import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/brand-button";
import Logo from "@/components/Logo";
import { AuthControls } from "@/components/auth/AuthControls";
import { cn } from "@/lib/utils";

type NavMenu = {
  label: string;
  href?: string;
  items?: { label: string; href: string; external?: boolean }[];
};

const MENUS: NavMenu[] = [
  { label: "Home", href: "/" },
  {
    label: "Development Ethics",
    items: [
      { label: "Development Ethics", href: "/development-ethics" },
      { label: "Worthwhile Development", href: "/worthwhile-development" },
      { label: "The Capability Approach", href: "/capability-approach" },
    ],
  },
  {
    label: "Tools",
    items: [
      {
        label: "AI Business Ethics Canvas",
        href: "https://main.dn6y4rvhmhz3f.amplifyapp.com/",
        external: true,
      },
      { label: "AI Ethics Dashboard", href: "/ai-ethics-dashboard" },
      { label: "Ethics of Innovation", href: "/ethics-of-innovation" },
      { label: "Human Centered Design", href: "/human-centered-design" },
      { label: "Project Planning", href: "/project-planning" },
      { label: "Project Evaluation", href: "/project-evaluation" },
      { label: "Geopolitical Analysis", href: "/geopolitical-analysis" },
    ],
  },
  {
    label: "Case Studies",
    href: "/case-studies",
  },
  {
    label: "Resources",
    items: [
      { label: "Funding Sources", href: "/funding-sources" },
      { label: "Podcast", href: "/podcast" },
      { label: "Acknowledgements", href: "/acknowledgements" },
    ],
  },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const [open, setOpen] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileOpenMenu, setMobileOpenMenu] = useState<number | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const openMenu = (i: number) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpen(i);
  };

  const scheduleClose = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(() => setOpen(null), 200);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.96 },
  };

  const mobileMenuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.04, duration: 0.2 },
    }),
  };

  return (
    <motion.header
      data-site-header
      className={cn(
        "sticky top-0 z-50 backdrop-blur-xl transition-colors",
        isHome
          ? "border-b border-white/10 bg-[#0B0C10]/85 text-white"
          : "border-b border-gray-200/60 bg-white/80 shadow-sm",
      )}
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.33, duration: 0.4, ease: "easeOut" }}
    >
      {/* Top gradient accent hairline */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-[#A07CFF] via-[#6D83F2] to-[#A07CFF]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* BRAND */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="group inline-flex shrink-0 items-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="GDD Home"
            >
              <Logo size="sm" className={isHome ? "text-white" : undefined} />
            </Link>
            {isHome && (
              <span className="hidden rounded-full border border-indigo-500/40 bg-[#181A24] px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#A07CFF] sm:inline-flex">
                GDD FIRE
              </span>
            )}
          </div>

          {/* DESKTOP NAV MENU */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-2 lg:flex"
          >
            <div
              className={cn(
                "flex items-center gap-1.5",
                isHome &&
                  "rounded-full border border-white/10 bg-[#12141C] px-2 py-1.5",
              )}
            >
              {MENUS.map((m, i) =>
                m.items ? (
                  <div
                    key={m.label}
                    className="relative"
                    onMouseEnter={() => openMenu(i)}
                    onMouseLeave={scheduleClose}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(open === i ? null : i)}
                      aria-expanded={open === i}
                      className={cn(
                        "group inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-sm font-medium transition-all duration-200",
                        isHome
                          ? "rounded-full px-4 py-1.5 text-slate-300 hover:bg-[#1F2233] hover:text-white"
                          : "rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-slate-800 shadow-sm hover:border-[#6D83F2] hover:bg-[#A07CFF]/10 hover:text-[#6D83F2]",
                      )}
                    >
                      <span>{m.label}</span>
                      <motion.span
                        animate={{ rotate: open === i ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5",
                            isHome
                              ? "text-slate-400 group-hover:text-[#A07CFF]"
                              : "text-slate-500 group-hover:text-[#6D83F2]",
                          )}
                        />
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {open === i && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          transition={{ duration: 0.18 }}
                          className={cn(
                            "absolute left-0 mt-2 w-72 overflow-hidden rounded-xl border shadow-xl",
                            isHome
                              ? "border-white/10 bg-[#12141E] shadow-black/50"
                              : "border-gray-200/80 bg-white",
                          )}
                          onMouseEnter={() => openMenu(i)}
                          onMouseLeave={scheduleClose}
                        >
                          <div className="py-2">
                            {m.items.map((it, idx) =>
                              it.external ? (
                                <motion.a
                                  key={it.href}
                                  href={it.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={cn(
                                    "block px-5 py-2.5 text-sm transition-colors duration-150",
                                    isHome
                                      ? "text-slate-300 hover:bg-[#1E2235] hover:text-[#C4B5FD]"
                                      : "text-slate-700 hover:bg-[#A07CFF]/10 hover:text-[#6D83F2]",
                                  )}
                                  variants={itemVariants}
                                  initial="hidden"
                                  animate="visible"
                                  custom={idx}
                                >
                                  {it.label}
                                </motion.a>
                              ) : (
                                <motion.div
                                  key={it.href}
                                  variants={itemVariants}
                                  initial="hidden"
                                  animate="visible"
                                  custom={idx}
                                >
                                  <Link
                                    to={it.href}
                                    onClick={() => setOpen(null)}
                                    className={cn(
                                      "block px-5 py-2.5 text-sm transition-colors duration-150",
                                      isHome
                                        ? "text-slate-300 hover:bg-[#1E2235] hover:text-[#C4B5FD]"
                                        : "text-slate-700 hover:bg-[#A07CFF]/10 hover:text-[#6D83F2]",
                                    )}
                                  >
                                    {it.label}
                                  </Link>
                                </motion.div>
                              ),
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={m.label}
                    to={m.href || "/"}
                    className={cn(
                      "inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200",
                      isHome
                        ? cn(
                            "rounded-full px-4 py-1.5",
                            pathname === m.href
                              ? "bg-[#1F2233] font-semibold text-white"
                              : "text-slate-300 hover:bg-[#1F2233] hover:text-white",
                          )
                        : "rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-slate-800 shadow-sm hover:border-[#6D83F2] hover:bg-[#A07CFF]/10 hover:text-[#6D83F2] hover:shadow-md",
                    )}
                  >
                    {m.label}
                  </Link>
                ),
              )}
            </div>

            {/* Prerelease info toggle */}
            <div className="relative ml-2">
              <Button
                size="icon"
                variant="default"
                onClick={() => setShowMessage((v) => !v)}
                aria-label="Prerelease info"
                className={cn(
                  isHome
                    ? "!rounded-full !border-white/10 !bg-[#12141C] hover:!border-[#A07CFF]/50 hover:!bg-[#1E2235]"
                    : "hover:!border-[#6D83F2] hover:!bg-[#A07CFF]/10 hover:!text-[#6D83F2]",
                )}
              >
                <AlertTriangle
                  className={cn(
                    "h-4 w-4",
                    isHome ? "text-amber-400" : "text-red-600",
                  )}
                />
              </Button>

              <AnimatePresence>
                {showMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 5 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "absolute right-0 top-full z-50 mt-2 w-64 rounded-xl p-3.5 text-xs leading-relaxed shadow-xl",
                      isHome
                        ? "border border-amber-400/30 bg-[#141726] text-slate-200"
                        : "bg-red-600 text-white",
                    )}
                  >
                    This is a prerelease version of our Development Ethics
                    Toolkit. For feedback and issues, please email{" "}
                    <a
                      href="mailto:gddfire@gmail.com"
                      className="font-semibold underline"
                    >
                      gddfire@gmail.com
                    </a>
                    .
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AUTH */}
            <div className="ml-1">
              <AuthControls tone={isHome ? "dark" : "light"} />
            </div>
          </nav>

          {/* MOBILE TOGGLE */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="icon"
              className={cn(
                "lg:hidden",
                isHome
                  ? "!border-white/15 !bg-[#12141C] !text-white"
                  : "!border-gray-200 !bg-white !text-slate-800 shadow-sm",
              )}
              onClick={() => setMobile((v) => !v)}
              aria-label="Toggle menu"
            >
              <motion.div
                animate={{ rotate: mobile ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {mobile ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* MOBILE NAV */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
            className={cn(
              "overflow-hidden border-t lg:hidden",
              isHome
                ? "border-white/10 bg-[#0B0C10]"
                : "border-gray-200/60 bg-white",
            )}
          >
            <div className="space-y-2 px-4 py-3">
              {MENUS.map((m, idx) =>
                m.items ? (
                  <div key={m.label} className="space-y-2">
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-medium",
                        isHome
                          ? "border-white/10 bg-[#12141C] text-white"
                          : "border-gray-200 bg-white text-slate-800",
                      )}
                      onClick={() =>
                        setMobileOpenMenu(mobileOpenMenu === idx ? null : idx)
                      }
                    >
                      <span>{m.label}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          mobileOpenMenu === idx && "rotate-180",
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileOpenMenu === idx && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-1.5 overflow-hidden pl-3"
                        >
                          {m.items.map((it) => (
                            <li key={it.href}>
                              {it.external ? (
                                <a
                                  href={it.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setMobile(false)}
                                  className={cn(
                                    "block rounded-lg px-4 py-2 text-sm",
                                    isHome
                                      ? "bg-[#171A27] text-slate-200 hover:text-white"
                                      : "bg-slate-50 text-slate-700 hover:text-[#6D83F2]",
                                  )}
                                >
                                  {it.label}
                                </a>
                              ) : (
                                <Link
                                  to={it.href}
                                  onClick={() => setMobile(false)}
                                  className={cn(
                                    "block rounded-lg px-4 py-2 text-sm",
                                    isHome
                                      ? "bg-[#171A27] text-slate-200 hover:text-white"
                                      : "bg-slate-50 text-slate-700 hover:text-[#6D83F2]",
                                  )}
                                >
                                  {it.label}
                                </Link>
                              )}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={m.label}
                    to={m.href || "/"}
                    onClick={() => setMobile(false)}
                    className={cn(
                      "block w-full rounded-lg border px-4 py-2.5 text-center text-sm font-medium",
                      isHome
                        ? "border-white/10 bg-[#12141C] text-white"
                        : "border-gray-200 bg-white text-slate-800",
                    )}
                  >
                    {m.label}
                  </Link>
                ),
              )}

              {/* AUTH */}
              <div
                className={cn(
                  "border-t pt-3",
                  isHome ? "border-white/10" : "border-gray-200/60",
                )}
              >
                <AuthControls
                  layout="stacked"
                  tone={isHome ? "dark" : "light"}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
