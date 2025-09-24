import React, { createContext, useContext, useMemo } from "react";
import { defaultButtonTheme } from "./defaults";
import type { ButtonTheme, DeepPartial } from "./types";

const ButtonThemeContext = createContext<ButtonTheme>(defaultButtonTheme);

function deepMerge<T extends object>(base: T, override?: DeepPartial<T>): T {
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

export interface ButtonThemeProviderProps {
  theme?: DeepPartial<ButtonTheme>;
  children: React.ReactNode;
}

export function ButtonThemeProvider({ theme, children }: ButtonThemeProviderProps) {
  const value = useMemo(() => deepMerge(defaultButtonTheme, theme), [theme]);
  return <ButtonThemeContext.Provider value={value}>{children}</ButtonThemeContext.Provider>;
}

export function useButtonTheme() {
  return useContext(ButtonThemeContext);
}
