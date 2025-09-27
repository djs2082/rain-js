import React from "react";
import { useToastTheme } from "../theme/toastProvider";
import type { ToastVariant } from "../theme/toastTypes";

export type ToastProps = {
  id?: string;
  message: React.ReactNode;
  variant?: ToastVariant;
  width?: string | number;
  height?: string | number;
  duration?: number;
  onClose?: (id?: string) => void;
};

export function Toast({ id, message, variant = "info", width, height, onClose }: ToastProps) {
  const theme = useToastTheme();
  const v = theme.variants[variant ?? "info"];
  const w = width ?? theme.toast.width;
  const h = height;
  const style: React.CSSProperties = {
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
  };

  return (
    <div style={style} className="rain-toast">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1 }}>{message}</div>
        <button
          aria-label="Close"
          onClick={() => onClose?.(id)}
          style={{ pointerEvents: "auto", background: "transparent", border: 0, color: "inherit", cursor: "pointer" }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default Toast;
