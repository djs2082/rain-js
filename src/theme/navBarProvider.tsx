import React, { createContext, useContext, useMemo } from "react";
import { defaultNavBarTheme } from "./navBarDefaults";
import type { NavBarTheme, NavBarThemeOverride } from "./navBarTypes";

const NavBarThemeContext = createContext<NavBarTheme>(defaultNavBarTheme);

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

export interface NavBarThemeProviderProps {
  theme?: NavBarThemeOverride;
  children: React.ReactNode;
}

export function NavBarThemeProvider({ theme, children }: NavBarThemeProviderProps) {
  const value = useMemo(() => deepMerge(defaultNavBarTheme, theme), [theme]);
  return <NavBarThemeContext.Provider value={value}>{children}</NavBarThemeContext.Provider>;
}

export function useNavBarTheme() {
  return useContext(NavBarThemeContext);
}
