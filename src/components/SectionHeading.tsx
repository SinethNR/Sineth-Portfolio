import Reveal from "./Reveal";
import ScrambleText from "./ScrambleText";

export default function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mb-14 sm:mb-20">
      <p className="mb-4 font-mono text-base tracking-wider text-accent-cyan sm:text-lg">{eyebrow}</p>
      <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
        <ScrambleText text={title} />
      </h2>
      <div className="bg-gradient-accent mt-6 h-1.5 w-20 rounded-full" />
    </Reveal>
  );
}
