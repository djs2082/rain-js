import React, { createContext, useContext, useMemo } from "react";
import { defaultTypographyTheme } from "./typographyDefaults";
import type { TypographyTheme, TypographyThemeOverride } from "./typographyTypes";

const TypographyThemeContext = createContext<TypographyTheme>(defaultTypographyTheme);

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

export interface TypographyThemeProviderProps {
  theme?: TypographyThemeOverride;
  children: React.ReactNode;
}

export function TypographyThemeProvider({ theme, children }: TypographyThemeProviderProps) {
  const value = useMemo(() => deepMerge(defaultTypographyTheme, theme), [theme]);
  return <TypographyThemeContext.Provider value={value}>{children}</TypographyThemeContext.Provider>;
}

export function useTypographyTheme() {
  return useContext(TypographyThemeContext);
}
