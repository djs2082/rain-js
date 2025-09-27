import type { DeepPartial } from "./types";

export interface NavBarTheme {
  container: {
    height: string; // e.g., "60px"
    background: string;
    color: string;
    paddingX: string; // horizontal padding
    borderBottom?: string;
    shadow?: string;
    zIndex?: number;
  };
  brand: {
    fontSize: string;
    fontWeight: number;
    color?: string;
  };
  link: {
    color: string;
    hoverColor: string;
    activeColor: string;
    padding: string; // e.g., "8px 12px"
    fontSize: string;
    borderRadius: string;
  };
  menu: {
    mobileMenuMargin: string;
    gap: string;
    mobileBackground?: string;
    /** Border between navbar and mobile menu. CSS value for border (e.g. '1px solid #e5e7eb') */
    mobileMenuBorder?: string;
  };
  hamburger: {
    color: string;
    size: string; // icon size (e.g., "20px")
  };
  breakpoint: number; // px width below which menu collapses
}

export type NavBarThemeOverride = DeepPartial<NavBarTheme>;
