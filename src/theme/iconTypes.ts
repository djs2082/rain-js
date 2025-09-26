export interface IconTheme {
  size: string; // default size e.g. '20px'
  color: string; // default color
  strokeWidth?: number;
}

export type IconThemeOverride = Partial<IconTheme>;
