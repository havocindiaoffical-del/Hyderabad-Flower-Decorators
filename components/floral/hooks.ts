"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

// ─── Reduced Motion Detection ──────────────────────────────────────
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// ─── Mouse Position Tracking (throttled) ───────────────────────────
export function useMousePosition() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const ref = useRef<number>(0);

  useEffect(() => {
    let rafId = 0;
    const handleMove = (e: MouseEvent) => {
      if (ref.current++ > 3) {
        ref.current = 0;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          setPos({
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
          });
        });
      }
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return pos;
}

// ─── Scroll Progress (0 → 1 per section) ───────────────────────────
export function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh;
      const end = -rect.height;
      const current = rect.top;
      const p = Math.max(0, Math.min(1, (current - start) / (end - start)));
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return progress;
}

// ─── Is Mobile Detection ───────────────────────────────────────────
// Returns `null` until client-side detection completes, so heavy
// animations can be deferred and avoid crashing mobile browsers on
// first render (when the default was `false` / desktop).
export function useIsMobile() {
  const [mobile, setMobile] = useState<boolean | null>(null);
  useEffect(() => {
    setMobile(window.innerWidth < 768);
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
}

// Convenience: returns `true` only when we KNOW it's mobile.
// Returns `false` when desktop OR when detection hasn't resolved yet
// (used by components that should render a lightweight fallback).
export function useIsMobileSafe(): boolean {
  const m = useIsMobile();
  return m === true;
}

// Returns `true` when we KNOW it's NOT mobile (i.e. desktop resolved).
// Returns `false` for mobile or unresolved — safe for gating heavy desktop features.
export function useIsDesktopReady(): boolean {
  const m = useIsMobile();
  return m === false;
}
