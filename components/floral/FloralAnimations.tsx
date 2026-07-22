"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import {
  BigRose3D, BigMarigold3D, BigJasmineCluster3D, BigLeaf3D,
  BigVine3D, BigFlowerCluster3D, BigPetal3D, BigGoldPetal3D,
} from "./BigFloralElements";
import {
  Rose3D, RosePetal, Jasmine3D, Marigold3D, Leaf3D,
  BotanicalStem3D, Vine3D, FlowerBud3D, GoldPetal,
} from "./FloralElements";
import { useReducedMotion, useIsMobile } from "./hooks";

// ─── Floating Petals — continuous gentle drift ────────────────────
// These animate endlessly with Infinity repeat, so they NEVER stick.

export function FloatingPetals({ count = 5 }: { count?: number }) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  if (reduced) return null;

  const actualCount = isMobile ? Math.min(count, 3) : count;

  const petalTypes = [BigPetal3D, BigGoldPetal3D, RosePetal, GoldPetal, BigPetal3D, BigGoldPetal3D, RosePetal];
  const petalSizes = isMobile ? [24, 22, 14, 12, 26, 20, 14] : [38, 34, 18, 16, 42, 30, 20];

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]" style={{ perspective: "1200px" }}>
      {Array.from({ length: actualCount }).map((_, i) => {
        const Petal = petalTypes[i % petalTypes.length];
        const size = petalSizes[i % petalSizes.length];
        const leftPos = `${10 + i * 18}%`;
        const topStart = `${-10 - i * 5}%`;
        const totalDuration = 25 + i * 6;
        const driftX = (i % 2 === 0 ? 1 : -1) * (15 + i * 5);
        const driftY = 1200; // large enough value for vertical travel (works on all screen sizes)

        return (
          <motion.div
            key={`petal-${i}`}
            className="absolute"
            style={{ left: leftPos, top: topStart }}
            initial={{ opacity: 0, scale: 0.5, y: 0, x: 0, rotateZ: 0 }}
            animate={{
              opacity: [0, 0.25, 0.35, 0.30, 0.15, 0],
              y: [0, driftY * 0.2, driftY * 0.4, driftY * 0.6, driftY * 0.8, driftY],
              x: [0, driftX * 0.3, driftX * 0.5, driftX * 0.4, driftX * 0.6, driftX * 0.7],
              rotateZ: [0, 50 + i * 15, 120 + i * 20, 200 + i * 10, 280 + i * 15, 360],
              rotateY: [0, 10, -10, 8, -8, 0],
              scale: [0.4, 0.65, 0.9, 0.85, 0.6, 0.3],
            }}
            transition={{
              duration: totalDuration,
              delay: i * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Petal size={size} />
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Scroll-linked Flowers — move with page scroll, never stick ──
// Uses useScroll() + useTransform() so flowers respond to actual scroll position

export function ScrollFlowers() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  if (reduced) return null;

  const { scrollYProgress } = useScroll();

  const placements = isMobile ? [
    { flower: <BigRose3D size={65} />, x: "-5%", opacityMul: 1, rotateMul: 1 },
    { flower: <BigLeaf3D size={50} />, x: "90%", opacityMul: 0.8, rotateMul: 0.7 },
    { flower: <BigJasmineCluster3D size={55} />, x: "0%", opacityMul: 0.7, rotateMul: 0.9 },
    { flower: <BigMarigold3D size={55} />, x: "85%", opacityMul: 0.8, rotateMul: 0.6 },
    { flower: <BigPetal3D size={30} />, x: "10%", opacityMul: 0.6, rotateMul: 0.5 },
  ] : [
    { flower: <BigRose3D size={100} />, x: "-5%", opacityMul: 1, rotateMul: 1 },
    { flower: <BigLeaf3D size={70} />, x: "92%", opacityMul: 0.8, rotateMul: 0.8 },
    { flower: <BigPetal3D size={44} />, x: "0%", opacityMul: 0.7, rotateMul: 0.7 },
    { flower: <BigJasmineCluster3D size={75} />, x: "88%", opacityMul: 0.8, rotateMul: 0.6 },
    { flower: <BigVine3D size={120} />, x: "-3%", opacityMul: 0.6, rotateMul: 0.5 },
    { flower: <BigMarigold3D size={70} />, x: "90%", opacityMul: 0.7, rotateMul: 0.7 },
    { flower: <BigFlowerCluster3D size={85} />, x: "-2%", opacityMul: 0.6, rotateMul: 0.4 },
    { flower: <BigGoldPetal3D size={38} />, x: "85%", opacityMul: 0.5, rotateMul: 0.3 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]" style={{ perspective: "1200px" }}>
      {placements.map((p, i) => {
        // Each flower fades in/out and drifts as the page scrolls
        const entryProgress = 0.05 + i * 0.07;
        const exitProgress = entryProgress + 0.25;

        const opacity = useTransform(
          scrollYProgress,
          [entryProgress, entryProgress + 0.05, exitProgress - 0.05, exitProgress],
          [0, 0.3 * p.opacityMul, 0.25 * p.opacityMul, 0]
        );

        const y = useTransform(
          scrollYProgress,
          [entryProgress, exitProgress],
          [`-${10 + i * 5}%`, `${90 + i * 8}%`]
        );

        const rotation = useTransform(
          scrollYProgress,
          [entryProgress, exitProgress],
          [0, (120 + i * 30) * p.rotateMul]
        );

        return (
          <motion.div
            key={`scroll-flower-${i}`}
            className="absolute"
            style={{
              left: p.x,
              opacity,
              y,
              rotateZ: rotation,
            }}
            transition={{ type: "tween" }}
          >
            {/* Gentle sway so it never looks completely frozen */}
            <motion.div
              animate={{ rotateZ: [0, 2, 0, -2, 0] }}
              transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut" }}
            >
              {p.flower}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Hero 3D Flower Animation ──────────────────────────────────────
// 6 prominent 3D floral elements in the hero with mouse parallax

export function HeroFloralAnimation() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  if (reduced) return null;

  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const baseX = useSpring(useMotionValue(0), { stiffness: 40, damping: 30 });
  const baseY = useSpring(useMotionValue(0), { stiffness: 40, damping: 30 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
      baseX.set((mouseRef.current.x - 0.5) * 30);
      baseY.set((mouseRef.current.y - 0.5) * 20);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [baseX, baseY]);

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
      {elCount >= 1 && (
        <motion.div className="absolute top-[22%] left-[2%] sm:left-[5%]" style={{ x: x1, y: y1 }}
          initial={{ opacity: 0, rotateY: 25, rotateX: -8, scale: 0.7 }}
          animate={{ opacity: 0.45, rotateY: 0, rotateX: 0, scale: 1 }}
          transition={{ duration: 2.5, delay: 0.6, ease: "easeOut" }}>
          <motion.div animate={{ rotateZ: [0, 3, 0, -3, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
            <BigRose3D size={isMobile ? 60 : 100} />
          </motion.div>
        </motion.div>
      )}
      {elCount >= 2 && (
        <motion.div className="absolute top-[14%] right-[1%] sm:right-[3%] lg:right-[6%]" style={{ x: x2, y: y2 }}
          initial={{ opacity: 0, rotateY: -15, scale: 0.8 }}
          animate={{ opacity: 0.35, rotateY: 0, scale: 1 }}
          transition={{ duration: 2.2, delay: 1.0, ease: "easeOut" }}>
          <motion.div animate={{ rotateZ: [0, -4, 0, 4, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}>
            <BigLeaf3D size={isMobile ? 50 : 70} />
          </motion.div>
        </motion.div>
      )}
      {elCount >= 3 && (
        <motion.div className="absolute top-[50%] right-[18%] lg:right-[28%]" style={{ x: x3, y: y3 }}
          initial={{ opacity: 0, rotateY: 40, scale: 0.6 }}
          animate={{ opacity: 0.32, rotateY: 0, scale: 1 }}
          transition={{ duration: 2.4, delay: 1.3, ease: "easeOut" }}>
          <motion.div animate={{ rotateZ: [0, 6, 0, -6, 0], y: [0, -10, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}>
            <BigPetal3D size={isMobile ? 30 : 48} />
          </motion.div>
        </motion.div>
      )}
      {elCount >= 4 && (
        <motion.div className="absolute bottom-[18%] left-[10%] lg:left-[14%]" style={{ x: x4, y: y4 }}
          initial={{ opacity: 0, rotateX: 18, scale: 0.6 }}
          animate={{ opacity: 0.30, rotateX: 0, scale: 1 }}
          transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}>
          <motion.div animate={{ rotateZ: [0, -3, 0, 3, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}>
            <BigJasmineCluster3D size={isMobile ? 55 : 80} />
          </motion.div>
        </motion.div>
      )}
      {elCount >= 5 && (
        <motion.div className="absolute top-[35%] right-[10%] lg:right-[15%]" style={{ x: x5, y: y5 }}
          initial={{ opacity: 0, rotateX: 25, scale: 0.5 }}
          animate={{ opacity: 0.28, rotateX: 0, scale: 1 }}
          transition={{ duration: 2, delay: 1.8, ease: "easeOut" }}>
          <motion.div animate={{ rotateZ: [0, 5, 0, -5, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
            <BigGoldPetal3D size={isMobile ? 28 : 40} />
          </motion.div>
        </motion.div>
      )}
      {elCount >= 6 && (
        <motion.div className="absolute top-[8%] right-[22%] lg:right-[25%]" style={{ x: x6, y: y6 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.22, scale: 1 }}
          transition={{ duration: 2, delay: 2.0, ease: "easeOut" }}>
          <motion.div animate={{ rotateZ: [0, 2, 0, -2, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
            <Rose3D size={42} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Section Floral Transition ─────────────────────────────────────

interface SectionTransitionProps {
  variant: "hero-services" | "services-occasions" | "occasions-garlands" | "garlands-gallery" | "gallery-booking";
}

export function SectionFloralTransition({ variant }: SectionTransitionProps) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  if (reduced) return null;

  const config: Record<string, { elements: React.ReactNode[]; direction: string }> = {
    "hero-services": {
      elements: isMobile ? [<BigRose3D size={60} />, <Leaf3D size={30} />] : [<BigRose3D size={80} />, <BigLeaf3D size={50} />, <BigPetal3D size={30} />],
      direction: "down",
    },
    "services-occasions": {
      elements: isMobile ? [<BigPetal3D size={28} />, <BigGoldPetal3D size={26} />] : [<BigPetal3D size={36} />, <BigGoldPetal3D size={34} />, <BigPetal3D size={24} />],
      direction: "across",
    },
    "occasions-garlands": {
      elements: isMobile ? [<BigJasmineCluster3D size={60} />, <BigMarigold3D size={55} />] : [<BigJasmineCluster3D size={80} />, <BigMarigold3D size={70} />, <BigPetal3D size={26} />],
      direction: "across-reverse",
    },
    "garlands-gallery": {
      elements: [<BigVine3D size={isMobile ? 80 : 140} />],
      direction: "curved",
    },
    "gallery-booking": {
      elements: isMobile ? [<BigFlowerCluster3D size={70} />] : [<BigFlowerCluster3D size={100} />, <BigGoldPetal3D size={30} />],
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
      className={`relative h-20 sm:h-32 flex ${posStyles[direction]} justify-center pointer-events-none overflow-hidden`}
      style={{ perspective: "600px" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.5 }}
    >
      {els.map((el, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: direction === "down" ? -25 : 0, x: direction === "across" || direction === "across-reverse" ? 35 : 0, rotateZ: -8, scale: 0.6 }}
          whileInView={{ opacity: 0.45, y: 0, x: 0, rotateZ: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 2, delay: i * 0.35, ease: "easeOut" }}
        >
          <motion.div animate={{ rotateZ: [0, 2.5, 0, -2.5, 0] }} transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}>
            {el}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
