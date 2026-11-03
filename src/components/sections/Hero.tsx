"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { profile } from "@/data/portfolio";
import { useIntroDone } from "@/lib/intro";
import Magnetic from "../Magnetic";
import DetectionFrame from "../Detection";
import { ArrowRightIcon, DownloadIcon, SparkleIcon } from "../icons";

const SPRING = { type: "spring", stiffness: 420, damping: 20, mass: 0.8 } as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/** A single word popping in on a spring */
const word: Variants = {
  hidden: { opacity: 0, y: "0.55em", scale: 0.6, rotate: -8 },
  show: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: SPRING },
};

const block: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 160, damping: 22 } },
};

const photoIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

/** Gradient slice for word i of n, so the cyan → violet sweep spans the whole name. */
const sliceGradient = (i: number, n: number) => {
  const mix = (p: number) => `color-mix(in oklab, var(--color-accent-cyan), var(--color-accent-violet) ${p}%)`;
  return {
    backgroundImage: `linear-gradient(90deg, ${mix(Math.round((i / n) * 100))}, ${mix(Math.round(((i + 1) / n) * 100))})`,
  };
};

function Words({ text, gradient }: { text: string; gradient?: boolean }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block">
          <motion.span
            variants={word}
            className={`inline-block will-change-transform ${gradient ? "bg-clip-text text-transparent" : ""}`}
            style={gradient ? sliceGradient(i, words.length) : undefined}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </>
  );
}

/** Circular text that slowly spins */
function CircleBadge() {
  const text = "AI ENGINEER • COMPUTER VISION • LLM AGENTS • ";
  return (
    <div className="relative h-24 w-24 rounded-full border border-white/10 bg-navy-900/85 backdrop-blur-md sm:h-28 sm:w-28 lg:h-36 lg:w-36">
      <svg viewBox="0 0 100 100" className="animate-spin-slower absolute inset-0 h-full w-full motion-reduce:animate-none" aria-hidden="true">
        <defs>
          <path id="circle-text-path" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        {/* textLength = circumference (2πr, r = 37) so the phrase wraps the circle exactly once */}
        <text className="fill-slate-200 font-mono" style={{ fontSize: 7.4 }}>
          <textPath href="#circle-text-path" textLength={230} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <SparkleIcon className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-accent-yellow lg:h-8 lg:w-8" />
      <span className="sr-only">AI Engineer, Computer Vision, LLM Agents</span>
    </div>
  );
}

/**
 * Face box as a fraction of the square photo frame. me.jpg (765×738) is
 * object-cover'd into a square, so these map the head region of the image.
 * Adjust if you swap the photo.
 */
const FACE_BOX = { left: "36.5%", top: "11%", width: "29%", height: "39%" };

