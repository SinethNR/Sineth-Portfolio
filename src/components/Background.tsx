"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; r: number; violet: boolean };

const LINK_DIST = 140; // px between particles to draw a line
const MOUSE_DIST = 180; // px from pointer to draw a line
const ALPHA_BUCKETS = 5; // lines are batched into a few opacity groups → few strokes per frame

/**
 * Full-page constellation: drifting particles joined by faint lines, plus
 * soft cyan/violet glows. Plain 2D canvas, DPR capped, paused when the tab is
 * hidden, and a single static frame when prefers-reduced-motion is set.
 */
export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0;
    let h = 0;
    const particles: Particle[] = [];
    let raf = 0;
    let last = 0;
    const mouse = { x: -9999, y: -9999 };

    const makeParticle = (): Particle => {
      const speed = 8 + Math.random() * 14; // px / second
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 0.8 + Math.random() * 1.4,
        violet: Math.random() < 0.45,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.max(28, Math.min(110, Math.floor((w * h) / 13000)));
      if (particles.length > target) particles.length = target;
      while (particles.length < target) particles.push(makeParticle());
      for (const p of particles) {
        p.x = Math.min(p.x, w);
        p.y = Math.min(p.y, h);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Lines, grouped by opacity bucket
      const buckets: Path2D[] = Array.from({ length: ALPHA_BUCKETS }, () => new Path2D());
      const linkSq = LINK_DIST * LINK_DIST;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkSq) {
            const t = 1 - Math.sqrt(d2) / LINK_DIST; // 0..1, closer = stronger
            const k = Math.min(ALPHA_BUCKETS - 1, Math.floor(t * ALPHA_BUCKETS));
            buckets[k].moveTo(a.x, a.y);
            buckets[k].lineTo(b.x, b.y);
          }
        }
      }
      ctx.lineWidth = 1;
      for (let k = 0; k < ALPHA_BUCKETS; k++) {
        ctx.strokeStyle = `rgba(148, 163, 255, ${(((k + 1) / ALPHA_BUCKETS) * 0.16).toFixed(3)})`;
        ctx.stroke(buckets[k]);
      }

      // Pointer links
      if (mouse.x > -999) {
        const mouseSq = MOUSE_DIST * MOUSE_DIST;
        const path = new Path2D();
        for (const p of particles) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          if (dx * dx + dy * dy < mouseSq) {
            path.moveTo(mouse.x, mouse.y);
            path.lineTo(p.x, p.y);
          }
        }
        ctx.strokeStyle = "rgba(34, 211, 238, 0.14)";
        ctx.stroke(path);
      }

      // Dots, two colour batches
      const cyan = new Path2D();
      const violet = new Path2D();
      for (const p of particles) {
        const path = p.violet ? violet : cyan;
        path.moveTo(p.x + p.r, p.y);
        path.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      }
      ctx.fillStyle = "rgba(34, 211, 238, 0.75)";
      ctx.fill(cyan);
      ctx.fillStyle = "rgba(167, 139, 250, 0.75)";
      ctx.fill(violet);
    };

    const tick = (now: number) => {
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        else if (p.y > h + 10) p.y = -10;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = 0;
      if (reduceMq.matches) draw();
      else raf = requestAnimationFrame(tick);
    };
    const stop = () => cancelAnimationFrame(raf);

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resize();
        if (reduceMq.matches) draw();
      });
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    reduceMq.addEventListener("change", start);

    return () => {
      stop();
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      reduceMq.removeEventListener("change", start);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Glows: radial gradients (no filter: blur) so they cost almost nothing to composite */}
      <div className="animate-drift absolute -top-[20vh] -left-[15vw] h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(circle,rgb(34_211_238_/_0.16),transparent_65%)] will-change-transform motion-reduce:animate-none" />
      <div className="animate-drift-slow absolute top-[25vh] -right-[20vw] h-[90vh] w-[90vh] rounded-full bg-[radial-gradient(circle,rgb(139_92_246_/_0.18),transparent_65%)] will-change-transform motion-reduce:animate-none" />
      <div className="animate-drift absolute -bottom-[30vh] left-[20vw] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgb(99_102_241_/_0.10),transparent_65%)] will-change-transform motion-reduce:animate-none" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
