import type { DeepPartial } from "./types";

export interface ModalColors {
  overlay: string;
  surface: string;
  headerBg: string;
  headerText: string;
  bodyText: string;
  footerBg: string;
  footerText: string;
  border: string;
  shadow: string;
}

export interface ModalTheme {
  colors: ModalColors;
  borderRadius: string;
  borderWidth: string;
  fontFamily: string;
  padding: { header: string; body: string; footer: string };
  zIndex: number;
  width: string;  // default content width
  height: string; // default content height
}

export type ModalThemeOverride = DeepPartial<ModalTheme>;
