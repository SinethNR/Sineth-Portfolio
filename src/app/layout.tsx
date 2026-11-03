import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Background from "@/components/Background";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";
import ScrollRail from "@/components/ScrollRail";
import CommandPalette from "@/components/CommandPalette";
import YoloEasterEgg from "@/components/YoloEasterEgg";
import { profile, site } from "@/data/portfolio";
import { introSkipScript } from "@/lib/intro-constants";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: profile.name, url: profile.socials.linkedin }],
  creator: profile.name,
  alternates: { canonical: "/" },
  icons: { icon: "/icon.svg" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.name,
    title: site.title,
    description: site.description,
    images: [{ url: profile.photo, width: 765, height: 738, alt: `Portrait of ${profile.name}` }],
  },
  twitter: {
    card: "summary",
    title: site.title,
    description: site.description,
    images: [profile.photo],
  },
};

/** schema.org Person — helps search engines show the right name, role and profiles */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: site.description,
  url: site.url,
  image: new URL(profile.photo, site.url).toString(),
  worksFor: { "@type": "Organization", name: "Tracified (TilliT AI)" },
  alumniOf: { "@type": "CollegeOrUniversity", name: profile.university },
  knowsAbout: ["Computer Vision", "YOLOv11", "YOLOv8", "LangChain", "LangGraph", "LLM agents", "React", "Node.js", "Python"],
  sameAs: [profile.socials.github, profile.socials.linkedin],
};

export const viewport: Viewport = {
  themeColor: "#0a0f1f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the intro script below and browser extensions
    // (Grammarly, ColorZilla, …) add attributes to <html>/<body> before React hydrates.
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introSkipScript }} />
      </head>
      <body suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <Background />
        <SmoothScroll>
          <Loader />
          <ScrollRail />
          <CommandPalette />
          <YoloEasterEgg />
          {children}
        </SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
