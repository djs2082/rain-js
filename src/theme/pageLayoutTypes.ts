import type { DeepPartial } from "./types";

export interface PageLayoutTheme {
  surface: {
    background?: string;
  };
  header: {
    defaultHeight: string; // e.g., "60px"
    background?: string;
    color?: string;
    borderBottom?: string;
    zIndex?: number;
  };
  footer: {
    defaultHeight: string; // e.g., "60px"
    background?: string;
    color?: string;
    borderTop?: string;
    zIndex?: number;
  };
  content: {
    padding: string; // e.g., "16px"
    background?: string;
  };
}

export type PageLayoutThemeOverride = DeepPartial<PageLayoutTheme>;
