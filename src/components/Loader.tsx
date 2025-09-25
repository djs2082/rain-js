import React from "react";
import ReactDOM from "react-dom";

type LoaderVariant = "spinner" | "skeleton" | "image";
type SpinnerType = "ring" | "dots" | "hourglass";

export interface LoaderProps {
  variant?: LoaderVariant;
  // General
  visible?: boolean; // controls mount; default true
  label?: React.ReactNode; // accessible label or visual text under loader
  className?: string;
  style?: React.CSSProperties;

  // Overlay behavior
  fullscreen?: boolean; // cover window
  coverParent?: boolean; // position:absolute to nearest relative parent
  overlay?: boolean; // show translucent backdrop
  overlayColor?: string; // backdrop color
  overlayOpacity?: number; // 0..1
  zIndex?: number; // stacking
  backdropClickable?: boolean; // if true, allow clicks to pass through; if false, block clicks
  onBackdropClick?: (e: React.MouseEvent) => void;

  // Spinner-specific
  spinnerType?: SpinnerType;
  size?: number; // px
  color?: string;
  thickness?: number; // ring thickness
  speedMs?: number; // animation speed

  // Skeleton-specific
  rows?: number; // number of skeleton lines
  skeletonWidth?: string | number;
  skeletonHeight?: string | number;
  skeletonRadius?: number; // border radius
  skeletonAnimate?: boolean;
  skeletonGap?: number;

  // Image loader specific
  src?: string;
  alt?: string;
  imgWidth?: string | number;
  imgHeight?: string | number;
  objectFit?: React.CSSProperties["objectFit"];
  showWhileLoading?: boolean; // show loader until image loads
  fallback?: React.ReactNode; // on error
}

const toCss = (v?: string | number) => (typeof v === "number" ? `${v}px` : v);

function Portal({ children, zIndex = 9999 }: { children: React.ReactNode; zIndex?: number }) {
  const elRef = React.useRef<HTMLElement | null>(null);
  if (!elRef.current && typeof document !== "undefined") {
    const el = document.createElement("div");
    el.style.position = "fixed";
    el.style.zIndex = String(zIndex);
    el.style.top = "0";
    el.style.left = "0";
    el.style.right = "0";
    el.style.bottom = "0";
    elRef.current = el;
  }
  React.useEffect(() => {
    if (!elRef.current || typeof document === "undefined") return;
    document.body.appendChild(elRef.current);
    return () => {
      if (elRef.current?.parentElement) elRef.current.parentElement.removeChild(elRef.current);
    };
  }, []);
  return elRef.current ? ReactDOM.createPortal(children, elRef.current) : null;
}

function Spinner({ type, size = 48, color = "#2563eb", thickness = 4, speedMs = 900 }: {
  type?: SpinnerType; size?: number; color?: string; thickness?: number; speedMs?: number;
}) {
  const common: React.CSSProperties = { display: "inline-block" };
  switch (type) {
    case "dots": {
      const dot: React.CSSProperties = { width: size / 6, height: size / 6, background: color, borderRadius: "50%" };
      const gap = size / 6;
      const dur = speedMs / 1000;
      return (
        <div style={{ ...common }} aria-hidden>
          <style>
            {`
              @keyframes loader-dots { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
            `}
          </style>
          <div style={{ display: "inline-flex", alignItems: "center", gap }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ ...dot, animation: `loader-dots ${dur}s infinite ease-in-out`, animationDelay: `${i * (dur / 3)}s` }} />
            ))}
          </div>
        </div>
      );
    }
    case "hourglass": {
      const dur = speedMs / 1000;
      const sizeCss = toCss(size);
      return (
        <div style={{ ...common, width: sizeCss, height: sizeCss }} aria-hidden>
          <style>
            {`
              @keyframes loader-hourglass { 0% { transform: rotate(0); } 50% { transform: rotate(180deg); } 100% { transform: rotate(360deg); } }
            `}
          </style>
          <div style={{
            width: "100%", height: "100%",
            border: `${thickness}px solid ${color}66`, borderTopColor: color, borderBottomColor: color,
            borderRadius: "50%",
            animation: `loader-hourglass ${dur}s linear infinite`,
          }} />
        </div>
      );
    }
    case "ring":
    default: {
      const dur = speedMs / 1000;
      const sizeCss = toCss(size);
      return (
        <div style={{ ...common, width: sizeCss, height: sizeCss }} aria-hidden>
          <style>
            {`
              @keyframes loader-rotate { to { transform: rotate(360deg); } }
            `}
          </style>
          <div style={{
            boxSizing: "border-box",
            width: "100%",
            height: "100%",
            border: `${thickness}px solid ${color}22`,
            borderTopColor: color,
            borderRadius: "50%",
            animation: `loader-rotate ${dur}s linear infinite`,
          }} />
        </div>
      );
    }
  }
}

