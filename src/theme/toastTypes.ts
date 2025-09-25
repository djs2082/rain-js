export type ToastPlacement =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastVariantStyle {
  background: string;
  color?: string;
  border?: string;
}

export interface ToastTheme {
  container: {
    zIndex?: number;
    gap: string | number;
    edgeOffset: string | number; // distance from the screen edge
    mobileBreakpoint: number; // px
    placement: ToastPlacement;
  };
  toast: {
    borderRadius: string;
    shadow?: string;
    padding: string;
    width?: string | number;
    maxWidth?: string | number;
    fontSize?: string;
  };
  variants: Record<ToastVariant, ToastVariantStyle>;
  durations: { default: number };
}

export type ToastThemeOverride = Partial<
  ToastTheme & {
    container: Partial<ToastTheme["container"]>;
    toast: Partial<ToastTheme["toast"]>;
    variants: Partial<Record<ToastVariant, Partial<ToastVariantStyle>>>;
    durations: Partial<ToastTheme["durations"]>;
  }
>;
