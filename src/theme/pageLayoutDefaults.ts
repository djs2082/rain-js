import type { PageLayoutTheme } from "./pageLayoutTypes";

export const defaultPageLayoutTheme: PageLayoutTheme = {
  surface: {
    background: "#ffffff",
  },
  header: {
    defaultHeight: "60px",
    background: "#ffffff",
    color: "#111827",
    borderBottom: "1px solid #e5e7eb",
    zIndex: 100,
  },
  footer: {
    defaultHeight: "60px",
    background: "#ffffff",
    color: "#111827",
    borderTop: "1px solid #e5e7eb",
    zIndex: 100,
  },
  content: {
    padding: "16px",
    background: "#fafafa",
  },
};
