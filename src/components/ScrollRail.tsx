"use client";

import { motion } from "framer-motion";
import { sections } from "@/data/portfolio";
import { useActiveSection } from "@/lib/useActiveSection";

/**
 * Vertical progress line on the left (lg+). The gradient fill draws with the
 * page scroll; each section has a dot placed at the scroll position where that
 * section starts, which lights up once reached.
 */
export default function ScrollRail() {
  const { active, stops, scrollYProgress } = useActiveSection();

  return (
    <nav
      aria-label="Section progress"
      className="fixed top-1/2 left-6 z-40 hidden h-[60vh] -translate-y-1/2 lg:block xl:left-8"
    >
      <div className="relative h-full w-px bg-white/10">
        <motion.div
          className="absolute inset-0 origin-top bg-gradient-to-b from-accent-cyan to-accent-violet"
          style={{ scaleY: scrollYProgress }}
        />
        {sections.map((s, i) => {
          const lit = i <= active;
          return (
            <a
              key={s.href}
              href={s.href}
              aria-label={s.label}
              aria-current={i === active ? "true" : undefined}
              className="group absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center p-2"
              style={{ top: `${stops[i] * 100}%` }}
            >
              <span
                className={`block h-2.5 w-2.5 rounded-full border transition-all duration-300 ${
                  lit
                    ? "border-transparent bg-gradient-accent shadow-[0_0_12px_rgb(34_211_238_/_0.7)]"
                    : "border-white/30 bg-navy-900"
                } ${i === active ? "scale-125" : ""}`}
              />
              <span className="pointer-events-none absolute left-7 rounded-md border border-white/10 bg-navy-800/90 px-2.5 py-1 font-mono text-xs whitespace-nowrap text-slate-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                {s.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
