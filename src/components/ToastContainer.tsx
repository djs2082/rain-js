import React from "react";
import { useToastTheme } from "../theme/toastProvider";
import type { ToastPlacement } from "../theme/toastTypes";
import { Toast, type ToastProps } from "./Toast";

export function ToastContainer({
  items,
  placement,
  onClose,
  style
}: {
  items: (ToastProps & { id?: string; duration?: number })[];
  placement?: ToastPlacement;
  onClose?: (id?: string) => void;
  /** optional override for the container style */
  style?: React.CSSProperties;
}) {
  const theme = useToastTheme();
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
    ...style // user-provided style overrides
  };

  return (
    <div style={containerStyle} className="toast-container">
      {items.map(item => (
        <Toast key={item.id} id={item.id} message={item.message} variant={item.variant} width={item.width} height={item.height} onClose={onClose} />
      ))}
      <style>
        {`
          @media (max-width: ${theme.container.mobileBreakpoint - 1}px) {
            .toast-container { padding: 0 12px; box-sizing: border-box; }
            .toast-container > div { width: 100% !important; max-width: 100% !important; }
          }
        `}
      </style>
    </div>
  );
}

export default ToastContainer;
