"use client";

import React from "react";

// ─── BIG 3D Floral Elements ────────────────────────────────────────
// Large-scale flowers for hero and section backgrounds

// ─── BIG Rose (hero-scale, 3-layer bloom) ──────────────────────────
export function BigRose3D({ size = 120, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      style={{ filter: "drop-shadow(0 8px 24px rgba(184,147,95,0.18))" }}
    >
      <defs>
        <radialGradient id="brg1" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#f0d0d0" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#e8a0a0" stopOpacity="0.92" />
          <stop offset="70%" stopColor="#d47878" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#c45c5c" stopOpacity="0.82" />
        </radialGradient>
        <radialGradient id="brg2" cx="50%" cy="40%" r="40%">
          <stop offset="0%" stopColor="#f8e8e8" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#e8a0a0" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#d47878" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="brg3" cx="50%" cy="50%" r="20%">
          <stop offset="0%" stopColor="#fff0f0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f0c8c8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="brgs" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B7553" />
          <stop offset="100%" stopColor="#3d5435" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path d="M100 120 Q100 140, 96 190" stroke="#5B7553" strokeWidth="3" fill="none" />
      {/* Leaves */}
      <path d="M100 150 Q120 138, 135 128 Q118 142, 100 150" fill="url(#brgs)" opacity="0.85" />
      <path d="M96 165 Q76 155, 60 145 Q78 160, 96 165" fill="url(#brgs)" opacity="0.75" />
      {/* Outer petals — Layer 1 (5 large petals) */}
      <path d="M55 90 Q45 50, 70 30 Q80 60, 100 80 Q75 95, 55 90" fill="url(#brg1)" opacity="0.78" />
      <path d="M145 90 Q155 50, 130 30 Q120 60, 100 80 Q125 95, 145 90" fill="url(#brg1)" opacity="0.78" />
      <path d="M65 115 Q35 105, 40 70 Q60 85, 100 88 Q72 115, 65 115" fill="url(#brg1)" opacity="0.72" />
      <path d="M135 115 Q165 105, 160 70 Q140 85, 100 88 Q128 115, 135 115" fill="url(#brg1)" opacity="0.72" />
      <path d="M80 65 Q70 25, 100 15 Q110 50, 100 70 Q85 68, 80 65" fill="url(#brg1)" opacity="0.75" />
      <path d="M120 65 Q130 25, 100 15 Q90 50, 100 70 Q115 68, 120 65" fill="url(#brg1)" opacity="0.75" />
      {/* Inner petals — Layer 2 */}
      <path d="M80 82 Q72 48, 100 35 Q115 55, 100 82 Q85 82, 80 82" fill="url(#brg2)" opacity="0.88" />
      <path d="M120 82 Q128 48, 100 35 Q85 55, 100 82 Q115 82, 120 82" fill="#d47878" opacity="0.85" />
      <path d="M75 95 Q55 85, 60 65 Q80 75, 100 85 Q82 95, 75 95" fill="#e8a0a0" opacity="0.82" />
      <path d="M125 95 Q145 85, 140 65 Q120 75, 100 85 Q118 95, 125 95" fill="#d47878" opacity="0.82" />
      {/* Center glow */}
      <circle cx="100" cy="72" r="22" fill="url(#brg3)" />
    </svg>
  );
}

