export type Priority = "low" | "medium" | "high";

export interface PriorityBadgeVariantStyle {
  background: string;
  color: string;
  dotColor?: string;
}

export interface PriorityBadgeTheme {
  variants: Record<Priority, PriorityBadgeVariantStyle>;
  badge: {
    fontSize: string;
    fontWeight: number | string;
    borderRadius: string | number;
    padding: string;
    gap: number | string;
  };
  dot: {
    size: number; // px
    opacity: number;
    blinkDurationMs: number;
  };
}

export type PriorityBadgeThemeOverride = Partial<
  PriorityBadgeTheme & {
    variants: Partial<Record<Priority, Partial<PriorityBadgeVariantStyle>>>;
    badge: Partial<PriorityBadgeTheme["badge"]>;
    dot: Partial<PriorityBadgeTheme["dot"]>;
  }
>;
