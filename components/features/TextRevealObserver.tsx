"use client";

import { useEffect, useRef } from "react";

export default function TextRevealObserver() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            // Don't unobserve — keep it revealed once triggered
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    // Observe all elements with reveal classes
    const selectors = [
      ".text-reveal",
      ".text-reveal-stagger",
      ".heading-reveal",
      ".img-reveal",
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        observerRef.current?.observe(el);
      });
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return null;
}
