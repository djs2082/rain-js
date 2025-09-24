import type { ButtonTheme } from "./types";

export const defaultButtonTheme: ButtonTheme = {
  colors: {
    primary: { main: "#1976d2", hover: "#1565c0", text: "#1976d2" },
    secondary: { main: "#9c27b0", hover: "#7b1fa2", text: "#9c27b0" },
    success: { main: "#2e7d32", hover: "#1b5e20", text: "#2e7d32" },
    error: { main: "#d32f2f", hover: "#c62828", text: "#d32f2f" },
    warning: { main: "#ed6c02", hover: "#e65100", text: "#ed6c02" },
    info: { main: "#0288d1", hover: "#0277bd", text: "#0288d1" }
  },
  sizes: {
    small: { padding: "4px 10px", fontSize: "0.8125rem", minHeight: "30px" },
    medium: { padding: "6px 16px", fontSize: "0.875rem", minHeight: "36px" },
    large: { padding: "8px 22px", fontSize: "0.9375rem", minHeight: "42px" }
  },
  borderRadius: "4px",
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  textTransform: "uppercase",
  letterSpacing: "0.02857em",
  fontWeight: 500
};
