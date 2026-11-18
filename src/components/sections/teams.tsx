"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion, } from "motion/react";
import Image from "next/image";
import { useId, useState } from "react";
import { APP_URL } from "@/lib/site";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const TEAMS: {
  name: string;
  photo: string;
  alt: string;
  headline: string;
  wins: string[];
}[] = [
  {
    name: "Sales",
    photo: "/images/sales.webp",
    alt: "A saleswoman on a phone call, taking notes beside her laptop",
    headline: "Reply to every lead while it is still warm",
    wins: [
      "New enquiries land in your leads sheet on their own",
      "A personal follow-up is drafted for every one",
      "Meetings go straight into Google Calendar",
    ],
  },
  {
    name: "Operations",
    photo: "/images/operations.webp",
    alt: "A warehouse worker checking stock on a tablet between shelves of boxes",
    headline: "Know what is running low before it runs out",
    wins: [
      "Stock levels checked every morning",
      "A clear restock list, ready for the supplier",
      "Expenses logged as tidy spreadsheet rows",
    ],
  },
  {
    name: "Support",
    photo: "/images/support.webp",
    alt: "A support agent wearing a headset, helping a customer at her laptop",
    headline: "Answer faster, in your own words",
    wins: [
      "Replies drafted from your own policies",
      "Product feedback turned into GitHub issues",
      "Follow-ups added to Todoist so nothing slips",
    ],
  },
  {
    name: "Team leads",
    photo: "/images/team.webp",
    alt: "Three colleagues looking at a laptop together in a bright office",
    headline: "Keep everyone in the loop without writing it all",
    wins: [
      "A short daily update shared in Slack",
      "Call notes turned into Notion pages",
      "The week's numbers sent to the right people",
    ],
  },
];

/** Shows a photo and workflow benefits for each team. */
export function Teams() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotionSafe();
  const id = useId();
  const team = TEAMS[active]!;
  const onKey = (event: React.KeyboardEvent) => {
    const step = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + TEAMS.length) % TEAMS.length;
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <section id="teams" aria-labelledby="teams-title" className="border-t border-line bg-surface py-24 sm:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="teams-title" className="heading max-w-[18ch] text-[length:clamp(2rem,1.3rem+2.4vw,3.1rem)]">
            Built for the way your team works
          </h2>
          <div role="tablist" aria-label="Teams" onKeyDown={onKey} className="flex flex-wrap gap-2">
            {TEAMS.map((t, i) => (
              <button
                key={t.name}
                id={`${id}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls={`${id}-panel`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className={`h-11 rounded-full border px-5 text-[15px] font-semibold transition-colors ${
                  i === active
                    ? "border-ink bg-ink text-canvas"
                    : "border-line-strong text-ink-muted hover:border-ink-faint hover:text-ink"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${active}`}
          className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-canvas">
            <AnimatePresence initial={false}>
              <motion.div
                key={team.photo}
                initial={reduced ? false : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image src={team.photo} alt={team.alt} fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
          </div>

          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={team.name}
                initial={reduced ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? undefined : { opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="heading text-[length:clamp(1.6rem,1.2rem+1.3vw,2.3rem)]">{team.headline}</h3>
                <ul className="mt-7 space-y-4">
                  {team.wins.map((win) => (
                    <li key={win} className="flex gap-3 text-lg">
                      <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-done-tint text-done-ink">
                        <Check size={14} aria-hidden="true" />
                      </span>
                      <span className="text-ink-muted">{win}</span>
                    </li>
                  ))}
                </ul>
                <a href={APP_URL} className="btn btn-primary mt-9">
                  Automate {team.name === "Team leads" ? "your team updates" : `${team.name.toLowerCase()} work`}
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
