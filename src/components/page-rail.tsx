"use client";

import { useEffect, useRef, useState } from "react";

/** Sections on the rail, found by an id inside each section. */
const STOPS = [
  { id: "try", label: "Try it" },
  { id: "apps-title", label: "Apps" },
  { id: "before-title", label: "Before and after" },
  { id: "how", label: "How it works" },
  { id: "tour", label: "Product tour" },
  { id: "templates", label: "Templates" },
  { id: "teams", label: "Teams" },
  { id: "trust-title", label: "Safe to run" },
  { id: "faq", label: "FAQ" },
  { id: "cta-title", label: "Get started" },
];

const GAP = 30; // px between nodes

/**
 * The workflow wire, running down the page: it fills as you read, and each
 * section is a step that lights up when you reach it. Wide screens only.
 */
export function PageRail() {
  const [progress, setProgress] = useState(0); // 0 … STOPS.length - 1
  const [visible, setVisible] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    const sections = STOPS.map((s) => {
      const el = document.getElementById(s.id);
      return (el?.closest("section") ?? el) as HTMLElement | null;
    });
    const update = () => {
      frame.current = 0;
      const line = window.innerHeight * 0.4;
      const tops = sections.map((s) => (s ? s.getBoundingClientRect().top + window.scrollY : Infinity));
      const y = window.scrollY + line;
      let p = 0;
      for (let i = 0; i < tops.length; i++) {
        if (y >= tops[i]!) {
          const next = tops[i + 1] ?? tops[i]! + 1;
          p = i + Math.min(1, (y - tops[i]!) / Math.max(1, next - tops[i]!));
        }
      }
      setProgress(Math.min(p, STOPS.length - 1));
      const first = tops[0] ?? Infinity;
      const end = document.documentElement.scrollHeight - window.innerHeight * 1.2;
      setVisible(y > first - 80 && window.scrollY < end);
    };
    const onScroll = () => {
      if (!frame.current) frame.current = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  const height = (STOPS.length - 1) * GAP;
  const active = Math.floor(progress + 0.0001);

  return (
    <nav
      aria-label="Page sections"
      className={`fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-300 lg:block ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="relative" style={{ height }}>
        <span aria-hidden="true" className="absolute left-[7px] top-0 w-0.5 rounded-full bg-line-strong" style={{ height }} />
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-0 w-0.5 rounded-full bg-cobalt"
          style={{ height: (progress / (STOPS.length - 1)) * height }}
        />
        <ol>
          {STOPS.map((stop, i) => {
            const reached = i <= active;
            const current = i === active;
            return (
              <li key={stop.id} className="absolute left-0" style={{ top: i * GAP - 8 }}>
                <a
                  href={`#${stop.id}`}
                  aria-current={current ? "location" : undefined}
                  className="group relative flex size-4 items-center justify-center rounded-full"
                >
                  <span
                    className={`block rounded-full border-2 transition-all duration-300 ${
                      current
                        ? "size-4 border-cobalt bg-surface shadow-[0_0_0_4px_var(--cobalt-tint)]"
                        : reached
                          ? "size-2.5 border-cobalt bg-cobalt"
                          : "size-2.5 border-line-strong bg-canvas"
                    }`}
                  />
                  <span className="pointer-events-none absolute left-6 whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-semibold text-ink opacity-0 shadow-[0_8px_20px_-12px_rgb(var(--shadow)/0.6)] transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {stop.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
