import { skills } from "@/data/portfolio";
import Section from "../Section";
import SectionHeading from "../SectionHeading";
import Reveal from "../Reveal";
import Chip from "../Chip";

export default function Skills() {
  return (
    <Section id="skills">
      <SectionHeading eyebrow="02. Skills" title="What I Work With" />

      <div className="grid gap-6 md:grid-cols-2">
        {skills.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.08} className="h-full">
            <div className="h-full rounded-3xl bg-white/10 p-px transition-colors duration-300 hover:bg-gradient-to-br hover:from-accent-cyan hover:to-accent-violet">
              <div className="h-full rounded-[23px] bg-navy-800/95 p-7 sm:p-9">
                <h3 className="mb-6 text-2xl font-semibold text-white sm:text-3xl">{group.title}</h3>
                <div className="flex flex-wrap gap-2.5">
                  {group.skills.map((skill) => (
                    <Chip key={skill}>{skill}</Chip>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
