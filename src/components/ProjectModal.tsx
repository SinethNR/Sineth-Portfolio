"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import type { Project } from "@/data/portfolio";
import Chip from "./Chip";
import { CloseIcon, ExternalLinkIcon, GitHubIcon, LinkedInIcon } from "./icons";

/** Shared-element id: the card image morphs into the modal image (framer-motion layoutId). */
export const mediaLayoutId = (slug: string) => `project-media-${slug}`;

const linkClass =
  "inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-base font-semibold text-white transition hover:border-accent-cyan/50 hover:bg-white/[0.08]";

export default function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!project) return;
    const opener = document.activeElement as HTMLElement | null;
    lenis?.stop();
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !dialogRef.current) return;
      // Minimal focus trap
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      opener?.focus?.({ preventScroll: true });
    };
  }, [project, lenis, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25, delay: 0.1 } }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* Not overflow-hidden: the shared image must be free to fly in from the card */}
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col"
          >
            <motion.div
              layoutId={mediaLayoutId(project.slug)}
              style={{ borderRadius: "24px 24px 0 0" }}
              className="relative aspect-[16/9] max-h-[38vh] w-full shrink-0 overflow-hidden bg-navy-900"
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <Image src={project.image} alt={`${project.title} preview`} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
            </motion.div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="absolute top-4 right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-navy-900/80 text-slate-200 backdrop-blur transition hover:border-accent-cyan/60 hover:text-white"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.12, duration: 0.3 } }}
              exit={{ opacity: 0, y: 12, transition: { duration: 0.15 } }}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-b-3xl border-x border-b border-white/10 bg-navy-800 p-6 shadow-2xl shadow-black/60 sm:p-9"
              data-lenis-prevent
            >
              <div className="flex flex-wrap items-center gap-2">
                {project.categories.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-accent-cyan/40 bg-accent-cyan/10 px-2.5 py-0.5 font-mono text-xs tracking-wider text-cyan-300 uppercase"
                  >
                    {c}
                  </span>
                ))}
                {project.note && <span className="font-mono text-xs text-slate-400">{project.note}</span>}
              </div>

              <h3 id="project-modal-title" className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {project.title}
              </h3>
              <p className="text-gradient mt-2 w-fit text-lg font-medium sm:text-xl">{project.hook}</p>
              <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">{project.description}</p>

              {project.role && (
                <>
                  <h4 className="mt-8 font-mono text-sm tracking-wider text-slate-400 uppercase">My role</h4>
                  <p className="mt-3 text-base text-slate-300 sm:text-lg">{project.role}</p>
                </>
              )}

              <h4 className="mt-8 font-mono text-sm tracking-wider text-slate-400 uppercase">Highlights</h4>
              <ul className="mt-3 space-y-2.5 text-base text-slate-300 sm:text-lg">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-yellow" />
                    {h}
                  </li>
                ))}
              </ul>

              <h4 className="mt-8 font-mono text-sm tracking-wider text-slate-400 uppercase">Tech</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <GitHubIcon className="h-5 w-5" /> GitHub
                  </a>
                )}
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <ExternalLinkIcon className="h-5 w-5" /> Live demo
                  </a>
                )}
                {project.linkedinPost && (
                  <a href={project.linkedinPost} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <LinkedInIcon className="h-5 w-5" /> LinkedIn post
                  </a>
                )}
                {!project.github && !project.demo && !project.linkedinPost && (
                  <p className="text-base text-slate-400">Code is private — happy to walk through it in an interview.</p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
