"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 174, suffix: "+", label: "Happy Clients" },
  { value: 4.9, suffix: "", label: "Google Rating", decimals: 1 },
  { value: 500, suffix: "+", label: "Events Designed" },
  { value: 7, suffix: " Yrs", label: "Of Excellence" },
];

function Counter({ target, suffix, decimals = 0 }: { target: number; suffix: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const dur = 2000, start = Date.now();
    const run = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setCount(Number((target * (1 - Math.pow(1 - p, 3))).toFixed(decimals)));
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [inView, target, decimals]);
  return <span ref={ref}>{decimals > 0 ? count.toFixed(decimals) : Math.round(count)}{suffix}</span>;
}

export default function Statistics() {
  return (
    <section className="relative -mt-20 z-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="bg-ivory border border-border-light rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] px-8 sm:px-12 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-border-light">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center lg:px-8 first:pl-0 last:pr-0">
                <div className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal">
                  <Counter target={s.value} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <p className="mt-2 label-uppercase text-stone">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
