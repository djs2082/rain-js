import React, { createContext, useContext, useMemo } from "react";
import { defaultPriorityBadgeTheme } from "./defaults";
import type { PriorityBadgeTheme, PriorityBadgeThemeOverride } from "./types";

const PriorityBadgeThemeContext = createContext<PriorityBadgeTheme>(defaultPriorityBadgeTheme);

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

export interface PriorityBadgeThemeProviderProps {
  theme?: PriorityBadgeThemeOverride;
  children: React.ReactNode;
}

export function PriorityBadgeThemeProvider({ theme, children }: PriorityBadgeThemeProviderProps) {
  const value = useMemo(() => deepMerge(defaultPriorityBadgeTheme, theme), [theme]);
  return <PriorityBadgeThemeContext.Provider value={value}>{children}</PriorityBadgeThemeContext.Provider>;
}

export function usePriorityBadgeTheme() {
  return useContext(PriorityBadgeThemeContext);
}
