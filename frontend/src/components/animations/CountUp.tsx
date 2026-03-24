"use client";

import { useEffect, useRef, useState } from "react";
import { useInViewOnce } from "./useInViewOnce";

export default function CountUp({ to, duration = 1.2, prefix = "", suffix = "", className = "" }: { to: number; duration?: number; prefix?: string; suffix?: string; className?: string }) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>();
  const [val, setVal] = useState(0);
  const start = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const step = (t: number) => {
      if (start.current === null) start.current = t;
      const p = Math.min((t - start.current) / (duration * 1000), 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, duration, to]);

  return <span ref={ref} className={className}>{prefix}{val}{suffix}</span>;
}


