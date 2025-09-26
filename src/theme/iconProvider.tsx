import React, { createContext, useContext, useMemo } from 'react';
import { defaultIconTheme } from './iconDefaults';
import type { IconTheme, IconThemeOverride } from './iconTypes';

const IconThemeContext = createContext<IconTheme>(defaultIconTheme);

export interface IconThemeProviderProps {
  theme?: IconThemeOverride;
  children: React.ReactNode;
}

function deepMerge<T extends object>(base: T, override?: Partial<T>): T {
  if (!override) return base;
  const out: any = { ...base };
  for (const k of Object.keys(override) as (keyof T)[]) {
    const v = override[k];
    if (v !== undefined) out[k] = v as any;
  }
  return out as T;
}

export function IconThemeProvider({ theme, children }: IconThemeProviderProps) {
  const value = useMemo(() => deepMerge(defaultIconTheme, theme || {}), [theme]);
  return <IconThemeContext.Provider value={value}>{children}</IconThemeContext.Provider>;
}

export function useIconTheme() {
  return useContext(IconThemeContext);
}
