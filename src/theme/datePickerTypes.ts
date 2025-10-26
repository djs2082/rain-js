import type { DeepPartial } from "./types";
import type { InputColorKey } from "./inputTypes";

export type DatePickerColorKey = InputColorKey;

export interface DatePickerColorSet {
  main: string;
  hover: string;
  text: string;
  border: string;
  focus: string;
}

export interface DatePickerSizeTokens {
  daySize: number; // px
  fontSize: string;
  headerFontSize: string;
  padding: string; // panel padding
}

export interface DatePickerTheme {
  colors: Record<DatePickerColorKey, DatePickerColorSet>;
  sizes: Record<"small" | "medium" | "large", DatePickerSizeTokens>;
  radius: string;
  fontFamily: string;
  shadow: string;
  surface: {
    background: string;
    border: string;
    headerBackground: string;
    headerText: string;
    mutedText: string;
    outsideText: string;
  };
  zIndex: number;
}

export type DatePickerThemeOverride = DeepPartial<DatePickerTheme>;
