"use client";

import { useRef, type ReactNode } from "react";

/**
 * Leans gently toward the pointer and lights the spot under it. Mouse and pen
 * only, and skipped entirely for people who prefer reduced motion.
 */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
      el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 6}deg)`;
      el.dataset.lit = "true";
    });
  };
  const leave = () => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    delete el.dataset.lit;
  };

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`tilt-card h-full ${className ?? ""}`}>
      {children}
    </div>
  );
}
