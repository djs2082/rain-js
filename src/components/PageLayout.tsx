import React from "react";
import { usePageLayoutTheme } from "../theme/pageLayoutProvider";

export interface PageLayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  /**
   * Fixed height for the header when rendered. Defaults to 60px.
   */
  headerHeight?: number | string;
  /**
   * Fixed height for the footer when rendered. Defaults to 60px.
   */
  footerHeight?: number | string;
  /**
   * If true, header stays outside the scrollable content and remains visible.
   * If false, header is part of the scrollable content.
   */
  stickyHeader?: boolean;
  /**
   * If true, footer stays outside the scrollable content and remains visible.
   * If false, footer is part of the scrollable content.
   */
  stickyFooter?: boolean;
  /**
   * If true (default), the layout will consume the full viewport height (100vh)
   * and prevent window-level scrolling. Content scrolls inside the layout instead.
   */
  fullHeight?: boolean;
  /**
   * Optional background color for the full layout surface.
   */
  background?: string;
  /**
   * Padding applied inside the scrollable content area.
   */
  contentPadding?: number | string;
  /**
   * Optional className for the root container.
   */
  className?: string;
  /**
   * Props applied to the scrollable content container (<main>).
   */
  contentProps?: React.HTMLAttributes<HTMLDivElement>;
  /**
   * Children rendered as the main page content.
   */
  children?: React.ReactNode;
}

const toCssSize = (v?: number | string, fallback = 60) => {
  if (v === undefined || v === null) return `${fallback}px`;
  return typeof v === "number" ? `${v}px` : v;
};

export function PageLayout({
  header,
  footer,
  headerHeight,
  footerHeight,
  stickyHeader = false,
  stickyFooter = false,
  fullHeight = true,
  background,
  contentPadding,
  className,
  contentProps,
  children,
}: PageLayoutProps) {
  const theme = usePageLayoutTheme();
  const hh = toCssSize(headerHeight ?? theme.header.defaultHeight, 60);
  const fh = toCssSize(footerHeight ?? theme.footer.defaultHeight, 60);

  // Determine grid rows based on stickiness
  let gridTemplateRows: string;
  if (stickyHeader && stickyFooter) {
    gridTemplateRows = `${header ? hh : "0px"} 1fr ${footer ? fh : "0px"}`;
  } else if (stickyHeader && !stickyFooter) {
    gridTemplateRows = `${header ? hh : "0px"} 1fr`;
  } else if (!stickyHeader && stickyFooter) {
    gridTemplateRows = `1fr ${footer ? fh : "0px"}`;
  } else {
    gridTemplateRows = `1fr`;
  }

  const containerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateRows,
    height: fullHeight ? "100vh" : undefined,
    width: "100%",
    overflow: "hidden", // prevent window scroll; internal areas scroll instead
    background: background ?? theme.surface.background,
  };

  // Scroll area styles; minHeight:0 is key for grid children to allow overflow
  const scrollAreaStyle: React.CSSProperties = {
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    WebkitOverflowScrolling: "touch",
    display: "flex",
    flexDirection: "column",
    padding: contentPadding ?? theme.content.padding,
    boxSizing: "border-box",
    background: theme.content.background,
  };

  const headerStyle: React.CSSProperties = {
    height: hh,
    boxSizing: "border-box",
    overflow: "hidden",
    position: stickyHeader ? "sticky" : "static",
    top: stickyHeader ? 0 : undefined,
    zIndex: stickyHeader ? (theme.header.zIndex ?? 2) : (theme.header.zIndex ?? 1),
    background: theme.header.background,
    color: theme.header.color,
    borderBottom: theme.header.borderBottom,
  };

  const footerStyle: React.CSSProperties = {
    height: fh,
    boxSizing: "border-box",
    overflow: "hidden",
    position: stickyFooter ? "sticky" : "static",
    bottom: stickyFooter ? 0 : undefined,
    zIndex: stickyFooter ? (theme.footer.zIndex ?? 2) : (theme.footer.zIndex ?? 1),
    background: theme.footer.background,
    color: theme.footer.color,
    borderTop: theme.footer.borderTop,
  };

  // Render helpers for different stickiness combinations
  const renderStickyHeader = stickyHeader && header;
  const renderStickyFooter = stickyFooter && footer;

  return (
    <div style={containerStyle} className={className}>
      {renderStickyHeader && <header style={headerStyle}>{header}</header>}

      {/* Middle area */}
      <div style={scrollAreaStyle} {...contentProps}>
        {/* Non-sticky header is part of scrollable content */}
        {!stickyHeader && header && (
          <header style={{ height: hh, background: theme.header.background, color: theme.header.color, borderBottom: theme.header.borderBottom }}>
            {header}
          </header>
        )}

        <main style={{ flex: "1 1 auto", minHeight: 0 }}>
          {children}
        </main>

        {/* Non-sticky footer is part of scrollable content */}
        {!stickyFooter && footer && (
          <footer style={{ height: fh, background: theme.footer.background, color: theme.footer.color, borderTop: theme.footer.borderTop }}>
            {footer}
          </footer>
        )}
      </div>

      {renderStickyFooter && <footer style={footerStyle}>{footer}</footer>}
    </div>
  );
}

export default PageLayout;
