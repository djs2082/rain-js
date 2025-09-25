import React, { createContext, useContext, useMemo } from "react";
import { defaultToastTheme } from "./toastDefaults";
import type { ToastTheme, ToastThemeOverride } from "./toastTypes";

const ToastThemeContext = createContext<ToastTheme>(defaultToastTheme);

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

export interface ToastThemeProviderProps {
  theme?: ToastThemeOverride;
  children: React.ReactNode;
}

export function ToastThemeProvider({ theme, children }: ToastThemeProviderProps) {
  const value = useMemo(() => deepMerge(defaultToastTheme, theme), [theme]);
  return <ToastThemeContext.Provider value={value}>{children}</ToastThemeContext.Provider>;
}

export function useToastTheme() {
  return useContext(ToastThemeContext);
}
