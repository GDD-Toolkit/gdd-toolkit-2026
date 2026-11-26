import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import LogoSVG from "./LogoSVG";

export default function Splash() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setShow(false);
      setMounted(false);
      return;
    }
    // 0.90s (outline) + 0.35s (fill) + 0.12s (settle overlap) ≈ 1.25s then exit
    const fadeTimer = setTimeout(() => setShow(false), 1250);
    // Hard safety unmount after the 0.34s fade-out so the overlay can never stay stuck
    const unmountTimer = setTimeout(() => setMounted(false), 1700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, [reducedMotion]);

  if (!mounted) return null;

  return (
    <AnimatePresence onExitComplete={() => setMounted(false)}>
      {show && (
        <motion.div
          key="splash"
          data-testid="splash-overlay"
          className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.34, ease: "easeOut" }}
        >
          <motion.div
            // slight settle while fill appears
            initial={{ scale: 1.04 }}
            animate={{ scale: 1.0 }}
            transition={{ delay: 0.92, duration: 0.28, ease: "easeOut" }}
            className="inline-flex flex-shrink-0 items-center text-[#202B20]"
          >
            <LogoSVG size="md" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
