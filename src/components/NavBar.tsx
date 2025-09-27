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
  /** If true, NavBar sticks to the top (useful with PageLayout). For reliable mobile stickiness, consider stickyMode="fixed". */
  sticky?: boolean;
  /** Sticky strategy: CSS "sticky" (default) or "fixed" (more reliable on mobile or when ancestor has overflow properties). */
  stickyMode?: "sticky" | "fixed";
  /** Custom height; defaults to theme.container.height. */
  height?: string | number;
  /** Optional className for root. */
  className?: string;
  /** Optional style override for root. */
  style?: React.CSSProperties;
  /** If true, clicking outside the open mobile menu will close it. Defaults to true. */
  closeOnOutsideClick?: boolean;
}

const toCss = (v?: string | number) => (typeof v === "number" ? `${v}px` : v);

export function NavBar({
  brand,
  right,
  links = [],
  collapseAt,
  sticky = false,
  stickyMode = "sticky",
  height,
  className,
  style,
  closeOnOutsideClick = true,
}: NavBarProps) {
  const theme = useNavBarTheme();
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [animateIn, setAnimateIn] = React.useState(false);
  const navRef = React.useRef<HTMLElement>(null);
  const bp = collapseAt ?? theme.breakpoint;
  // Normalize right prop into an array of children so we can render its individual
  // child nodes stacked in mobile menu (preserve order)
  const rightChildren = React.Children.toArray(right) as React.ReactNode[];
  
  // Handle mobile sticky behavior
  React.useEffect(() => {
    if (!sticky || !navRef.current) return;
    
    // Function to handle scroll behavior
    const handleScroll = () => {
      const nav = navRef.current;
      if (!nav) return;
      
      const isMobile = window.innerWidth < bp;
      
      // If on mobile device or small screen, prioritize fixed positioning for more reliable stickiness
      if (isMobile) {
        // Use fixed positioning for mobile as it's more reliable
        nav.style.position = "fixed";
        nav.style.top = "0";
        nav.style.left = "0";
        nav.style.right = "0";
        nav.style.width = "100%";
        nav.style.zIndex = `${(theme.container.zIndex ?? 200) + 50}`;
        
        // When using fixed positioning, we need to add padding to body to prevent content jump
        if (stickyMode === "fixed") {
          document.body.style.paddingTop = nav.offsetHeight + "px";
        }
      } else if (stickyMode === "fixed") {
        // For desktop fixed mode
        nav.style.position = "fixed";
        nav.style.top = "0";
        nav.style.left = "0";
        nav.style.right = "0";
        nav.style.width = "100%";
        document.body.style.paddingTop = nav.offsetHeight + "px";
      } else {
        // For desktop sticky mode (default)
        nav.style.position = "sticky";
        nav.style.top = "0";
        nav.style.width = "100%";
        document.body.style.paddingTop = "0px";
      }
    };
    
    // Setup
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      document.body.style.paddingTop = "0px"; // Reset body padding
    };
  }, [sticky, stickyMode, bp, theme.container.zIndex]);

  // Manage dropdown mount/animation lifecycle so we can animate open/close
  const animationDuration = 180; // ms
  const animTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (open) {
      // mount then animate in
      setMounted(true);
      // next frame toggle animateIn
      window.requestAnimationFrame(() => setAnimateIn(true));
    } else {
      // animate out then unmount after duration
      setAnimateIn(false);
      if (animTimeoutRef.current) {
        window.clearTimeout(animTimeoutRef.current);
      }
      animTimeoutRef.current = window.setTimeout(() => {
        setMounted(false);
      }, animationDuration + 30);
    }

    return () => {
      if (animTimeoutRef.current) {
        window.clearTimeout(animTimeoutRef.current);
        animTimeoutRef.current = null;
      }
    };
  }, [open]);

  // Click-outside to close (mobile dropdown). Uses pointerdown for better UX.
  React.useEffect(() => {
    if (!mounted || !closeOnOutsideClick) return;

    const handlePointer = (ev: PointerEvent | MouseEvent) => {
      const target = ev.target as Node | null;
      if (!navRef.current) return;
      if (target && !navRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointer);
    return () => document.removeEventListener("pointerdown", handlePointer);
  }, [mounted, closeOnOutsideClick]);

  // Determine effective positioning when sticky requested.
  // Note: For mobile compatibility issues with sticky positioning:
  // - Use stickyMode="fixed" when inside containers with overflow properties
  // - Fixed mode is more reliable on mobile but removes the element from normal flow
  // - Sticky mode works in standard scenarios but may fail in complex layouts on mobile
  
  // Initial position strategy - will be enhanced by the useEffect for client-side rendering
  const effectivePosition: React.CSSProperties["position"] = !sticky
    ? "relative"
    : stickyMode === "fixed"
    ? "fixed"
    : "sticky"; // default strategy

  // The key issues with mobile sticky:
  // 1. Need to be positioned at the very top of viewport (fixed ensures this)
  // 2. Need explicit width:100% and left:0,right:0 (especially for fixed)
  // 3. Need increased z-index to appear above other elements
  const rootStyles: React.CSSProperties = {
    position: effectivePosition,
    top: sticky ? 0 : undefined,
    left: sticky ? 0 : undefined,
    right: sticky ? 0 : undefined,
    width: sticky ? "100%" : undefined, 
    zIndex: (theme.container.zIndex ?? 200) + (sticky ? (stickyMode === "fixed" ? 50 : 20) : 0),
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
    <nav ref={navRef} style={{ ...rootStyles, ...style }} className={className}>
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
        <div className="nav-right" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
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
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {/* Desktop-only right area (hidden on mobile via CSS) */}
            <div className="nav-right-desktop" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {right}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer (simple inline) */}
      {mounted && (
        // Compact dropdown anchored to the right (hamburger). Position is absolute relative to the nav element.
        <div
          className="nav-mobile-dropdown-wrapper"
          style={{ position: "absolute", top: toCss(height ?? theme.container.height), right: 0, zIndex: (theme.container.zIndex ?? 200) + 60, pointerEvents: "auto" }}
        >
          {/* Pointer triangle */}
          <div
            style={{
              position: "absolute",
              right: parseInt(String(theme.container.paddingX || "16")) + 12,
              top: -8,
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: `8px solid ${theme.menu.mobileBackground ?? theme.container.background}`,
            }}
          />

          <div
            className="nav-mobile-dropdown"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              padding: `6px 0`,
              background: theme.menu.mobileBackground ?? theme.container.background,
              border: theme.menu.mobileMenuBorder ?? "1px solid rgba(0,0,0,0.08)",
              borderRadius: 8,
              minWidth: theme.menu.mobileMenuMinWidth ?? 160,
              maxWidth: theme.menu.mobileMenuMaxWidth ?? "90vw",
              boxShadow: theme.container.shadow,
              overflow: "hidden",
              margin: theme.menu.mobileMenuMargin || "0",
              transformOrigin: "top right",
              transition: `transform ${animationDuration}ms ease, opacity ${animationDuration}ms ease`,
              transform: animateIn ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.98)",
              opacity: animateIn ? 1 : 0,
            }}
          >
            {links.map(item => {
              const Comp: any = item.href ? "a" : "button";
              const base = { ...linkBase, display: "block", padding: "10px 14px" } as React.CSSProperties;
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
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    opacity: item.disabled ? 0.5 : 1,
                  }}
                >
                  {item.label}
                </Comp>
              );
            })}

            {rightChildren.length > 0 && (
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.04)", padding: "6px 8px", display: "flex", flexDirection: "column", gap: 8 }}>
                {rightChildren.map((child, idx) => (
                  <div key={idx} style={{ width: "100%" }}>
                    {child}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Simple responsive CSS via inline <style>: hide/show parts based on breakpoint */}
      <style>
        {`
          @media (min-width: ${bp}px) {
            .nav-hamburger { display: none !important; }
            .nav-mobile { display: none !important; }
            .nav-links-desktop { display: flex; }
            .nav-right-desktop { display: inline-flex; }
          }
          @media (max-width: ${bp - 1}px) {
            .nav-hamburger { display: inline-flex; }
            .nav-desktop { display: none; }
            .nav-links-desktop { display: none; }
            /* Hide header right area on mobile; actions moved into mobile drawer */
            .nav-right-desktop { display: none !important; }
            .nav-right { /* keep hamburger position */ display: inline-flex; }
            .nav-mobile { align-items: flex-end; }
            .nav-mobile .nav-right-mobile { display: flex; flex-direction: column; }
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
