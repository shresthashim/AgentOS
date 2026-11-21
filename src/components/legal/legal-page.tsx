import { ArrowUpRight, Check, Mail } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme";
import { APP_URL, CONTACT_EMAIL, LEGAL_UPDATED } from "@/lib/site";

export type LegalSection = { id: string; title: string; content: ReactNode };

const DOCS = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
] as const;

/**
 * Shared layout for the privacy policy and terms of service: a plain summary
 * first, then the full text with a table of contents that stays in view.
 */
export function LegalPage({
  current,
  title,
  intro,
  summary,
  sections,
}: {
  current: (typeof DOCS)[number]["href"];
  title: string;
  intro: string;
  summary: string[];
  sections: LegalSection[];
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-lg bg-cobalt px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md">
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

      <main id="main">
        <section className="dot-canvas border-b border-line">
          <div className="wrap pb-14 pt-12 sm:pb-16 sm:pt-16">
            <nav aria-label="Legal documents" className="inline-flex rounded-xl border border-line bg-surface p-1">
              {DOCS.map((doc) => (
                <Link
                  key={doc.href}
                  href={doc.href}
                  aria-current={doc.href === current ? "page" : undefined}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    doc.href === current ? "bg-cobalt text-white" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {doc.label}
                </Link>
              ))}
            </nav>
            <h1 className="display mt-7 text-[length:clamp(2.5rem,1.7rem+3.2vw,4.25rem)]">{title}</h1>
            <p className="lede mt-5 max-w-[44rem] text-ink-muted">{intro}</p>
            <p className="mt-6 text-sm text-ink-faint">Last updated {LEGAL_UPDATED}</p>
          </div>
        </section>

        <div className="wrap grid gap-10 py-12 sm:py-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-24">
              <p className="text-sm font-semibold">On this page</p>
              <ol className="mt-3 space-y-0.5 border-l border-line">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ml-px flex gap-2.5 border-l border-transparent py-1.5 pl-4 text-sm text-ink-muted transition-colors hover:border-cobalt hover:text-ink"
                    >
                      <span className="w-5 shrink-0 tabular-nums text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="min-w-0 max-w-[46rem]">
            <section aria-labelledby="summary-title" className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
              <h2 id="summary-title" className="heading text-xl">
                The short version
              </h2>
              <ul className="mt-4 space-y-3">
                {summary.map((point) => (
                  <li key={point} className="flex gap-3 text-[15px] leading-relaxed text-ink-muted">
                    <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-done-tint text-done-ink">
                      <Check size={12} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-line pt-4 text-sm text-ink-faint">
                This summary helps you find your way. The full text below is what applies.
              </p>
            </section>

            <article className="legal-prose mt-12">
              {sections.map((section, i) => (
                <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
                  <h2 id={`${section.id}-title`}>
                    <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    {section.title}
                  </h2>
                  {section.content}
                </section>
              ))}
            </article>

            <section
              aria-labelledby="legal-help-title"
              className="mt-14 flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7"
            >
              <div>
                <h2 id="legal-help-title" className="heading text-xl">
                  Questions?
                </h2>
                <p className="mt-1.5 text-[15px] text-ink-muted">Write to us and we’ll get back to you.</p>
              </div>
              <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-secondary h-11 shrink-0 px-4 text-[15px]">
                <Mail size={17} aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

/** A link that leaves the site, marked as such. */
export function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRight size={14} aria-hidden="true" className="ml-0.5 inline align-[-1px]" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** A two-column table that scrolls sideways on narrow screens instead of squeezing. */
export function DataTable({ head, rows }: { head: [string, string, string?]; rows: [ReactNode, ReactNode, ReactNode?][] }) {
  return (
    <div className="legal-table" role="region" aria-label={head[0]} tabIndex={0}>
      <table>
        <thead>
          <tr>
            {head.filter(Boolean).map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.slice(0, head.filter(Boolean).length).map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
