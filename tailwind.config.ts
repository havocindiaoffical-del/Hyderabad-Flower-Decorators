import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF8F5",
        cream: "#F0EBE3",
        charcoal: "#1A1A1A",
        graphite: "#2D2D2D",
        gold: "#B8935F",
        "gold-light": "#D4B886",
        sage: "#5B7553",
        "sage-light": "#7A9470",
        stone: "#6B6560",
        "warm-gray": "#9B9490",
        "border-light": "#E8E2DA",
      },
      fontFamily: {
        heading: ["var(--font-manrope)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(40px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "clip-reveal": { "0%": { clipPath: "inset(0 100% 0 0)" }, "100%": { clipPath: "inset(0 0% 0 0)" } },
        "slow-zoom": { "0%": { transform: "scale(1)" }, "100%": { transform: "scale(1.08)" } },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "clip-reveal": "clip-reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards",
        "slow-zoom": "slow-zoom 20s ease-out forwards",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
