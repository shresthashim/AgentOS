"use client";

import { Check, Play, RotateCcw, ShieldCheck } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { StepIconView } from "@/components/step-icon";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { APP_URL, type StepIcon } from "@/lib/site";

type Option = { id: string; icon: StepIcon; label: string; card: string; app?: boolean };

const TRIGGERS: Option[] = [
  { id: "weekly", icon: "clock", label: "Every Monday at 9:00", card: "Every Monday, 9:00" },
  { id: "form", icon: "inbox", label: "A new form entry arrives", card: "New form entry" },
  { id: "sheet", icon: "googlesheets", label: "A spreadsheet row changes", card: "Sheet row changed" },
];

const ACTIONS: Option[] = [
  { id: "ai", icon: "ai", label: "Write it up with AI", card: "AI writes the summary" },
  { id: "gmail", icon: "gmail", label: "Send an email", card: "Send with Gmail", app: true },
  { id: "slack", icon: "slack", label: "Post in Slack", card: "Post in #team", app: true },
  { id: "sheets", icon: "googlesheets", label: "Add a sheet row", card: "Add a row to Sheets", app: true },
  { id: "notion", icon: "notion", label: "Create a Notion page", card: "Create a Notion page", app: true },
  { id: "calendar", icon: "googlecalendar", label: "Book a meeting", card: "Book in Calendar", app: true },
  { id: "github", icon: "github", label: "Open a GitHub issue", card: "Open a GitHub issue", app: true },
  { id: "todoist", icon: "todoist", label: "Add a Todoist task", card: "Add a Todoist task", app: true },
];

const MAX_ACTIONS = 3;
type Phase = "idle" | "running" | "waiting" | "done";
type Card = { key: string; icon: StepIcon; kind: string; title: string; approval?: boolean };

function buildFlow(trigger: Option, actions: Option[]): Card[] {
  const cards: Card[] = [{ key: `t-${trigger.id}`, icon: trigger.icon, kind: "Trigger", title: trigger.card }];
  // AI work first, then one approval before anything reaches another app.
  const ordered = [...actions.filter((a) => !a.app), ...actions.filter((a) => a.app)];
  let approvalAdded = false;
  for (const action of ordered) {
    if (action.app && !approvalAdded) {
      cards.push({ key: "approval", icon: "approve", kind: "Approval", title: "Your team approves", approval: true });
      approvalAdded = true;
    }
    cards.push({ key: action.id, icon: action.icon, kind: action.app ? "Action" : "AI step", title: action.card });
  }
  return cards;
}

