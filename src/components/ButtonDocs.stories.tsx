import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "./Button";
import { ButtonThemeProvider } from "../theme/provider";

/**
 * # Button
 * 
 * A themeable, MUI-like Button with variants, sizes, colors, and icon support.
 * 
 * The Button component provides three visual variants, six color palettes, and three sizes.
 * It can be customized via inline styles or through the Button theme provider for consistent app-wide styling.
 * 
 * ## Props
 * 
 * Key props:
 * - `variant`: "text" | "outlined" | "contained"
 * - `color`: "primary" | "secondary" | "success" | "error" | "warning" | "info"
 * - `size`: "small" | "medium" | "large"
 * - `disabled`: boolean
 * - `startIcon` / `endIcon`: React nodes rendered before/after the label
 * - `fullWidth`: boolean to stretch to container width
 * - `onClick`: button click handler
 * - Plus all native button attributes (type, aria-*, etc.)
 */

const meta: Meta<typeof Button> = {
  title: "Components/Button/Documentation",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A themeable, MUI-like Button with variants, sizes, colors, and icon support."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof Button>;

/**
 * ## Quick usage
 * 
 * The Button component can be used with various props to create different visual styles.
 */
export const QuickUsage: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h3>Basic button</h3>
        <Button variant="contained" color="primary">Primary</Button>
      </div>
      
      <div>
        <h3>Variants</h3>
        <div style={{ display: "flex", gap: 16 }}>
          <Button variant="text">Text</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="contained">Contained</Button>
        </div>
      </div>
      
      <div>
        <h3>Sizes</h3>
        <div style={{ display: "flex", gap: 16 }}>
          <Button variant="contained" size="small">Small</Button>
          <Button variant="contained" size="medium">Medium</Button>
          <Button variant="contained" size="large">Large</Button>
        </div>
      </div>
      
      <div>
        <h3>With icons</h3>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Button variant="contained" startIcon={<span>★</span>}>Start</Button>
          <Button variant="outlined" endIcon={<span>→</span>}>End</Button>
        </div>
      </div>
      
      <div>
        <h3>Inline styling</h3>
        <Button
          variant="contained"
          style={{ borderRadius: 20, textTransform: "none", fontWeight: 700, fontSize: 16 }}
        >
          Custom Styled
        </Button>
      </div>
    </div>
  )
};

/**
 * ## Theming
 * 
 * Wrap part of your tree with `ButtonThemeProvider` to override tokens.
 * Only the provided pieces are overridden; everything else falls back to defaults.
 * 
 * ### How to use the theme provider (step-by-step)
 * 
 * 1. Import the provider and wrap the part of your app where you want overrides to apply.
 * 2. Pass a partial theme object; deep merge preserves unspecified defaults.
 * 3. Use the `color` and `size` props on buttons as usual; they'll pick up your tokens.
 * 
 * Global (App-level) usage:
 * 
 * ```tsx
 * import React from "react";
 * import { Button, ButtonThemeProvider } from "@karya_app1/rain-js";
 * 
 * export function App() {
 *   return (
 *     <ButtonThemeProvider
 *       theme={{
 *         colors: {
 *           primary: { main: "#4f46e5", hover: "#4338ca", text: "#4f46e5", border: "#4f46e5" }
 *         },
 *         borderRadius: "8px",
 *         textTransform: "none"
 *       }}
 *     >
 *       <Button variant="contained" color="primary">Primary</Button>
 *     </ButtonThemeProvider>
 *   );
 * }
 * ```
 * 
 * Local (Section-level) usage:
 * 
 * ```tsx
 * <div>
 *   <Button variant="contained" color="primary">Un-themed</Button>
 *   <ButtonThemeProvider theme={{ colors: { primary: { main: "#10b981", hover: "#059669", text: "#10b981", border: "#10b981" } } }}>
 *     <Button variant="contained" color="primary">Themed only here</Button>
 *   </ButtonThemeProvider>
 *   <Button variant="contained" color="primary">Un-themed again</Button>
 * </div>
 * ```
 * 
 * ### Theme structure and defaults
 * 
 * TypeScript types you can import:
 * 
 * ```ts
 * import type { ButtonTheme, ButtonColorKey } from "@karya_app1/rain-js";
 * ```
 * 
 * Default tokens (used when you don't override):
 * 
 * ```ts
 * // defaultButtonTheme
 * {
 *   colors: {
 *     primary:   { main: "#1976d2", hover: "#1565c0", text: "#1976d2", border: "#1976d2" },
 *     secondary: { main: "#9c27b0", hover: "#7b1fa2", text: "#9c27b0", border: "#9c27b0" },
 *     success:   { main: "#2e7d32", hover: "#1b5e20", text: "#2e7d32", border: "#2e7d32" },
 *     error:     { main: "#d32f2f", hover: "#c62828", text: "#d32f2f", border: "#d32f2f" },
 *     warning:   { main: "#ed6c02", hover: "#e65100", text: "#ed6c02", border: "#ed6c02" },
 *     info:      { main: "#0288d1", hover: "#0277bd", text: "#0288d1", border: "#0288d1" }
 *   },
 *   sizes: {
 *     small:  { padding: "4px 10px", fontSize: "0.8125rem", minHeight: "30px" },
 *     medium: { padding: "6px 16px", fontSize: "0.875rem",  minHeight: "36px" },
 *     large:  { padding: "8px 22px", fontSize: "0.9375rem", minHeight: "42px" }
 *   },
 *   borderRadius: "4px",
 *   fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
 *   textTransform: "uppercase",
 *   letterSpacing: "0.02857em",
 *   fontWeight: 500
 * }
 * ```
 * 
 * How variants use tokens:
 * - contained: uses `colors[color].main` for background, `hover` on hover, and `border` for the border.
 * - outlined: transparent background; `text` for label color; `border` for border; hover adds a subtle overlay.
 * - text: transparent background; `text` for label; no border.
 */
