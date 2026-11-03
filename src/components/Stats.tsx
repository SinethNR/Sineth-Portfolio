"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import type { Stat } from "@/data/portfolio";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Server HTML holds the real number; on the client we reset to 0 and count up once visible.
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!inView) {
      el.textContent = `0${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = `${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

export default function Stats({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col-reverse justify-end rounded-3xl border border-white/10 bg-navy-800/60 p-6 backdrop-blur-sm sm:p-7"
        >
          <dt className="mt-3 text-sm leading-snug text-slate-400 sm:text-base">{s.label}</dt>
          <dd className="text-gradient w-fit text-5xl font-bold tracking-tight sm:text-6xl">
            <Counter value={s.value} suffix={s.suffix} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
