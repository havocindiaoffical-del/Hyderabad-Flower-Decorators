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
export function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(window.innerWidth < 768);
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
}