/** YOLO-style detection that locks onto the face, with live-looking jitter and confidence. */
function FaceDetection({ show }: { show: boolean }) {
  const jitterRef = useRef<HTMLDivElement>(null);
  const confRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!show) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const tick = () => {
      const t = performance.now() - start;
      if (confRef.current) confRef.current.textContent = (reduce ? 0.99 : Math.min(0.99, 0.72 + (t / 650) * 0.27)).toFixed(2);
      // Frame-to-frame wobble, like a real detector re-estimating the box
      if (!reduce && jitterRef.current) {
        const jx = (Math.random() - 0.5) * 1.6;
        const jy = (Math.random() - 0.5) * 1.6;
        const js = 1 + (Math.random() - 0.5) * 0.025;
        jitterRef.current.style.transform = `translate(${jx}%, ${jy}%) scale(${js})`;
      }
    };
    tick();
    const id = setInterval(tick, 90);
    return () => clearInterval(id);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none absolute"
          style={FACE_BOX}
          initial={{ opacity: 0, scale: 1.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.15 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <div ref={jitterRef} className="absolute inset-0 transition-transform duration-75 ease-linear">
            <DetectionFrame ref={confRef} label="AI Engineer" confidence="0.72" className="inset-0" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HeroPhoto() {
  // Pointer parallax (fine pointers, no reduced motion)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 80, damping: 18 });
  const sy = useSpring(py, { stiffness: 80, damping: 18 });
  const badgeX = useTransform(sx, (v) => v * 1.8);
  const badgeY = useTransform(sy, (v) => v * 1.8);
  const ready = useIntroDone();
  const [hovered, setHovered] = useState(false);
  const [demo, setDemo] = useState(false);

  // Show the detection once after the intro so visitors discover it
  useEffect(() => {
    if (!ready) return;
    const on = setTimeout(() => setDemo(true), 1300);
    const off = setTimeout(() => setDemo(false), 3800);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, [ready]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 22);
      py.set((e.clientY / window.innerHeight - 0.5) * 22);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py]);

  return (
    <motion.div variants={photoIn} className="relative">
      <motion.div
        style={{ x: sx, y: sy }}
        className="relative h-48 w-48 sm:h-60 sm:w-60 lg:h-[380px] lg:w-[380px] xl:h-[430px] xl:w-[430px]"
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
        onClick={() => setHovered((v) => !v)}
        data-cursor="hover"
      >
        {/* Soft glow */}
        <div
          aria-hidden="true"
          className="absolute -inset-[22%] rounded-full bg-[radial-gradient(circle,rgb(34_211_238_/_0.28),rgb(139_92_246_/_0.18)_45%,transparent_70%)]"
        />
        {/* Rotating gradient ring */}
        <div
          aria-hidden="true"
          className="animate-spin-slow absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#22d3ee,#8b5cf6,#facc15,#22d3ee)] will-change-transform motion-reduce:animate-none"
        />
        {/* Photo */}
        <div className="absolute inset-[5px] overflow-hidden rounded-full border-[5px] border-navy-900 bg-navy-800 lg:inset-[6px] lg:border-[6px]">
          <Image
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            fill
            priority
            sizes="(min-width: 1280px) 430px, (min-width: 1024px) 380px, 240px"
            className="object-cover object-[50%_22%]"
          />
        </div>
        <FaceDetection show={hovered || demo} />
      </motion.div>

      <motion.div style={{ x: badgeX, y: badgeY }} className="absolute -bottom-3 -left-6 sm:-left-8 lg:bottom-4 lg:-left-12">
        <CircleBadge />
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const ready = useIntroDone();

  return (
    <section id="top" className="relative flex min-h-screen items-center pt-24 pb-16">
      <motion.div
        variants={container}
        initial="hidden"
        animate={ready ? "show" : "hidden"}
        className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10 lg:px-16"
      >
        {/* Photo: above the name on mobile, right column on desktop */}
        <div className="order-1 flex justify-center pt-4 lg:order-2 lg:justify-end lg:pt-0">
          <HeroPhoto />
        </div>

        <div className="order-2 lg:order-1">
          {profile.badge && (
            <motion.div variants={block}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300 sm:text-base">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                {profile.badge}
              </span>
            </motion.div>
          )}

          <motion.p variants={block} className="mt-8 font-mono text-lg text-slate-400 sm:text-xl">
            Hi, I&apos;m
          </motion.p>

          <h1 className="mt-2 text-7xl leading-[0.95] font-bold tracking-tighter text-white sm:text-8xl xl:text-9xl">
            <Words text={profile.name} gradient />
          </h1>

          <p className="mt-6 text-2xl font-semibold text-slate-100 sm:text-3xl lg:text-4xl">
            <Words text={profile.role} />
            <span className="sr-only"> — </span>
            <motion.span variants={block} className="mt-2 block text-xl font-medium text-slate-300 sm:text-2xl">
              {profile.headline}
            </motion.span>
          </p>

          <motion.p variants={block} className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            {profile.tagline}
          </motion.p>

          <motion.p variants={block} className="mt-6 flex items-center gap-3 font-mono text-sm text-slate-300 sm:text-base">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-yellow opacity-70 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-yellow" />
            </span>
            <span>
              <span className="text-slate-400">Currently:</span> {profile.status}
            </span>
          </motion.p>

          <motion.div variants={block} className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Magnetic className="w-full sm:w-auto">
              <a
                href="#projects"
                className="bg-gradient-accent group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-base font-semibold text-navy-950 shadow-lg shadow-accent-violet/25 transition hover:shadow-accent-violet/50 hover:brightness-110 sm:text-lg"
              >
                View Projects
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic className="w-full sm:w-auto">
              <a
                href={profile.cvUrl}
                download
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl border border-accent-yellow/40 bg-accent-yellow/[0.06] px-8 py-4 text-base font-semibold text-accent-yellow backdrop-blur-sm transition hover:border-accent-yellow/70 hover:bg-accent-yellow/10 sm:text-lg"
              >
                <DownloadIcon className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                Download CV
              </a>
            </Magnetic>
            <Magnetic className="w-full sm:w-auto">
              <a
                href="#contact"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:border-accent-cyan/50 hover:bg-white/[0.08] sm:text-lg"
              >
                Contact Me
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
