"use client";

import { Check, History, ShieldCheck, Workflow } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type Point = { title: string; text: string };

/** Real screens from AgentOS, with the parts that matter marked. */
const TABS: { id: string; label: string; icon: typeof Workflow; title: string; image: string; alt: string; points: Point[] }[] = [
  {
    id: "build",
    label: "Build",
    icon: Workflow,
    title: "Lay out the steps on a canvas",
    image: "build",
    alt: "The AgentOS workflow editor: a canvas of steps from a trigger to Google Sheets, a message template and a reviewed save, with step settings on the right",
    points: [
      { title: "Every step, in order", text: "Start from a trigger and add steps with the + between them." },
      { title: "Approval built in", text: "Steps that send or change something are marked “Needs approval”." },
      { title: "Test before it’s live", text: "Run the saved version on sample data, then publish." },
    ],
  },
  {
    id: "approve",
    label: "Approve",
    icon: ShieldCheck,
    title: "Decide what goes out",
    image: "approve",
    alt: "The AgentOS approvals page: a request to save a follow-up email for a new lead, with the full text and Approve and Deny buttons",
    points: [
      { title: "See exactly what goes out", text: "The real email, rows or invite, not a summary of it." },
      { title: "Approve or deny", text: "Owners decide. Add a reason that’s kept with the run." },
      { title: "Nothing waits forever", text: "Requests nobody answers in time are declined, never sent." },
    ],
  },
  {
    id: "review",
    label: "Review",
    icon: History,
    title: "See everything that happened",
    image: "review",
    alt: "An AgentOS run: a timeline from created to succeeded, including the wait for approval, and the finished follow-up email",
    points: [
      { title: "Every stage, timed", text: "Created, running, waiting for approval, finished." },
      { title: "The result, kept", text: "What each step produced is saved with the run." },
      { title: "The full record", text: "Timeline, actions and files, step by step." },
    ],
  },
];

export function ProductTour() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotionSafe();
  const frame = useRef<HTMLDivElement>(null);
  const id = useId();
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "start 0.25"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 16, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : 0.92, 1]);
  const tab = TABS[active]!;

  const onKey = (event: React.KeyboardEvent) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + TABS.length) % TABS.length;
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <section id="tour" aria-labelledby="tour-title" className="overflow-hidden bg-surface py-16 sm:py-24">
      <div className="wrap">
        <div className="mx-auto max-w-[44rem] text-center">
          <h2 id="tour-title" className="heading text-[length:clamp(2rem,1.3rem+2.4vw,3.1rem)]">
            A look inside AgentOS
          </h2>
          <p className="lede mx-auto mt-4 max-w-[46ch] text-ink-muted">
            Build a workflow, approve what it prepares, and see every step it
            took. These are real screens from the app.
          </p>
          <div
            role="tablist"
            aria-label="Product screens"
            onKeyDown={onKey}
            className="mx-auto mt-9 inline-flex rounded-2xl border border-line bg-canvas p-1.5"
          >
            {TABS.map((t, i) => (
              <button
                key={t.id}
                id={`${id}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls={`${id}-panel`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className="relative inline-flex h-11 items-center rounded-xl px-2.5 text-sm font-semibold sm:px-5 sm:text-[15px]"
              >
                {i === active ? (
                  <motion.span
                    layoutId="tour-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-xl bg-surface shadow-[0_6px_18px_-10px_rgb(var(--shadow)/0.6)]"
                  />
                ) : null}
                <span className={`relative inline-flex items-center gap-1.5 sm:gap-2 ${i === active ? "text-ink" : "text-ink-muted"}`}>
                  <t.icon size={17} aria-hidden="true" />
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="mt-8 sm:mt-10">
          <div className="[perspective:1600px]">
            <motion.div
              ref={frame}
              style={{ rotateX, scale, transformOrigin: "50% 100%" }}
              className="mx-auto max-w-6xl overflow-hidden rounded-[1.25rem] border border-line bg-canvas shadow-sm"
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3">
                <span aria-hidden="true" className="flex gap-1.5">
                  <span className="size-3 rounded-full bg-line-strong" />
                  <span className="size-3 rounded-full bg-line-strong" />
                  <span className="size-3 rounded-full bg-line-strong" />
                </span>
                <span className="mx-auto truncate rounded-lg bg-canvas px-4 py-1 text-xs text-ink-faint">
                  AgentOS · {tab.title}
                </span>
                <span aria-hidden="true" className="w-12" />
              </div>
              <div className="relative aspect-[16/10] overflow-hidden">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={tab.id}
                    initial={reduced ? false : { opacity: 0, scale: 1.015 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={`/images/tour/${tab.image}-light.webp`}
                      alt={tab.alt}
                      fill
                      sizes="(min-width: 1200px) 1152px, 100vw"
                      className="object-cover object-top dark:hidden"
                      priority={false}
                    />
                    <Image
                      src={`/images/tour/${tab.image}-dark.webp`}
                      alt={tab.alt}
                      fill
                      sizes="(min-width: 1200px) 1152px, 100vw"
                      className="hidden object-cover object-top dark:block"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <ul className="grid divide-y divide-line border-t border-line bg-surface md:grid-cols-3 md:divide-x md:divide-y-0">
                {tab.points.map((point) => (
                  <li key={point.title} className="flex min-w-0 gap-3 p-4 sm:p-5">
                    <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-cobalt-tint text-cobalt-ink">
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                    <span>
                      <span className="block font-semibold">{point.title}</span>
                      <span className="mt-1 block text-[15px] text-ink-muted">{point.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
