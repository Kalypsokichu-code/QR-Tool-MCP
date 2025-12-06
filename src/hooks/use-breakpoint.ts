import { useEffect, useState } from "react";

/**
 * Responsive hook providing Tailwind-style breakpoint checks.
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
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { width } = windowSize;

  // Tailwind breakpoint constants
  const SM_BREAKPOINT = 640;
  const MD_BREAKPOINT = 768;
  const LG_BREAKPOINT = 1024;
  const XL_BREAKPOINT = 1280;

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
