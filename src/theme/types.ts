export type ButtonColorKey = "primary" | "secondary" | "success" | "error" | "warning" | "info";

export interface ColorSet {
  main: string;
  hover: string;
  text: string;
}

export interface ButtonSizeTokens {
  padding: string;
  fontSize: string;
  minHeight: string;
}

export interface ButtonTheme {
  colors: Record<ButtonColorKey, ColorSet>;
  sizes: Record<"small" | "medium" | "large", ButtonSizeTokens>;
  borderRadius: string;
  fontFamily: string;
  textTransform: string;
  letterSpacing: string;
  fontWeight: number;
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
