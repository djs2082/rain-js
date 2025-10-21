import type { PriorityBadgeTheme } from "./types";

export const defaultPriorityBadgeTheme: PriorityBadgeTheme = {
  variants: {
    low: { background: "#059669", color: "#ffffff", dotColor: "rgba(255,255,255,0.9)" },
    medium: { background: "#d97706", color: "#ffffff", dotColor: "rgba(255,255,255,0.9)" },
    high: { background: "#dc2626", color: "#ffffff", dotColor: "rgba(255,255,255,0.9)" },
  },
  badge: {
    fontSize: "0.75rem",
    fontWeight: 600,
    borderRadius: 999,
    padding: "2px 8px",
    gap: 6,
  },
  dot: {
    size: 6,
    opacity: 0.9,
    blinkDurationMs: 1200,
  },
};
