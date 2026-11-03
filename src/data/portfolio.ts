/**
 * ─────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — edit everything on the site from here.
 *  Search for "TODO" to find placeholders that still need you.
 * ─────────────────────────────────────────────────────────────
 */

// ---------- Types ----------
export type Profile = {
  name: string;
  firstName: string;
  role: string;
  headline: string;
  tagline: string;
  university: string;
  degree: string;
  location: string;
  email: string;
  photo: string;
  cvUrl: string;
  /** Short "Currently: …" status shown in the hero */
  status: string;
  /** IANA time zone used for the live clock in the Contact section */
  timeZone: string;
  timeZoneLabel: string;
  /** Hero badge; set to "" to hide */
  badge: string;
  socials: { github: string; linkedin: string };
};

export type Fact = { label: string; value: string };
export type Stat = { value: number; suffix?: string; label: string };
export type SkillGroup = { title: string; skills: string[] };

export type Experience = {
  type: "work" | "leadership" | "education";
  role: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
  tech?: string[];
};

export type ProjectCategory = "AI" | "CV" | "Web" | "Mobile" | "Hardware";

export type Project = {
  slug: string;
  title: string;
  /** One-line hook shown on cards */
  hook: string;
  /** 2–3 sentences shown in the details modal */
  description: string;
  /** Exactly what's true — real numbers only */
  highlights: string[];
  tech: string[];
  categories: ProjectCategory[];
  github?: string;
  demo?: string;
  linkedinPost: string;
  /** Placeholder SVG for now. Drop public/projects/<slug>.jpg in and change the extension here. */
  image: string;
  featured?: boolean;
  /** Small note shown on the card, e.g. "Private · company project" */
  note?: string;
  /** Your part in a team project (shown in the details modal). "" = TODO */
  role?: string;
};

export type NavLink = { label: string; href: string };

// ---------- Site / SEO ----------
export const site = {
  // TODO: set to your deployed URL (used for canonical + social preview links)
  url: "https://sinethnr.github.io",
  title: "Sineth Nimhan — AI Engineer (Computer Vision & LLM Agents)",
  description:
    "Junior AI Engineer from Sri Lanka. I train YOLOv8/v11 computer vision models, build LLM agents with LangChain and LangGraph, and ship them as production pipelines and full-stack apps. Currently at TilliT.",
  keywords: [
    "AI Engineer",
    "Junior AI Engineer",
    "Computer Vision",
    "YOLOv11",
    "YOLOv8",
    "LangChain",
    "LangGraph",
    "LLM agents",
    "Python",
    "React",
    "Sri Lanka",
    "University of Moratuwa",
  ],
};

// ---------- Profile ----------
export const profile: Profile = {
  name: "Sineth Nimhan",
  firstName: "Sineth",
  role: "AI Engineer",
  headline: "Computer vision, LLM agents, and the software around them.",
  tagline:
    "I train YOLOv8/v11 models, build LLM agents with LangChain and LangGraph, and turn them into pipelines and apps that run in production — not just in a notebook.",
  university: "University of Moratuwa",
  degree: "BSc (Hons) Information Technology",
  location: "Sri Lanka",
  email: "rdsnimhan@gmail.com",
  photo: "/me.jpg",
  cvUrl: "/cv.pdf", // TODO: add public/cv.pdf
  status: "building AI traceability with YOLOv11 @ TilliT",
  timeZone: "Asia/Colombo",
  timeZoneLabel: "Moratuwa, Sri Lanka",
  badge: "Open to AI Engineer roles",
  socials: {
    github: "https://github.com/SinethNR",
    linkedin: "https://www.linkedin.com/in/sineth-nimhan-4866b7264",
  },
};

