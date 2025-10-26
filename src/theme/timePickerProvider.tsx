import React, { createContext, useContext, useMemo } from "react";
import { defaultTimePickerTheme } from "./timePickerDefaults";
import type { TimePickerTheme, TimePickerThemeOverride } from "./timePickerTypes";

const TimePickerThemeContext = createContext<TimePickerTheme>(defaultTimePickerTheme);

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

export interface TimePickerThemeProviderProps {
  theme?: TimePickerThemeOverride;
  children: React.ReactNode;
}

export function TimePickerThemeProvider({ theme, children }: TimePickerThemeProviderProps) {
  const value = useMemo(() => deepMerge(defaultTimePickerTheme, theme), [theme]);
  return <TimePickerThemeContext.Provider value={value}>{children}</TimePickerThemeContext.Provider>;
}

export function useTimePickerTheme() {
  return useContext(TimePickerThemeContext);
}
