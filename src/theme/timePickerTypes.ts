import type { DeepPartial } from "./types";
import type { InputColorKey } from "./inputTypes";

export type TimePickerColorKey = InputColorKey;

export interface TimePickerColorSet {
  main: string;
  hover: string;
  text: string;
  border: string;
  focus: string;
}

export interface TimePickerSizeTokens {
  itemHeight: number;
  fontSize: string;
  padding: string;
}

export interface TimePickerTheme {
  colors: Record<TimePickerColorKey, TimePickerColorSet>;
  sizes: Record<"small" | "medium" | "large", TimePickerSizeTokens>;
  radius: string;
  fontFamily: string;
  shadow: string;
  surface: {
    background: string;
    border: string;
    headerBackground: string;
    headerText: string;
    mutedText: string;
  };
  zIndex: number;
}

export type TimePickerThemeOverride = DeepPartial<TimePickerTheme>;
