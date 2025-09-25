import React from "react";
import { useNavBarTheme } from "../theme/navBarProvider";

export type NavLinkItem = {
  key: string;
  label: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
  disabled?: boolean;
};

export interface NavBarProps {
  /** Branding area (e.g., logo + name). Placed on the left. */
  brand?: React.ReactNode;
  /** Right-side area (e.g., buttons like Sign in). */
  right?: React.ReactNode;
  /** Links/menu items for the center/left area. */
  links?: NavLinkItem[];
  /** Collapses links under hamburger below this width (px). Defaults to theme.breakpoint. */
  collapseAt?: number;
  /** If true, NavBar sticks to the top (useful with PageLayout). */
  sticky?: boolean;
  /** Custom height; defaults to theme.container.height. */
  height?: string | number;
  /** Optional className for root. */
  className?: string;
  /** Optional style override for root. */
  style?: React.CSSProperties;
}

const toCss = (v?: string | number) => (typeof v === "number" ? `${v}px` : v);

export function NavBar({
  brand,
  right,
  links = [],
  collapseAt,
  sticky = false,
  height,
  className,
  style,
}: NavBarProps) {
  const theme = useNavBarTheme();
  const [open, setOpen] = React.useState(false);
  const bp = collapseAt ?? theme.breakpoint;

  const rootStyles: React.CSSProperties = {
    position: sticky ? "sticky" : "relative",
    top: sticky ? 0 : undefined,
    zIndex: theme.container.zIndex ?? 200,
    background: theme.container.background,
    color: theme.container.color,
    borderBottom: theme.container.borderBottom,
    boxShadow: theme.container.shadow,
  };

  const innerStyles: React.CSSProperties = {
    height: toCss(height ?? theme.container.height),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: `0 ${theme.container.paddingX}`,
    boxSizing: "border-box",
  };

  const brandStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    fontSize: theme.brand.fontSize,
    fontWeight: theme.brand.fontWeight,
    color: theme.brand.color ?? theme.container.color,
    minWidth: 0,
  };

  const menuStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: theme.menu.gap,
  };

  const linkBase: React.CSSProperties = {
    fontSize: theme.link.fontSize,
    color: theme.link.color,
    padding: theme.link.padding,
    borderRadius: theme.link.borderRadius,
    textDecoration: "none",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
  };

  const hamburgerButton: React.CSSProperties = {
    alignItems: "center",
    justifyContent: "center",
    width: `calc(${theme.hamburger.size} + 8px)`,
    height: `calc(${theme.hamburger.size} + 8px)`,
    color: theme.hamburger.color,
    background: "transparent",
    border: 0,
    cursor: "pointer",
  };

  // Responsive: render two menus; desktop visible above breakpoint, mobile below
  return (
    <nav style={{ ...rootStyles, ...style }} className={className}>
      <div style={innerStyles}>
        {/* Left: brand */}
        <div style={brandStyles}>{brand}</div>

        {/* Desktop menu */}
        <div className="nav-desktop" style={{ ...menuStyles, flex: 1, justifyContent: "center" }}>
          <div
            style={{ alignItems: "center", gap: theme.menu.gap } as React.CSSProperties}
            className="nav-links-desktop"
          >
            {links.map(item => {
              const Comp: any = item.href ? "a" : "button";
              const base = { ...linkBase } as React.CSSProperties;
              const active = item.active;
              return (
                <Comp
                  key={item.key}
                  href={item.href}
                  onClick={item.onClick}
                  disabled={item.disabled as any}
                  style={{
                    ...base,
                    color: active ? theme.link.activeColor : base.color,
                    opacity: item.disabled ? 0.5 : 1,
                  }}
                >
                  {item.label}
                </Comp>
              );
            })}
          </div>
        </div>

        {/* Right: actions or hamburger */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {/* Mobile hamburger toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(v => !v)}
            style={hamburgerButton}
            className="nav-hamburger"
          >
            {/* Simple hamburger icon */}
            <svg width={theme.hamburger.size} height={theme.hamburger.size} viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="6" width="18" height="2" rx="1" />
              <rect x="3" y="11" width="18" height="2" rx="1" />
              <rect x="3" y="16" width="18" height="2" rx="1" />
            </svg>
          </button>

          {/* Right actions (desktop first) */}
          <div className="nav-right" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {right}
          </div>
        </div>
      </div>

      {/* Mobile menu drawer (simple inline) */}
      {open && (
        <div
          className="nav-mobile"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.menu.gap,
            padding: `8px ${theme.container.paddingX}`,
            background: theme.menu.mobileBackground ?? theme.container.background,
            borderBottom: theme.container.borderBottom,
          }}
        >
          {links.map(item => {
            const Comp: any = item.href ? "a" : "button";
            const base = { ...linkBase } as React.CSSProperties;
            const active = item.active;
            return (
              <Comp
                key={item.key}
                href={item.href}
                onClick={(e: React.MouseEvent) => {
                  item.onClick?.(e);
                  setOpen(false);
                }}
                disabled={item.disabled as any}
                style={{
                  ...base,
                  color: active ? theme.link.activeColor : base.color,
                  textAlign: "left",
                  width: "100%",
                  opacity: item.disabled ? 0.5 : 1,
                }}
              >
                {item.label}
              </Comp>
            );
          })}
        </div>
      )}

      {/* Simple responsive CSS via inline <style>: hide/show parts based on breakpoint */}
      <style>
        {`
          @media (min-width: ${bp}px) {
            .nav-hamburger { display: none !important; }
            .nav-mobile { display: none !important; }
            .nav-links-desktop { display: flex; }
          }
          @media (max-width: ${bp - 1}px) {
            .nav-hamburger { display: inline-flex; }
            .nav-desktop { display: none; }
            .nav-links-desktop { display: none; }
          }
          .nav-links-desktop a:hover, .nav-links-desktop button:hover {
            color: ${theme.link.hoverColor};
          }
        `}
      </style>
    </nav>
  );
}

export default NavBar;
