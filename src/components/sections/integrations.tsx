"use client";

import { Lock, Zap } from "lucide-react";
import { AnimatePresence, motion, useInView, } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { BrandMark } from "@/components/brand";
import type { AppSlug } from "@/lib/site";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const DETAILS: {
  slug: AppSlug;
  name: string;
  tint: string;
  summary: string;
  can: { title: string; text: string }[];
  example: string;
  access: string;
}[] = [
  {
    slug: "gmail",
    name: "Gmail",
    tint: "#ea4335",
    summary: "Send the emails your workflows prepare.",
    can: [
      { title: "Send reports and replies", text: "To customers, your team or a mailing list" },
      { title: "Formatted or plain", text: "Headings and tables, or simple text" },
    ],
    example: "Email the Monday sales report to the team",
    access: "Send-only. AgentOS cannot read your inbox.",
  },
  {
    slug: "googlesheets",
    name: "Google Sheets",
    tint: "#0f9d58",
    summary: "Use your spreadsheets as the source and the record.",
    can: [
      { title: "Read rows", text: "Sales, stock, leads or any table you keep" },
      { title: "Add rows", text: "Log new leads, expenses or orders" },
    ],
    example: "Add every website enquiry to the leads sheet",
    access: "Only the spreadsheets you list.",
  },
  {
    slug: "googlecalendar",
    name: "Google Calendar",
    tint: "#4285f4",
    summary: "Turn requests into booked appointments.",
    can: [
      { title: "Create appointments", text: "With a time, place and description" },
      { title: "Invite guests", text: "Everyone gets the calendar invitation" },
    ],
    example: "Book a call when a customer asks for one",
    access: "Only the calendars you choose.",
  },
  {
    slug: "slack",
    name: "Slack",
    tint: "#9d4fa3",
    summary: "Keep the team in the loop where they already talk.",
    can: [
      { title: "Post updates", text: "Daily summaries, alerts and reports" },
      { title: "Pick the channel", text: "Each workflow posts where it belongs" },
    ],
    example: "Share a short team update every evening",
    access: "Only the channels you list.",
  },
  {
    slug: "notion",
    name: "Notion",
    tint: "#6b7390",
    summary: "Write things down where your team looks for them.",
    can: [
      { title: "Create pages", text: "Meeting notes, briefs and summaries" },
      { title: "Keep next steps together", text: "Under the parent page you choose" },
    ],
    example: "Turn call notes into a Notion page",
    access: "Only under the parent pages you share.",
  },
  {
    slug: "github",
    name: "GitHub",
    tint: "#6b7390",
    summary: "Get customer feedback in front of the product team.",
    can: [
      { title: "Open issues", text: "With a clear title and summary" },
      { title: "From any source", text: "Support emails, forms or call notes" },
    ],
    example: "Open an issue for each feature request",
    access: "Only the repositories your token allows.",
  },
  {
    slug: "todoist",
    name: "Todoist",
    tint: "#e44332",
    summary: "Make sure nothing slips through the cracks.",
    can: [
      { title: "Add tasks", text: "With the details someone needs to act" },
      { title: "In the right project", text: "Sorted where your team works" },
    ],
    example: "Add a follow-up task after every workshop",
    access: "Only the projects you choose.",
  },
];

const RING = DETAILS.map((app, i) => {
  const angle = (-90 + (360 / DETAILS.length) * i) * (Math.PI / 180);
  return { slug: app.slug, name: app.name, x: 50 + Math.cos(angle) * 38, y: 50 + Math.sin(angle) * 38 };
});

