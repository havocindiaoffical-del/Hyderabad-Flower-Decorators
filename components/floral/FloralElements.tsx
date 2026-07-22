"use client";

import React from "react";

// ─── SVG-based 3D Floral Elements ──────────────────────────────────
// These use gradient fills, translucency, and shadows to create
// a realistic botanical appearance with 3D depth illusion.

// ─── 3D Rose (small, elegant) ──────────────────────────────────────
export function Rose3D({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{ filter: "drop-shadow(0 4px 12px rgba(184,147,95,0.15))" }}
    >
      <defs>
        <radialGradient id="rg1" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#e8a0a0" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#d47878" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c45c5c" stopOpacity="0.85" />
        </radialGradient>
        <radialGradient id="rg1b" cx="50%" cy="50%" r="30%">
          <stop offset="0%" stopColor="#f0c8c8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#d47878" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rg1s" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B7553" />
          <stop offset="100%" stopColor="#3d5435" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path d="M50 58 Q50 72, 48 95" stroke="#5B7553" strokeWidth="1.5" fill="none" />
      {/* Leaves */}
      <path d="M50 72 Q62 64, 70 58 Q62 66, 50 72" fill="url(#rg1s)" opacity="0.8" />
      <path d="M48 80 Q36 74, 28 68 Q38 76, 48 80" fill="url(#rg1s)" opacity="0.7" />
      {/* Outer petals */}
      <path d="M30 48 Q25 30, 38 20 Q45 32, 50 40 Q40 48, 30 48" fill="url(#rg1)" opacity="0.8" />
      <path d="M70 48 Q75 30, 62 20 Q55 32, 50 40 Q60 48, 70 48" fill="url(#rg1)" opacity="0.8" />
      <path d="M35 56 Q20 50, 22 35 Q35 42, 50 44 Q38 56, 35 56" fill="url(#rg1)" opacity="0.75" />
      <path d="M65 56 Q80 50, 78 35 Q65 42, 50 44 Q62 56, 65 56" fill="url(#rg1)" opacity="0.75" />
      {/* Inner petals */}
      <path d="M42 44 Q38 30, 50 24 Q58 30, 50 44 Q44 44, 42 44" fill="#d47878" opacity="0.9" />
      <path d="M58 44 Q62 30, 50 24 Q42 30, 50 44 Q56 44, 58 44" fill="#c45c5c" opacity="0.85" />
      {/* Center glow */}
      <circle cx="50" cy="36" r="10" fill="url(#rg1b)" />
    </svg>
  );
}

// ─── Rose Petal ─────────────────────────────────────────────────────
export function RosePetal({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 40 52"
      className={className}
      style={{ filter: "drop-shadow(0 2px 8px rgba(184,147,95,0.1))" }}
    >
      <defs>
        <linearGradient id="pg1" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#e8a0a0" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#d47878" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#c45c5c" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path d="M20 0 Q35 8, 38 24 Q34 40, 20 52 Q6 40, 2 24 Q5 8, 20 0" fill="url(#pg1)" />
      <path d="M20 8 Q28 14, 30 24 Q28 36, 20 44 Q12 36, 10 24 Q12 14, 20 8" fill="#f0c8c8" opacity="0.4" />
    </svg>
  );
}

// ─── Jasmine Flower ─────────────────────────────────────────────────
export function Jasmine3D({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      style={{ filter: "drop-shadow(0 3px 10px rgba(255,255,255,0.2))" }}
    >
      <defs>
        <radialGradient id="jg1" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#f5f0e8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ede5d5" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      {/* 5 petals */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 40 + Math.cos(rad) * 22;
        const cy = 40 + Math.sin(rad) * 22;
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="14"
            ry="8"
            fill="url(#jg1)"
            opacity="0.9"
            transform={`rotate(${angle}, ${cx}, ${cy})`}
          />
        );
      })}
      {/* Center */}
      <circle cx="40" cy="40" r="6" fill="#B8935F" opacity="0.7" />
    </svg>
  );
}

// ─── Marigold Flower ────────────────────────────────────────────────
export function Marigold3D({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      className={className}
      style={{ filter: "drop-shadow(0 3px 10px rgba(200,150,50,0.15))" }}
    >
      <defs>
        <radialGradient id="mg1" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#f0b040" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#d49620" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c07a10" stopOpacity="0.85" />
        </radialGradient>
        <radialGradient id="mg2" cx="50%" cy="50%" r="25%">
          <stop offset="0%" stopColor="#f8d060" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#d49620" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Outer ruffled petals */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 45 + Math.cos(rad) * 30;
        const cy = 45 + Math.sin(rad) * 30;
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="16"
            ry="7"
            fill="url(#mg1)"
            opacity="0.85"
            transform={`rotate(${angle}, ${cx}, ${cy})`}
          />
        );
      })}
      {/* Inner petals */}
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 45 + Math.cos(rad) * 18;
        const cy = 45 + Math.sin(rad) * 18;
        return (
          <ellipse
            key={`inner-${i}`}
            cx={cx}
            cy={cy}
            rx="11"
            ry="5"
            fill="#f0b040"
            opacity="0.9"
            transform={`rotate(${angle}, ${cx}, ${cy})`}
          />
        );
      })}
      {/* Center glow */}
      <circle cx="45" cy="45" r="8" fill="url(#mg2)" />
    </svg>
  );
}

