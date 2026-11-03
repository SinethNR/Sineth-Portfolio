"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { profile, sections } from "@/data/portfolio";
import { CopyIcon, DownloadIcon, GitHubIcon, HashIcon, LinkedInIcon, SearchIcon } from "./icons";

export const OPEN_PALETTE_EVENT = "open-command-palette";

type Command = {
  id: string;
  label: string;
  group: "Navigate" | "Actions" | "Links";
  icon: React.ReactNode;
  keywords?: string;
  run: () => void | "keep-open";
};

/** Ctrl/⌘ + K palette: jump to sections, copy email, open profiles, download CV. */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const lenis = useLenis();

  const close = useCallback(() => setOpen(false), []);

  const commands = useMemo<Command[]>(() => {
    const icon = "h-[18px] w-[18px]";
    return [
      ...sections.map<Command>((s) => ({
        id: `go-${s.href}`,
        label: `Go to ${s.label}`,
        group: "Navigate",
        icon: <HashIcon className={icon} />,
        run: () => {
          // Resume Lenis first: starting it later would reset (cancel) this scroll.
          if (lenis) {
            lenis.start();
            lenis.scrollTo(s.href); // section scroll-margin-top handles the navbar
          }
          else document.querySelector(s.href)?.scrollIntoView();
        },
      })),
      {
        id: "copy-email",
        label: "Copy email address",
        group: "Actions",
        keywords: profile.email,
        icon: <CopyIcon className={icon} />,
        run: () => {
          navigator.clipboard?.writeText(profile.email).then(
            () => setToast(`Copied ${profile.email}`),
            () => setToast(profile.email),
          );
          return "keep-open";
        },
      },
      {
        id: "cv",
        label: "Download CV",
        group: "Actions",
        keywords: "resume pdf",
        icon: <DownloadIcon className={icon} />,
        run: () => void window.open(profile.cvUrl, "_blank", "noopener"),
      },
      {
        id: "github",
        label: "Open GitHub",
        group: "Links",
        icon: <GitHubIcon className={icon} />,
        run: () => void window.open(profile.socials.github, "_blank", "noopener"),
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        group: "Links",
        icon: <LinkedInIcon className={icon} />,
        run: () => void window.open(profile.socials.linkedin, "_blank", "noopener"),
      },
    ];
  }, [lenis]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.group} ${c.keywords ?? ""}`.toLowerCase().includes(q));
  }, [commands, query]);

  // Global shortcut + programmatic open (navbar button)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  // Open/close side effects (only undo what opening did)
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      returnFocus.current = document.activeElement as HTMLElement | null;
      setQuery("");
      setActive(0);
      setToast("");
      lenis?.stop();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (wasOpen.current) {
      wasOpen.current = false;
      lenis?.start();
      returnFocus.current?.focus?.();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const runCommand = (c: Command) => {
    const result = c.run();
    if (result !== "keep-open") close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = filtered[active];
      if (c) runCommand(c);
    } else if (e.key === "Tab") {
      e.preventDefault(); // keep focus inside the palette
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-start justify-center bg-navy-950/70 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-navy-800/95 shadow-2xl shadow-black/50"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5">
              <SearchIcon className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search…"
                aria-label="Search commands"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={filtered[active] ? `cmd-${filtered[active].id}` : undefined}
                className="h-16 w-full bg-transparent text-lg text-white placeholder:text-slate-400 focus:outline-none"
              />
              <kbd className="hidden rounded-md border border-white/15 px-2 py-0.5 font-mono text-xs text-slate-400 sm:block">
                Esc
              </kbd>
            </div>

            <ul ref={listRef} id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
              {filtered.length === 0 && <li className="px-4 py-8 text-center text-slate-400">No matching commands</li>}
              {filtered.map((c, i) => {
                const header = c.group !== lastGroup ? c.group : null;
                lastGroup = c.group;
                return (
                  <li key={c.id} role="presentation">
                    {header && (
                      <p className="px-3 pt-3 pb-1.5 font-mono text-xs tracking-wider text-slate-400 uppercase">{header}</p>
                    )}
                    <div
                      id={`cmd-${c.id}`}
                      role="option"
                      aria-selected={i === active}
                      data-index={i}
                      onMouseMove={() => setActive(i)}
                      onClick={() => runCommand(c)}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-base transition-colors ${
                        i === active ? "bg-white/[0.07] text-white" : "text-slate-300"
                      }`}
                    >
                      <span className={i === active ? "text-accent-cyan" : "text-slate-400"}>{c.icon}</span>
                      {c.label}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-3 font-mono text-xs text-slate-400">
              <span aria-live="polite" className="truncate text-emerald-300">
                {toast}
              </span>
              <span className="hidden shrink-0 sm:block">↑↓ navigate · ↵ select · esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
