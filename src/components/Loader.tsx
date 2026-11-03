"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { profile } from "@/data/portfolio";
import { markIntroDone } from "@/lib/intro";
import { INTRO_SKIP_CLASS } from "@/lib/intro-constants";

/* ── Timeline (ms) ────────────────────────────────────────────── */
const T = {
  typeStart: 120,
  typeDur: 520,
  netStart: 600,
  netDur: 850,
  nameStart: 1200,
  nameDur: 700,
  split: 2000,
  splitDur: 700,
  heroDelay: 150, // start hero animations just after the split is under way
};
const LINE = "> initializing sineth.ai ...";
const [FIRST, ...REST] = profile.name.toUpperCase().split(" ");
const NAME = `${FIRST}\n${REST.join(" ")}`; // two lines on phones, one line from sm up
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*<>/";
const SPLIT_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);

/* ── Neural network ───────────────────────────────────────────── */
type Node = { x: number; y: number; layer: number };
type Edge = { a: Node; b: Node; start: number };
type Net = { nodes: Node[]; edges: Edge[]; layers: number };

function buildNet(w: number, h: number): Net {
  const layers = w < 640 ? 4 : 6;
  const nodes: Node[] = [];
  const byLayer: Node[][] = [];
  for (let l = 0; l < layers; l++) {
    const count = (w < 640 ? 3 : 4) + Math.floor(Math.random() * 4);
    const x = w * (0.1 + (0.8 * l) / (layers - 1));
    const col: Node[] = [];
    for (let i = 0; i < count; i++) {
      const y = h * (0.18 + (0.64 * (i + 0.5)) / count) + (Math.random() - 0.5) * 30;
      const n = { x: x + (Math.random() - 0.5) * 40, y, layer: l };
      col.push(n);
      nodes.push(n);
    }
    byLayer.push(col);
  }
  const edges: Edge[] = [];
  for (let l = 0; l < layers - 1; l++) {
    for (const a of byLayer[l]) {
      const next = [...byLayer[l + 1]].sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 2));
      for (const b of next) edges.push({ a, b, start: (l / (layers - 1)) * 0.72 + Math.random() * 0.08 });
    }
  }
  return { nodes, edges, layers };
}

const LAYER_COLORS = ["34,211,238", "56,189,248", "99,102,241", "139,92,246", "168,85,247", "250,204,21"];
const EDGE_DUR = 0.22;

function drawNet(ctx: CanvasRenderingContext2D, net: Net, p: number, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.lineWidth = 1;
  // Edges grow from a → b, batched per source layer colour
  for (let l = 0; l < net.layers - 1; l++) {
    const path = new Path2D();
    for (const e of net.edges) {
      if (e.a.layer !== l) continue;
      const k = clamp01((p - e.start) / EDGE_DUR);
      if (k <= 0) continue;
      path.moveTo(e.a.x, e.a.y);
      path.lineTo(e.a.x + (e.b.x - e.a.x) * k, e.a.y + (e.b.y - e.a.y) * k);
    }
    ctx.strokeStyle = `rgba(${LAYER_COLORS[l % LAYER_COLORS.length]},0.35)`;
    ctx.stroke(path);
  }
  // Nodes pop in when their layer is reached
  for (const n of net.nodes) {
    const appear = clamp01((p - ((n.layer / (net.layers - 1)) * 0.72 - 0.02)) / 0.12);
    if (appear <= 0) continue;
    const c = LAYER_COLORS[n.layer % LAYER_COLORS.length];
    ctx.beginPath();
    ctx.arc(n.x, n.y, 7 * appear, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${c},0.12)`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(n.x, n.y, 2.6 * appear, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${c},0.95)`;
    ctx.fill();
  }
}

