# Responsive Context

This library exposes a small responsive context you can use in your app to know whether the current viewport is mobile, tablet or desktop.

## API

- `ResponsiveProvider` — Wrap your app (or part of it) with this provider. It accepts an optional `breakpoints` prop to override defaults.
 - `ResponsiveProvider` — Wrap your app (or part of it) with this provider. It accepts optional props:
   - `breakpoints?: { mobile?: number; tablet?: number }` — override default breakpoints
   - `initialSize?: { width: number; height: number }` — initial window size used during first render (useful for SSR/hydration)
- `useResponsive()` — Hook that returns the responsive state:

```ts
interface ResponsiveContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}
```

## Example

```tsx
import { ResponsiveProvider, useResponsive } from 'rain-js';

function MyComponent() {
  const { isMobile } = useResponsive();
  return isMobile ? <MobileMenu /> : <DesktopMenu />;
}

function App() {
  return (
    <ResponsiveProvider>
      <MyComponent />
    </ResponsiveProvider>
  );
}
```

## Breakpoints

Defaults are:

- mobile: 768
- tablet: 1024

Pass an override to `ResponsiveProvider`:

```tsx
<ResponsiveProvider breakpoints={{ mobile: 600, tablet: 900 }}>
  ...
</ResponsiveProvider>
```

## SSR / Hydration notes

When server-rendering, window size is not available. To avoid layout jumps during hydration you can pass an `initialSize` prop that matches the expected client size. The provider will update the size immediately after mount.

```tsx
<ResponsiveProvider initialSize={{ width: 1024, height: 768 }}>
  <App />
</ResponsiveProvider>
```

This is optional — if not provided, the provider uses a sensible default and then updates on the client.
