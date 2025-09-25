import React, { createContext, useContext, useMemo } from "react";
import { defaultCardTheme } from "./cardDefaults";
import type { CardTheme, CardThemeOverride } from "./cardTypes";

const CardThemeContext = createContext<CardTheme>(defaultCardTheme);

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

export interface CardThemeProviderProps {
  theme?: CardThemeOverride;
  children: React.ReactNode;
}

export function CardThemeProvider({ theme, children }: CardThemeProviderProps) {
  const value = useMemo(() => deepMerge(defaultCardTheme, theme), [theme]);
  return <CardThemeContext.Provider value={value}>{children}</CardThemeContext.Provider>;
}

export function useCardTheme() {
  return useContext(CardThemeContext);
}
