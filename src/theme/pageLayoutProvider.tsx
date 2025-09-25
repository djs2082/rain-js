import React, { createContext, useContext, useMemo } from "react";
import { defaultPageLayoutTheme } from "./pageLayoutDefaults";
import type { PageLayoutTheme, PageLayoutThemeOverride } from "./pageLayoutTypes";

const PageLayoutThemeContext = createContext<PageLayoutTheme>(defaultPageLayoutTheme);

function deepMerge<T extends object>(base: T, override?: any): T {
  if (!override) return base;
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...base };
  for (const key of Object.keys(override) as (keyof T)[]) {
    const v = override[key];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[key] = deepMerge((base as any)[key], v as any);
    } else if (v !== undefined) {
      out[key] = v;
    }
  }
  return out as T;
}

export interface PageLayoutThemeProviderProps {
  theme?: PageLayoutThemeOverride;
  children: React.ReactNode;
}

export function PageLayoutThemeProvider({ theme, children }: PageLayoutThemeProviderProps) {
  const value = useMemo(() => deepMerge(defaultPageLayoutTheme, theme), [theme]);
  return (
    <PageLayoutThemeContext.Provider value={value}>
      {children}
    </PageLayoutThemeContext.Provider>
  );
}

export function usePageLayoutTheme() {
  return useContext(PageLayoutThemeContext);
}
