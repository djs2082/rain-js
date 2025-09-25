import React from "react";
import { useTypographyTheme } from "../theme/typographyProvider";
import type { TypographyVariantStyle } from "../theme/typographyTypes";

type AsProp<E extends keyof React.JSX.IntrinsicElements> = {
  as?: keyof React.JSX.IntrinsicElements;
} & Omit<React.JSX.IntrinsicElements[E], "as" | "style" | "color"> & {
  style?: React.CSSProperties;
  color?: string;
};

function cx(styles: React.CSSProperties, override?: React.CSSProperties): React.CSSProperties {
  return { ...styles, ...override };
}

function createElement(
  defaultTag: keyof React.JSX.IntrinsicElements,
  styleTokens: TypographyVariantStyle,
  baseColor?: string,
  props?: AsProp<keyof React.JSX.IntrinsicElements> & { children?: React.ReactNode }
) {
  const Tag = (props?.as ?? defaultTag) as any;
  const { style, color, children, ...rest } = props ?? {};
  const styles: React.CSSProperties = {
    fontFamily: undefined,
    fontSize: styleTokens.fontSize,
    fontWeight: styleTokens.fontWeight as any,
    lineHeight: styleTokens.lineHeight as any,
    letterSpacing: styleTokens.letterSpacing,
    textTransform: styleTokens.textTransform as any,
    margin: styleTokens.margin,
    color: color ?? styleTokens.color ?? baseColor,
  };
  return (
    <Tag style={cx(styles, style)} {...(rest as any)}>
      {children}
    </Tag>
  );
}

export interface TypographyProps {
  children?: React.ReactNode;
}

export function Typography({ children }: TypographyProps) {
  return <>{children}</>;
}

Typography.Title = function Title(props: AsProp<"h1">) {
  const theme = useTypographyTheme();
  return createElement("h1", theme.title, theme.base.color, props);
};

Typography.SubTitle = function SubTitle(props: AsProp<"h2">) {
  const theme = useTypographyTheme();
  return createElement("h2", theme.subTitle, theme.base.color, props);
};

Typography.HeaderText = function HeaderText(props: AsProp<"h3">) {
  const theme = useTypographyTheme();
  return createElement("h3", theme.headerText, theme.base.color, props);
};

Typography.FooterText = function FooterText(props: AsProp<"p">) {
  const theme = useTypographyTheme();
  return createElement("p", theme.footerText, theme.base.color, props);
};

Typography.HelperText = function HelperText(props: AsProp<"p">) {
  const theme = useTypographyTheme();
  return createElement("p", theme.helperText, theme.base.color, props);
};

Typography.ErrorText = function ErrorText(props: AsProp<"p">) {
  const theme = useTypographyTheme();
  return createElement("p", theme.errorText, theme.base.color, props);
};

Typography.SuccessText = function SuccessText(props: AsProp<"p">) {
  const theme = useTypographyTheme();
  return createElement("p", theme.successText, theme.base.color, props);
};

export default Typography;
