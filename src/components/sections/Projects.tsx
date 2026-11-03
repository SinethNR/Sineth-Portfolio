"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { projects, type Project, type ProjectCategory } from "@/data/portfolio";
import { seeded, useYoloActive } from "@/lib/yolo";
import Section from "../Section";
import SectionHeading from "../SectionHeading";
import Chip from "../Chip";
import DetectionFrame from "../Detection";
import ProjectModal, { mediaLayoutId } from "../ProjectModal";
import { ArrowRightIcon } from "../icons";

type Filter = "All" | ProjectCategory;
const CATEGORY_ORDER: ProjectCategory[] = ["AI", "CV", "Web", "Mobile", "Hardware"];

const YOLO_CLASS: Record<ProjectCategory, string> = {
  AI: "ai_system",
  CV: "cv_model",
  Web: "web_app",
  Mobile: "mobile_app",
  Hardware: "robot",
};

const cardMotion = {
  layout: true,
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96 },
  transition: { type: "spring", stiffness: 260, damping: 28 },
} as const;

/** Easter egg overlay: a stable, per-project YOLO box over the card image. */
function YoloOverlay({ project, index }: { project: Project; index: number }) {
  const active = useYoloActive();
  const r = (salt: number) => seeded(project.slug, salt);
  const box = {
    left: `${8 + r(1) * 14}%`,
    top: `${14 + r(2) * 14}%`,
    width: `${58 + r(3) * 18}%`,
    height: `${50 + r(4) * 18}%`,
  };
  const conf = (0.86 + r(5) * 0.13).toFixed(2);
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24, delay: index * 0.07 }}
        >
          <DetectionFrame label={YOLO_CLASS[project.categories[0]]} confidence={conf} style={box} size="sm" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Categories({ project }: { project: Project }) {
  return (
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
  );
}

function FeaturedCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  return (
    <motion.button
      {...cardMotion}
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      data-cursor="view"
      className="group grid w-full overflow-hidden rounded-3xl border border-white/10 bg-navy-800/60 text-left backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-accent-cyan/40 hover:shadow-[0_20px_60px_-20px_rgb(139_92_246_/_0.55)] md:grid-cols-[1.25fr_1fr]"
    >
      <motion.div
        layoutId={mediaLayoutId(project.slug)}
        className="relative aspect-[16/10] overflow-hidden bg-navy-900 md:aspect-auto md:min-h-[380px]"
      >
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          sizes="(min-width: 1280px) 640px, (min-width: 768px) 55vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute top-4 left-4 rounded-full bg-accent-yellow px-3 py-1 font-mono text-xs font-bold tracking-wider text-navy-950 uppercase">
          Featured
        </span>
        <YoloOverlay project={project} index={index} />
      </motion.div>
      <div className="flex flex-col p-7 sm:p-10">
        <Categories project={project} />
        <h3 className="mt-5 text-3xl font-bold tracking-tight text-white transition-colors group-hover:text-accent-cyan sm:text-4xl">
          {project.title}
        </h3>
        <p className="mt-3 text-lg leading-relaxed text-slate-300 sm:text-xl">{project.hook}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
        <span className="mt-auto inline-flex items-center gap-2 pt-8 text-base font-semibold text-accent-cyan">
          View details
          <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </motion.button>
  );
}

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  return (
    <motion.button
      {...cardMotion}
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      data-cursor="view"
      className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-navy-800/60 text-left backdrop-blur-sm transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-1.5 hover:border-accent-cyan/40 hover:shadow-[0_16px_50px_-16px_rgb(139_92_246_/_0.5)]"
    >
      <motion.div
        layoutId={mediaLayoutId(project.slug)}
        style={{ borderRadius: "24px 24px 0 0" }}
        className="relative aspect-[16/10] w-full overflow-hidden bg-navy-900"
      >
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <YoloOverlay project={project} index={index} />
      </motion.div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <Categories project={project} />
        <h3 className="mt-4 text-2xl font-semibold text-white transition-colors group-hover:text-accent-cyan">{project.title}</h3>
        <p className="mt-2 flex-1 text-base leading-relaxed text-slate-400 sm:text-lg">{project.hook}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech.slice(0, 3).map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const close = useCallback(() => setSelected(null), []);

  const filters = useMemo<Filter[]>(
    () => ["All", ...CATEGORY_ORDER.filter((c) => projects.some((p) => p.categories.includes(c)))],
    [],
  );
  const visible = projects.filter((p) => filter === "All" || p.categories.includes(filter));
  const featured = visible.find((p) => p.featured);
  const rest = visible.filter((p) => p !== featured);

  return (
    <Section id="projects">
      <SectionHeading eyebrow="04. Projects" title="Things I've Built" />

      <div role="group" aria-label="Filter projects" className="mb-10 flex flex-wrap gap-2">
        {filters.map((f) => {
          const activeF = f === filter;
          const count = f === "All" ? projects.length : projects.filter((p) => p.categories.includes(f)).length;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={activeF}
              onClick={() => setFilter(f)}
              className={`relative rounded-full px-5 py-2.5 text-base font-medium transition-colors ${
                activeF ? "text-navy-950" : "text-slate-300 hover:text-white"
              }`}
            >
              {activeF && (
                <motion.span
                  layoutId="project-filter-pill"
                  className="bg-gradient-accent absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {!activeF && <span className="absolute inset-0 rounded-full border border-white/15" />}
              <span className="relative">
                {f} <span className={activeF ? "text-navy-950/70" : "text-slate-400"}>{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="space-y-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {featured && (
            <FeaturedCard key={featured.slug} project={featured} index={0} onOpen={() => setSelected(featured)} />
          )}
        </AnimatePresence>

        <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {rest.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i + 1} onOpen={() => setSelected(p)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <ProjectModal project={selected} onClose={close} />
    </Section>
  );
}