/** One selectable tile; the same size and shape for triggers and actions. */
function Tile({
  option,
  on,
  disabled,
  onClick,
}: {
  option: Option;
  on: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-12 w-full items-center gap-3 rounded-xl border px-3 text-left text-sm font-medium transition-[border-color,background-color,opacity] ${
        on
          ? "border-cobalt bg-cobalt-tint"
          : disabled
            ? "cursor-not-allowed border-line opacity-45"
            : "border-line bg-surface hover:border-line-strong"
      }`}
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-line bg-surface text-ink-muted">
        <StepIconView icon={option.icon} size={15} />
      </span>
      <span className="min-w-0 flex-1 truncate">{option.label}</span>
      <span
        aria-hidden="true"
        className={`grid size-5 shrink-0 place-items-center rounded-full border transition-colors ${
          on ? "border-cobalt bg-cobalt text-white" : "border-line-strong"
        }`}
      >
        {on ? <Check size={12} strokeWidth={3} /> : null}
      </span>
    </button>
  );
}

function StepHeading({ n, title, aside }: { n: number; title: string; aside?: string }) {
  return (
    <legend className="flex w-full items-center gap-2.5 text-sm font-semibold">
      <span className="grid size-6 place-items-center rounded-full bg-ink text-xs text-canvas">{n}</span>
      {title}
      {aside ? <span className="ml-auto font-normal tabular-nums text-ink-faint">{aside}</span> : null}
    </legend>
  );
}

/** Visitors assemble a workflow in a few clicks and watch it run. */
export function Playground() {
  const reduced = useReducedMotionSafe();
  const [triggerId, setTriggerId] = useState("weekly");
  const [actionIds, setActionIds] = useState<string[]>(["ai", "gmail"]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(-1);
  const timers = useRef<number[]>([]);

  const trigger = TRIGGERS.find((t) => t.id === triggerId)!;
  const actions = actionIds.map((id) => ACTIONS.find((a) => a.id === id)!);
  const flow = buildFlow(trigger, actions);
  const approvalIndex = flow.findIndex((c) => c.approval);
  const busy = phase === "running" || phase === "waiting";

  const clear = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => clear, []);
  const reset = () => {
    clear();
    setPhase("idle");
    setStep(-1);
  };

  // Walk the pulse from `from` to `to`, one card at a time.
  const walk = (from: number, to: number, then: () => void) => {
    const gap = reduced ? 0 : 650;
    for (let i = from; i <= to; i++) {
      timers.current.push(window.setTimeout(() => setStep(i), (i - from) * gap));
    }
    timers.current.push(window.setTimeout(then, (to - from) * gap + (reduced ? 0 : 450)));
  };
  const run = () => {
    reset();
    setPhase("running");
    const stopAt = approvalIndex >= 0 ? approvalIndex : flow.length - 1;
    walk(0, stopAt, () => setPhase(approvalIndex >= 0 ? "waiting" : "done"));
  };
  const approve = () => {
    setPhase("running");
    walk(approvalIndex + 1, flow.length - 1, () => setPhase("done"));
  };

  const pickTrigger = (id: string) => {
    reset();
    setTriggerId(id);
  };
  const toggleAction = (id: string) => {
    reset();
    setActionIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : ids.length >= MAX_ACTIONS ? ids : [...ids, id],
    );
  };

  const status =
    phase === "waiting"
      ? "Paused for approval. Nothing has been sent yet."
      : phase === "done"
        ? "Run finished. Every step is in the run history."
        : phase === "running"
          ? "Running…"
          : actionIds.length === 0
            ? "Pick at least one thing to do."
            : "Ready to run.";
  const statusDot =
    phase === "waiting" ? "bg-wait" : phase === "done" ? "bg-done" : phase === "running" ? "bg-cobalt" : "bg-line-strong";

  return (
    <section id="try" aria-labelledby="try-title" className="pb-24 pt-8 sm:pb-32 sm:pt-12">
      <div className="wrap">
        <div className="max-w-[40rem]">
          <h2 id="try-title" className="heading text-[length:clamp(2rem,1.3rem+2.4vw,3.1rem)]">
            Build a workflow in ten seconds
          </h2>
          <p className="lede mt-4 text-ink-muted">
            Pick what starts it and what it should do. AgentOS lines up the
            steps, and adds an approval before anything leaves.
          </p>
        </div>

        {/* One builder window: the bar, the choices and the canvas share edges. */}
        <div className="mt-12 overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[0_60px_110px_-70px_rgb(var(--shadow)/0.8)]">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6 sm:py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <span aria-hidden="true" className="hidden gap-1.5 sm:flex">
                <span className="size-2.5 rounded-full bg-line-strong" />
                <span className="size-2.5 rounded-full bg-line-strong" />
                <span className="size-2.5 rounded-full bg-line-strong" />
              </span>
              <p className="truncate text-sm font-semibold">New workflow</p>
              <span className="hidden rounded-full bg-canvas px-2.5 py-0.5 text-xs font-medium tabular-nums text-ink-muted sm:inline">
                {flow.length} steps{approvalIndex >= 0 ? " · 1 approval" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={reset}
                disabled={phase === "idle"}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink disabled:opacity-0"
              >
                <RotateCcw size={15} aria-hidden="true" /> Reset
              </button>
              <button
                type="button"
                onClick={run}
                disabled={busy || actionIds.length === 0}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-cobalt px-4 text-sm font-semibold text-white transition-colors hover:bg-cobalt-hover disabled:opacity-50"
              >
                <Play size={15} aria-hidden="true" />
                <span className="sm:hidden">Run</span>
                <span className="hidden sm:inline">Test run</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[22rem_minmax(0,1fr)]">
            {/* Choices */}
            <div className="min-w-0 space-y-7 border-b border-line p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <fieldset className="min-w-0 space-y-3">
                <StepHeading n={1} title="Starts when" />
                <div className="grid gap-2">
                  {TRIGGERS.map((t) => (
                    <Tile key={t.id} option={t} on={t.id === triggerId} onClick={() => pickTrigger(t.id)} />
                  ))}
                </div>
              </fieldset>
              <fieldset className="min-w-0 space-y-3">
                <StepHeading n={2} title="Then" aside={`${actionIds.length} of ${MAX_ACTIONS}`} />
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {ACTIONS.map((a) => {
                    const on = actionIds.includes(a.id);
                    return (
                      <Tile
                        key={a.id}
                        option={a}
                        on={on}
                        disabled={!on && actionIds.length >= MAX_ACTIONS}
                        onClick={() => toggleAction(a.id)}
                      />
                    );
                  })}
                </div>
              </fieldset>
            </div>

            {/* Canvas */}
            <div className="relative flex min-h-[32rem] min-w-0 flex-col">
              <div className="dot-canvas flex flex-1 items-center justify-center px-5 py-10">
                <LayoutGroup>
                  <ol className="flex w-full max-w-sm flex-col items-center" aria-label="Workflow steps">
                    <AnimatePresence initial={false}>
                      {flow.map((card, i) => {
                        const active = step === i && phase === "running";
                        const passed = step > i || (step === i && phase === "done");
                        const waiting = card.approval && phase === "waiting";
                        const lit = step >= i;
                        return (
                          <motion.li
                            key={card.key}
                            layout={!reduced}
                            initial={reduced ? false : { opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={reduced ? undefined : { opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            className="flex w-full flex-col items-center"
                          >
                            {i > 0 ? (
                              <span aria-hidden="true" className="relative h-8 w-0.5 rounded-full bg-line-strong">
                                <span
                                  className={`absolute inset-x-0 top-0 rounded-full bg-cobalt transition-[height] duration-500 ${lit ? "h-full" : "h-0"}`}
                                />
                              </span>
                            ) : null}
                            <div
                              className={`relative flex w-full items-center gap-3 rounded-2xl border bg-surface px-4 py-3 transition-[border-color,box-shadow] duration-300 ${
                                waiting
                                  ? "border-wait shadow-[0_0_0_5px_var(--wait-tint)]"
                                  : active
                                    ? "border-cobalt shadow-[0_0_0_5px_var(--cobalt-tint)]"
                                    : card.approval
                                      ? "border-dashed border-wait"
                                      : "border-line shadow-[0_10px_24px_-18px_rgb(var(--shadow)/0.6)]"
                              }`}
                            >
                              <span
                                className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                                  card.approval ? "bg-wait-tint text-wait-ink" : "bg-canvas text-cobalt-ink"
                                }`}
                              >
                                {card.approval ? <ShieldCheck size={19} aria-hidden="true" /> : <StepIconView icon={card.icon} size={19} />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-xs text-ink-faint">
                                  {card.kind}
                                  {card.approval ? " · added for you" : ""}
                                </span>
                                <span className="block truncate text-[15px] font-semibold">{card.title}</span>
                              </span>
                              {waiting ? (
                                <button
                                  type="button"
                                  onClick={approve}
                                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-done px-3.5 text-sm font-semibold text-white hover:brightness-110"
                                >
                                  <Check size={15} aria-hidden="true" /> Approve
                                </button>
                              ) : passed ? (
                                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-done text-white">
                                  <Check size={14} aria-hidden="true" />
                                  <span className="sr-only">done</span>
                                </span>
                              ) : null}
                            </div>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ol>
                </LayoutGroup>
              </div>

              {/* Status, and the next step once the run is finished. */}
              <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-t border-line bg-surface px-5 py-3 sm:px-6">
                <p aria-live="polite" className="flex items-center gap-2.5 text-sm text-ink-muted">
                  <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${statusDot}`} />
                  {status}
                </p>
                {phase === "done" ? (
                  <motion.a
                    initial={reduced ? false : { opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    href={APP_URL}
                    className="inline-flex h-10 items-center rounded-xl bg-cobalt px-4 text-sm font-semibold text-white hover:bg-cobalt-hover"
                  >
                    Build this for real
                  </motion.a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
