"use client";

import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const isTouch = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      isTouch.current = true;
      return;
    }

    let mx = 0, my = 0;
    let ox = 0, oy = 0;
    let hovering = false;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, select, textarea")) {
        hovering = true;
      }
    };

    const handleOut = () => { hovering = false; };

    // Lightweight animation loop using direct style manipulation
    let rafId: number;
    const animate = () => {
      // Smooth follow with lerp
      ox += (mx - ox) * 0.15;
      oy += (my - oy) * 0.15;

      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${ox - 16}px, ${oy - 16}px) scale(${hovering ? 1.6 : 1})`;
        outerRef.current.style.opacity = mx ? '1' : '0';
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
        innerRef.current.style.opacity = mx ? '1' : '0';
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    window.addEventListener("mouseout", handleOut, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mouseout", handleOut);
    };
  }, []);

  if (typeof window !== "undefined" && isTouch.current) return null;

  return (
    <>
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-gold/30 pointer-events-none z-[9999] mix-blend-difference opacity-0"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-gold pointer-events-none z-[9999] opacity-0"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
