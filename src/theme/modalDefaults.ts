import type { ModalTheme } from "./modalTypes";

export const defaultModalTheme: ModalTheme = {
  colors: {
    overlay: "rgba(0,0,0,0.5)",
    surface: "#ffffff",
    headerBg: "#f8fafc",
    headerText: "#111827",
    bodyText: "#111827",
    footerBg: "#f8fafc",
    footerText: "#111827",
    border: "#e5e7eb",
    shadow: "rgba(0,0,0,0.2)"
  },
  borderRadius: "8px",
  borderWidth: "1px",
  fontFamily: '"Inter", system-ui, sans-serif',
  padding: { header: "12px 16px", body: "16px", footer: "12px 16px" },
  zIndex: 1300,
  width: "600px",
  height: "auto"
};
