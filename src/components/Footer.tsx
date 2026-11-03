import { profile } from "@/data/portfolio";
import SocialIcons from "./SocialIcons";
import LastUpdated from "./LastUpdated";

// Evaluated when the page is statically built, i.e. at each deploy.
const BUILT_AT = new Date().toISOString();

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-900/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-10 sm:flex-row sm:px-8 lg:px-16">
        <div className="space-y-1.5 text-center sm:text-left">
          <p className="text-base text-slate-400">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p className="font-mono text-xs text-slate-400 sm:text-sm">
            Built with Next.js · deployed on Vercel · <LastUpdated iso={BUILT_AT} />
          </p>
        </div>
        <SocialIcons />
      </div>
    </footer>
  );
}
