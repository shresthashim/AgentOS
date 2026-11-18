"use client";

import { Moon, Sun } from "lucide-react";
import { ThemeProvider as NextThemes, useTheme } from "next-themes";
import { useRef, type ReactNode } from "react";
import { flushSync } from "react-dom";

/** Light and dark themes; follows the system setting until the visitor chooses. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}

/**
 * Crossfades light and dark themes when supported. Both icons render so CSS can
 * show the correct theme on first paint.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const switching = useRef<{ theme: "light" | "dark"; transition: ViewTransition } | null>(null);

  const toggle = () => {
    const pending = switching.current;
    const next = (pending?.theme ?? resolvedTheme) === "dark" ? "light" : "dark";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof document.startViewTransition !== "function") {
      switching.current = null;
      pending?.transition.skipTransition();
      setTheme(next);
      return;
    }
    const transition = document.startViewTransition(() => {
      if (switching.current?.transition === transition) {
        flushSync(() => setTheme(next));
      }
    });
    switching.current = { theme: next, transition };
    const clear = () => {
      if (switching.current?.transition === transition) switching.current = null;
    };
    void transition.ready.catch(() => undefined);
    void transition.finished.then(clear, clear);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex size-10 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface hover:text-ink ${className ?? ""}`}
      title="Switch between light and dark"
    >
      <Sun size={19} aria-hidden="true" className="hidden dark:block" />
      <Moon size={19} aria-hidden="true" className="block dark:hidden" />
      <span className="sr-only">Switch between light and dark theme</span>
    </button>
  );
}
