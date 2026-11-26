import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// eslint-disable-next-line react-refresh/only-export-components
export const EDITORIAL_SERIF_STYLE = {
  fontFamily: '"Noto Serif", Georgia, serif',
} as const;

// eslint-disable-next-line react-refresh/only-export-components
export const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

/** Subtle forest-to-cream reading progress bar pinned below the sticky navbar. */
export function ScrollProgressBar() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[2.5px] origin-left bg-gradient-to-r from-[#3F673C] via-[#187347] to-[#E9E6B2]"
    />
  );
}

export interface EditorialHeroBadge {
  label: string;
  tone?: "cream" | "sage";
}

export interface EditorialPageHeroProps {
  id?: string;
  ariaLabel?: string;
  backLink?: { label: string; to: string };
  badges?: EditorialHeroBadge[];
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  footnote?: ReactNode;
  aside?: ReactNode;
  compact?: boolean;
  className?: string;
  titleId?: string;
}

/**
 * Full-bleed Forest Green (#3F673C) editorial hero matching the Homepage hero.
 * Supports optional back breadcrumb, pill badges, Noto Serif heading with italic
 * cream emphasis, CTAs, and an optional right-column visual/KPI card.
 */
export function EditorialPageHero({
  id,
  ariaLabel,
  backLink,
  badges = [],
  title,
  subtitle,
  actions,
  footnote,
  aside,
  compact = false,
  className,
  titleId,
}: EditorialPageHeroProps) {
  const reduced = useReducedMotion();

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={titleId}
      className={cn(
        "relative w-full overflow-hidden bg-[#3F673C] text-white",
        className,
      )}
    >
      {/* Subtle botanical architectural atmosphere (always clipped inside hero) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="editorial-grid-texture absolute inset-0 opacity-60" />
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EDITORIAL_EASE }}
          className="absolute -right-24 -top-28 h-96 w-96 rounded-full border border-[#9AB887]/25 bg-[#2E502B]/35 blur-2xl"
        />
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          transition={{ duration: 1.1, ease: EDITORIAL_EASE }}
          className="absolute -bottom-36 left-1/3 h-80 w-80 rounded-full border border-[#E9E6B2]/15"
        />
      </div>

      <div
        className={cn(
          "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          compact ? "py-10 sm:py-12 lg:py-14" : "py-14 sm:py-16 lg:py-20",
        )}
      >
        <div
          className={cn(
            "grid grid-cols-1 items-center gap-10",
            aside ? "lg:grid-cols-12" : "max-w-4xl",
          )}
        >
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EDITORIAL_EASE }}
            className={cn(
              "flex flex-col items-start gap-5",
              aside ? "lg:col-span-7" : "w-full",
            )}
          >
            {backLink && (
              <Link
                to={backLink.to}
                className="group inline-flex items-center gap-2 rounded-full border border-[#9AB887]/65 bg-[#2E502B]/80 px-3.5 py-1.5 text-xs font-medium text-[#EDF4E8] transition-all hover:border-[#E9E6B2] hover:bg-[#254223] hover:text-[#E9E6B2]"
              >
                <ArrowLeft
                  className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
                <span>{backLink.label}</span>
              </Link>
            )}

            {badges.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5">
                {badges.map((badge) => (
                  <span
                    key={badge.label}
                    className={cn(
                      "inline-flex items-center rounded-full border px-3.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider",
                      badge.tone === "sage"
                        ? "border-[#9AB887]/60 bg-[#355832] text-[#EDF4E8]"
                        : "border-[#9AB887] bg-[#2E502B] text-[#E9E6B2]",
                    )}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            )}

            <h1
              id={titleId}
              className="text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.2rem]"
              style={EDITORIAL_SERIF_STYLE}
            >
              {title}
            </h1>

            {subtitle && (
              <div className="max-w-2xl text-base leading-relaxed text-[#E8F0E5] sm:text-lg">
                {subtitle}
              </div>
            )}

            {actions && (
              <div className="flex w-full flex-wrap items-center gap-3.5 pt-1">
                {actions}
              </div>
            )}

            {footnote && (
              <div className="w-full border-t border-[#9AB887]/40 pt-4 text-xs font-medium leading-relaxed text-[#E9E6B2]/95">
                {footnote}
              </div>
            )}
          </motion.div>

          {aside && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20, scale: 0.98 }}
              animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EDITORIAL_EASE }}
              className="lg:col-span-5"
            >
              {aside}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export interface EditorialSectionProps {
  id?: string;
  tone?: "white" | "sage" | "forest";
  ariaLabel?: string;
  ariaLabelledBy?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  compact?: boolean;
}

export function EditorialSection({
  id,
  tone = "white",
  ariaLabel,
  ariaLabelledBy,
  children,
  className,
  innerClassName,
  compact = false,
}: EditorialSectionProps) {
  const toneClass =
    tone === "sage"
      ? "border-y border-[#B2C9A8] bg-[#F2F6EF] text-[#202B20]"
      : tone === "forest"
        ? "bg-[#202B20] text-white"
        : "bg-white text-[#202B20]";

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "w-full",
        toneClass,
        compact ? "py-12 md:py-16" : "py-16 md:py-20",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

export interface EditorialSectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  titleId?: string;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function EditorialSectionHeader({
  eyebrow,
  title,
  titleId,
  description,
  action,
  align = "left",
  className,
}: EditorialSectionHeaderProps) {
  if (align === "center") {
    return (
      <div className={cn("mx-auto max-w-3xl text-center", className)}>
        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#187347]">
          {eyebrow}
        </p>
        <h2
          id={titleId}
          className="mt-2.5 text-3xl font-semibold tracking-tight text-[#202B20] sm:text-4xl"
          style={EDITORIAL_SERIF_STYLE}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-[#596556] sm:text-base">
            {description}
          </p>
        )}
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 md:flex-row md:items-end",
        className,
      )}
    >
      <div>
        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#187347]">
          {eyebrow}
        </p>
        <h2
          id={titleId}
          className="mt-2 text-2xl font-semibold tracking-tight text-[#202B20] sm:text-3xl lg:text-4xl"
          style={EDITORIAL_SERIF_STYLE}
        >
          {title}
        </h2>
      </div>
      {description && (
        <p className="max-w-md text-sm leading-relaxed text-[#596556]">
          {description}
        </p>
      )}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function EditorialReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, delay, ease: EDITORIAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

