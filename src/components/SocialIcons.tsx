import { profile } from "@/data/portfolio";
import { GitHubIcon, LinkedInIcon } from "./icons";
import Magnetic from "./Magnetic";

const linkClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/5 hover:text-accent-cyan";

export default function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Magnetic strength={0.45}>
      <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={linkClass}>
        <GitHubIcon className="h-[22px] w-[22px]" />
      </a>
      </Magnetic>
      <Magnetic strength={0.45}>
      <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={linkClass}>
        <LinkedInIcon className="h-[21px] w-[21px]" />
      </a>
      </Magnetic>
    </div>
  );
}
