"use client";

import { useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

/**
 * Reduced-motion preference that is false during the server render and the first
 * client render, so markup that depends on it never differs during hydration.
 */
export function useReducedMotionSafe(): boolean {
  const prefers = useReducedMotion() ?? false;
  const hydrated = useSyncExternalStore(noSubscribe, () => true, () => false);
  return hydrated && prefers;
}
