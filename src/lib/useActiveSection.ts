"use client";

import { useEffect, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { sections } from "@/data/portfolio";

/**
 * Tracks which section the reader is in.
 * `stops[i]` is the scroll progress (0–1) at which section i counts as reached:
 * when its top passes ~35% down the viewport.
 */
export function useActiveSection() {
  const { scrollYProgress } = useScroll();
  const [stops, setStops] = useState<number[]>(() => sections.map((_, i) => i / (sections.length - 1)));
  const [active, setActive] = useState(0);

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      setStops(
        sections.map(({ href }) => {
          const el = document.querySelector<HTMLElement>(href);
          if (!el) return 0;
          const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35;
          return Math.min(1, Math.max(0, top / max));
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const update = (v: number) => {
    let idx = 0;
    stops.forEach((s, i) => {
      if (v >= s - 0.01) idx = i;
    });
    setActive((prev) => (prev === idx ? prev : idx));
  };
  useMotionValueEvent(scrollYProgress, "change", update);
  useEffect(() => update(scrollYProgress.get()), [stops]); // eslint-disable-line react-hooks/exhaustive-deps

  return { active, stops, scrollYProgress };
}