// ─── Small Leaf ─────────────────────────────────────────────────────
export function Leaf3D({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 50 75"
      className={className}
      style={{ filter: "drop-shadow(0 3px 8px rgba(91,117,83,0.12))" }}
    >
      <defs>
        <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7A9470" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#5B7553" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#3d5435" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="lg2" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#90b080" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#5B7553" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Leaf body */}
      <path d="M25 0 Q42 15, 45 30 Q42 50, 25 75 Q8 50, 5 30 Q8 15, 25 0" fill="url(#lg1)" />
      {/* Vein highlight */}
      <path d="M25 5 L25 70" stroke="url(#lg2)" strokeWidth="1" fill="none" />
      <path d="M25 20 L38 28" stroke="#7A9470" strokeWidth="0.5" fill="none" opacity="0.4" />
      <path d="M25 35 L12 42" stroke="#7A9470" strokeWidth="0.5" fill="none" opacity="0.3" />
      <path d="M25 50 L40 55" stroke="#7A9470" strokeWidth="0.5" fill="none" opacity="0.3" />
    </svg>
  );
}

// ─── Botanical Stem ─────────────────────────────────────────────────
export function BotanicalStem3D({ size = 60, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size * 0.4}
      height={size}
      viewBox="0 0 40 100"
      className={className}
      style={{ filter: "drop-shadow(0 2px 6px rgba(91,117,83,0.08))" }}
    >
      <defs>
        <linearGradient id="sg1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5B7553" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#7A9470" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3d5435" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* Main stem */}
      <path d="M20 100 Q18 80, 22 60 Q20 40, 18 20 Q16 5, 20 0" stroke="url(#sg1)" strokeWidth="2" fill="none" />
      {/* Small leaf offshoots */}
      <path d="M22 60 Q30 55, 35 48 Q28 58, 22 60" fill="#7A9470" opacity="0.6" />
      <path d="M18 40 Q10 36, 5 30 Q12 38, 18 40" fill="#5B7553" opacity="0.5" />
      <path d="M20 20 Q28 16, 32 10 Q24 18, 20 20" fill="#7A9470" opacity="0.5" />
      {/* Tiny bud at top */}
      <ellipse cx="20" cy="5" rx="4" ry="6" fill="#e8a0a0" opacity="0.5" />
    </svg>
  );
}

// ─── Delicate Vine ──────────────────────────────────────────────────
export function Vine3D({ size = 80, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 200 120"
      className={className}
      style={{ filter: "drop-shadow(0 2px 6px rgba(91,117,83,0.06))" }}
    >
      <defs>
        <linearGradient id="vg1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5B7553" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#7A9470" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Curved vine */}
      <path d="M0 60 Q30 30, 60 45 Q90 60, 120 35 Q150 10, 180 30 Q200 50, 200 60" stroke="url(#vg1)" strokeWidth="1.5" fill="none" />
      {/* Tiny leaves along vine */}
      <path d="M60 45 Q68 38, 72 30 Q66 40, 60 45" fill="#7A9470" opacity="0.5" />
      <path d="M120 35 Q115 28, 108 22 Q112 30, 120 35" fill="#5B7553" opacity="0.45" />
      <path d="M90 60 Q96 54, 100 46 Q94 56, 90 60" fill="#7A9470" opacity="0.4" />
      {/* Tiny bud */}
      <circle cx="150" cy="15" r="3" fill="#e8a0a0" opacity="0.4" />
    </svg>
  );
}

// ─── Small Flower Bud ──────────────────────────────────────────────
export function FlowerBud3D({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 30 42"
      className={className}
      style={{ filter: "drop-shadow(0 2px 6px rgba(184,147,95,0.1))" }}
    >
      <defs>
        <radialGradient id="bg1" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#f0c8c8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d47878" stopOpacity="0.8" />
        </radialGradient>
      </defs>
      {/* Closed bud petals */}
      <path d="M15 0 Q20 8, 22 16 Q20 24, 15 28 Q10 24, 8 16 Q10 8, 15 0" fill="url(#bg1)" />
      {/* Sepal */}
      <path d="M15 28 Q20 30, 18 36 Q16 40, 15 42 Q14 40, 12 36 Q10 30, 15 28" fill="#5B7553" opacity="0.7" />
    </svg>
  );
}

// ─── Gold Petal (warm-toned) ────────────────────────────────────────
export function GoldPetal({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 36 50"
      className={className}
      style={{ filter: "drop-shadow(0 2px 6px rgba(184,147,95,0.12))" }}
    >
      <defs>
        <linearGradient id="gpg" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#D4B886" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#B8935F" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a07840" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path d="M18 0 Q30 10, 34 25 Q30 40, 18 50 Q6 40, 2 25 Q6 10, 18 0" fill="url(#gpg)" />
      <path d="M18 8 Q26 14, 28 25 Q26 38, 18 42 Q10 38, 8 25 Q10 14, 18 8" fill="#e8d0b0" opacity="0.35" />
    </svg>
  );
}
