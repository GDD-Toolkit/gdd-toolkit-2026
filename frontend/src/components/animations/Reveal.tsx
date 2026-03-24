"use client";

import { motion } from "framer-motion";
import { useInViewOnce } from "./useInViewOnce";
import { fadeIn, slideUp, slideLeft, slideRight, scaleIn, staggerContainer } from "./variants";

const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type P = { children: React.ReactNode; className?: string; delay?: number };

function Wrapper({ variant, ...props }: P & { variant: any }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  if (prefersReduced()) return <div ref={ref} className={props.className}>{props.children}</div>;
  return (
    <motion.div
      ref={ref}
      className={props.className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={variant}
      transition={{ delay: props.delay ?? 0 }}
    >
      {props.children}
    </motion.div>
  );
}

export const FadeIn = (p: P) => <Wrapper variant={fadeIn} {...p} />;
export const SlideUp = (p: P) => <Wrapper variant={slideUp} {...p} />;
export const SlideInLeft = (p: P) => <Wrapper variant={slideLeft} {...p} />;
export const SlideInRight = (p: P) => <Wrapper variant={slideRight} {...p} />;
export const ScaleIn = (p: P) => <Wrapper variant={scaleIn} {...p} />;

export const StaggerChildren: React.FC<P> = ({ children, className }) => {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  if (prefersReduced()) return <div ref={ref} className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} initial="hidden" animate={inView ? "show" : "hidden"} variants={staggerContainer}>
      {children}
    </motion.div>
  );
};


