import { experience, type Experience as ExperienceItem } from "@/data/portfolio";
import Section from "../Section";
import SectionHeading from "../SectionHeading";
import Reveal from "../Reveal";
import Chip from "../Chip";

const TYPE_LABEL: Record<ExperienceItem["type"], string> = {
  work: "Work",
  leadership: "Leadership",
  education: "Education",
};

const TYPE_STYLE: Record<ExperienceItem["type"], string> = {
  work: "border-accent-cyan/40 bg-accent-cyan/10 text-cyan-300",
  leadership: "border-accent-violet/40 bg-accent-violet/10 text-violet-300",
  education: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
};

export default function Experience() {
  return (
    <Section id="experience">
      <SectionHeading eyebrow="03. Experience" title="Where I've Been" />

      <ol className="relative">
        {/* Timeline line: left on mobile, centered on desktop */}
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[9px] w-px bg-gradient-to-b from-accent-cyan via-accent-violet to-transparent md:left-1/2 md:-translate-x-1/2"
        />

        {experience.map((job, i) => {
          const right = i % 2 === 1;
          return (
            <li
              key={`${job.company}-${job.role}`}
              className="relative pb-14 pl-12 last:pb-0 md:grid md:grid-cols-2 md:gap-16 md:pl-0"
            >
              {/* Dot */}
              <span
                aria-hidden="true"
                className="bg-gradient-accent absolute top-2 left-0 h-[19px] w-[19px] rounded-full border-[3px] border-navy-900 shadow-[0_0_0_5px_rgb(34_211_238_/_0.15)] md:left-1/2 md:-translate-x-1/2"
              />

              {/* Period (desktop: opposite side of card) */}
              <div className={`hidden md:block ${right ? "md:order-1 md:text-right" : "md:order-2"}`}>
                <p className="pt-1 font-mono text-lg text-accent-cyan">{job.period}</p>
                <p className="mt-1 text-base text-slate-400">{job.location}</p>
              </div>

              <Reveal className={right ? "md:order-2" : "md:order-1"}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/60 p-7 backdrop-blur-sm transition-colors hover:border-white/20 sm:p-8">
                  <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-xs tracking-wider uppercase ${TYPE_STYLE[job.type]}`}
                    >
                      {TYPE_LABEL[job.type]}
                    </span>
                    <span className="font-mono text-sm text-accent-cyan md:hidden">{job.period}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white sm:text-2xl">{job.role}</h3>
                  <p className="text-gradient mt-1 w-fit text-base font-medium sm:text-lg">{job.company}</p>
                  <p className="mt-1 text-sm text-slate-400 md:hidden">{job.location}</p>
                  <ul className="mt-5 space-y-2.5 text-base leading-relaxed text-slate-400 sm:text-lg">
                    {job.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-violet" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  {job.tech && job.tech.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {job.tech.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