// ─── BIG Marigold (full bloom, Indian ceremonial) ───────────────────
export function BigMarigold3D({ size = 100, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      className={className}
      style={{ filter: "drop-shadow(0 8px 20px rgba(200,150,50,0.2))" }}
    >
      <defs>
        <radialGradient id="bmg1" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#f8c840" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#f0b040" stopOpacity="0.92" />
          <stop offset="70%" stopColor="#d49620" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#c07a10" stopOpacity="0.82" />
        </radialGradient>
        <radialGradient id="bmg2" cx="50%" cy="50%" r="25%">
          <stop offset="0%" stopColor="#ffe870" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d49620" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Outer ruffled petals — 16 petals */}
      {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 80 + Math.cos(rad) * 55;
        const cy = 80 + Math.sin(rad) * 55;
        return (
          <ellipse key={i} cx={cx} cy={cy} rx="28" ry="12" fill="url(#bmg1)" opacity="0.82"
            transform={`rotate(${angle}, ${cx}, ${cy})`} />
        );
      })}
      {/* Inner petals — 10 */}
      {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 80 + Math.cos(rad) * 32;
        const cy = 80 + Math.sin(rad) * 32;
        return (
          <ellipse key={`b-${i}`} cx={cx} cy={cy} rx="18" ry="8" fill="#f0b040" opacity="0.9"
            transform={`rotate(${angle}, ${cx}, ${cy})`} />
        );
      })}
      {/* Center */}
      <circle cx="80" cy="80" r="14" fill="url(#bmg2)" />
      <circle cx="80" cy="80" r="6" fill="#B8935F" opacity="0.5" />
    </svg>
  );
}

// ─── BIG Jasmine Cluster (3 blooms) ────────────────────────────────
export function BigJasmineCluster3D({ size = 90, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      className={className}
      style={{ filter: "drop-shadow(0 6px 18px rgba(255,255,240,0.25))" }}
    >
      <defs>
        <radialGradient id="bjg1" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#f5f0e8" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#ede5d5" stopOpacity="0.85" />
        </radialGradient>
        <linearGradient id="bjgs" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B7553" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3d5435" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Connecting stems */}
      <path d="M70 140 Q68 120, 60 100" stroke="#5B7553" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M70 140 Q72 120, 80 105" stroke="#5B7553" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M70 140 Q70 130, 70 120" stroke="#5B7553" strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Small leaf */}
      <path d="M60 120 Q48 112, 42 105 Q52 118, 60 120" fill="url(#bjgs)" opacity="0.5" />
      {/* Flower 1 — top center */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 70 + Math.cos(rad) * 18;
        const cy = 30 + Math.sin(rad) * 18;
        return <ellipse key={`f1-${i}`} cx={cx} cy={cy} rx="12" ry="7" fill="url(#bjg1)" opacity="0.9"
          transform={`rotate(${angle}, ${cx}, ${cy})`} />;
      })}
      <circle cx="70" cy="30" r="5" fill="#B8935F" opacity="0.6" />
      {/* Flower 2 — bottom left */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 50 + Math.cos(rad) * 15;
        const cy = 80 + Math.sin(rad) * 15;
        return <ellipse key={`f2-${i}`} cx={cx} cy={cy} rx="10" ry="6" fill="url(#bjg1)" opacity="0.85"
          transform={`rotate(${angle}, ${cx}, ${cy})`} />;
      })}
      <circle cx="50" cy="80" r="4" fill="#B8935F" opacity="0.5" />
      {/* Flower 3 — bottom right */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 88 + Math.cos(rad) * 15;
        const cy = 85 + Math.sin(rad) * 15;
        return <ellipse key={`f3-${i}`} cx={cx} cy={cy} rx="10" ry="6" fill="url(#bjg1)" opacity="0.85"
          transform={`rotate(${angle}, ${cx}, ${cy})`} />;
      })}
      <circle cx="88" cy="85" r="4" fill="#B8935F" opacity="0.5" />
    </svg>
  );
}

