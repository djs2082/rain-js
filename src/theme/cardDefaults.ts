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
};
