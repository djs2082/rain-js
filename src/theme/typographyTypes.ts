export type TypographyVariantStyle = {
  fontSize?: string;
  fontWeight?: number | string;
  lineHeight?: string | number;
  color?: string;
  margin?: string;
  letterSpacing?: string;
  textTransform?: string;
};

export interface TypographyBase {
  fontFamily?: string;
  color?: string; // default color fallback
}

export interface TypographyTheme {
  base: TypographyBase;
  title: TypographyVariantStyle & { as?: string };
  subTitle: TypographyVariantStyle & { as?: string };
  headerText: TypographyVariantStyle & { as?: string };
  footerText: TypographyVariantStyle & { as?: string };
  helperText: TypographyVariantStyle & { as?: string };
  errorText: TypographyVariantStyle & { as?: string };
  successText: TypographyVariantStyle & { as?: string };
}

export type TypographyThemeOverride = Partial<
  TypographyTheme & {
    base: Partial<TypographyBase>;
    title: TypographyVariantStyle & { as?: string };
    subTitle: TypographyVariantStyle & { as?: string };
    headerText: TypographyVariantStyle & { as?: string };
    footerText: TypographyVariantStyle & { as?: string };
    helperText: TypographyVariantStyle & { as?: string };
    errorText: TypographyVariantStyle & { as?: string };
    successText: TypographyVariantStyle & { as?: string };
  }
>;
