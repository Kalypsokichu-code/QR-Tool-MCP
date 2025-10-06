import { useEffect, useState } from "react";

/**
 * Custom hook to check if the current window width is greater than or equal to a specified breakpoint value.
 *
 * @param breakpointValue The pixel value of the breakpoint (e.g., 768, 1024).
 * @returns True if the window width is >= the breakpoint, false otherwise.
 */
export function useBreakpoint(breakpointValue: number): boolean {
  const [isAboveBreakpoint, setIsAboveBreakpoint] = useState<boolean>(false);

  useEffect(() => {
    // Ensure window is defined (for server-side rendering compatibility)
    if (typeof window === "undefined") {
      // Default behavior for SSR (optional, depends on desired SSR output)
      setIsAboveBreakpoint(false); // Or true, or determine based on context if possible
      return;
    }

    const handleResize = () => {
      setIsAboveBreakpoint(window.innerWidth >= breakpointValue);
    };

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpointValue]); // Re-run effect if breakpointValue prop changes

  return isAboveBreakpoint;
}

/**
 * Custom hook to check if the current window width is less than a specified breakpoint value.
 *
 * @param breakpointValue The pixel value of the breakpoint (e.g., 768, 1024).
 * @returns True if the window width is < the breakpoint, false otherwise.
 */
export function useBreakpointMax(breakpointValue: number): boolean {
  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsBelowBreakpoint(true); // Assume mobile/below breakpoint for SSR
      return;
    }

    const handleResize = () => {
      setIsBelowBreakpoint(window.innerWidth < breakpointValue);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpointValue]);

  return isBelowBreakpoint;
}

/**
 * Enhanced responsive hook that provides common breakpoint checks following Tailwind's conventions.
 * Designed for mobile-first responsive design while preserving desktop layouts.
 */
export function useResponsive() {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { width } = windowSize;

  // Tailwind breakpoint constants
  const SM_BREAKPOINT = 640;
  const MD_BREAKPOINT = 768;
  const LG_BREAKPOINT = 1024;
  const XL_BREAKPOINT = 1280;
  const _XXL_BREAKPOINT = 1536;

  return {
    // Raw dimensions
    width,
    height: windowSize.height,

    // Tailwind-compatible breakpoints
    isMobile: width < SM_BREAKPOINT, // Below sm: (mobile-only)
    isTablet: width >= SM_BREAKPOINT && width < LG_BREAKPOINT, // sm: to lg: (tablet)
    isDesktop: width >= LG_BREAKPOINT, // lg: and above (desktop)

    // Specific breakpoint checks (following your existing patterns)
    isSm: width >= SM_BREAKPOINT, // sm: and above
    isMd: width >= MD_BREAKPOINT, // md: and above
    isLg: width >= LG_BREAKPOINT, // lg: and above
    isXl: width >= XL_BREAKPOINT, // xl: and above

    // Convenience flags for common use cases
    isMobileOnly: width < SM_BREAKPOINT,
    isTabletAndBelow: width < LG_BREAKPOINT,
    isDesktopAndAbove: width >= LG_BREAKPOINT,

    // Touch detection (useful for mobile optimizations)
    isTouchDevice: typeof window !== "undefined" && "ontouchstart" in window,
  };
}
