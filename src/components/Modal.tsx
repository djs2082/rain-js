import React, { useEffect } from "react";
import { useModalTheme } from "../theme/modalProvider";

export interface ModalActionButton {
  key: string;
  node: React.ReactNode; // typically your Button component
  // optional click handler if not embedded in node
  onClick?: () => void;
}

export interface ModalProps {
  show: boolean;
  onClose?: () => void;
  crossButton?: boolean;
  header?: React.ReactNode;
  children?: React.ReactNode; // body content
  footerButtons?: ModalActionButton[];
  width?: string | number;
  height?: string | number;
  ariaLabel?: string;
  disableBackdropClose?: boolean;
  closeOnEscape?: boolean;
}

export function Modal({
  show,
  onClose,
  crossButton = true,
  header,
  children,
  footerButtons,
  width,
  height,
  ariaLabel = "Modal dialog",
  disableBackdropClose = false,
  closeOnEscape
}: ModalProps) {
  const theme = useModalTheme();

  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (typeof closeOnEscape === "undefined" || closeOnEscape)) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [show, onClose, closeOnEscape]);

  if (!show) return null;

  const onBackdrop = () => {
    if (!disableBackdropClose) onClose?.();
  };

  return (
    <div role="dialog" aria-label={ariaLabel} aria-modal="true" style={{
      position: "fixed",
      inset: 0,
      background: theme.colors.overlay,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: theme.zIndex
    }} onClick={onBackdrop}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: width ?? theme.width,
          height: height ?? theme.height,
          maxWidth: "90vw",
          maxHeight: "90vh",
          background: theme.colors.surface,
          borderRadius: theme.borderRadius,
          border: `${theme.borderWidth} solid ${theme.colors.border}`,
          boxShadow: `0 10px 30px ${theme.colors.shadow}`,
          fontFamily: theme.fontFamily,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        <div style={{
          background: theme.colors.headerBg,
          color: theme.colors.headerText,
          padding: theme.padding.header,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `${theme.borderWidth} solid ${theme.colors.border}`
        }}>
          <div>{header}</div>
          {crossButton && (
            <button
              aria-label="Close"
              onClick={onClose}
              style={{ background: "transparent", border: 0, cursor: "pointer", color: theme.colors.headerText }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div style={{ padding: theme.padding.body, color: theme.colors.bodyText, flex: 1, overflow: "auto" }}>
          {children}
        </div>

        <div style={{
          background: theme.colors.footerBg,
          color: theme.colors.footerText,
          padding: theme.padding.footer,
          borderTop: `${theme.borderWidth} solid ${theme.colors.border}`,
          display: "flex",
          justifyContent: "flex-end",
          gap: 8
        }}>
          {footerButtons?.map(btn => (
            <span key={btn.key} onClick={btn.onClick} style={{ display: "inline-flex" }}>
              {btn.node}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
