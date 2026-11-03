"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import { MotionConfig } from "framer-motion";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Lenis stays mounted (so children never remount); with reduced motion it
  // simply stops smoothing and anchor jumps become instant.
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: !reduceMotion,
        // No offset: Lenis honours each section's scroll-margin-top (5rem = navbar height)
        anchors: { immediate: reduceMotion },
      }}
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}
