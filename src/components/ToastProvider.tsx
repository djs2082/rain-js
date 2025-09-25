import React from "react";
import { useToastTheme } from "../theme/toastProvider";
import type { ToastVariant, ToastPlacement } from "../theme/toastTypes";

export type ToastItem = {
  id: string;
  message: React.ReactNode;
  variant?: ToastVariant;
  duration?: number; // ms
  width?: string | number;
  height?: string | number;
};

type ToastContextValue = {
  show: (message: React.ReactNode, options?: Omit<ToastItem, "id" | "message">) => string;
  hide: (id: string) => void;
  clear: () => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export interface ToastProviderProps {
  placement?: ToastPlacement; // override theme placement
  children: React.ReactNode;
}

export function ToastProvider({ placement, children }: ToastProviderProps) {
  const theme = useToastTheme();
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const timers = React.useRef<Record<string, any>>({});

  const show: ToastContextValue["show"] = (message, options) => {
    const id = Math.random().toString(36).slice(2);
    const variant = options?.variant ?? "info";
    const duration = options?.duration ?? theme.durations.default;
    const item: ToastItem = { id, message, variant, duration, width: options?.width, height: options?.height };
    setItems(prev => (placement?.startsWith("bottom") || theme.container.placement.startsWith("bottom") ? [...prev, item] : [item, ...prev]));
    if (duration && duration > 0) {
      timers.current[id] = setTimeout(() => {
        setItems(prev => prev.filter(i => i.id !== id));
        delete timers.current[id];
      }, duration);
    }
    return id;
  };

  const hide: ToastContextValue["hide"] = id => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clear: ToastContextValue["clear"] = () => {
    Object.values(timers.current).forEach(t => clearTimeout(t));
    timers.current = {};
    setItems([]);
  };

  React.useEffect(() => () => clear(), []);

  const value = React.useMemo(() => ({ show, hide, clear }), []);

  const pos = placement ?? theme.container.placement;
  const base: React.CSSProperties = {
    position: "fixed",
    zIndex: theme.container.zIndex ?? 1000,
    display: "flex",
    gap: typeof theme.container.gap === "number" ? `${theme.container.gap}px` : theme.container.gap,
    pointerEvents: "none",
  };

  const offset = typeof theme.container.edgeOffset === "number" ? `${theme.container.edgeOffset}px` : theme.container.edgeOffset;
  const isTop = pos.includes("top");
  const isCenter = pos.includes("center");
  const isRight = pos.includes("right");

  const containerStyle: React.CSSProperties = {
    ...base,
    top: isTop ? offset : undefined,
    bottom: !isTop ? offset : undefined,
    left: isCenter ? 0 : isRight ? undefined : offset,
    right: isCenter ? 0 : isRight ? offset : undefined,
    justifyContent: isCenter ? "center" : undefined,
    flexDirection: isTop ? "column" : "column-reverse",
    width: isCenter ? "100%" : undefined,
    alignItems: isCenter ? "center" : undefined,
  };

  const toastStyle = (variant?: ToastVariant, width?: string | number, height?: string | number): React.CSSProperties => {
    const v = theme.variants[variant ?? "info"];
    const w = width ?? theme.toast.width;
    const h = height;
    return {
      background: v.background,
      color: v.color,
      border: v.border,
      borderRadius: theme.toast.borderRadius,
      boxShadow: theme.toast.shadow,
      padding: theme.toast.padding,
  width: typeof w === "number" ? `${w}px` : w,
  maxWidth: typeof theme.toast.maxWidth === "number" ? `${theme.toast.maxWidth}px` : theme.toast.maxWidth,
      minHeight: typeof h === "number" ? `${h}px` : h,
      fontSize: theme.toast.fontSize,
      pointerEvents: "auto",
    } as React.CSSProperties;
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={containerStyle} className="toast-container">
        {items.map(item => (
          <div key={item.id} style={toastStyle(item.variant, item.width, item.height)}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1 }}>{item.message}</div>
              <button
                aria-label="Close"
                onClick={() => hide(item.id)}
                style={{ pointerEvents: "auto", background: "transparent", border: 0, color: "inherit", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <style>
        {`
          @media (max-width: ${theme.container.mobileBreakpoint - 1}px) {
            .toast-container { padding: 0 12px; box-sizing: border-box; }
            .toast-container > div { width: 100% !important; max-width: 100% !important; }
          }
        `}
      </style>
    </ToastContext.Provider>
  );
}
