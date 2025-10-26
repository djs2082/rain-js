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
  const ANIM_MS = 220;

  type Visible = { id: string; data: ToastProps & { duration?: number }; status: "enter" | "present" | "exit" };
  const [visible, setVisible] = React.useState<Visible[]>(() =>
    items.map(i => ({ id: i.id ?? Math.random().toString(36).slice(2), data: i, status: "enter" }))
  );

  const timers = React.useRef<Record<string, number>>({});

  // Sync incoming items -> visible list (add new, mark removed)
  React.useEffect(() => {
    const incomingById = new Map<string, (ToastProps & { id?: string; duration?: number })>();
    for (const it of items) {
      const id = it.id ?? Math.random().toString(36).slice(2);
      incomingById.set(id, { ...it, id });
    }

    setVisible(prev => {
      const next: Visible[] = [];
      const prevById = new Map(prev.map(v => [v.id, v] as const));

      // keep or add
      for (const [id, incoming] of incomingById.entries()) {
        if (prevById.has(id)) {
          // keep previous status
          next.push(prevById.get(id)!);
        } else {
          // new item - enter
          next.push({ id, data: incoming, status: "enter" });
        }
      }

      // mark those in prev but not in incoming as exit
      for (const prevItem of prev) {
        if (!incomingById.has(prevItem.id)) {
          // ensure it's present only once
          if (!next.find(n => n.id === prevItem.id)) {
            next.push({ ...prevItem, status: "exit" });
          }
        }
      }

      return next;
    });
  }, [items]);

  // Handle status transitions and auto-dismiss timers
  React.useEffect(() => {
    // Promote enters to present, start timers for durations
    for (const v of visible) {
      if (v.status === "enter") {
        // schedule to become present on next tick
        window.setTimeout(() => {
          setVisible(prev => prev.map(p => (p.id === v.id ? { ...p, status: "present" } : p)));
        }, 10);
      }
      if (v.status === "present" && v.data.duration && v.data.duration > 0 && !timers.current[v.id]) {
        // schedule auto-exit -> call onClose after animation
        timers.current[v.id] = window.setTimeout(() => {
          setVisible(prev => prev.map(p => (p.id === v.id ? { ...p, status: "exit" } : p)));
          // remove after animation and notify
          window.setTimeout(() => {
            setVisible(prev => prev.filter(p => p.id !== v.id));
            try { onClose?.(v.id); } catch {}
            delete timers.current[v.id];
          }, ANIM_MS);
        }, v.data.duration) as unknown as number;
      }
      if (v.status === "exit") {
        // ensure removal after animation
        if (!timers.current[v.id]) {
          timers.current[v.id] = window.setTimeout(() => {
            setVisible(prev => prev.filter(p => p.id !== v.id));
            try { onClose?.(v.id); } catch {}
            delete timers.current[v.id];
          }, ANIM_MS) as unknown as number;
        }
      }
    }
    return () => {
      // no-op cleanup here; timers cleared on unmount below
    };
  }, [visible, onClose]);

  React.useEffect(() => {
    return () => {
      // cleanup all timers on unmount
      for (const k of Object.keys(timers.current)) {
        try { window.clearTimeout(timers.current[k]); } catch {}
      }
      timers.current = {};
    };
  }, []);

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
      {visible.map(v => {
        const isTop = pos.includes("top");
        const entering = v.status === "enter";
        const exiting = v.status === "exit";
        const translate = isTop ? "-8px" : "8px";
        const wrapperStyle: React.CSSProperties = {
          transition: `transform ${ANIM_MS}ms ease, opacity ${ANIM_MS}ms ease`,
          transform: entering ? `translateY(${translate})` : exiting ? `translateY(${translate})` : "translateY(0)",
          opacity: entering ? 0 : exiting ? 0 : 1,
          pointerEvents: "auto",
        };
        return (
          <div key={v.id} style={wrapperStyle}>
            <Toast id={v.id} message={v.data.message} variant={v.data.variant} width={v.data.width} height={v.data.height} onClose={onClose} />
          </div>
        );
      })}
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
