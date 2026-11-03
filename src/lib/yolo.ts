"use client";

import { useSyncExternalStore } from "react";

/** Easter-egg state: true for a few seconds after someone types "yolo". */
let active = false;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const YOLO_DURATION = 3000;

export function triggerYolo() {
  active = true;
  emit();
  clearTimeout(timer);
  timer = setTimeout(() => {
    active = false;
    emit();
  }, YOLO_DURATION);
}

export function useYoloActive() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => active,
    () => false,
  );
}

/** Deterministic pseudo-random number in [0, 1) from a string — stable boxes per project. */
export function seeded(key: string, salt = 0) {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}
