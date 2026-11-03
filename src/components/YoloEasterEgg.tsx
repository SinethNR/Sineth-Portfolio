"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { projects } from "@/data/portfolio";
import { triggerYolo, useYoloActive } from "@/lib/yolo";

const SECRET = "yolo";

/**
 * Type "yolo" anywhere (outside form fields): detection boxes appear on every
 * project card for 3 seconds. Scrolls to the projects first if they're off-screen.
 */
export default function YoloEasterEgg() {
  const active = useYoloActive();
  const lenis = useLenis();

  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("input, textarea, select, [contenteditable='true']")) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-SECRET.length);
      if (buffer !== SECRET) return;
      buffer = "";

      const el = document.getElementById("projects");
      const r = el?.getBoundingClientRect();
      const inView = r && r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.4;
      if (el && !inView && lenis) {
        lenis.scrollTo(el, { duration: 1.1, onComplete: () => triggerYolo() });
      } else {
        triggerYolo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lenis]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 z-[160] -translate-x-1/2 rounded-full border border-accent-yellow/50 bg-navy-900/90 px-5 py-2.5 font-mono text-sm whitespace-nowrap text-accent-yellow shadow-lg backdrop-blur-md"
        >
          YOLO mode · {projects.length} projects detected
        </motion.div>
      )}
    </AnimatePresence>
  );
}
