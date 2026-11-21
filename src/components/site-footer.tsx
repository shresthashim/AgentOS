import { Wordmark } from "@/components/brand";
import { APP_URL } from "@/lib/site";

const GROUPS = [
  {
    title: "Product",
    links: [
      { href: "/#how", label: "How it works" },
      { href: "/#templates", label: "Templates" },
    ],
  },
  {
    title: "Use cases",
    links: [
      { href: "/#teams", label: "Sales" },
      { href: "/#teams", label: "Operations" },
      { href: "/#teams", label: "Support" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: APP_URL, label: "Sign in" },
      { href: APP_URL, label: "Get started" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-line bg-surface pb-20 md:pb-0">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]">
        <div className="max-w-[24rem]">
          <Wordmark />
          <p className="mt-4 text-[15px] text-ink-muted">
            Workflows across your apps, with AI to draft and a person to
            approve.
          </p>
        </div>
        {GROUPS.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-sm font-semibold">{group.title}</h2>
            <ul className="mt-3 space-y-2 text-[15px] text-ink-muted">
              {group.links.map((link) => (
                <li key={link.label}>
                  <a className="hover:text-ink" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-ink-faint">
          <p>© 2026 AgentOS</p>
          <p>Workflows that wait for your approval.</p>
        </div>
      </div>
      {/* The name, large, with the wire running through it. */}
      <div aria-hidden="true" className="relative overflow-hidden">
        <div className="wrap pb-6 pt-2">
          <svg viewBox="0 0 1000 232" className="block h-auto w-full text-line">
            <text
              x="0"
              y="168"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              className="fill-current font-display font-bold"
              style={{ fontSize: 214, letterSpacing: "-0.06em" }}
            >
              AgentOS
            </text>
          </svg>
        </div>
        <div className="absolute inset-x-0 top-[44%] flex items-center">
          <span className="absolute inset-x-0 h-px bg-line-strong" />
          <svg viewBox="0 0 1000 4" preserveAspectRatio="none" className="absolute inset-x-0 h-1 w-full">
            <line x1="0" y1="2" x2="1000" y2="2" pathLength={100} className="wire-flow stroke-cobalt" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {[12, 38, 64, 88].map((x) => (
            <span
              key={x}
              className="absolute size-3 -translate-x-1/2 rounded-full border-2 border-cobalt bg-surface"
              style={{ left: `${x}%` }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
