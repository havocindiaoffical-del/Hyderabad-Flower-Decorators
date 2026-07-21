"use client";

import React, { useEffect, useRef, useState } from "react";

const stats = [
  { value: "146+", label: "Happy Clients" },
  { value: "4.9", label: "Google Rating" },
  { value: "420+", label: "Events Designed" },
  { value: "6 Yrs", label: "Of Excellence" },
];

export default function Statistics() {
  return (
    <section className="relative -mt-20 z-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="bg-ivory border border-border-light rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] px-8 sm:px-12 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-border-light">
            {stats.map((s) => (
              <div key={s.label} className="text-center lg:px-8 first:pl-0 last:pr-0">
                <div className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal">{s.value}</div>
                <p className="mt-2 label-uppercase text-stone">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
