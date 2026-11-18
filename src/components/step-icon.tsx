import {
  BarChart3,
  Clock,
  FileText,
  Filter,
  Inbox,
  PenLine,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { AppSlug, StepIcon } from "@/lib/site";

const APP_SLUGS: AppSlug[] = [
  "gmail",
  "googlesheets",
  "googlecalendar",
  "slack",
  "notion",
  "github",
  "todoist",
];

export function isApp(icon: StepIcon): icon is AppSlug {
  return (APP_SLUGS as string[]).includes(icon);
}

const GLYPHS: Record<Exclude<StepIcon, AppSlug>, { component: LucideIcon; svg: string }> = {
  clock: {
    component: Clock,
    svg: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  },
  inbox: {
    component: Inbox,
    svg: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  },
  ai: {
    component: PenLine,
    svg: '<path d="M12 20h9"/><path d="M16.38 3.62a1 1 0 0 1 3 3L7.37 18.64a2 2 0 0 1-.86.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.86z"/>',
  },
  approve: {
    component: ShieldCheck,
    svg: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  },
  doc: {
    component: FileText,
    svg: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  },
  filter: {
    component: Filter,
    svg: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  },
  chart: {
    component: BarChart3,
    svg: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  },
};

/** An SVG data URL for drawing a step icon into a canvas texture. */
export function iconUrl(icon: StepIcon, color: string): string {
  if (isApp(icon)) return `/apps/${icon}.svg`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${GLYPHS[icon].svg}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** The same icon as page markup: app logos as images, the rest as line icons. */
export function StepIconView({ icon, size = 20 }: { icon: StepIcon; size?: number }) {
  if (isApp(icon)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`/apps/${icon}.svg`} alt="" width={size} height={size} style={{ width: size, height: size }} />;
  }
  const Icon = GLYPHS[icon].component;
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}
