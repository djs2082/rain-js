import React, { createContext, useContext, useMemo } from "react";
import { defaultModalTheme } from "./modalDefaults";
import type { ModalTheme, ModalThemeOverride } from "./modalTypes";

const ModalThemeContext = createContext<ModalTheme>(defaultModalTheme);

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

export interface ModalThemeProviderProps {
  theme?: ModalThemeOverride;
  children: React.ReactNode;
}

export function ModalThemeProvider({ theme, children }: ModalThemeProviderProps) {
  const value = useMemo(() => deepMerge(defaultModalTheme, theme), [theme]);
  return <ModalThemeContext.Provider value={value}>{children}</ModalThemeContext.Provider>;
}

export function useModalTheme() {
  return useContext(ModalThemeContext);
}
