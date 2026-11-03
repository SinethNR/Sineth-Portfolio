"use client";

import { useSyncExternalStore } from "react";
import { INTRO_SEEN_KEY, INTRO_SKIP_CLASS } from "./intro-constants";

/**
 * Tiny shared store: becomes `true` once the opening loader has revealed the
 * page (or immediately when the loader is skipped). The hero waits on it.
 */
let done: boolean | null = null;
const listeners = new Set<() => void>();

function read() {
  if (done === null) {
    // Class is set by the inline script in <head> when the loader should not play.
    done = document.documentElement.classList.contains(INTRO_SKIP_CLASS);
  }
  return done;
}

export function markIntroDone() {
  done = true;
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useIntroDone() {
  return useSyncExternalStore(subscribe, read, () => false);
}
