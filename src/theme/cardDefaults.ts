import type { CardTheme } from "./cardTypes";

export const defaultCardTheme: CardTheme = {
  container: {
    background: "#ffffff",
    color: "#111827",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    shadow: "0 6px 16px rgba(0,0,0,0.08)",
    padding: "16px",
    gap: 12,
    width: "auto",
    maxWidth: 640,
    height: undefined,
    mobileBreakpoint: 640,
    mobilePadding: "12px",
  },
  header: {
    fontSize: "16px",
    fontWeight: 600,
  },
  body: {
    fontSize: "14px",
  },
  footer: {
    fontSize: "13px",
    color: "#6b7280",
  },
  divider: {
    color: "#e5e7eb",
    thickness: "1px",
    style: "solid",
    inset: "0",
  },
  accent: {
    enabled: true,
    baseWidth: 4,
    expandedWidth: 120,
    transitionMs: 200,
    radius: "12px 0 0 12px",
    shadow: undefined,
    padding: "8px",
    variants: {
      primary: { color: "#3b82f6", contentColor: "#ffffff" },
      secondary: { color: "#6b7280", contentColor: "#ffffff" },
      success: { color: "#10b981", contentColor: "#ffffff" },
      warning: { color: "#f59e0b", contentColor: "#111827" },
      danger: { color: "#ef4444", contentColor: "#ffffff" },
      info: { color: "#0ea5e9", contentColor: "#ffffff" },
    },
  },
};