/* ── Component ────────────────────────────────────────────────── */
export default function Loader() {
  const [active, setActive] = useState(true);
  const [splitting, setSplitting] = useState(false);
  const lenis = useLenis();

  const lineRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const finishRef = useRef<() => void>(() => {});

  const setName = (text: string, visible: boolean) => {
    for (const el of nameRefs.current) {
      if (!el) continue;
      el.textContent = text;
      el.style.opacity = visible ? "1" : "0";
    }
  };

  useEffect(() => {
    if (document.documentElement.classList.contains(INTRO_SKIP_CLASS)) {
      setActive(false);
      return;
    }
    window.scrollTo(0, 0);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas && ctx) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const net = buildNet(w, h);
    const chars = [...NAME];
    const settleAt = chars.map((_, i) => T.nameStart + 100 + (i / (chars.length - 1)) * (T.nameDur - 100));

    let raf = 0;
    let done = false;
    let lastScramble = 0;
    const start = performance.now();

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      if (lineRef.current) lineRef.current.textContent = LINE;
      if (counterRef.current) counterRef.current.textContent = "100";
      if (ctx) drawNet(ctx, net, 1, w, h);
      setName(NAME, true);
      setSplitting(true);
      // Hero photo + words animate in while the halves part. Slight delay so the
      // (compositor-driven) split starts before the hero's work hits the main thread.
      setTimeout(markIntroDone, T.heroDelay);
    };
    finishRef.current = finish;

    const frame = (now: number) => {
      const t = now - start;

      // 1. Terminal line
      const typed = Math.round(clamp01((t - T.typeStart) / T.typeDur) * LINE.length);
      if (lineRef.current) lineRef.current.textContent = LINE.slice(0, typed);

      // 2. Counter (runs across the whole intro)
      if (counterRef.current) counterRef.current.textContent = String(Math.round(easeOut(clamp01((t - 150) / (T.split - 250))) * 100));

      // 3. Network draws itself, then dims behind the name
      if (ctx && t >= T.netStart) {
        const p = clamp01((t - T.netStart) / T.netDur);
        if (p < 1 || t - T.netStart < T.netDur + 40) drawNet(ctx, net, p, w, h);
        if (canvas) canvas.style.opacity = t > T.nameStart ? "0.35" : "1";
      }

      // 4. Name decodes letter by letter
      if (t >= T.nameStart && now - lastScramble > 40) {
        lastScramble = now;
        let out = "";
        for (let i = 0; i < chars.length; i++) {
          const c = chars[i];
          out += c === " " || c === "\n" || t >= settleAt[i] ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setName(out, true);
      }

      if (t >= T.split) finish();
      else raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      done = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  // Skip with Esc (click is handled on the overlay)
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finishRef.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  // Lock scrolling while the intro is on screen
  useEffect(() => {
    if (!lenis) return;
    if (active) lenis.stop();
    else lenis.start();
  }, [lenis, active]);

  const onSplitDone = useCallback(() => setActive(false), []);

  useEffect(() => {
    if (!splitting) return;
    const t = setTimeout(onSplitDone, T.splitDur + 300);
    return () => clearTimeout(t);
  }, [splitting, onSplitDone]);

  // CSS transitions run on the compositor, so the split stays smooth even if
  // the main thread is busy starting the hero animations.
  const half = (dir: -1 | 1): React.CSSProperties => ({
    transform: splitting ? `translate3d(0, ${dir * 100}%, 0)` : "translate3d(0, 0, 0)",
    transition: `transform ${T.splitDur}ms ${SPLIT_EASE}`,
  });

  if (!active) return null;

  const nameBlock = (i: number) => (
    <div className="flex h-full items-center justify-center px-4">
      <span
        ref={(el) => {
          nameRefs.current[i] = el;
        }}
        className="bg-[linear-gradient(90deg,#22d3ee,#8b5cf6_55%,#facc15)] bg-clip-text text-center font-sans text-[19vw] leading-[0.92] font-bold tracking-tight whitespace-pre-line text-transparent opacity-0 sm:text-[10.5vw] sm:whitespace-nowrap"
      />
    </div>
  );

  return (
    <div
      id="intro-loader"
      className="fixed inset-0 z-[200] cursor-pointer select-none"
      onClick={() => finishRef.current()}
      aria-hidden="true"
    >
      {/* Top half — slides up */}
      <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-[#020409] will-change-transform" style={half(-1)}>
        <div className="absolute inset-x-0 top-0 h-[200%]">{nameBlock(0)}</div>
      </div>

      {/* Bottom half — slides down */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-[#020409] will-change-transform"
        style={half(1)}
        onTransitionEnd={(e) => e.target === e.currentTarget && splitting && onSplitDone()}
      >
        <div className="absolute inset-x-0 bottom-0 h-[200%]">{nameBlock(1)}</div>
      </div>

      {/* Terminal, network and counter — fade out as the screen splits */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{ opacity: splitting ? 0 : 1 }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full transition-opacity duration-500" />

        <p className="absolute top-6 left-6 font-mono text-sm text-emerald-300 sm:top-10 sm:left-10 sm:text-lg">
          <span ref={lineRef} />
          <span className="animate-blink ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-emerald-300" />
        </p>

        <p className="absolute right-6 bottom-6 font-mono text-slate-400 sm:right-10 sm:bottom-10">
          <span ref={counterRef} className="text-4xl text-white tabular-nums sm:text-6xl">
            0
          </span>
          <span className="ml-1 text-xl sm:text-2xl">%</span>
        </p>

        <p className="absolute bottom-6 left-6 font-mono text-xs tracking-wider text-slate-400 uppercase sm:bottom-10 sm:left-10">
          Click or press Esc to skip
        </p>
      </div>
    </div>
  );
}