// ─── BIG Leaf (monstera-style, dramatic) ────────────────────────────
export function BigLeaf3D({ size = 80, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 1.6}
      viewBox="0 0 100 160"
      className={className}
      style={{ filter: "drop-shadow(0 6px 16px rgba(91,117,83,0.15))" }}
    >
      <defs>
        <linearGradient id="blg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#90b080" stopOpacity="0.92" />
          <stop offset="35%" stopColor="#7A9470" stopOpacity="0.88" />
          <stop offset="65%" stopColor="#5B7553" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#3d5435" stopOpacity="0.82" />
        </linearGradient>
        <linearGradient id="blg2" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#a0c890" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#5B7553" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Large leaf body */}
      <path d="M50 0 Q85 20, 90 40 Q85 60, 70 80 Q60 100, 50 130 Q50 145, 50 160 Q40 145, 40 130 Q30 100, 20 80 Q15 60, 10 40 Q15 20, 50 0" fill="url(#blg1)" />
      {/* Split cuts (monstera style) */}
      <path d="M85 55 Q78 48, 70 45 Q76 52, 85 55" fill="url(#blg1)" opacity="0.9" />
      <path d="M15 60 Q22 52, 30 48 Q24 56, 15 60" fill="url(#blg1)" opacity="0.9" />
      {/* Vein system */}
      <path d="M50 5 L50 150" stroke="url(#blg2)" strokeWidth="1.5" fill="none" />
      <path d="M50 30 L78 42" stroke="#7A9470" strokeWidth="0.8" fill="none" opacity="0.45" />
      <path d="M50 50 L22 38" stroke="#7A9470" strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M50 70 L75 80" stroke="#7A9470" strokeWidth="0.8" fill="none" opacity="0.35" />
      <path d="M50 90 L25 95" stroke="#7A9470" strokeWidth="0.8" fill="none" opacity="0.35" />
      <path d="M50 110 L70 118" stroke="#7A9470" strokeWidth="0.6" fill="none" opacity="0.3" />
    </svg>
  );
}

// ─── BIG Vine (long, sweeping) ──────────────────────────────────────
export function BigVine3D({ size = 140, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox="0 0 280 140"
      className={className}
      style={{ filter: "drop-shadow(0 4px 12px rgba(91,117,83,0.08))" }}
    >
      <defs>
        <linearGradient id="bvg1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5B7553" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#7A9470" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#3d5435" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* Long sweeping vine */}
      <path d="M0 80 Q40 40, 80 55 Q120 70, 160 45 Q200 20, 240 40 Q280 60, 280 70" stroke="url(#bvg1)" strokeWidth="2.5" fill="none" />
      {/* Leaves along vine */}
      <path d="M80 55 Q90 45, 95 35 Q85 48, 80 55" fill="#7A9470" opacity="0.55" />
      <path d="M160 45 Q150 38, 145 28 Q155 42, 160 45" fill="#5B7553" opacity="0.5" />
      <path d="M120 70 Q128 62, 132 52 Q124 64, 120 70" fill="#7A9470" opacity="0.45" />
      <path d="M240 40 Q250 32, 255 22 Q248 38, 240 40" fill="#7A9470" opacity="0.45" />
      {/* Flower buds */}
      <circle cx="95" cy="28" r="5" fill="#e8a0a0" opacity="0.45" />
      <circle cx="200" cy="18" r="4" fill="#f0c8c8" opacity="0.35" />
      {/* Small jasmine bloom */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 250 + Math.cos(rad) * 10;
        const cy = 22 + Math.sin(rad) * 10;
        return <ellipse key={i} cx={cx} cy={cy} rx="8" ry="4" fill="#f5f0e8" opacity="0.5"
          transform={`rotate(${angle}, ${cx}, ${cy})`} />;
      })}
    </svg>
  );
}

