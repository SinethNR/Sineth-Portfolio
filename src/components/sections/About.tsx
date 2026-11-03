import { about, stats } from "@/data/portfolio";
import Stats from "../Stats";
import Section from "../Section";
import SectionHeading from "../SectionHeading";
import Reveal from "../Reveal";

export default function About() {
  return (
    <Section id="about">
      <SectionHeading eyebrow="01. About" title="About Me" />

      <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <Reveal className="space-y-6 text-lg leading-relaxed text-slate-300 sm:text-xl lg:text-[1.4rem] lg:leading-relaxed">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="rounded-3xl border border-white/10 bg-navy-800/60 p-7 backdrop-blur-sm sm:p-9">
            {about.facts.map((fact, i) => (
              <div
                key={fact.label}
                className={`flex flex-col gap-1.5 py-5 ${i !== 0 ? "border-t border-white/10" : "pt-0"} ${
                  i === about.facts.length - 1 ? "pb-0" : ""
                }`}
              >
                <dt className="font-mono text-sm tracking-wider text-slate-400 uppercase">{fact.label}</dt>
                <dd className="text-lg font-medium text-slate-100 sm:text-xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <Reveal className="mt-14 sm:mt-20">
        <Stats stats={stats} />
      </Reveal>
    </Section>
  );
}
