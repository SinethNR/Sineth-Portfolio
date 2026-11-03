"use client";

import { useEffect, useRef, useState } from "react";

const VIEW = "[data-cursor='view']";
const INTERACTIVE = "a, button, [role='button'], [role='option'], label, select, summary, [data-cursor='hover']";
const TEXT_FIELD = "input, textarea, [contenteditable='true']";

/**
 * White dot + yellow trailing ring, blended with mix-blend-difference.
 * Ring grows over links, becomes a "VIEW" disc over project cards, and
 * shrinks while the mouse button is held. Fine pointers only.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!enabled || !dot || !ring) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    let running = false;

    const setVisible = (v: boolean) => {
      dot.style.opacity = v ? "1" : "0";
      ring.style.opacity = v ? "1" : "0";
    };

    const loop = () => {
      const k = reduce.matches ? 1 : 0.18;
      rx += (mx - rx) * k;
      ry += (my - ry) * k;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (Math.abs(mx - rx) < 0.1 && Math.abs(my - ry) < 0.1) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (mx < -50) {
        rx = e.clientX;
        ry = e.clientY;
      }
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

      const target = e.target as Element | null;
      const overText = !!target?.closest?.(TEXT_FIELD);
      setVisible(!overText);
      const state = overText
        ? "default"
        : target?.closest?.(VIEW)
          ? "view"
          : target?.closest?.(INTERACTIVE)
            ? "hover"
            : "default";
      ring.dataset.state = state;
      dot.dataset.state = state;

      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    const onLeave = () => setVisible(false);
    const onDown = () => (ring.dataset.down = "true");
    const onUp = () => (ring.dataset.down = "false");

    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  // Two separate fixed layers (no shared stacking context) so each can choose
  // its own blend mode: difference normally, plain yellow disc for "VIEW".
  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        data-state="default"
        data-down="false"
        className="group/ring pointer-events-none fixed top-0 left-0 z-[300] opacity-0 mix-blend-difference transition-opacity duration-200 will-change-transform data-[state=view]:mix-blend-normal"
      >
        <div
          className="-mt-5 -ml-5 h-10 w-10 rounded-full border-2 border-accent-yellow transition-[scale,background-color] duration-300 ease-out
            group-data-[state=hover]/ring:scale-[1.6]
            group-data-[state=view]/ring:scale-[2.6] group-data-[state=view]/ring:bg-accent-yellow
            group-data-[down=true]/ring:scale-75 group-data-[state=view]/ring:group-data-[down=true]/ring:scale-[2.1]"
        />
        <span className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 font-mono text-xs font-bold tracking-[0.2em] text-navy-950 opacity-0 transition-opacity duration-200 group-data-[state=view]/ring:opacity-100">
          VIEW
        </span>
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        data-state="default"
        className="group/dot pointer-events-none fixed top-0 left-0 z-[301] opacity-0 mix-blend-difference transition-opacity duration-200 will-change-transform"
      >
        <div className="-mt-1 -ml-1 h-2 w-2 rounded-full bg-white transition-[scale] duration-200 group-data-[state=view]/dot:scale-0" />
      </div>
    </>
  );
}
