import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import LogoSVG from "./LogoSVG";

export default function Logo({
  className = "",
  size = "md",
  sharedLayout = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Only opt in when a single mounted instance participates in a layoutId transition. */
  sharedLayout?: boolean;
}) {
  return (
    <motion.div
      layoutId={sharedLayout ? "brand-logo" : undefined}
      className={cn(
        "inline-flex flex-shrink-0 items-center text-neutral-900",
        className,
      )}
    >
      <LogoSVG size={size} />
    </motion.div>
  );
}