// ---------- About ----------
export const about = {
  paragraphs: [
    "I'm an AI Engineer at Tracified (TilliT AI), where I build AI traceability pipelines and YOLOv11 verification engines for global supply-chain compliance, and LLM-based agents for blockchain-powered supply-chain solutions.",
    "My core is computer vision — dataset preparation, YOLOv8/v11 training, image processing and evaluation — and LLM agents built with LangChain and LangGraph. I care about the unglamorous part too: wiring models into pipelines, APIs and interfaces that other people can actually use.",
    "I started out building full-stack and mobile apps with React, React Native, Node.js and TypeScript, so I can take a model from training run to a shipped product on my own. I'm finishing a BSc (Hons) in Information Technology at the University of Moratuwa (2023 – 2027) and looking for a full-time AI Engineer role.",
  ],
  facts: [
    { label: "Now", value: "AI Engineer · TilliT (Tracified)" },
    { label: "Focus", value: "Computer Vision · LLM Agents · AI Pipelines" },
    { label: "Education", value: "BSc (Hons) IT · University of Moratuwa" },
    { label: "Based in", value: "Sri Lanka" },
  ] satisfies Fact[],
};

// ---------- Skills ----------
export const skills: SkillGroup[] = [
  {
    title: "Computer Vision",
    skills: ["YOLOv11", "YOLOv8", "Model Training", "Image Processing", "Dataset Preparation", "Python"],
  },
  {
    title: "LLMs & Agents",
    skills: ["LangChain", "LangGraph", "LLM Agents", "Prompt Engineering", "AI Pipelines"],
  },
  {
    title: "Full-Stack",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "Express", "Tailwind CSS"],
  },
  {
    title: "Mobile & Tools",
    skills: ["React Native", "Expo", "Redux Toolkit", "Git", "GitHub", "Figma"],
  },
];

/** Words that scroll in the marquee band (defaults to every skill) */
export const marquee: string[] = [
  "YOLOv11",
  "Computer Vision",
  "LangGraph",
  "LangChain",
  "LLM Agents",
  "Python",
  "YOLOv8",
  "AI Pipelines",
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "React Native",
];

// ---------- Experience (newest first) ----------
const TILLIT_START = new Date(2026, 0, 1); // January 2026

export const experience: Experience[] = [
  {
    type: "work",
    role: "AI Engineer",
    company: "Tracified · TilliT AI",
    period: "Jan 2026 — Present",
    location: "Sri Lanka",
    bullets: [
      "Building AI traceability pipelines and YOLOv11 verification engines for global supply-chain compliance.",
      "Training computer vision models and the image-processing steps around them.",
      "Developing LLM features and intelligent agents for blockchain-powered supply-chain solutions.",
      // TODO: add a measurable result (accuracy / mAP, throughput, time saved…)
    ],
    tech: ["Python", "YOLOv11", "Computer Vision", "LLM Agents"],
  },
  {
    type: "leadership",
    role: "Co-Director, Information Management & Marketing",
    company: "OREPA — Old Royalists Engineering Professionals' Association",
    period: "Apr 2026 — Present",
    location: "Colombo, Sri Lanka",
    bullets: ["Published the OREPA Newsletter July edition."],
  },
  {
    type: "leadership",
    role: "HR Member",
    company: "MoraSpirit",
    period: "May 2023 — Oct 2025",
    location: "Moratuwa, Sri Lanka",
    bullets: [
      "Organised the first-ever Epilogue Musical Concert (2023).",
      "Covered SLUG 2023 at the Eastern University, Batticaloa.",
      "Won the 2023 Rowing Regatta as a rower.",
    ],
  },
  {
    type: "leadership",
    role: "IEEE IAS Chapter Member",
    company: "IEEE Industry Applications Society — University of Moratuwa",
    period: "Oct 2023 — Oct 2024",
    location: "Moratuwa, Sri Lanka",
    bullets: ["Contributed to IEEE Open Week 2024."],
  },
  {
    type: "leadership",
    role: "Rotaractor",
    company: "Rotaract Club of University of Moratuwa",
    period: "Apr 2023 — Jul 2024",
    location: "Moratuwa, Sri Lanka",
    bullets: [
      "Zoozanthale '23 and Vanguard Gaming Competition 2024.",
      "Cancer Hearts fund-raising project — Book Fair, BMICH 2023.",
    ],
  },
  {
    type: "education",
    role: "BSc (Hons) Information Technology",
    company: "University of Moratuwa",
    period: "2023 — 2027",
    location: "Moratuwa, Sri Lanka",
    bullets: ["Machine learning, data structures & algorithms, and software engineering."],
  },
];

