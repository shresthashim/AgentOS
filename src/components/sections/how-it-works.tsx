"use client";

import { CalendarClock, Check, FileSpreadsheet, Inbox, MousePointerClick, Plus } from "lucide-react";
import { AnimatePresence, motion, } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { StepIconView } from "@/components/step-icon";
import { APP_URL } from "@/lib/site";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

function Trigger() {
  const options = [
    { icon: CalendarClock, label: "On a schedule", sub: "Every Monday at 9:00", on: true },
    { icon: FileSpreadsheet, label: "When a sheet changes", sub: "New or edited rows" },
    { icon: Inbox, label: "When another app sends data", sub: "A form, a shop, a CRM" },
    { icon: MousePointerClick, label: "When you press Run", sub: "Whenever you need it" },
  ];
  return (
    <div className="w-full max-w-sm">
      <p className="mb-3 text-sm font-semibold text-ink-muted">When should this run?</p>
      <ul className="space-y-2">
        {options.map((o, i) => (
          <motion.li
            key={o.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 ${
              o.on ? "border-cobalt bg-cobalt-tint shadow-[0_10px_30px_-18px_rgb(52_84_191/0.6)]" : "border-line bg-surface"
            }`}
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-surface text-ink-muted shadow-[0_1px_2px_rgb(var(--shadow)/0.1)]">
              <o.icon size={17} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold">{o.label}</span>
              <span className="block text-sm text-ink-muted">{o.sub}</span>
            </span>
            {o.on ? <Check size={18} className="text-cobalt-ink" aria-hidden="true" /> : null}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function Steps() {
  const steps = [
    { icon: "clock" as const, kind: "Trigger", text: "Every Monday, 9:00" },
    { icon: "googlesheets" as const, kind: "Action", text: "Read this week's sales" },
    { icon: "ai" as const, kind: "AI step", text: "Write the summary" },
    { icon: "gmail" as const, kind: "Action", text: "Email the report" },
  ];
  return (
    <div className="flex w-full max-w-xs flex-col items-center">
      {steps.map((s, i) => (
        <motion.div
          key={s.text}
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.12, type: "spring", stiffness: 300, damping: 26 }}
          className="flex w-full flex-col items-center"
        >
          {i > 0 ? <span className="h-4 w-px bg-line-strong" aria-hidden="true" /> : null}
          <div className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-3.5 py-3 shadow-[0_8px_24px_-18px_rgb(var(--shadow)/0.5)]">
            <span className="flex size-9 items-center justify-center rounded-xl bg-canvas text-cobalt-ink">
              <StepIconView icon={s.icon} size={18} />
            </span>
            <span>
              <span className="block text-xs text-ink-faint">{s.kind}</span>
              <span className="block text-[15px] font-semibold">{s.text}</span>
            </span>
          </div>
        </motion.div>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 flex size-8 items-center justify-center rounded-full border border-dashed border-line-strong bg-surface text-ink-faint"
      >
        <Plus size={15} aria-hidden="true" />
      </motion.span>
    </div>
  );
}

function Approve() {
  const [approved, setApproved] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setApproved(true), 1400);
    return () => window.clearTimeout(id);
  }, []);
  const log = ["Started on schedule", "Read 214 rows", "AI wrote the summary"];
  return (
    <div className="w-full max-w-sm space-y-3">
      <ol className="space-y-1.5 rounded-2xl border border-line bg-surface p-4 text-sm">
        {log.map((line) => (
          <li key={line} className="flex items-center gap-2 text-ink-muted">
            <Check size={15} className="text-done-ink" aria-hidden="true" />
            {line}
          </li>
        ))}
      </ol>
      <motion.div layout className="rounded-2xl border border-line bg-surface p-4 shadow-[0_18px_40px_-26px_rgb(var(--shadow)/0.55)]">
        <p className={`flex items-center gap-2 text-sm font-semibold ${approved ? "text-done-ink" : "text-wait-ink"}`}>
          <span aria-hidden="true" className={`size-2 rounded-full ${approved ? "bg-done" : "bg-wait"}`} />
          {approved ? "Approved by you. Email sent" : "Waiting for your approval"}
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Email to <span className="text-ink">sales-team@northwind.example</span>
        </p>
        <p className="text-sm text-ink-muted">
          Subject: <span className="text-ink">Weekly sales are up 8%</span>
        </p>
        <div className="mt-3 flex gap-2">
          <span
            className={`inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-sm font-semibold text-white transition-colors ${
              approved ? "bg-done" : "bg-cobalt"
            }`}
          >
            <Check size={15} aria-hidden="true" /> {approved ? "Approved" : "Approve and send"}
          </span>
          <span className="inline-flex h-9 items-center rounded-xl border border-line-strong px-3.5 text-sm font-medium">
            Edit first
          </span>
        </div>
      </motion.div>
    </div>
  );
}

const STEPS: { title: string; text: string; visual: () => ReactNode }[] = [
  {
    title: "Choose what starts it",
    text: "Run on a schedule, when a spreadsheet changes, when another app sends something in, or whenever you press Run.",
    visual: () => <Trigger />,
  },
  {
    title: "Add the steps",
    text: "Pick actions from your apps and built-in tools. Each step can use whatever earlier steps found, with no code and no copying.",
    visual: () => <Steps />,
  },
  {
    title: "Test it, approve it, turn it on",
    text: "Watch every step with sample data first. Emails, posts and changes wait for someone on your team to approve them, every time.",
    visual: () => <Approve />,
  },
];

function BuilderWindow({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[0_50px_100px_-50px_rgb(var(--shadow)/0.6)]">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <p className="text-sm font-semibold">Weekly sales report</p>
        <span className="rounded-full bg-canvas px-2.5 py-1 text-xs font-medium text-ink-muted">{label}</span>
      </div>
      <div className="dot-canvas flex min-h-[26rem] items-center justify-center p-8">{children}</div>
    </div>
  );
}

/** Three steps; on wide screens the builder stays in view and changes as you read. */
export function HowItWorks() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotionSafe();
  const blocks = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    blocks.current.forEach((block) => block && observer.observe(block));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how" aria-labelledby="how-title" className="border-t border-line bg-surface py-24 sm:py-28">
      <div className="wrap">
        <div className="max-w-[40rem]">
          <h2 id="how-title" className="heading text-[length:clamp(2rem,1.3rem+2.4vw,3.1rem)]">
            From idea to running workflow in three steps
          </h2>
          <p className="lede mt-4 text-ink-muted">
            Start from a template or a blank canvas, and change it whenever
            your process changes.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:mt-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <ol>
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <div
                  ref={(node) => {
                    blocks.current[i] = node;
                  }}
                  data-index={i}
                  className="flex flex-col justify-center py-6 lg:min-h-[70vh] lg:py-0"
                >
                  <span
                    className={`flex size-10 items-center justify-center rounded-full border-2 border-cobalt font-display text-lg font-bold transition-colors duration-300 ${
                      active === i ? "bg-cobalt text-white" : "text-cobalt-ink"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <h3 className="heading mt-5 text-[length:clamp(1.5rem,1.2rem+1vw,2rem)]">{step.title}</h3>
                  <p className="mt-3 max-w-[36ch] text-lg text-ink-muted">{step.text}</p>
                  {i === STEPS.length - 1 ? (
                    <a href={APP_URL} className="btn btn-primary mt-7 self-start">
                      Build your first workflow
                    </a>
                  ) : null}
                  <div className="mt-8 lg:hidden">
                    <BuilderWindow label={`Step ${i + 1} of 3`}>{step.visual()}</BuilderWindow>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="hidden lg:block">
            <div className="sticky top-[max(6rem,calc(50vh-17rem))]">
              <BuilderWindow label={`Step ${active + 1} of 3`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                    className="flex w-full justify-center"
                  >
                    {STEPS[active]!.visual()}
                  </motion.div>
                </AnimatePresence>
              </BuilderWindow>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
