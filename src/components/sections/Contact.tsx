"use client";

import { useEffect, useState } from "react";
import { contact, profile } from "@/data/portfolio";
import Reveal from "../Reveal";
import { ArrowUpRightIcon, CheckIcon, CopyIcon, GitHubIcon, LinkedInIcon, SendIcon } from "../icons";

/** Live clock in the profile's time zone (client-only to avoid hydration mismatch). */
function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: profile.timeZone,
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      }).format(now)
    : "--:--:--";

  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg text-slate-400 sm:text-xl">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </span>
      <time className="font-mono text-slate-100 tabular-nums" suppressHydrationWarning>
        {time}
      </time>
      <span>in {profile.timeZoneLabel}</span>
    </p>
  );
}

const socialRows = [
  {
    label: "LinkedIn",
    handle: profile.socials.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "").replace(/\/$/, ""),
    href: profile.socials.linkedin,
    Icon: LinkedInIcon,
  },
  {
    label: "GitHub",
    handle: profile.socials.github.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, ""),
    href: profile.socials.github,
    Icon: GitHubIcon,
  },
];

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-navy-950/60 px-5 py-4 text-base text-white placeholder:text-slate-600 transition-colors outline-none focus:border-accent-cyan/60 focus:bg-navy-950/80 sm:text-lg";

function ContactForm() {
  const [topic, setTopic] = useState(contact.topics[0]);
  const [sent, setSent] = useState(false);

  // No backend: compose the message in the visitor's email app.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = `[${topic}] Portfolio message from ${name}`;
    const body = `${message}\n\n— ${name}\n${email}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-white/10 bg-navy-800/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-9"
    >
      <h3 className="text-2xl font-semibold text-white sm:text-3xl">Send a message</h3>

      <fieldset className="mt-7">
        <legend className="mb-3 font-mono text-sm tracking-wider text-slate-400 uppercase">What&apos;s this about?</legend>
        <div className="flex flex-wrap gap-2.5">
          {contact.topics.map((t) => {
            const selected = t === topic;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={selected}
                onClick={() => setTopic(t)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition sm:text-base ${
                  selected
                    ? "bg-gradient-accent border-transparent text-navy-950"
                    : "border-white/15 text-slate-300 hover:border-accent-cyan/50 hover:text-white"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" className={inputClass} />
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            className={inputClass}
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell me about your project or role…"
          className={`${inputClass} resize-none`}
          data-lenis-prevent
        />
      </label>

      <button
        type="submit"
        className="bg-gradient-accent group mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-base font-semibold text-navy-950 shadow-lg shadow-accent-violet/25 transition hover:shadow-accent-violet/50 hover:brightness-110 sm:text-lg"
      >
        Send message
        <SendIcon className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
      <p className="mt-3 min-h-6 text-center text-sm text-slate-400" aria-live="polite">
        {sent ? "Opening your email app…" : "Opens in your email app."}
      </p>
    </form>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const words = contact.heading.split(" ");
  const plain = words.slice(0, -2).join(" ");
  const accent = words.slice(-2).join(" ");

  return (
    <section id="contact" className="relative flex min-h-screen flex-col justify-center py-24 sm:py-32">
      <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-16">
        <Reveal>
          <p className="mb-4 font-mono text-base tracking-wider text-accent-cyan sm:text-lg">05. Contact</p>
          <h2 className="text-5xl leading-[1.02] font-bold tracking-tight text-white sm:text-7xl lg:text-8xl">
            {plain} <span className="text-gradient">{accent}</span>
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-400 sm:text-xl">{contact.text}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="text-2xl font-semibold break-all text-white decoration-accent-cyan/60 underline-offset-8 transition-colors hover:text-accent-cyan hover:underline sm:text-3xl lg:text-4xl"
            >
              {profile.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label={copied ? "Email copied" : "Copy email address"}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 text-slate-300 transition hover:border-accent-cyan/50 hover:bg-white/5 hover:text-white"
            >
              {copied ? <CheckIcon className="h-5 w-5 text-emerald-400" /> : <CopyIcon className="h-5 w-5" />}
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? "Email copied to clipboard" : ""}
            </span>
          </div>

          <div className="mt-6">
            <LocalTime />
          </div>

          <ul className="mt-12 border-t border-white/10">
            {socialRows.map(({ label, handle, href, Icon }) => (
              <li key={label} className="border-b border-white/10">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 py-6"
                >
                  <Icon className="h-6 w-6 shrink-0 text-slate-400 transition-colors group-hover:text-accent-cyan" />
                  <span className="text-xl font-semibold text-white sm:text-2xl">{label}</span>
                  <span className="hidden truncate font-mono text-base text-slate-400 sm:inline">{handle}</span>
                  <ArrowUpRightIcon className="ml-auto h-7 w-7 shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent-cyan" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.12} className="lg:pt-8">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