/** Pick an app on the hub to see what AgentOS can do there and what it can reach. */
export function Integrations() {
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState(false);
  const reduced = useReducedMotionSafe();
  const hub = useRef<HTMLDivElement>(null);
  const inView = useInView(hub, { amount: 0.4 });
  const id = useId();
  const app = DETAILS[active]!;

  // Walk around the hub until the visitor chooses an app.
  useEffect(() => {
    if (picked || reduced || !inView) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % DETAILS.length), 3200);
    return () => window.clearTimeout(timer);
  }, [active, picked, reduced, inView]);

  const choose = (i: number) => {
    setPicked(true);
    setActive(i);
  };
  const onKey = (event: React.KeyboardEvent) => {
    const step = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + DETAILS.length) % DETAILS.length;
    choose(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <section aria-labelledby="apps-title" className="border-y border-line bg-surface py-24 sm:py-32">
      <div className="wrap">
        <div className="mx-auto max-w-[44rem] text-center">
          <h2 id="apps-title" className="heading text-[length:clamp(2rem,1.3rem+2.4vw,3.1rem)]">
            One place for the tools your team already uses
          </h2>
          <p className="lede mx-auto mt-5 max-w-[46ch] text-ink-muted">
            Connect an account once and choose exactly what AgentOS may reach.
            Pick an app to see what it can do there.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div ref={hub} className="relative mx-auto aspect-square w-full max-w-[34rem]">
            <div
              aria-hidden="true"
              className="dot-canvas absolute inset-[5%] rounded-full border border-line [mask-image:radial-gradient(closest-side,black_72%,transparent)]"
            />
            <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              <circle cx="50" cy="50" r="38" className="fill-none stroke-line" strokeWidth="0.3" strokeDasharray="0.8 1.6" />
              {RING.map((tile, i) => {
                const on = i === active;
                return (
                  <g key={tile.slug}>
                    <line
                      x1="50"
                      y1="50"
                      x2={tile.x}
                      y2={tile.y}
                      className={on ? "stroke-cobalt" : "stroke-line-strong"}
                      strokeWidth={on ? 0.7 : 0.3}
                      style={{ transition: "stroke-width 300ms" }}
                    />
                    {on ? (
                      <line
                        x1="50"
                        y1="50"
                        x2={tile.x}
                        y2={tile.y}
                        pathLength={100}
                        className="wire-flow stroke-cobalt"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    ) : null}
                  </g>
                );
              })}
            </svg>
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex size-[23%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-[28%] bg-cobalt text-white shadow-[0_24px_60px_-18px_rgb(52_84_191/0.7)]"
            >
              <BrandMark size={34} />
              <span className="text-[clamp(0.6rem,1.4vw,0.85rem)] font-semibold">AgentOS</span>
            </div>
            <div role="tablist" aria-label="Connected apps" onKeyDown={onKey}>
              {RING.map((tile, i) => {
                const on = i === active;
                return (
                  <button
                    key={tile.slug}
                    id={`${id}-tab-${i}`}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls={`${id}-panel`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => choose(i)}
                    className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 rounded-2xl"
                    style={{ left: `${tile.x}%`, top: `${tile.y}%` }}
                  >
                    <span
                      className={`flex size-[clamp(2.9rem,8.5vw,4rem)] items-center justify-center rounded-2xl border bg-surface transition-[border-color,box-shadow,transform] duration-300 group-hover:-translate-y-0.5 ${
                        on
                          ? "scale-110 border-cobalt shadow-[0_0_0_5px_var(--cobalt-tint),0_18px_36px_-16px_rgb(52_84_191/0.6)]"
                          : "border-line shadow-[0_12px_30px_-16px_rgb(var(--shadow)/0.45)]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/apps/${tile.slug}.svg`} alt="" width={28} height={28} className="size-[44%]" />
                    </span>
                    <span className={`whitespace-nowrap text-xs font-semibold transition-[margin] duration-300 ${on ? "mt-1.5 text-ink" : "text-ink-muted"}`}>
                      {tile.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id={`${id}-panel`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${active}`}
            className="relative overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[0_50px_100px_-60px_rgb(var(--shadow)/0.7)]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={app.slug}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header washed in the app's own colour. */}
                <div
                  className="px-7 pb-7 pt-8 sm:px-9"
                  style={{ background: `linear-gradient(160deg, color-mix(in srgb, ${app.tint} 14%, transparent), transparent 75%)` }}
                >
                  <motion.span
                    initial={reduced ? false : { scale: 0.8, rotate: -8 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    className="flex size-16 items-center justify-center rounded-[1.25rem] border border-line bg-surface shadow-[0_16px_32px_-18px_rgb(var(--shadow)/0.6)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/apps/${app.slug}.svg`} alt="" width={34} height={34} className="size-[34px]" />
                  </motion.span>
                  <h3 className="heading mt-5 text-[1.9rem]">{app.name}</h3>
                  <p className="mt-1.5 max-w-[34ch] text-lg text-ink-muted">{app.summary}</p>
                </div>

                <div className="px-7 sm:px-9">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {app.can.map((item, i) => (
                      <motion.li
                        key={item.title}
                        initial={reduced ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.07, duration: 0.3 }}
                        className="rounded-2xl border border-line bg-canvas p-4"
                      >
                        <span className="block font-semibold">{item.title}</span>
                        <span className="mt-1 block text-sm text-ink-muted">{item.text}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.3 }}
                    className="mt-3 flex items-center gap-3 rounded-2xl bg-cobalt-tint px-4 py-3.5"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-cobalt text-white">
                      <Zap size={16} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold text-cobalt-ink">For example</span>
                      <span className="block font-medium">{app.example}</span>
                    </span>
                  </motion.div>
                </div>

                <p className="mt-7 flex items-center gap-2.5 border-t border-line px-7 py-5 text-[15px] sm:px-9">
                  <Lock size={16} className="shrink-0 text-ink-faint" aria-hidden="true" />
                  <span className="text-ink-muted">{app.access}</span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
