"use client";

import React from "react";

const stats = [
  { value: "146+", label: "Beautiful Events" },
  { value: "49", label: "Floral Concepts" },
  { value: "420+", label: "Happy Celebrations" },
  { value: "6 Yrs", label: "Creating Beauty" },
];

export default function Statistics() {
  return (
    <section className="relative -mt-16 z-20 pb-12">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        <div
          className="px-8 sm:px-14 py-12 sm:py-14"
          style={{
            background: "rgba(250, 248, 245, 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(232, 226, 218, 0.7)",
            borderRadius: "24px",
            boxShadow:
              "0 20px 60px -15px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-border-light">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="text-center lg:px-8 first:pl-0 last:pr-0"
              >
                <div
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: "clamp(2rem, 4vw, 3.2rem)",
                    fontWeight: 400,
                    lineHeight: 1.1,
                    color: "#1A1A1A",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.value}
                </div>
                <p
                  className="mt-2.5 label-uppercase"
                  style={{
                    color: "#9B9490",
                    fontSize: "0.58rem",
                    letterSpacing: "0.3em",
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
