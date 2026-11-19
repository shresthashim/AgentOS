import { ArrowRight, Check, House, LayoutTemplate, Link2, Workflow, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/brand";
import { ThemeToggle } from "@/components/theme";
import { APP_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Page not found | ${SITE_NAME}`,
  description: "This page doesn't exist or has moved.",
};

/*
 * The 404 is a run that hit a dead end: the link step passed, the page step found
 * nothing, and the workflow takes its fallback path to three places that exist.
 * A Server Component with CSS-only motion, because the root not-found ships with
 * every route.
 */

const ROUTES: { href: string; title: string; text: string; icon: LucideIcon; x: number }[] = [
  { href: "/", title: "Home page", text: "Start again from the top.", icon: House, x: 17 },
  { href: "/#templates", title: "Templates", text: "Ready-made workflows for real work.", icon: LayoutTemplate, x: 50 },
  { href: "/#how", title: "How it works", text: "From idea to a running workflow.", icon: Workflow, x: 83 },
];

/* Canvas geometry (1000 × 420). Wires run centre to centre, behind the cards. */
const LINK_STEP = { x: 15, y: 19 };
const PAGE_STEP = { x: 50, y: 19 };
const ROUTE_Y = 77;
const toUnits = (x: number, y: number) => [x * 10, y * 4.2] as const;

function branch(toX: number): string {
  const [x1, y1] = toUnits(PAGE_STEP.x, PAGE_STEP.y);
  const [x2, y2] = toUnits(toX, ROUTE_Y);
  const mid = (y1 + y2) / 2;
  return `M${x1} ${y1} C${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`;
}

function LinkStep({ className = "" }: { className?: string }) {
  return (
    <div className={`nf-card flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 ${className}`}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cobalt-tint text-cobalt-ink">
        <Link2 size={18} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-ink-faint">Trigger</span>
        <span className="block text-[15px] font-semibold leading-snug">You followed a link</span>
      </span>
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-done text-white">
        <Check size={14} strokeWidth={3} aria-hidden="true" />
        <span className="sr-only">Done</span>
      </span>
    </div>
  );
}

function PageStep({ className = "" }: { className?: string }) {
  return (
    <div className={`nf-card nf-dead-end rounded-2xl border border-wait bg-surface px-5 pt-4 pb-5 ${className}`}>
      <span className="flex items-center justify-between gap-3">
        <span className="text-xs text-ink-faint">Open page</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-wait-tint px-2.5 py-1 text-xs font-semibold text-wait-ink">
          <span className="nf-wait-dot size-1.5 rounded-full bg-wait" aria-hidden="true" />
          Not found
        </span>
      </span>
      <span className="display mt-2 block text-[clamp(3.25rem,2.4rem+3vw,4.75rem)] leading-none text-ink">404</span>
    </div>
  );
}

function RouteCard({ route, className = "", style }: { route: (typeof ROUTES)[number]; className?: string; style?: React.CSSProperties }) {
  const Icon = route.icon;
  return (
    <Link
      href={route.href}
      style={style}
      className={`nf-card nf-route group flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-cobalt ${className}`}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-canvas text-cobalt-ink transition-colors group-hover:bg-cobalt group-hover:text-white">
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-snug">{route.title}</span>
        <span className="block text-sm leading-snug text-ink-muted">{route.text}</span>
      </span>
      <ArrowRight
        size={17}
        aria-hidden="true"
        className="shrink-0 text-ink-faint transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-cobalt-ink"
      />
    </Link>
  );
}

function FallbackLabel() {
  return (
    <span className="nf-label inline-flex items-center gap-1.5 rounded-full border border-dashed border-line-strong bg-canvas px-3 py-1 text-xs font-medium text-ink-muted">
      Fallback path
    </span>
  );
}

/** Wide screens: the run drawn on a canvas, with wires behind the cards. */
function RunCanvas() {
  const [ax, ay] = toUnits(LINK_STEP.x, LINK_STEP.y);
  const [bx, by] = toUnits(PAGE_STEP.x, PAGE_STEP.y);
  const place = (x: number, y: number) => ({ left: `${x}%`, top: `${y}%` });
  return (
    <div className="relative mx-auto hidden aspect-[1000/420] w-full max-w-5xl md:block">
      <svg viewBox="0 0 1000 420" className="absolute inset-0 size-full" aria-hidden="true">
        <path d={`M${ax} ${ay} L${bx} ${by}`} pathLength={1} className="nf-wire-done" />
        {ROUTES.map((route, i) => (
          <g key={route.href}>
            <path d={branch(route.x)} className="nf-wire-base" style={{ animationDelay: `${1.05 + i * 0.12}s` }} />
            <path d={branch(route.x)} className="nf-wire-flow wire-flow-px" />
          </g>
        ))}
      </svg>
      <div className="absolute w-[26%] -translate-x-1/2 -translate-y-1/2" style={place(LINK_STEP.x, LINK_STEP.y)}>
        <LinkStep className="nf-in" />
      </div>
      <div className="absolute w-[25%] -translate-x-1/2 -translate-y-1/2" style={place(PAGE_STEP.x, PAGE_STEP.y)}>
        <PageStep className="nf-in [animation-delay:0.45s]" />
      </div>
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={place(50, 48)}>
        <FallbackLabel />
      </div>
      {ROUTES.map((route, i) => (
        <div
          key={route.href}
          className="absolute w-[30%] -translate-x-1/2 -translate-y-1/2"
          style={place(route.x, ROUTE_Y)}
        >
          <RouteCard route={route} className="nf-in min-h-[5.5rem]" style={{ animationDelay: `${1.2 + i * 0.12}s` }} />
        </div>
      ))}
    </div>
  );
}

/** Small screens: the same run, top to bottom. */
function RunStack() {
  const joint = <span aria-hidden="true" className="mx-auto block h-5 w-px bg-cobalt" />;
  return (
    <div className="mx-auto max-w-sm md:hidden">
      <LinkStep className="nf-in" />
      {joint}
      <PageStep className="nf-in [animation-delay:0.3s]" />
      <span aria-hidden="true" className="mx-auto block h-5 w-px border-l border-dashed border-line-strong" />
      <div className="text-center">
        <FallbackLabel />
      </div>
      <span aria-hidden="true" className="mx-auto block h-5 w-px border-l border-dashed border-line-strong" />
      <div className="space-y-3">
        {ROUTES.map((route, i) => (
          <RouteCard key={route.href} route={route} className="nf-in" style={{ animationDelay: `${0.6 + i * 0.1}s` }} />
        ))}
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <div className="dot-canvas flex min-h-dvh flex-col">
      <header>
        <nav aria-label="Main" className="wrap flex h-16 items-center justify-between gap-4">
          <Link href="/" className="rounded-lg" aria-label="AgentOS home">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <a href={APP_URL} className="btn btn-primary h-10 px-4 text-[15px]">
              Get started
            </a>
          </div>
        </nav>
      </header>

      <main id="main" className="wrap flex flex-1 flex-col justify-center py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="display nf-in text-[length:clamp(2.4rem,1.6rem+3.4vw,4.2rem)]">This step leads nowhere</h1>
          <p className="lede nf-in mx-auto mt-5 max-w-[34rem] text-ink-muted [animation-delay:0.1s]">
            The page you were looking for doesn’t exist or has moved. Every good workflow has a fallback
            path, so here is ours.
          </p>
        </div>

        <nav aria-label="Ways back" className="mt-12 sm:mt-14">
          <RunCanvas />
          <RunStack />
        </nav>

        <p className="nf-in mt-12 text-center text-[15px] text-ink-muted [animation-delay:1.5s] md:mt-6">
          Looking for your workflows?{" "}
          <a href={APP_URL} className="font-semibold text-cobalt-ink underline-offset-4 hover:underline">
            Open your workspace
          </a>
        </p>
      </main>

      <footer className="wrap flex flex-wrap items-center justify-between gap-3 border-t border-line py-6 text-sm text-ink-muted">
        <span>© 2026 AgentOS</span>
        <Link href="/" className="hover:text-ink">
          Back to the home page
        </Link>
      </footer>
    </div>
  );
}
