"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/#%&*+=";

/**
 * Decodes text from random glyphs the first time it scrolls into view.
 * An invisible copy reserves the final layout so nothing shifts while it
 * scrambles; screen readers only ever get the real text.
 */
export default function ScrambleText({ text, duration = 900 }: { text: string; duration?: number }) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const outRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-60px" });

  useEffect(() => {
    const el = outRef.current;
    if (!inView || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = [...text];
    // Each character settles at a staggered time; spaces never scramble.
    const settleAt = chars.map((_, i) => 150 + (i / Math.max(1, chars.length - 1)) * duration * 0.75);
    let raf = 0;
    let lastSwap = 0;
    const start = performance.now();

    const frame = (now: number) => {
      const t = now - start;
      if (now - lastSwap > 45) {
        lastSwap = now;
        let out = "";
        for (let i = 0; i < chars.length; i++) {
          const c = chars[i];
          out += c === " " || t >= settleAt[i] ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
      }
      if (t < duration + 200) raf = requestAnimationFrame(frame);
      else el.textContent = text;
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [inView, text, duration]);

  return (
    <span ref={wrapRef} className="relative inline-block">
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span ref={outRef} className="absolute inset-0" aria-hidden="true">
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
