import React, { createContext, useContext, useMemo } from "react";
import { defaultInputTheme } from "./inputDefaults";
import type { InputTheme, InputThemeOverride } from "./inputTypes";

const InputThemeContext = createContext<InputTheme>(defaultInputTheme);

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

export interface InputThemeProviderProps {
  theme?: InputThemeOverride;
  children: React.ReactNode;
}

export function InputThemeProvider({ theme, children }: InputThemeProviderProps) {
  const value = useMemo(() => deepMerge(defaultInputTheme, theme), [theme]);
  return <InputThemeContext.Provider value={value}>{children}</InputThemeContext.Provider>;
}

export function useInputTheme() {
  return useContext(InputThemeContext);
}
