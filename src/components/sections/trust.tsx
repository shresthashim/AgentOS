"use client";

import { Check, History, KeyRound, Lock, RotateCcw, ShieldCheck, Timer, Users } from "lucide-react";
import { motion, useInView, } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const RUN = [
  { time: "9:00:00", text: "Started on schedule" },
  { time: "9:00:02", text: "Read 214 rows from Weekly sales" },
  { time: "9:00:09", text: "AI wrote the summary" },
  { time: "9:04:31", text: "Approved by Sam", done: true },
  { time: "9:04:32", text: "Email sent to sales-team", done: true },
];

function Tile({ icon: Icon, title, text, className, children }: {
  icon: typeof History;
  title: string;
  text: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={`flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface ${className ?? ""}`}>
      <div className="dot-canvas flex flex-1 items-center justify-center border-b border-line p-6">{children}</div>
      <div className="p-6">
        <Icon size={20} className="text-cobalt-ink" aria-hidden="true" />
        <h3 className="heading mt-3 text-xl">{title}</h3>
        <p className="mt-1.5 text-[15px] text-ink-muted">{text}</p>
      </div>
    </article>
  );
}

/** What makes it safe to leave running, each with a small piece of the product. */
export function Trust() {
  const grid = useRef<HTMLDivElement>(null);
  const seen = useInView(grid, { once: true, amount: 0.25 });
  const reduced = useReducedMotionSafe();
  const show = (i: number) =>
    reduced ? {} : { initial: { opacity: 0, x: -8 }, animate: seen ? { opacity: 1, x: 0 } : {}, transition: { delay: 0.2 + i * 0.25 } };

  return (
    <section aria-labelledby="trust-title" className="py-24 sm:py-32">
      <div className="wrap">
        <div className="max-w-[42rem]">
          <h2 id="trust-title" className="heading text-[length:clamp(2rem,1.3rem+2.4vw,3.1rem)]">
            Safe to leave running
          </h2>
          <p className="lede mt-4 text-ink-muted">
            Everything a team needs to trust automation with real customers
            and real numbers, and to know exactly what happened.
          </p>
        </div>

        <div ref={grid} className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          <Tile
            icon={ShieldCheck}
            title="Review outgoing actions"
            text="Sending a message or changing a connected app waits for a workspace Owner. Unanswered requests expire."
            className="lg:col-span-3"
          >
            <ul className="w-full max-w-sm space-y-2.5">
              {[
                { text: "Email to maria@harbourcafe…", state: "done" },
                { text: "Post in #sales-updates", state: "wait" },
                { text: "Invite for Thursday 10:00", state: "wait" },
              ].map((item, i) => (
                <motion.li
                  key={item.text}
                  {...show(i)}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm"
                >
                  <span className="truncate">{item.text}</span>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      item.state === "done" ? "bg-done-tint text-done-ink" : "bg-wait-tint text-wait-ink"
                    }`}
                  >
                    {item.state === "done" ? <Check size={12} aria-hidden="true" /> : null}
                    {item.state === "done" ? "Approved" : "Waiting"}
                  </span>
                </motion.li>
              ))}
            </ul>
          </Tile>

          <Tile
            icon={History}
            title="A record of every run"
            text="See what each step read, wrote and decided, in order, with who approved it and when."
            className="lg:col-span-3"
          >
            <ol className="w-full max-w-sm space-y-2 rounded-xl border border-line bg-surface p-4 text-sm">
              {RUN.map((line, i) => (
                <motion.li key={line.time} {...show(i)} className="grid grid-cols-[4.25rem_1fr] gap-2">
                  <span className="tabular-nums text-ink-faint">{line.time}</span>
                  <span className={line.done ? "font-medium text-done-ink" : ""}>{line.text}</span>
                </motion.li>
              ))}
            </ol>
          </Tile>

          <Tile icon={Timer} title="On your schedule" text="Daily, weekly, on chosen days, or when something changes." className="lg:col-span-2">
            <div className="w-full max-w-[15rem] rounded-xl border border-line bg-surface p-4">
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <span
                    key={i}
                    className={`flex aspect-square items-center justify-center rounded-lg ${
                      [0, 2, 4].includes(i) ? "bg-cobalt text-white" : "bg-canvas text-ink-faint"
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-center text-sm text-ink-muted">
                at <span className="font-semibold text-ink">9:00</span>, London time
              </p>
            </div>
          </Tile>

          <Tile icon={RotateCcw} title="Undo with versions" text="Publish a version when it is ready, and go back to an earlier one at any time." className="lg:col-span-2">
            <ol className="flex w-full max-w-[15rem] items-center justify-between">
              {["v1", "v2", "v3"].map((v, i) => (
                <li key={v} className="flex flex-1 items-center last:flex-none">
                  <span
                    className={`flex size-11 items-center justify-center rounded-full border-2 text-sm font-bold ${
                      i === 2 ? "border-cobalt bg-cobalt text-white" : "border-line-strong bg-surface text-ink-muted"
                    }`}
                  >
                    {v}
                  </span>
                  {i < 2 ? <span className="mx-1 h-0.5 flex-1 bg-line-strong" aria-hidden="true" /> : null}
                </li>
              ))}
            </ol>
          </Tile>

          <Tile icon={Users} title="Roles for everyone" text="Decide who can build workflows, who approves, and who can only look." className="lg:col-span-2">
            <ul className="w-full max-w-[15rem] space-y-2 text-sm">
              {[
                { name: "Sam", role: "Approves", c: "bg-[#3454bf]" },
                { name: "Dana", role: "Builds", c: "bg-[#1c7a4c]" },
                { name: "Lee", role: "Views", c: "bg-[#8a5507]" },
              ].map((p) => (
                <li key={p.name} className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2">
                  <span className={`flex size-7 items-center justify-center rounded-full text-xs font-bold text-white ${p.c}`}>
                    {p.name[0]}
                  </span>
                  <span className="flex-1 font-medium">{p.name}</span>
                  <span className="text-ink-muted">{p.role}</span>
                </li>
              ))}
            </ul>
          </Tile>

          <Tile
            icon={KeyRound}
            title="Access you choose, kept encrypted"
            text="Each connection only reaches the inboxes, sheets, calendars and channels you allow, and credentials are stored encrypted."
            className="md:col-span-2 lg:col-span-6"
          >
            <ul className="flex max-w-3xl flex-wrap justify-center gap-2.5">
              {["Send from sales-team@", "Weekly sales sheet", "#sales-updates", "Team calendar", "Product roadmap page"].map((item) => (
                <li key={item} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium">
                  <Lock size={14} className="text-ink-faint" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Tile>
        </div>
      </div>
    </section>
  );
}
