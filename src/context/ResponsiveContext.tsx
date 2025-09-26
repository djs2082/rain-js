import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ResponsiveContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

// Breakpoints - can be adjusted if needed by consumers (extendable later)
export const DEFAULT_BREAKPOINTS = {
  mobile: 768, // Max width for mobile
  tablet: 1024, // Max width for tablet
};

export type ResponsiveBreakpoints = typeof DEFAULT_BREAKPOINTS;

const defaultContext: ResponsiveContextType = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  width: typeof window !== 'undefined' ? window.innerWidth : 1024,
  height: typeof window !== 'undefined' ? window.innerHeight : 768,
};

const ResponsiveContext = createContext<ResponsiveContextType>(defaultContext);

export function useResponsive(): ResponsiveContextType {
  const context = useContext(ResponsiveContext);
  if (context === undefined) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
}

export interface ResponsiveProviderProps {
  children: React.ReactNode;
  /** Optional breakpoints override */
  breakpoints?: Partial<ResponsiveBreakpoints>;
  /** Optional initial size (useful for SSR/hydration) */
  initialSize?: { width: number; height: number };
}

export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children, breakpoints, initialSize }) => {
  const bp = { ...DEFAULT_BREAKPOINTS, ...(breakpoints || {}) };

  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: (initialSize && initialSize.width) ?? (typeof window !== 'undefined' ? window.innerWidth : 1024),
    height: (initialSize && initialSize.height) ?? (typeof window !== 'undefined' ? window.innerHeight : 768),
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

  window.addEventListener('resize', handleResize);
  // Call handler right away so state gets updated with initial window size
  // (this will overwrite the initialSize on the client; initialSize is mainly for SSR)
  handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width <= bp.mobile;
  const isTablet = windowSize.width > bp.mobile && windowSize.width <= bp.tablet;
  const isDesktop = windowSize.width > bp.tablet;

  const value: ResponsiveContextType = {
    isMobile,
    isTablet,
    isDesktop,
    width: windowSize.width,
    height: windowSize.height,
  };

  return <ResponsiveContext.Provider value={value}>{children}</ResponsiveContext.Provider>;
};

export default ResponsiveProvider;
