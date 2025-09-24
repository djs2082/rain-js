import type { DeepPartial } from "./types";

export type InputColorKey = "primary" | "secondary" | "success" | "error" | "warning" | "info";

export interface InputColorSet {
  main: string;
  hover: string;
  text: string;
  border: string;
  focus: string; // focus ring/border color
  helper?: string; // helper/error text color
}

export interface InputSizeTokens {
  padding: string; // vertical/horizontal padding inside input
  fontSize: string;
  height: string; // target control height
  labelFontSize: string;
}

export interface InputTheme {
  colors: Record<InputColorKey, InputColorSet>;
  sizes: Record<"small" | "medium" | "large", InputSizeTokens>;
  borderRadius: string;
  borderWidth: string;
  fontFamily: string;
  labelColor: string;
  labelBackground?: string; // background behind floating label
  placeholderColor: string;
  background: string; // default background for filled
}

export type InputThemeOverride = DeepPartial<InputTheme>;
