"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand";
import { ThemeToggle } from "@/components/theme";
import { APP_URL } from "@/lib/site";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#templates", label: "Templates" },
  { href: "#teams", label: "Use cases" },
  { href: "#faq", label: "FAQ" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-200 ${
        scrolled || open ? "border-b border-line bg-canvas/90 backdrop-blur-md" : "border-b border-transparent bg-canvas"
      }`}
    >
      <nav aria-label="Main" className="wrap flex h-16 items-center justify-between gap-6">
        <a href="#top" className="rounded-lg" aria-label="AgentOS, back to top">
          <Wordmark />
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="rounded-lg px-3 py-2 text-[15px] text-ink-muted transition-colors hover:text-ink">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <a href={APP_URL} className="hidden rounded-lg px-3 py-2 text-[15px] font-medium text-ink sm:inline">
            Sign in
          </a>
          <a href={APP_URL} className="btn btn-primary hidden h-10 px-4 text-[15px] sm:inline-flex">
            Get started
          </a>
          <button
            ref={toggle}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-10 items-center justify-center rounded-lg text-ink lg:hidden"
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </nav>
      {open ? (
        <div id="mobile-menu" className="border-t border-line bg-canvas lg:hidden">
          <ul className="wrap flex flex-col py-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)} className="block rounded-lg py-3 text-lg text-ink">
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2 flex gap-3 border-t border-line pt-4">
              <a href={APP_URL} className="btn btn-secondary">
                Sign in
              </a>
              <a href={APP_URL} className="btn btn-primary flex-1">
                Get started
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
