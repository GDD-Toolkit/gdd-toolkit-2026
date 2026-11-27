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
    label: "Human Centered Innovations",
    href: "/development-ethics",
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

const HCI_PATHS = [
  "/development-ethics",
  "/worthwhile-development",
  "/capability-approach",
  "/human-centered-design",
];

function isPathMatch(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isMenuActive(menu: NavMenu, pathname: string): boolean {
  if (menu.items) {
    return menu.items.some(
      (it) => !it.external && isPathMatch(it.href, pathname),
    );
  }
  if (!menu.href) return false;
  if (menu.href === "/development-ethics") {
    return HCI_PATHS.some((p) => isPathMatch(p, pathname));
  }
  return isPathMatch(menu.href, pathname);
}

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileOpenMenu, setMobileOpenMenu] = useState<number | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const desktopAlertRef = useRef<HTMLDivElement | null>(null);
  const mobileAlertBtnRef = useRef<HTMLButtonElement | null>(null);
  const mobileBannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showMessage) return;
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !desktopAlertRef.current?.contains(target) &&
        !mobileAlertBtnRef.current?.contains(target) &&
        !mobileBannerRef.current?.contains(target)
      ) {
        setShowMessage(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowMessage(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMessage]);

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
      className="sticky top-0 z-50 border-b border-[#B2C9A8] bg-white/95 backdrop-blur-xl shadow-xs"
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.33, duration: 0.4, ease: "easeOut" }}
    >
      {/* Top forest-to-emerald accent hairline */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-[#3F673C] via-[#187347] to-[#94B985]" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* LEFT: BRAND + SEGMENTED NAVIGATION RAIL */}
          <div className="flex min-w-0 items-center gap-6 xl:gap-7">
            {/* BRAND */}
            <Link
              to="/"
              className="group inline-flex shrink-0 items-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="GDD Home"
            >
              <Logo size="sm" className="text-[#284B26]" />
            </Link>

            {/* DESKTOP SEGMENTED NAV RAIL */}
            <nav
              aria-label="Primary navigation"
              className="hidden items-center gap-1 rounded-full border border-[#D5E3D9] bg-[#F2F6EF] p-1 xl:flex"
            >
              {MENUS.map((m, i) => {
                const active = isMenuActive(m, pathname);
                const segmentClasses = cn(
                  "inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C]/50",
                  active
                    ? "bg-white font-semibold text-[#187347] shadow-xs ring-1 ring-[#B2C9A8]/70"
                    : "bg-transparent font-medium text-[#394838] hover:bg-white/75 hover:text-[#284B26]",
                );

                return m.items ? (
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
                      className={cn(segmentClasses, "group")}
                    >
                      <span>{m.label}</span>
                      <motion.span
                        animate={{ rotate: open === i ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-colors",
                            active
                              ? "text-[#187347]"
                              : "text-[#596556] group-hover:text-[#187347]",
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
                          className="absolute left-0 mt-2.5 w-72 overflow-hidden rounded-xl border border-[#B2C9A8] bg-white shadow-xl"
                          onMouseEnter={() => openMenu(i)}
                          onMouseLeave={scheduleClose}
                        >
                          <div className="space-y-0.5 p-1.5">
                            {m.items.map((it, idx) =>
                              it.external ? (
                                <motion.a
                                  key={it.href}
                                  href={it.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block rounded-lg px-3.5 py-2.5 text-sm text-[#394838] transition-colors duration-150 hover:bg-[#EDF4E8] hover:text-[#187347]"
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
                                      "block rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-150 hover:bg-[#EDF4E8] hover:text-[#187347]",
                                      isPathMatch(it.href, pathname)
                                        ? "bg-[#EDF4E8] font-semibold text-[#187347]"
                                        : "text-[#394838]",
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
                    aria-current={active ? "page" : undefined}
                    className={segmentClasses}
                  >
                    {m.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* RIGHT: PRERELEASE CHIP + AUTH */}
          <div className="hidden shrink-0 items-center gap-3 xl:flex">
            {/* Prerelease chip */}
            <div className="relative" ref={desktopAlertRef}>
              <button
                type="button"
                onClick={() => setShowMessage((v) => !v)}
                aria-label="Prerelease info"
                aria-expanded={showMessage}
                className="inline-flex h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-300/80 bg-[#FAF8E4] px-3.5 text-xs font-medium text-[#284B26] transition-colors hover:border-amber-400 hover:bg-[#F6F4D8]"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>Prerelease</span>
              </button>

              <AnimatePresence>
                {showMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 5 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-[#94B985] bg-[#202B20] p-3.5 text-xs leading-relaxed text-[#E8F0E5] shadow-xl"
                  >
                    This is a prerelease version of our Development Ethics
                    Toolkit. For feedback and issues, please email{" "}
                    <a
                      href="mailto:gddfire@gmail.com"
                      className="font-semibold text-[#E9E6B2] underline"
                    >
                      gddfire@gmail.com
                    </a>
                    .
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AUTH */}
            <AuthControls tone="forest" />
          </div>

          {/* MOBILE ACTIONS */}
          <div className="flex shrink-0 items-center gap-2 xl:hidden">
            <Button
              ref={mobileAlertBtnRef}
              size="icon"
              variant="default"
              onClick={() => setShowMessage((v) => !v)}
              aria-label="Prerelease info"
              aria-expanded={showMessage}
              className="!rounded-full !border-amber-300/80 !bg-[#FAF8E4] hover:!border-amber-400 hover:!bg-[#F6F4D8]"
            >
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </Button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="icon"
                className="!border-[#B2C9A8] !bg-white !text-[#284B26] shadow-xs"
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

        {/* Mobile prerelease banner */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              ref={mobileBannerRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pb-3 xl:hidden"
            >
              <div className="rounded-xl border border-[#94B985] bg-[#202B20] p-3.5 text-xs leading-relaxed text-[#E8F0E5] shadow-md">
                This is a prerelease version of our Development Ethics Toolkit.
                For feedback and issues, please email{" "}
                <a
                  href="mailto:gddfire@gmail.com"
                  className="font-semibold text-[#E9E6B2] underline"
                >
                  gddfire@gmail.com
                </a>
                .
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
            className="overflow-hidden border-t border-[#B2C9A8] bg-[#F2F6EF]/80 xl:hidden"
          >
            <div className="space-y-2 px-4 py-3">
              {MENUS.map((m, idx) => {
                const active = isMenuActive(m, pathname);
                return m.items ? (
                  <div key={m.label} className="space-y-1.5">
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors",
                        active
                          ? "border-[#3F673C] bg-[#EDF4E8] font-semibold text-[#187347]"
                          : "border-[#B2C9A8] bg-white font-medium text-[#284B26]",
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
                          {m.items.map((it) => {
                            const subActive =
                              !it.external && isPathMatch(it.href, pathname);
                            return (
                              <li key={it.href}>
                                {it.external ? (
                                  <a
                                    href={it.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setMobile(false)}
                                    className="block rounded-lg border border-[#D5E3D9] bg-white px-4 py-2 text-sm text-[#284B26]"
                                  >
                                    {it.label}
                                  </a>
                                ) : (
                                  <Link
                                    to={it.href}
                                    onClick={() => setMobile(false)}
                                    className={cn(
                                      "block rounded-lg border px-4 py-2 text-sm",
                                      subActive
                                        ? "border-[#3F673C] bg-[#EDF4E8] font-semibold text-[#187347]"
                                        : "border-[#D5E3D9] bg-white text-[#284B26]",
                                    )}
                                  >
                                    {it.label}
                                  </Link>
                                )}
                              </li>
                            );
                          })}
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
                      "block w-full rounded-lg border px-4 py-2.5 text-sm transition-colors",
                      active
                        ? "border-[#3F673C] bg-[#EDF4E8] font-semibold text-[#187347]"
                        : "border-[#B2C9A8] bg-white font-medium text-[#284B26]",
                    )}
                  >
                    {m.label}
                  </Link>
                );
              })}

              <div className="border-t border-[#D5E3D9] pt-3">
                <AuthControls layout="stacked" tone="forest" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