function SkeletonLines({
  rows = 3,
  width = "100%",
  height = 12,
  radius = 6,
  gap = 10,
  animate = true,
}: { rows?: number; width?: string | number; height?: string | number; radius?: number; gap?: number; animate?: boolean }) {
  const shimmerId = React.useId();
  return (
    <div aria-hidden>
      <style>
        {animate ? `
          @keyframes loader-shimmer-${shimmerId} { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        ` : ""}
      </style>
      <div style={{ display: "grid", rowGap: gap }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            style={{
              width: toCss(width),
              height: toCss(height),
              borderRadius: radius,
              background: animate
                ? `linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%)`
                : `#e5e7eb`,
              backgroundSize: animate ? "400% 100%" : undefined,
              animation: animate ? `loader-shimmer-${shimmerId} 1.4s ease infinite` : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ImageLoader({ src, alt, width, height, objectFit = "cover", showWhileLoading = true, fallback, spinner }: {
  src?: string; alt?: string; width?: string | number; height?: string | number; objectFit?: React.CSSProperties["objectFit"]; showWhileLoading?: boolean; fallback?: React.ReactNode; spinner?: React.ReactNode;
}) {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  return (
    <div style={{ position: "relative", width: toCss(width), height: toCss(height), background: "#f3f4f6", overflow: "hidden" }}>
      {!loaded && !error && showWhileLoading && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {spinner ?? <Spinner type="ring" />}
        </div>
      )}
      {error && fallback}
      {src && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ width: "100%", height: "100%", objectFit }}
        />
      )}
    </div>
  );
}

export function Loader(props: LoaderProps) {
  const {
    variant = "spinner",
    visible = true,
    label,
    className,
    style,
    fullscreen,
    coverParent,
    overlay = true,
    overlayColor = "#111827",
    overlayOpacity = 0.35,
    zIndex = 9999,
    backdropClickable = false,
    onBackdropClick,
    spinnerType = "ring",
    size = 48,
    color = "#2563eb",
    thickness = 4,
    speedMs = 900,
    rows,
    skeletonWidth,
    skeletonHeight,
    skeletonRadius,
    skeletonAnimate,
    skeletonGap,
    src,
    alt,
    imgWidth,
    imgHeight,
    objectFit,
    showWhileLoading,
    fallback,
  } = props;

  if (!visible) return null;

  const renderInner = () => {
    switch (variant) {
      case "skeleton":
        return (
          <SkeletonLines rows={rows} width={skeletonWidth ?? "100%"} height={skeletonHeight ?? 12} radius={skeletonRadius ?? 6} gap={skeletonGap ?? 10} animate={skeletonAnimate ?? true} />
        );
      case "image":
        return <ImageLoader src={src} alt={alt} width={imgWidth} height={imgHeight} objectFit={objectFit} showWhileLoading={showWhileLoading} fallback={fallback} spinner={<Spinner type={spinnerType} size={size} color={color} thickness={thickness} speedMs={speedMs} />} />;
      case "spinner":
      default:
        return (
          <div role="status" aria-live="polite" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Spinner type={spinnerType} size={size} color={color} thickness={thickness} speedMs={speedMs} />
            {label ? <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div> : null}
          </div>
        );
    }
  };

  const content = (
    <div className={className} style={style}>
      {renderInner()}
    </div>
  );

  // Decide container/overlay behavior
  const overlayStyles: React.CSSProperties = {
    position: fullscreen ? "fixed" : coverParent ? "absolute" : undefined,
    inset: fullscreen || coverParent ? 0 : undefined,
    display: fullscreen || coverParent ? "flex" : undefined,
    alignItems: "center",
    justifyContent: "center",
    background: overlay ? overlayColor : undefined,
    opacity: overlay ? overlayOpacity : undefined,
    pointerEvents: backdropClickable ? "none" : "auto",
    zIndex: fullscreen ? zIndex : undefined,
  };

  const innerWrap: React.CSSProperties = {
    pointerEvents: "auto", // allow interacting with loader content even if backdrop is click-through
  };

  if (fullscreen) {
    return (
      <Portal zIndex={zIndex}>
        <div style={overlayStyles} onClick={onBackdropClick}>
          <div style={innerWrap}>{content}</div>
        </div>
      </Portal>
    );
  }

  if (coverParent) {
    return (
      <div style={overlayStyles} onClick={onBackdropClick}>
        <div style={innerWrap}>{content}</div>
      </div>
    );
  }

  // No overlay: inline loader
  return content;
}

export default Loader;
