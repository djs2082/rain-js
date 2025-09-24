import type { InputTheme } from "./inputTypes";

export const defaultInputTheme: InputTheme = {
  colors: {
    primary:   { main: "#1976d2", hover: "#1565c0", text: "#111827", border: "#cbd5e1", focus: "#1976d2" },
    secondary: { main: "#9c27b0", hover: "#7b1fa2", text: "#111827", border: "#cbd5e1", focus: "#9c27b0" },
    success:   { main: "#2e7d32", hover: "#1b5e20", text: "#111827", border: "#cbd5e1", focus: "#2e7d32" },
    error:     { main: "#d32f2f", hover: "#c62828", text: "#111827", border: "#cbd5e1", focus: "#d32f2f", helper: "#d32f2f" },
    warning:   { main: "#ed6c02", hover: "#e65100", text: "#111827", border: "#cbd5e1", focus: "#ed6c02" },
    info:      { main: "#0288d1", hover: "#0277bd", text: "#111827", border: "#cbd5e1", focus: "#0288d1" }
  },
  sizes: {
    small:  { padding: "6px 10px", fontSize: "0.8125rem", height: "36px", labelFontSize: "0.75rem" },
    medium: { padding: "8px 14px", fontSize: "0.875rem",  height: "40px", labelFontSize: "0.8125rem" },
    large:  { padding: "10px 16px", fontSize: "0.9375rem", height: "48px", labelFontSize: "0.875rem" }
  },
  borderRadius: "4px",
  borderWidth: "1px",
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  labelColor: "#374151",
  labelBackground: "transparent",
  placeholderColor: "#9ca3af",
  background: "#ffffff"
};