// ---------- Projects ----------
// Images: placeholders live at public/projects/<slug>.svg.
// To use a real image, add public/projects/<slug>.jpg and change ".svg" → ".jpg" below.
export const projects: Project[] = [
  {
    slug: "ai-traceability",
    title: "AI Traceability Engine",
    hook: "YOLOv11 verification for supply-chain traceability.",
    description:
      "My current work at Tracified (TilliT AI): AI traceability pipelines and YOLOv11 verification engines for global supply-chain compliance, on a blockchain-powered supply-chain platform. Alongside the vision work I build LLM-based agents for the same platform.",
    highlights: [
      "YOLOv11 verification engine for supply-chain compliance",
      "Model training and image processing, from dataset to pipeline",
      "LLM agents for blockchain-powered supply-chain workflows",
      // TODO: replace one of these with a real metric (e.g. mAP@50, images/sec)
    ],
    tech: ["Python", "YOLOv11", "Computer Vision", "LLM Agents"],
    categories: ["AI", "CV"],
    linkedinPost: "", // TODO: paste the LinkedIn post URL
    image: "/projects/ai-traceability.svg",
    featured: true,
    note: "Private · company project",
  },
  {
    slug: "resource-hub",
    title: "Resource Hub",
    hook: "Open-source resource management platform, built for a WSO2 competition.",
    description:
      "A full-stack platform for managing an organisation's assets, meals, maintenance requests and users, with separate dashboards for admins and staff. Built by FiveStackDev, a 5-member team led by Minul (github.com/Minulck), for a WSO2 competition — a Ballerina backend on MySQL with a React frontend.",
    highlights: [
      "5-member team project; I built the Asset Management UI — asset table, asset pop-ups and the user asset-request flow",
      "Ballerina backend split into 5 services — main, reports, dashboard, notifications, auth — on MySQL",
      "JWT auth with role-based access (Admin, SuperAdmin, Manager, User), SMTP notifications and scheduled PDF reports",
    ],
    tech: ["Ballerina", "MySQL", "React", "Material UI", "Tailwind CSS", "JWT"],
    categories: ["Web"],
    // From the commit history (12 frontend commits). TODO: confirm or expand.
    role: "Frontend — Asset Management module: asset table, asset pop-ups, user asset-request button and request table.",
    github: "https://github.com/FiveStackDev",
    demo: "https://fivestackdev-resourcehub.vercel.app/login",
    linkedinPost: "", // TODO
    image: "/projects/resource-hub.svg",
    note: "Team project · 5 members", // TODO: add the competition name / result
  },
  {
    slug: "bus-lanka",
    title: "Bus Lanka",
    hook: "Offline, trilingual long-distance bus guide for Sri Lanka.",
    description:
      "A React Native (Expo) app that answers \"which bus, when, and how much\" between Sri Lankan cities — with no internet connection needed. Every route carries its stops, distance, travel time, NTC fares by bus class, boarding points and known departures, in Sinhala, English and Tamil.",
    highlights: [
      "52 long-distance routes across 49 cities, bundled for offline use",
      "Full-route NTC fares for normal, semi-luxury and luxury (July 2026 rates)",
      "Sinhala, English and Tamil UI, with expressway and night-bus views",
    ],
    tech: ["React Native", "Expo", "JavaScript", "React Native Web"],
    categories: ["Mobile"],
    github: "https://github.com/SinethNR/bus-lanka",
    linkedinPost: "", // TODO
    image: "/projects/bus-lanka.svg",
  },
  {
    slug: "lexhub",
    title: "LexHUB",
    hook: "Intellectual-property law platform with an AI legal assistant.",
    description:
      "A web platform for Sri Lankan intellectual-property law: statute search, an AI legal-assistant chat, lawyer consultation booking and a community forum. Built as a team project; I worked on the React + TypeScript frontend.",
    highlights: [
      "UI in English, Sinhala and Tamil",
      "Role-based dashboards for students, lawyers and admins",
      "PDF report export with jsPDF and an Express mock API for local development",
    ],
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Express"],
    categories: ["Web", "AI"],
    role: "Frontend — React + TypeScript UI.",
    github: "https://github.com/SinethNR/lexhub-demo",
    demo: "https://lexhub-frontdemo.vercel.app",
    linkedinPost: "", // TODO
    image: "/projects/lexhub.svg",
  },
  {
    slug: "royallive-mobile",
    title: "RoyalLIVE",
    hook: "Sports hub for Royal College Colombo.",
    description:
      "A mobile sports hub for Royal College Colombo — match schedules, scores and media for students, alumni and fans. Built with Expo Router.",
    highlights: [
      "Tabbed app: Home, Sports, Hub and Profile",
      "File-based routing with Expo Router",
      "Haptics and Reanimated for native-feeling interactions",
    ],
    tech: ["React Native", "Expo Router", "TypeScript", "Reanimated"],
    categories: ["Mobile"],
    github: "https://github.com/SinethNR/RoyalLive-Mobile",
    linkedinPost: "", // TODO
    image: "/projects/royallive-mobile.svg",
  },
  {
    slug: "luigi",
    title: "Luigi",
    hook: "Raspberry Pi smart car with a GPT voice assistant.",
    description:
      "A team prototype of a Raspberry Pi–powered smart car you can talk to: speech recognition feeds GPT-3.5-turbo, and replies are spoken back with OpenAI text-to-speech. Around it the team tested the car's hardware — an MPU-6000 accelerometer/gyroscope, signal lights and USB audio — with an ESP32 remote and an emotion system planned.",
    highlights: [
      "Voice loop: speech-to-text → GPT-3.5-turbo → OpenAI TTS",
      "Hardware tests on Raspberry Pi: MPU-6000 IMU, signal lights, USB mic and speaker",
      "Python ↔ C inter-process communication experiments for real-time control",
    ],
    tech: ["Raspberry Pi", "Python", "OpenAI API", "ESP32", "C"],
    categories: ["Hardware", "AI"],
    role: "", // TODO: describe your part (the repo's commits are by a teammate)
    github: "https://github.com/SinethNR/Luigi",
    linkedinPost: "", // TODO
    image: "/projects/luigi.svg",
    note: "Team project · prototype",
  },
];

// ---------- Stats (real numbers only) ----------
const monthsSince = (start: Date) => {
  const now = new Date();
  return (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1;
};

export const stats: Stat[] = [
  { value: monthsSince(TILLIT_START), label: "Months as an AI Engineer at TilliT" },
  { value: projects.length, label: "Projects on this page" },
  { value: 13, label: "Public GitHub repositories" }, // non-fork repos, Nov 2026
  { value: 52, label: "Bus routes mapped in Bus Lanka" },
  // TODO: add a model metric when you can share one, e.g. { value: 92, suffix: "%", label: "mAP@50" }
];

// ---------- Contact ----------
export const contact = {
  heading: "Let's build what's next.",
  text: "Hiring for an AI Engineer — computer vision, LLM agents or AI pipelines? I'd like to hear about it.",
  topics: ["AI Engineer role", "Computer vision", "LLM agents", "Just saying hi"],
};

// ---------- Navigation ----------
export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

/** Sections tracked by the left-side scroll progress rail and the command palette */
export const sections = [{ label: "Home", href: "#top" }, ...navLinks];
