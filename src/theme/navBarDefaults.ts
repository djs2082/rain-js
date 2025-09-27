import type { NavBarTheme } from "./navBarTypes";

export const defaultNavBarTheme: NavBarTheme = {
  container: {
    height: "60px",
    background: "#ffffff",
    color: "#111827",
    paddingX: "16px",
    borderBottom: "1px solid #e5e7eb",
    shadow: "",
    zIndex: 200,
  },
  brand: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#111827",
  },
  link: {
    color: "#111827",
    hoverColor: "#1f2937",
    activeColor: "#2563eb",
    padding: "8px 12px",
    fontSize: "14px",
    borderRadius: "6px",
  },
  menu: {
    gap: "8px",
    mobileBackground: "#ffffff",
    mobileMenuBorder: "1px solid #e5e7eb",
    mobileMenuMinWidth: 160,
    mobileMenuMaxWidth: "90vw",
    mobileMenuMargin: "0",
  },
  hamburger: {
    color: "#111827",
    size: "20px",
  },
  breakpoint: 768,
};
