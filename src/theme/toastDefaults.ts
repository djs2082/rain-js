import type { ToastTheme } from "./toastTypes";

export const defaultToastTheme: ToastTheme = {
  container: {
    zIndex: 1000,
    gap: 8,
    edgeOffset: 16,
    mobileBreakpoint: 640,
    placement: "top-right",
  },
  toast: {
    borderRadius: "8px",
    shadow: "0 8px 20px rgba(0,0,0,0.15)",
    padding: "10px 12px",
    width: "auto",
    maxWidth: 360,
    fontSize: "14px",
  },
  variants: {
    success: { background: "#16a34a", color: "#fff" },
    error: { background: "#dc2626", color: "#fff" },
    info: { background: "#2563eb", color: "#fff" },
    warning: { background: "#f59e0b", color: "#111827" },
  },
  durations: { default: 3000 },
};
