"use client";

import { useEffect, useState } from "react";

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

function relative(from: Date, now: Date) {
  const secs = (from.getTime() - now.getTime()) / 1000;
  for (const [unit, s] of UNITS) if (Math.abs(secs) >= s) return rtf.format(Math.round(secs / s), unit);
  return "just now";
}

/**
 * "Last updated 4 Nov 2026 · 2 days ago". The date is fixed at build/deploy
 * time; the relative part is computed live in the browser and ticks every minute.
 */
export default function LastUpdated({ iso }: { iso: string }) {
  const date = new Date(iso);
  const [rel, setRel] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setRel(relative(date, new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [iso]); // eslint-disable-line react-hooks/exhaustive-deps

  const absolute = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Colombo",
  }).format(date);

  return (
    <span>
      Last updated <time dateTime={iso}>{absolute}</time>
      {rel && <span> · {rel}</span>}
    </span>
  );
}
