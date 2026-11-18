"use client";

import { useInView, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { StepIconView } from "@/components/step-icon";
import { HERO_FLOWS, APP_URL } from "@/lib/site";

const FlowScene = dynamic(() => import("./flow-scene"), {
  ssr: false,
  loading: () => <FlowPoster />,
});

/** Shown while the 3D canvas loads, and instead of it without WebGL. */
function FlowPoster() {
  return (
    <svg viewBox="0 0 1200 360" className="h-full w-full" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          {i < 4 ? (
            <path
              d={`M${170 + i * 230} ${i % 2 ? 210 : 150} C ${230 + i * 230} ${i % 2 ? 210 : 150}, ${230 + i * 230} ${i % 2 ? 150 : 210}, ${290 + i * 230} ${i % 2 ? 150 : 210}`}
              className="stroke-line-strong"
              strokeWidth="3"
              fill="none"
            />
          ) : null}
          <rect x={40 + i * 230} y={i % 2 ? 160 : 100} width="190" height="96" rx="16" className="fill-surface stroke-line" />
        </g>
      ))}
    </svg>
  );
}

let webglSupport: boolean | undefined;
function detectWebGL() {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noSubscribe = () => () => {};

export function Hero() {
  const reduced = useReducedMotion() ?? false;
  const { resolvedTheme } = useTheme();
  const webgl = useSyncExternalStore(noSubscribe, detectWebGL, () => null);
  const stage = useRef<HTMLDivElement>(null);
  const visible = useInView(stage, { amount: 0.25 });
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(false);
  const tabsId = useId();
  const flow = HERO_FLOWS[index]!;

  // Show a different workflow every few seconds until the visitor picks one.
  useEffect(() => {
    if (picked || reduced || !visible) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % HERO_FLOWS.length), 9000);
    return () => window.clearTimeout(id);
  }, [index, picked, reduced, visible]);

  const choose = (i: number) => {
    setPicked(true);
    setIndex(i);
  };
  const onKey = (event: React.KeyboardEvent) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + HERO_FLOWS.length) % HERO_FLOWS.length;
    choose(next);
    document.getElementById(`${tabsId}-tab-${next}`)?.focus();
  };

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-28 sm:pt-32">
      <div className="wrap grid items-end gap-x-12 gap-y-7 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <h1
          id="hero-title"
          className="display max-w-[14ch] text-[length:clamp(2.6rem,1.2rem+4.4vw,4.6rem)]"
        >
          Automate the work between your apps
        </h1>
        <div className="max-w-[34rem] lg:pb-2">
          <p className="lede text-ink-muted">
            Turn a sales sheet into a weekly report or a new lead into a
            ready-to-send follow-up. Build the workflow once and AgentOS runs
            it on a schedule or when new data arrives.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={APP_URL} className="btn btn-primary">
              Get started
            </a>
            <a href="#templates" className="btn btn-secondary">
              Browse templates
            </a>
          </div>
        </div>
      </div>

      <div className="relative mt-6 sm:mt-2">
        <div
          ref={stage}
          aria-hidden="true"
          className="relative mx-auto h-[560px] w-full max-w-[110rem] sm:h-[clamp(300px,38vw,450px)]"
        >
          {webgl ? (
            <FlowScene
              active={visible}
              steps={flow.steps}
              flowKey={flow.id}
              reduced={reduced}
              dark={resolvedTheme === "dark"}
            />
          ) : (
            <FlowPoster />
          )}
        </div>

        <div className="wrap -mt-2 flex flex-col items-center gap-3 pb-16 sm:-mt-6">
          <p id={`${tabsId}-label`} className="text-sm text-ink-faint">
            See a workflow in action
          </p>
          <div
            role="tablist"
            aria-labelledby={`${tabsId}-label`}
            onKeyDown={onKey}
            className="flex max-w-full flex-wrap justify-center gap-1 rounded-2xl border border-line bg-surface p-1.5 shadow-[0_10px_30px_-18px_rgb(var(--shadow)/0.35)]"
          >
            {HERO_FLOWS.map((item, i) => (
              <button
                key={item.id}
                id={`${tabsId}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-controls={`${tabsId}-panel`}
                tabIndex={i === index ? 0 : -1}
                onClick={() => choose(i)}
                className={`flex h-10 shrink-0 items-center gap-2 rounded-xl px-3.5 text-[15px] font-medium transition-colors ${
                  i === index ? "bg-cobalt-tint text-ink" : "text-ink-muted hover:bg-canvas hover:text-ink"
                }`}
              >
                <StepIconView icon={item.steps.find((s) => s.kind === "Action")?.icon ?? "inbox"} size={16} />
                {item.name}
              </button>
            ))}
          </div>
          <div id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={`${tabsId}-tab-${index}`} className="sr-only">
            <p>{flow.name}, step by step:</p>
            <ol>
              {flow.steps.map((step) => (
                <li key={step.title}>
                  {step.kind}: {step.title}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
