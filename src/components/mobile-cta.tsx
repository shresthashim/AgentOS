"use client";

import { useEffect, useState } from "react";
import { APP_URL } from "@/lib/site";

/** Phones only: a slim "Get started" bar once the hero has scrolled away. */
export function MobileCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("top");
    const ends = [document.getElementById("cta-title")?.closest("section"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => Boolean(el),
    );
    let pastHero = false;
    const visibleEnds = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) pastHero = !entry.isIntersecting;
        else if (entry.isIntersecting) visibleEnds.add(entry.target);
        else visibleEnds.delete(entry.target);
      }
      setShow(pastHero && visibleEnds.size === 0);
    });
    if (hero) observer.observe(hero);
    ends.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-40 transition-[transform,opacity] duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface/95 p-2 pl-4 shadow-[0_20px_40px_-20px_rgb(var(--shadow)/0.6)] backdrop-blur">
        <p className="min-w-0 flex-1 truncate text-sm font-medium">Automate your first workflow</p>
        <a href={APP_URL} tabIndex={show ? 0 : -1} className="btn btn-primary h-10 px-4 text-sm">
          Get started
        </a>
      </div>
    </div>
  );
}