// ─── BIG Flower Cluster (mixed blooms) ──────────────────────────────
export function BigFlowerCluster3D({ size = 110, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      className={className}
      style={{ filter: "drop-shadow(0 8px 24px rgba(184,147,95,0.18))" }}
    >
      <defs>
        <radialGradient id="bfcg1" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#f0d0d0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d47878" stopOpacity="0.8" />
        </radialGradient>
        <radialGradient id="bfcg2" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ede5d5" stopOpacity="0.85" />
        </radialGradient>
        <radialGradient id="bfcg3" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#f8c840" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d49620" stopOpacity="0.8" />
        </radialGradient>
      </defs>
      {/* Branch stems */}
      <path d="M90 180 Q88 160, 75 130" stroke="#5B7553" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M90 180 Q92 155, 105 135" stroke="#5B7553" strokeWidth="2" fill="none" opacity="0.55" />
      <path d="M90 180 Q90 165, 90 155" stroke="#5B7553" strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Leaf */}
      <path d="M75 155 Q60 145, 55 135 Q65 152, 75 155" fill="#5B7553" opacity="0.5" />
      {/* Rose bloom — top */}
      <path d="M55 50 Q45 20, 75 10 Q80 40, 90 50 Q65 55, 55 50" fill="url(#bfcg1)" opacity="0.75" />
      <path d="M125 50 Q135 20, 105 10 Q100 40, 90 50 Q115 55, 125 50" fill="url(#bfcg1)" opacity="0.75" />
      <path d="M72 55 Q60 48, 65 30 Q78 42, 90 50 Q76 58, 72 55" fill="url(#bfcg1)" opacity="0.82" />
      <path d="M108 55 Q120 48, 115 30 Q102 42, 90 50 Q104 58, 108 55" fill="url(#bfcg1)" opacity="0.82" />
      {/* Jasmine — bottom left */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 60 + Math.cos(rad) * 14;
        const cy = 120 + Math.sin(rad) * 14;
        return <ellipse key={`j-${i}`} cx={cx} cy={cy} rx="10" ry="5" fill="url(#bfcg2)" opacity="0.85"
          transform={`rotate(${angle}, ${cx}, ${cy})`} />;
      })}
      <circle cx="60" cy="120" r="4" fill="#B8935F" opacity="0.6" />
      {/* Small marigold — bottom right */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 130 + Math.cos(rad) * 22;
        const cy = 130 + Math.sin(rad) * 22;
        return <ellipse key={`m-${i}`} cx={cx} cy={cy} rx="12" ry="5" fill="url(#bfcg3)" opacity="0.8"
          transform={`rotate(${angle}, ${cx}, ${cy})`} />;
      })}
      <circle cx="130" cy="130" r="6" fill="#f8d060" opacity="0.5" />
    </svg>
  );
}

// ─── BIG Petal (hero-scale floating) ────────────────────────────────
export function BigPetal3D({ size = 50, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 70 98"
      className={className}
      style={{ filter: "drop-shadow(0 6px 18px rgba(184,147,95,0.14))" }}
    >
      <defs>
        <linearGradient id="bpg" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#f0d0d0" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#e8a0a0" stopOpacity="0.88" />
          <stop offset="70%" stopColor="#d47878" stopOpacity="0.82" />
          <stop offset="100%" stopColor="#c45c5c" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path d="M35 0 Q58 14, 65 42 Q58 70, 35 98 Q12 70, 5 42 Q12 14, 35 0" fill="url(#bpg)" />
      <path d="M35 14 Q50 22, 55 42 Q50 65, 35 78 Q20 65, 15 42 Q20 22, 35 14" fill="#f8e8e8" opacity="0.4" />
    </svg>
  );
}

// ─── BIG Gold Petal ─────────────────────────────────────────────────
export function BigGoldPetal3D({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 70 98"
      className={className}
      style={{ filter: "drop-shadow(0 6px 16px rgba(184,147,95,0.16))" }}
    >
      <defs>
        <linearGradient id="bgpg" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#e8d0b0" stopOpacity="0.88" />
          <stop offset="40%" stopColor="#D4B886" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#B8935F" stopOpacity="0.82" />
          <stop offset="100%" stopColor="#a07840" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <path d="M35 0 Q58 14, 65 42 Q58 70, 35 98 Q12 70, 5 42 Q12 14, 35 0" fill="url(#bgpg)" />
      <path d="M35 14 Q50 22, 55 42 Q50 65, 35 78 Q20 65, 15 42 Q20 22, 35 14" fill="#f5e8d0" opacity="0.38" />
    </svg>
  );
}
