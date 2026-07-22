"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  Rose3D, RosePetal, Jasmine3D, Marigold3D, Leaf3D,
  BotanicalStem3D, Vine3D, FlowerBud3D, GoldPetal,
} from "./FloralElements";
import {
  BigRose3D, BigMarigold3D, BigJasmineCluster3D, BigLeaf3D,
  BigVine3D, BigFlowerCluster3D, BigPetal3D, BigGoldPetal3D,
} from "./BigFloralElements";
import { useReducedMotion, useMousePosition, useIsMobile } from "./hooks";

// ─── Hero 3D Flower Animation (BIG flowers) ─────────────────────────
// 6 prominent 3D floral elements in the hero with mouse parallax

export function HeroFloralAnimation() {
  const reduced = useReducedMotion();
  const mouse = useMousePosition();
  const isMobile = useIsMobile();

  if (reduced) return null;

  const baseX = useSpring(useMotionValue(0), { stiffness: 40, damping: 30 });
  const baseY = useSpring(useMotionValue(0), { stiffness: 40, damping: 30 });

  useEffect(() => {
    baseX.set((mouse.x - 0.5) * 30);
    baseY.set((mouse.y - 0.5) * 20);
  }, [mouse.x, mouse.y, baseX, baseY]);

  const x1 = useTransform(baseX, (v: number) => v * 0.6);
  const y1 = useTransform(baseY, (v: number) => v * 0.4);
  const x2 = useTransform(baseX, (v: number) => v * -1.0);
  const y2 = useTransform(baseY, (v: number) => v * -0.6);
  const x3 = useTransform(baseX, (v: number) => v * 0.4);
  const y3 = useTransform(baseY, (v: number) => v * 0.7);
  const x4 = useTransform(baseX, (v: number) => v * -0.5);
  const y4 = useTransform(baseY, (v: number) => v * -0.25);
  const x5 = useTransform(baseX, (v: number) => v * 0.3);
  const y5 = useTransform(baseY, (v: number) => v * 0.5);
  const x6 = useTransform(baseX, (v: number) => v * -0.35);
  const y6 = useTransform(baseY, (v: number) => v * -0.3);

  const elCount = isMobile ? 3 : 6;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]" style={{ perspective: "800px" }}>
      {/* 1. BIG Rose — left of headline */}
      {elCount >= 1 && (
        <motion.div
          className="absolute top-[22%] left-[2%] sm:left-[5%]"
          style={{ x: x1, y: y1 }}
          initial={{ opacity: 0, rotateY: 25, rotateX: -8, scale: 0.7 }}
          animate={{ opacity: 0.45, rotateY: 0, rotateX: 0, scale: 1 }}
          transition={{ duration: 2.5, delay: 0.6, ease: "easeOut" }}
        >
          <motion.div animate={{ rotateZ: [0, 3, 0, -3, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
            <BigRose3D size={isMobile ? 60 : 100} />
          </motion.div>
        </motion.div>
      )}

      {/* 2. BIG Leaf — right near image */}
      {elCount >= 2 && (
        <motion.div
          className="absolute top-[14%] right-[1%] sm:right-[3%] lg:right-[6%]"
          style={{ x: x2, y: y2 }}
          initial={{ opacity: 0, rotateY: -15, scale: 0.8 }}
          animate={{ opacity: 0.35, rotateY: 0, scale: 1 }}
          transition={{ duration: 2.2, delay: 1.0, ease: "easeOut" }}
        >
          <motion.div animate={{ rotateZ: [0, -4, 0, 4, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}>
            <BigLeaf3D size={isMobile ? 50 : 70} />
          </motion.div>
        </motion.div>
      )}

      {/* 3. BIG Floating Petal — center background */}
      {elCount >= 3 && (
        <motion.div
          className="absolute top-[50%] right-[18%] lg:right-[28%]"
          style={{ x: x3, y: y3 }}
          initial={{ opacity: 0, rotateY: 40, scale: 0.6 }}
          animate={{ opacity: 0.32, rotateY: 0, scale: 1 }}
          transition={{ duration: 2.4, delay: 1.3, ease: "easeOut" }}
        >
          <motion.div animate={{ rotateZ: [0, 6, 0, -6, 0], y: [0, -10, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}>
            <BigPetal3D size={isMobile ? 30 : 48} />
          </motion.div>
        </motion.div>
      )}

      {/* 4. Jasmine cluster — bottom-left of hero */}
      {elCount >= 4 && (
        <motion.div
          className="absolute bottom-[18%] left-[10%] lg:left-[14%]"
          style={{ x: x4, y: y4 }}
          initial={{ opacity: 0, rotateX: 18, scale: 0.6 }}
          animate={{ opacity: 0.30, rotateX: 0, scale: 1 }}
          transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
        >
          <motion.div animate={{ rotateZ: [0, -3, 0, 3, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}>
            <BigJasmineCluster3D size={isMobile ? 55 : 80} />
          </motion.div>
        </motion.div>
      )}

      {/* 5. Gold Petal — mid-right */}
      {elCount >= 5 && (
        <motion.div
          className="absolute top-[35%] right-[10%] lg:right-[15%]"
          style={{ x: x5, y: y5 }}
          initial={{ opacity: 0, rotateX: 25, scale: 0.5 }}
          animate={{ opacity: 0.28, rotateX: 0, scale: 1 }}
          transition={{ duration: 2, delay: 1.8, ease: "easeOut" }}
        >
          <motion.div animate={{ rotateZ: [0, 5, 0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
            <BigGoldPetal3D size={isMobile ? 28 : 40} />
          </motion.div>
        </motion.div>
      )}

      {/* 6. Small rose accent — top-right corner */}
      {elCount >= 6 && (
        <motion.div
          className="absolute top-[8%] right-[22%] lg:right-[25%]"
          style={{ x: x6, y: y6 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.22, scale: 1 }}
          transition={{ duration: 2, delay: 2.0, ease: "easeOut" }}
        >
          <motion.div animate={{ rotateZ: [0, 2, 0, -2, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
            <Rose3D size={42} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Section Floral Transition (BIG) ────────────────────────────────

interface SectionTransitionProps {
  variant: "hero-services" | "services-occasions" | "occasions-garlands" | "garlands-gallery" | "gallery-booking";
}

export function SectionFloralTransition({ variant }: SectionTransitionProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  if (reduced) return null;

  const config: Record<string, { elements: React.ReactNode[]; direction: string }> = {
    "hero-services": {
      elements: isMobile
        ? [<BigRose3D size={60} />, <Leaf3D size={30} />]
        : [<BigRose3D size={80} />, <BigLeaf3D size={50} />, <BigPetal3D size={30} />],
      direction: "down",
    },
    "services-occasions": {
      elements: isMobile
        ? [<BigPetal3D size={28} />, <BigGoldPetal3D size={26} />]
        : [<BigPetal3D size={36} />, <BigGoldPetal3D size={34} />, <BigPetal3D size={24} />],
      direction: "across",
    },
    "occasions-garlands": {
      elements: isMobile
        ? [<BigJasmineCluster3D size={60} />, <BigMarigold3D size={55} />]
        : [<BigJasmineCluster3D size={80} />, <BigMarigold3D size={70} />, <BigPetal3D size={26} />],
      direction: "across-reverse",
    },
    "garlands-gallery": {
      elements: [<BigVine3D size={isMobile ? 80 : 140} />],
      direction: "curved",
    },
    "gallery-booking": {
      elements: isMobile
        ? [<BigFlowerCluster3D size={70} />]
        : [<BigFlowerCluster3D size={100} />, <BigGoldPetal3D size={30} />],
      direction: "cluster",
    },
  };

  const { elements: els, direction } = config[variant] || config["hero-services"];

  const posStyles: Record<string, string> = {
    "down": "flex-col items-center gap-4",
    "across": "flex-row items-center gap-6",
    "across-reverse": "flex-row-reverse items-center gap-6",
    "curved": "flex-row items-center gap-4",
    "cluster": "flex-wrap items-center justify-center gap-4",
  };

  return (
    <motion.div
      ref={ref}
      className={`relative h-20 sm:h-32 flex ${posStyles[direction]} justify-center pointer-events-none overflow-hidden`}
      style={{ perspective: "600px" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 1.5 }}
    >
      {els.map((el, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: direction === "down" ? -25 : 0, x: direction === "across" || direction === "across-reverse" ? 35 : 0, rotateZ: -8, scale: 0.6 }}
          whileInView={{ opacity: 0.45, y: 0, x: 0, rotateZ: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 2, delay: i * 0.35, ease: "easeOut" }}
        >
          <motion.div animate={{ rotateZ: [0, 2.5, 0, -2.5, 0] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}>
            {el}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Scroll-linked Floral Element ──────────────────────────────────

interface ScrollFlowerProps {
  flower: React.ReactNode;
  startY: string;
  startX: string;
  side?: "left" | "right";
  scrollRange?: [number, number];
  rotationDeg?: number;
  driftY?: number;
  driftX?: number;
  opacityRange?: [number, number];
}

export function ScrollFloralElement({
  flower, startY, startX, side = "left",
  scrollRange = [0.1, 0.6], rotationDeg = 180,
  driftY = 40, driftX = 15, opacityRange = [0.3, 0.5],
}: ScrollFlowerProps) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  const styleLeft = side === "left"
    ? { left: startX, right: "auto" }
    : { right: startX, left: "auto" };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top: startY, ...styleLeft, perspective: "600px" }}
      initial={{ opacity: 0 }}
      whileInView={{
        opacity: opacityRange[1],
        rotateZ: rotationDeg / 2,
        y: driftY / 2,
        x: side === "left" ? driftX / 2 : -driftX / 2,
        scale: 0.85,
      }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <motion.div animate={{ rotateZ: [0, 1.5, 0, -1.5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
        {flower}
      </motion.div>
    </motion.div>
  );
}

// ─── Floating Petals (BIGGER) ───────────────────────────────────────

export function FloatingPetals({ count = 5 }: { count?: number }) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  if (reduced) return null;

  const actualCount = isMobile ? Math.min(count, 3) : count;

  const petalTypes = [BigPetal3D, BigGoldPetal3D, BigPetal3D, BigGoldPetal3D, BigPetal3D, RosePetal, GoldPetal];
  const petalSizes = [38, 34, 42, 30, 36, 18, 16];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: "1000px" }}>
      {Array.from({ length: actualCount }).map((_, i) => {
        const Petal = petalTypes[i % petalTypes.length];
        const size = petalSizes[i % petalSizes.length];
        const leftPos = `${8 + i * 17}%`;
        const topStart = `${5 + i * 12}%`;
        const duration = 18 + i * 5;
        const delay = i * 2.5;
        const driftX = (i % 2 === 0 ? 1 : -1) * (10 + i * 4);
        const driftY = 25 + i * 10;

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: leftPos, top: topStart }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 0.28, 0.35, 0.2, 0],
              y: [0, driftY * 0.3, driftY * 0.6, driftY * 0.8, driftY],
              x: [0, driftX * 0.2, driftX * 0.4, driftX * 0.3, driftX * 0.5],
              rotateZ: [0, 45 + i * 20, 90 + i * 25, 135 + i * 15, 180 + i * 20],
              rotateY: [0, 12, 0, -12, 0],
              scale: [0.5, 0.75, 1, 0.85, 0.4],
            }}
            transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <Petal size={size} />
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Interactive Hover Flower ───────────────────────────────────────

interface InteractiveFlowerProps {
  flower: React.ReactNode;
  className?: string;
}

export function InteractiveFlower({ flower, className = "" }: InteractiveFlowerProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`pointer-events-auto cursor-default ${className}`}
      whileHover={reduced ? {} : { scale: 1.05, rotateZ: 3, y: -3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div animate={reduced ? {} : { rotateZ: [0, 1, 0, -1, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
        {flower}
      </motion.div>
    </motion.div>
  );
}

// ─── Floral Journey (BIG flowers across entire page) ────────────────

export function FloralJourney() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  if (reduced) return null;

  const flowerPlacements = isMobile ? [
    { flower: <BigRose3D size={70} />, y: "5%", x: "3%", side: "left" as const, rotation: 120, driftY: 35, driftX: 12 },
    { flower: <BigLeaf3D size={55} />, y: "25%", x: "5%", side: "right" as const, rotation: 90, driftY: 30, driftX: 14 },
    { flower: <BigJasmineCluster3D size={60} />, y: "45%", x: "2%", side: "left" as const, rotation: 60, driftY: 25, driftX: 18 },
    { flower: <BigMarigold3D size={60} />, y: "65%", x: "4%", side: "right" as const, rotation: 90, driftY: 28, driftX: 12 },
    { flower: <BigPetal3D size={35} />, y: "85%", x: "3%", side: "left" as const, rotation: 60, driftY: 18, driftX: 10 },
  ] : [
    // Hero — BIG rose drifts
    { flower: <BigRose3D size={110} />, y: "4%", x: "4%", side: "left" as const, rotation: 180, driftY: 60, driftX: 14 },
    // Services — BIG leaf enters
    { flower: <BigLeaf3D size={80} />, y: "16%", x: "6%", side: "right" as const, rotation: 90, driftY: 40, driftX: 20 },
    // Occasions — BIG petals diagonal
    { flower: <BigPetal3D size={48} />, y: "28%", x: "3%", side: "left" as const, rotation: 120, driftY: 35, driftX: 28 },
    // Garland — BIG jasmine cluster
    { flower: <BigJasmineCluster3D size={85} />, y: "40%", x: "5%", side: "right" as const, rotation: 60, driftY: 28, driftX: 18 },
    // Gallery — BIG vine reveals
    { flower: <BigVine3D size={140} />, y: "52%", x: "3%", side: "left" as const, rotation: 45, driftY: 25, driftX: 12 },
    // Testimonials — BIG marigold settles
    { flower: <BigMarigold3D size={80} />, y: "64%", x: "5%", side: "right" as const, rotation: 90, driftY: 30, driftX: 16 },
    // CTA — BIG flower cluster
    { flower: <BigFlowerCluster3D size={100} />, y: "76%", x: "2%", side: "left" as const, rotation: 60, driftY: 22, driftX: 16 },
    // Bottom — BIG gold petal + rose
    { flower: <BigGoldPetal3D size={44} />, y: "88%", x: "7%", side: "right" as const, rotation: 45, driftY: 15, driftX: 10 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" style={{ perspective: "1200px" }}>
      {flowerPlacements.map((p, i) => (
        <ScrollFloralElement
          key={i}
          flower={p.flower}
          startY={p.y}
          startX={p.x}
          side={p.side}
          scrollRange={[0.05 + i * 0.08, 0.1 + i * 0.08 + 0.5]}
          rotationDeg={p.rotation}
          driftY={p.driftY}
          driftX={p.driftX}
          opacityRange={[0.18, 0.40]}
        />
      ))}
    </div>
  );
}
