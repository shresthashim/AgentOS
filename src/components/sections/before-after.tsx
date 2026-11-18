"use client";

import { ArrowRight, Bot, Check, Hand } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { StepIconView } from "@/components/step-icon";
import type { StepIcon } from "@/lib/site";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type Who = "you" | "auto" | "ai";

/** Each chore you do by hand, next to what AgentOS does instead. */
const ROWS: { hand: string; handIcon: StepIcon; with: string; withIcon: StepIcon; who: Who }[] = [
  { hand: "Open the sales sheet", handIcon: "googlesheets", with: "Starts every Monday at 9:00", withIcon: "clock", who: "auto" },
  { hand: "Copy this week's rows", handIcon: "googlesheets", with: "Reads this week's rows", withIcon: "googlesheets", who: "auto" },
  { hand: "Work out the totals", handIcon: "chart", with: "Works out the totals", withIcon: "chart", who: "auto" },
  { hand: "Write a summary of the week", handIcon: "ai", with: "Writes the summary", withIcon: "ai", who: "ai" },
  { hand: "Paste it into an email", handIcon: "gmail", with: "Puts it in an email", withIcon: "gmail", who: "auto" },
  { hand: "Check who it goes to", handIcon: "approve", with: "You read it and press Approve", withIcon: "approve", who: "you" },
  { hand: "Send it, and remember next week", handIcon: "gmail", with: "Sends it once, and again next Monday", withIcon: "gmail", who: "auto" },
];

const BADGE: Record<Who, { label: string; icon: typeof Hand; className: string }> = {
  you: { label: "You", icon: Hand, className: "bg-wait-tint text-wait-ink" },
  auto: { label: "Automatic", icon: Check, className: "bg-done-tint text-done-ink" },
  ai: { label: "AI", icon: Bot, className: "bg-cobalt-tint text-cobalt-ink" },
};

function Badge({ who }: { who: Who }) {
  const b = BADGE[who];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${b.className}`}>
      <b.icon size={13} aria-hidden="true" />
      {b.label}
    </span>
  );
}

function Step({ icon, text, who, muted }: { icon: StepIcon; text: string; who: Who; muted?: boolean }) {
  return (
    <div
      className={`flex h-full items-center gap-3 rounded-2xl border px-3.5 py-3 ${
        who === "you" && !muted
          ? "border-wait bg-wait-tint/40"
          : muted
            ? "border-line bg-canvas"
            : "border-line bg-surface"
      }`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink-muted">
        <StepIconView icon={icon} size={17} />
      </span>
      <span className={`min-w-0 flex-1 text-[15px] font-medium ${muted ? "text-ink-muted" : ""}`}>{text}</span>
      <Badge who={who} />
    </div>
  );
}

/** The Monday report, done by hand and with AgentOS, row against row. */
export function BeforeAfter() {
  const table = useRef<HTMLDivElement>(null);
  const seen = useInView(table, { once: true, amount: 0.35 });
  const reduced = useReducedMotionSafe();
  const [mobileAfter, setMobileAfter] = useState(true);
  const settled = reduced || seen;

  return (
    <section aria-labelledby="before-title" className="pb-12 pt-24 sm:pb-16 sm:pt-32">
      <div className="wrap">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
          <h2 id="before-title" className="heading max-w-[16ch] text-[length:clamp(2rem,1.3rem+2.6vw,3.4rem)]">
            Stop copying and pasting between tabs
          </h2>
          <p className="lede max-w-[42ch] text-ink-muted">
            Most weekly jobs are just moving information from one app to
            another. Here is the Monday sales report, step by step, before and
            after.
          </p>
        </div>

        {/* Phones show one side at a time. */}
        <div role="group" aria-label="Show" className="mt-10 inline-flex rounded-2xl border border-line bg-surface p-1.5 md:hidden">
          {[
            { value: false, label: "By hand" },
            { value: true, label: "With AgentOS" },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              aria-pressed={mobileAfter === o.value}
              onClick={() => setMobileAfter(o.value)}
              className={`h-10 rounded-xl px-4 text-[15px] font-semibold transition-colors ${
                mobileAfter === o.value ? (o.value ? "bg-cobalt text-white" : "bg-ink text-canvas") : "text-ink-muted"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div
          ref={table}
          className="mt-6 overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[0_50px_100px_-60px_rgb(var(--shadow)/0.55)] md:mt-12"
        >
          <div className="grid border-b border-line md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)]">
            <div className={`flex items-center justify-between gap-3 px-5 py-5 sm:px-7 ${mobileAfter ? "max-md:hidden" : ""}`}>
              <p className="font-semibold">By hand, every Monday</p>
              <p className="text-sm text-ink-muted">
                <span className="font-display text-2xl font-bold tabular-nums text-wait-ink">7</span> steps need you
              </p>
            </div>
            <div className="hidden md:block" />
            <div
              className={`flex items-center justify-between gap-3 bg-cobalt-tint/60 px-5 py-5 sm:px-7 ${
                mobileAfter ? "" : "max-md:hidden"
              }`}
            >
              <p className="font-semibold">With AgentOS</p>
              <p className="text-sm text-ink-muted" aria-live="polite">
                <CountDown from={7} to={1} run={settled} instant={reduced} />{" "}
                {settled ? "step needs you" : "steps need you"}
              </p>
            </div>
          </div>

          <ol className="grid gap-2.5 p-3 sm:p-5">
            {ROWS.map((row, i) => (
              <li key={row.hand} className="grid items-stretch gap-2.5 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)]">
                <div className={mobileAfter ? "max-md:hidden" : ""}>
                  <Step icon={row.handIcon} text={row.hand} who="you" muted />
                </div>
                <div aria-hidden="true" className="hidden items-center justify-center text-ink-faint md:flex">
                  <ArrowRight size={18} />
                </div>
                <div className={`[perspective:800px] ${mobileAfter ? "" : "max-md:hidden"}`}>
                  <motion.div
                    key={settled ? "after" : "before"}
                    initial={reduced || !settled ? false : { rotateX: 90 }}
                    animate={{ rotateX: 0 }}
                    transition={{ delay: 0.25 + i * 0.16, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full [transform-origin:50%_50%] [transform-style:preserve-3d]"
                  >
                    <Step
                      icon={settled ? row.withIcon : row.handIcon}
                      text={settled ? row.with : row.hand}
                      who={settled ? row.who : "you"}
                    />
                  </motion.div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** Counts down one step at a time, in time with the rows flipping. */
function CountDown({ from, to, run, instant }: { from: number; to: number; run: boolean; instant: boolean }) {
  const [value, setValue] = useState(from);
  useEffect(() => {
    if (!run) return;
    if (instant) {
      const id = window.setTimeout(() => setValue(to), 0);
      return () => window.clearTimeout(id);
    }
    const ids = Array.from({ length: from - to }, (_, i) =>
      window.setTimeout(() => setValue(from - i - 1), 250 + i * 160),
    );
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [run, instant, from, to]);
  return (
    <span className="inline-block min-w-[1ch] font-display text-2xl font-bold tabular-nums text-done-ink">{value}</span>
  );
}
