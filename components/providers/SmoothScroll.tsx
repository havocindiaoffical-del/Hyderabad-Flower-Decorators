"use client";

import React from "react";

// Minimal provider — no Lenis, no smooth scroll overhead
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
