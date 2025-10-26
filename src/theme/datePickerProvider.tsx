import React, { createContext, useContext, useMemo } from "react";
import { defaultDatePickerTheme } from "./datePickerDefaults";
import type { DatePickerTheme, DatePickerThemeOverride } from "./datePickerTypes";

const DatePickerThemeContext = createContext<DatePickerTheme>(defaultDatePickerTheme);

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

export interface DatePickerThemeProviderProps {
  theme?: DatePickerThemeOverride;
  children: React.ReactNode;
}

export function DatePickerThemeProvider({ theme, children }: DatePickerThemeProviderProps) {
  const value = useMemo(() => deepMerge(defaultDatePickerTheme, theme), [theme]);
  return <DatePickerThemeContext.Provider value={value}>{children}</DatePickerThemeContext.Provider>;
}

export function useDatePickerTheme() {
  return useContext(DatePickerThemeContext);
}
