import type { TimePickerTheme } from "./timePickerTypes";

export const defaultTimePickerTheme: TimePickerTheme = {
  colors: {
    primary:   { main: "#1976d2", hover: "#1565c0", text: "#111827", border: "#cbd5e1", focus: "#1976d2" },
    secondary: { main: "#9c27b0", hover: "#7b1fa2", text: "#111827", border: "#cbd5e1", focus: "#9c27b0" },
    success:   { main: "#2e7d32", hover: "#1b5e20", text: "#111827", border: "#cbd5e1", focus: "#2e7d32" },
    error:     { main: "#d32f2f", hover: "#c62828", text: "#111827", border: "#cbd5e1", focus: "#d32f2f" },
    warning:   { main: "#ed6c02", hover: "#e65100", text: "#111827", border: "#cbd5e1", focus: "#ed6c02" },
    info:      { main: "#0288d1", hover: "#0277bd", text: "#111827", border: "#cbd5e1", focus: "#0288d1" }
  },
  sizes: {
    small:  { itemHeight: 28, fontSize: "12px", padding: "8px" },
    medium: { itemHeight: 32, fontSize: "13px", padding: "10px" },
    large:  { itemHeight: 36, fontSize: "14px", padding: "12px" }
  },
  radius: "8px",
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  shadow: "0 8px 24px rgba(0,0,0,0.12)",
  surface: {
    background: "#ffffff",
    border: "#e5e7eb",
    headerBackground: "#f9fafb",
    headerText: "#111827",
    mutedText: "#6b7280"
  },
  zIndex: 50
};
