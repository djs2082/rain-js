import React from "react";
import { useCardTheme } from "../theme/cardProvider";

export interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode; // body
  showDividers?: boolean;
  headerHeight?: string | number;
  footerHeight?: string | number;
  width?: string | number;
  maxWidth?: string | number;
  height?: string | number;
  padding?: string; // override container padding
  borderRadius?: string;
  border?: string;
  shadow?: string;
  gap?: string | number;
  className?: string;
  style?: React.CSSProperties;
  resizable?: boolean; // allow resize via CSS
}

const toCss = (v?: string | number) => (typeof v === "number" ? `${v}px` : v);

export function Card({
  header,
  footer,
  children,
  showDividers = true,
  headerHeight,
  footerHeight,
  width,
  maxWidth,
  height,
  padding,
  borderRadius,
  border,
  shadow,
  gap,
  className,
  style,
  resizable,
}: CardProps) {
  const theme = useCardTheme();
  const containerPadding = padding ?? theme.container.padding;

  const root: React.CSSProperties = {
    background: theme.container.background,
    color: theme.container.color,
    border: border ?? theme.container.border,
    borderRadius: borderRadius ?? theme.container.borderRadius,
    boxShadow: shadow ?? theme.container.shadow,
    padding: containerPadding,
    width: toCss(width ?? theme.container.width),
    maxWidth: toCss(maxWidth ?? theme.container.maxWidth),
    height: toCss(height ?? theme.container.height),
    boxSizing: "border-box",
    resize: resizable ? (height ? "vertical" : "both") : undefined,
    overflow: resizable ? "auto" : undefined,
  };

  const sectionPadding = (p?: string) => p ?? containerPadding;
  const gapCss = gap ?? theme.container.gap;

  const Divider = () => (
    <div
      aria-hidden
      style={{
        height: theme.divider.thickness,
        background: theme.divider.color,
        margin: `0 ${theme.divider.inset}`,
        borderTop: theme.divider.style === "dashed" || theme.divider.style === "dotted" ? `${theme.divider.thickness} ${theme.divider.style} ${theme.divider.color}` : undefined,
      }}
    />
  );

  return (
    <div className={className} style={{ ...root, ...style }}>
      <div className="card-inner" style={{ display: "flex", flexDirection: "column", gap: gapCss }}>
        {header && (
          <div style={{ padding: sectionPadding(theme.header.padding), background: theme.header.background, color: theme.header.color, fontSize: theme.header.fontSize, fontWeight: theme.header.fontWeight, minHeight: toCss(headerHeight ?? theme.header.height) }}>
            {header}
          </div>
        )}
        {showDividers && header && <Divider />}
        <div style={{ padding: sectionPadding(theme.body.padding), background: theme.body.background, color: theme.body.color, fontSize: theme.body.fontSize, fontWeight: theme.body.fontWeight }}>
          {children}
        </div>
        {showDividers && footer && <Divider />}
        {footer && (
          <div style={{ padding: sectionPadding(theme.footer.padding), background: theme.footer.background, color: theme.footer.color, fontSize: theme.footer.fontSize, fontWeight: theme.footer.fontWeight, minHeight: toCss(footerHeight ?? theme.footer.height) }}>
            {footer}
          </div>
        )}
      </div>
      <style>
        {`
          @media (max-width: ${theme.container.mobileBreakpoint - 1}px) {
            .card-inner { gap: ${typeof gapCss === "number" ? `${gapCss}px` : gapCss}; }
            .card-inner > div { padding-left: ${theme.container.mobilePadding}; padding-right: ${theme.container.mobilePadding}; }
          }
        `}
      </style>
    </div>
  );
}

export default Card;
