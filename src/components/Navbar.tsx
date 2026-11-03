"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, profile, sections } from "@/data/portfolio";
import { useActiveSection } from "@/lib/useActiveSection";
import SocialIcons from "./SocialIcons";
import { OPEN_PALETTE_EVENT } from "./CommandPalette";
import { SearchIcon } from "./icons";

const pad = (n: number) => String(n).padStart(2, "0");

/** "01 / 06 · Home" — current section, ticks as you scroll. */
function SectionCounter() {
  const { active } = useActiveSection();
  return (
    <span className="flex items-center gap-2 border-l border-white/10 pl-4 font-mono text-sm text-slate-400">
      <span className="relative inline-flex h-5 w-[2ch] overflow-hidden text-white tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={active}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="absolute inset-0"
          >
            {pad(active + 1)}
          </motion.span>
        </AnimatePresence>
      </span>
      <span>/ {pad(sections.length)}</span>
      <span className="hidden text-slate-300 xl:inline">· {sections[active].label}</span>
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-white/10 bg-navy-900/75 backdrop-blur-lg" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-16" aria-label="Main">
        <div className="flex items-center gap-4">
          <a href="#top" className="text-2xl font-bold tracking-tight text-white">
            {profile.firstName}
            <span className="text-gradient">.</span>
          </a>
          <SectionCounter />
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-base text-slate-400 transition-colors hover:text-white lg:px-4 lg:text-lg"
            >
              {link.label}
            </a>
          ))}
          <span className="mx-3 h-6 w-px bg-white/10" aria-hidden="true" />
          <SocialIcons />
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            aria-label="Open command palette (Ctrl+K)"
            className="ml-2 hidden items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm text-slate-300 transition hover:border-accent-cyan/50 hover:text-white lg:inline-flex"
          >
            <SearchIcon className="h-4 w-4" />
            <kbd className="font-mono text-xs">Ctrl K</kbd>
          </button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <SocialIcons />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative ml-1 inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-200 hover:bg-white/5"
          >
            <span
              className={`absolute h-0.5 w-6 rounded bg-current transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-2"
              }`}
            />
            <span className={`absolute h-0.5 w-6 rounded bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
            <span
              className={`absolute h-0.5 w-6 rounded bg-current transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-2"
              }`}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden md:hidden"
          >
            <ul className="space-y-1 px-5 pt-2 pb-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-2xl font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
