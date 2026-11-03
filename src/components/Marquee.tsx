import { SparkleIcon } from "./icons";

function Row({ items, outline, reverse }: { items: string[]; outline?: boolean; reverse?: boolean }) {
  const list = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span
            className={`px-6 text-3xl font-semibold tracking-tight whitespace-nowrap sm:px-8 sm:text-5xl ${
              outline ? "text-transparent [-webkit-text-stroke:1px_rgb(203_213_225_/_0.45)]" : "text-slate-100"
            }`}
          >
            {item}
          </span>
          <SparkleIcon className={`h-5 w-5 shrink-0 sm:h-7 sm:w-7 ${outline ? "text-accent-violet" : "text-accent-yellow"}`} />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`flex w-max will-change-transform motion-reduce:animate-none ${
        reverse ? "animate-marquee-reverse" : "animate-marquee"
      }`}
    >
      {list(false)}
      {list(true)}
    </div>
  );
}

/** Infinite skills band. Pure CSS transform animation; static for reduced motion. */
export default function Marquee({ items }: { items: string[] }) {
  return (
    <div
      aria-label="Skills"
      className="relative space-y-4 overflow-hidden border-y border-white/10 bg-navy-900/50 py-8 backdrop-blur-sm [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] sm:py-10"
    >
      <Row items={items} />
      <Row items={[...items].reverse()} outline reverse />
    </div>
  );
}