export const ThemeExamples: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <h3>Custom primary color and radius</h3>
        <ButtonThemeProvider
          theme={{
            colors: { primary: { main: "#4f46e5", hover: "#4338ca", text: "#4f46e5", border: "#4f46e5" } },
            borderRadius: "9999px",
            textTransform: "none",
            fontWeight: 600
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <Button variant="contained" color="primary">Primary</Button>
            <Button variant="outlined" color="primary">Outlined</Button>
            <Button variant="text" color="primary">Text</Button>
          </div>
        </ButtonThemeProvider>
      </div>

      <div>
        <h3>Compact size tokens</h3>
        <ButtonThemeProvider
          theme={{
            sizes: {
              small: { padding: "2px 8px", fontSize: "0.75rem", minHeight: "26px" },
              medium: { padding: "4px 12px", fontSize: "0.8125rem", minHeight: "32px" },
              large: { padding: "6px 14px", fontSize: "0.875rem", minHeight: "38px" }
            }
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <Button variant="contained" size="small">Small</Button>
            <Button variant="contained" size="medium">Medium</Button>
            <Button variant="contained" size="large">Large</Button>
          </div>
        </ButtonThemeProvider>
      </div>

      <div>
        <h3>Custom border color (outlined buttons)</h3>
        <ButtonThemeProvider 
          theme={{ colors: { info: { main: "#0288d1", hover: "#0277bd", text: "#0288d1", border: "#14b8a6" } } }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <Button variant="outlined" color="info">Outlined (custom border)</Button>
            <Button variant="contained" color="info">Contained (unchanged)</Button>
          </div>
        </ButtonThemeProvider>
      </div>

      <div>
        <h3>Full width button</h3>
        <div style={{ width: 320 }}>
          <Button variant="contained" fullWidth>Full width</Button>
        </div>
      </div>
    </div>
  )
};

/**
 * ## Accessibility
 * 
 * - Uses a native `<button>` element, which supports keyboard and ARIA attributes.
 * - Pass `aria-label` when the button has only an icon.
 * - Respect `disabled` for both visual and interactive state.
 */
export const Accessibility: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h3>Icon-only button with aria-label</h3>
      <div style={{ display: "flex", gap: 16 }}>
        <Button
          variant="contained"
          aria-label="Add to favorites"
          startIcon={<span>★</span>}
        >
          {/* No text, only icon */}
        </Button>
      </div>
    </div>
  )
};