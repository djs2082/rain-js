export interface CardSectionStyle {
  padding?: string;
  background?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: number | string;
  height?: string | number; // optional min height for the section
}

export interface CardDividerStyle {
  color: string; // line color
  thickness: string; // e.g., '1px'
  inset?: string; // e.g., '0', '12px'
  style?: "solid" | "dashed" | "dotted";
}

export type CardAccentVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "info";

export interface CardAccentStyleVariant {
  color: string; // rail color
  contentColor?: string; // text/icon color when expanded
}

export interface CardAccentStyle {
  enabled?: boolean; // if false, accent is ignored globally
  baseWidth: number; // px
  expandedWidth: number; // px on hover/focus-within
  transitionMs: number;
  radius?: string; // border radius for the rail; defaults to inherit
  shadow?: string; // optional shadow for the rail when expanded
  padding?: string; // inner padding for content shown when expanded
  variants: Record<CardAccentVariant, CardAccentStyleVariant>;
}

export interface CardTheme {
  container: {
    background: string;
    color: string;
    border?: string;
    borderRadius: string;
    shadow?: string;
    padding: string; // default padding inside the card (applies around sections if section paddings undefined)
    gap: string | number; // vertical gap between sections when no dividers
    width?: string | number;
    maxWidth?: string | number;
    height?: string | number;
    mobileBreakpoint: number; // px
    mobilePadding?: string; // padding override on mobile
  };
  header: CardSectionStyle;
  body: CardSectionStyle;
  footer: CardSectionStyle;
  divider: CardDividerStyle;
  accent: CardAccentStyle;
}

export type CardThemeOverride = Partial<
  CardTheme & {
    container: Partial<CardTheme["container"]>;
    header: Partial<CardSectionStyle>;
    body: Partial<CardSectionStyle>;
    footer: Partial<CardSectionStyle>;
    divider: Partial<CardDividerStyle>;
    accent: Partial<CardAccentStyle> & { variants?: Partial<Record<CardAccentVariant, Partial<CardAccentStyleVariant>>> };
  }
>;
