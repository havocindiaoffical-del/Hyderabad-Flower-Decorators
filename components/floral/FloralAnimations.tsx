"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  Rose3D, RosePetal, Jasmine3D, Marigold3D, Leaf3D,
  BotanicalStem3D, Vine3D, FlowerBud3D, GoldPetal,
} from "./FloralElements";
import { useReducedMotion, useMousePosition, useIsMobile } from "./hooks";

// ─── Hero 3D Flower Animation ──────────────────────────────────────
// 2–4 subtle 3D floral elements in the hero with mouse parallax

export function HeroFloralAnimation() {
  const reduced = useReducedMotion();
  const mouse = useMousePosition();
  const isMobile = useIsMobile();

  if (reduced) return null;

  // Parallax offsets — extremely gentle
  const baseX = useSpring(useMotionValue(0), { stiffness: 40, damping: 30 });
  const baseY = useSpring(useMotionValue(0), { stiffness: 40, damping: 30 });

  useEffect(() => {
    baseX.set((mouse.x - 0.5) * 20); // ±10px max
    baseY.set((mouse.y - 0.5) * 15); // ±7.5px max
  }, [mouse.x, mouse.y, baseX, baseY]);

  const x1 = useTransform(baseX, (v: number) => v * 0.5);
  const y1 = useTransform(baseY, (v: number) => v * 0.3);
  const x2 = useTransform(baseX, (v: number) => v * -0.8);
  const y2 = useTransform(baseY, (v: number) => v * -0.5);
  const x3 = useTransform(baseX, (v: number) => v * 0.3);
  const y3 = useTransform(baseY, (v: number) => v * 0.6);
  const x4 = useTransform(baseX, (v: number) => v * -0.4);
  const y4 = useTransform(baseY, (v: number) => v * -0.2);

  // Mobile: fewer elements
  const elements = isMobile ? 2 : 4;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]" style={{ perspective: "800px" }}>
      {/* Rose near headline — left side */}
      {elements >= 1 && (
        <motion.div
          className="absolute top-[28%] left-[4%] sm:left-[8%]"
          style={{ x: x1, y: y1 }}
          initial={{ opacity: 0, rotateY: 30, rotateX: -10 }}
          animate={{ opacity: 0.55, rotateY: 0, rotateX: 0 }}
          transition={{ duration: 2.5, delay: 0.8, ease: "easeOut" }}
        >
          <motion.div
            animate={{ rotateZ: [0, 2, 0, -2, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Rose3D size={isMobile ? 28 : 36} />
          </motion.div>
        </motion.div>
      )}

      {/* Delicate leaf near image edge — right */}
      {elements >= 2 && (
        <motion.div
          className="absolute top-[18%] right-[2%] sm:right-[5%] lg:right-[8%]"
          style={{ x: x2, y: y2 }}
          initial={{ opacity: 0, rotateY: -20, scale: 0.8 }}
          animate={{ opacity: 0.4, rotateY: 0, scale: 1 }}
          transition={{ duration: 2, delay: 1.2, ease: "easeOut" }}
        >
          <motion.div
            animate={{ rotateZ: [0, -3, 0, 3, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <Leaf3D size={isMobile ? 22 : 32} />
          </motion.div>
        </motion.div>
      )}

      {/* Floating petal in background — center-right */}
      {elements >= 3 && (
        <motion.div
          className="absolute top-[55%] right-[25%] lg:right-[30%]"
          style={{ x: x3, y: y3 }}
          initial={{ opacity: 0, rotateY: 45, scale: 0.7 }}
          animate={{ opacity: 0.35, rotateY: 0, scale: 1 }}
          transition={{ duration: 2.2, delay: 1.5, ease: "easeOut" }}
        >
          <motion.div
            animate={{ rotateZ: [0, 5, 0, -5, 0], y: [0, -6, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
            <RosePetal size={isMobile ? 16 : 22} />
          </motion.div>
        </motion.div>
      )}

      {/* Small gold petal — bottom-left */}
      {elements >= 4 && (
        <motion.div
          className="absolute bottom-[20%] left-[15%] lg:left-[20%]"
          style={{ x: x4, y: y4 }}
          initial={{ opacity: 0, rotateX: 20 }}
          animate={{ opacity: 0.3, rotateX: 0 }}
          transition={{ duration: 2, delay: 1.8, ease: "easeOut" }}
        >
          <motion.div
            animate={{ rotateZ: [0, -4, 0, 4, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            <GoldPetal size={16} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Section Floral Transition ──────────────────────────────────────
// Flowers that drift between sections on scroll

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
        ? [<Rose3D size={24} />, <Leaf3D size={18} />]
        : [<Rose3D size={32} />, <Leaf3D size={24} />, <RosePetal size={16} />],
      direction: "down",
    },
    "services-occasions": {
      elements: isMobile
        ? [<RosePetal size={14} />, <RosePetal size={12} />]
        : [<RosePetal size={18} />, <RosePetal size={14} />, <GoldPetal size={12} />],
      direction: "across",
    },
    "occasions-garlands": {
      elements: isMobile
        ? [<Jasmine3D size={22} />, <Marigold3D size={24} />]
        : [<Jasmine3D size={28} />, <Marigold3D size={30} />, <RosePetal size={14} />],
      direction: "across-reverse",
    },
    "garlands-gallery": {
      elements: [<Vine3D size={isMobile ? 50 : 80} />],
      direction: "curved",
    },
    "gallery-booking": {
      elements: isMobile
        ? [<Rose3D size={24} />, <FlowerBud3D size={16} />]
        : [<Rose3D size={30} />, <FlowerBud3D size={18} />, <Jasmine3D size={22} />],
      direction: "cluster",
    },
  };

  const { elements: els, direction } = config[variant] || config["hero-services"];

  const posStyles: Record<string, string> = {
    "down": "flex-col items-center gap-4",
    "across": "flex-row items-center gap-6",
    "across-reverse": "flex-row-reverse items-center gap-6",
    "curved": "flex-row items-center gap-4",
    "cluster": "flex-wrap items-center justify-center gap-3",
  };

  return (
    <motion.div
      ref={ref}
      className={`relative h-16 sm:h-24 flex ${posStyles[direction]} justify-center pointer-events-none overflow-hidden`}
      style={{ perspective: "600px" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 1.5 }}
    >
      {els.map((el, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: direction === "down" ? -20 : 0, x: direction === "across" || direction === "across-reverse" ? 30 : 0, rotateZ: -5, scale: 0.7 }}
          whileInView={{ opacity: 0.4, y: 0, x: 0, rotateZ: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.8, delay: i * 0.3, ease: "easeOut" }}
        >
          <motion.div
            animate={{ rotateZ: [0, 2, 0, -2, 0] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {el}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Scroll-linked Floral Element ──────────────────────────────────
// Individual flower that animates based on scroll position

interface ScrollFlowerProps {
  flower: React.ReactNode;
  startY: string;  // CSS top position
  startX: string;  // CSS left/right position
  side?: "left" | "right";
  scrollRange?: [number, number]; // viewport progress range where visible
  rotationDeg?: number; // total rotation over scroll
  driftY?: number; // vertical drift px over scroll
  driftX?: number; // horizontal drift px over scroll
  opacityRange?: [number, number];
}

export function ScrollFloralElement({
  flower,
  startY,
  startX,
  side = "left",
  scrollRange = [0.1, 0.6],
  rotationDeg = 180,
  driftY = 40,
  driftX = 15,
  opacityRange = [0.3, 0.5],
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
      <motion.div
        animate={{ rotateZ: [0, 1.5, 0, -1.5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        {flower}
      </motion.div>
    </motion.div>
  );
}

// ─── Floating Petals System ────────────────────────────────────────
// 3–10 subtle floating petals that move slowly, rotate, and fade

export function FloatingPetals({ count = 5 }: { count?: number }) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  if (reduced) return null;

  const actualCount = isMobile ? Math.min(count, 3) : count;

  const petalTypes = [RosePetal, GoldPetal, RosePetal, GoldPetal, RosePetal];
  const petalSizes = [16, 14, 18, 12, 15];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: "1000px" }}>
      {Array.from({ length: actualCount }).map((_, i) => {
        const Petal = petalTypes[i % petalTypes.length];
        const size = petalSizes[i % petalSizes.length];
        const leftPos = `${10 + i * 18}%`;
        const topStart = `${5 + i * 15}%`;
        const duration = 15 + i * 4;
        const delay = i * 2;
        const driftX = (i % 2 === 0 ? 1 : -1) * (8 + i * 3);
        const driftY = 20 + i * 8;

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: leftPos, top: topStart }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: [0, 0.3, 0.35, 0.2, 0],
              y: [0, driftY * 0.3, driftY * 0.6, driftY * 0.8, driftY],
              x: [0, driftX * 0.2, driftX * 0.4, driftX * 0.3, driftX * 0.5],
              rotateZ: [0, 45 + i * 15, 90 + i * 20, 135 + i * 10, 180 + i * 15],
              rotateY: [0, 10, 0, -10, 0],
              scale: [0.6, 0.8, 1, 0.9, 0.5],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Petal size={size} />
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Interactive Hover Flower ───────────────────────────────────────
// Flower that responds gently to hover

interface InteractiveFlowerProps {
  flower: React.ReactNode;
  className?: string;
}

export function InteractiveFlower({ flower, className = "" }: InteractiveFlowerProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`pointer-events-auto cursor-default ${className}`}
      whileHover={reduced ? {} : {
        scale: 1.05,
        rotateZ: 3,
        y: -3,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        animate={reduced ? {} : { rotateZ: [0, 1, 0, -1, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        {flower}
      </motion.div>
    </motion.div>
  );
}

// ─── Scroll-based Floral Journey ───────────────────────────────────
// Comprehensive system that places flowers across the entire page
// based on scroll progress

export function FloralJourney() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  if (reduced) return null;

  const flowerPlacements = isMobile ? [
    { flower: <Rose3D size={24} />, y: "5%", x: "5%", side: "left" as const, rotation: 120, driftY: 30, driftX: 10 },
    { flower: <Leaf3D size={20} />, y: "25%", x: "8%", side: "right" as const, rotation: 90, driftY: 30, driftX: 10 },
    { flower: <Jasmine3D size={20} />, y: "45%", x: "3%", side: "left" as const, rotation: 60, driftY: 20, driftX: 15 },
    { flower: <Marigold3D size={24} />, y: "65%", x: "6%", side: "right" as const, rotation: 90, driftY: 25, driftX: 10 },
    { flower: <FlowerBud3D size={14} />, y: "85%", x: "5%", side: "left" as const, rotation: 60, driftY: 15, driftX: 10 },
  ] : [
    // Near hero — rose drifts and rotates
    { flower: <Rose3D size={36} />, y: "5%", x: "6%", side: "left" as const, rotation: 180, driftY: 50, driftX: 10 },
    // Services area — leaf enters
    { flower: <Leaf3D size={32} />, y: "18%", x: "8%", side: "right" as const, rotation: 90, driftY: 30, driftX: 15 },
    // Occasions — petals drift diagonally
    { flower: <RosePetal size={22} />, y: "30%", x: "4%", side: "left" as const, rotation: 120, driftY: 25, driftX: 20 },
    // Garland section — jasmine
    { flower: <Jasmine3D size={28} />, y: "42%", x: "7%", side: "right" as const, rotation: 60, driftY: 20, driftX: 12 },
    // Gallery — botanical stem reveals
    { flower: <BotanicalStem3D size={50} />, y: "55%", x: "5%", side: "left" as const, rotation: 45, driftY: 20, driftX: 8 },
    // CTA — marigold settles
    { flower: <Marigold3D size={30} />, y: "68%", x: "6%", side: "right" as const, rotation: 90, driftY: 25, driftX: 10 },
    // Near bottom — flower cluster
    { flower: <Rose3D size={28} />, y: "78%", x: "3%", side: "left" as const, rotation: 60, driftY: 15, driftX: 12 },
    { flower: <FlowerBud3D size={18} />, y: "82%", x: "9%", side: "right" as const, rotation: 45, driftY: 10, driftX: 8 },
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
          opacityRange={[0.15, 0.35]}
        />
      ))}
    </div>
  );
}
