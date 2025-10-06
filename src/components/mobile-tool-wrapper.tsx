"use client";

import React from "react";
import { useResponsive } from "@/hooks/use-breakpoint";
import { getRadius } from "@/lib/radius";
import { cn } from "@/lib/utils";

type MobileToolWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Wrapper component that provides mobile-optimized layouts for tools
 * while preserving desktop behavior completely unchanged.
 *
 * This component only applies mobile-specific optimizations and leaves
 * desktop layouts exactly as they were.
 */
export const MobileToolWrapper = React.memo<MobileToolWrapperProps>(
  ({ children, className }) => {
    const { isMobileOnly } = useResponsive();

    return (
      <div
        className={cn(
          // Base classes that apply to all screen sizes
          className,
          // Mobile-only optimizations - these only activate on mobile
          isMobileOnly && [
            // Minimal mobile spacing for ultra-compact design
            "space-y-3", // Tightest spacing between sections on mobile for minimal design
          ]
        )}
      >
        {children}
      </div>
    );
  }
);

/**
 * Mobile-optimized control panel component that stacks controls vertically on mobile
 * while preserving desktop grid layouts.
 */
type MobileControlPanelProps = {
  children: React.ReactNode;
  className?: string;
  desktopCols?: 2 | 3; // Number of columns on desktop (preserves existing behavior)
};

export const MobileControlPanel = React.memo<MobileControlPanelProps>(
  ({ children, className, desktopCols = 2 }) => {
    const { isMobileOnly } = useResponsive();
    const THREE_COLUMNS = 3;

    const desktopGridClass =
      desktopCols === THREE_COLUMNS ? "sm:grid-cols-3" : "sm:grid-cols-2";

    return (
      <div
        className={cn(
          // Preserve existing desktop grid behavior exactly
          "grid grid-cols-1 gap-4",
          desktopGridClass,
          // Mobile-only modifications - tighter spacing
          isMobileOnly && [
            "space-y-2.5", // Much tighter spacing between controls on mobile
          ],
          className
        )}
      >
        {children}
      </div>
    );
  }
);

/**
 * Mobile-optimized form group that provides better mobile spacing and layout
 * without changing desktop behavior.
 */
type MobileFormGroupProps = {
  children: React.ReactNode;
  className?: string;
  label?: string;
  labelId?: string;
};

export const MobileFormGroup = React.memo<MobileFormGroupProps>(
  ({ children, className, label, labelId }) => {
    const { isMobileOnly } = useResponsive();

    return (
      <div
        className={cn(
          // Base styling preserved for desktop
          className,
          // Mobile-only improvements
          isMobileOnly && [
            "space-y-1", // Ultra-tight spacing for minimal design
          ]
        )}
      >
        {label && (
          <label
            className={cn(
              "mb-2 block text-sm",
              // Mobile-specific label improvements
              isMobileOnly && [
                "text-xs", // Smaller text for more compact design
                "font-medium", // Better visual hierarchy on mobile
                "mb-0.5", // Ultra-tight spacing
                "uppercase", // Makes small text more readable
                "tracking-wide", // Better letter spacing for small text
              ]
            )}
            htmlFor={labelId}
          >
            {label}
          </label>
        )}
        {children}
      </div>
    );
  }
);

/**
 * Mobile-optimized button group that provides better mobile touch targets
 * while preserving desktop behavior.
 */
type MobileButtonGroupProps = {
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical" | "auto"; // auto = horizontal on desktop, vertical on mobile
};

export const MobileButtonGroup = React.memo<MobileButtonGroupProps>(
  ({ children, className, orientation = "auto" }) => {
    const { isMobileOnly } = useResponsive();

    return (
      <div
        className={cn(
          // Base classes
          "flex gap-2",
          // Desktop behavior (preserved exactly)
          !isMobileOnly && [
            orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
          ],
          // Mobile-only optimizations
          isMobileOnly && [
            orientation === "auto" || orientation === "vertical"
              ? "flex-col"
              : "flex-row flex-wrap",
            "gap-3", // Better touch spacing on mobile
          ],
          className
        )}
      >
        {children}
      </div>
    );
  }
);

/**
 * Mobile-optimized card/panel component that provides better mobile spacing
 * and touch-friendly interactions while preserving desktop layout.
 */
type MobileCardProps = {
  children: React.ReactNode;
  className?: string;
};

export const MobileCard = React.memo<MobileCardProps>(
  ({ children, className }) => {
    const { isMobileOnly } = useResponsive();

    return (
      <div
        className={cn(
          // Preserve existing desktop card styling
          `space-y-4 ${getRadius("card")} border bg-card p-4`,
          // Mobile-only improvements - more compact for minimal design
          isMobileOnly && [
            "p-3", // Even more compact padding for minimal design
            "space-y-3", // Tighter spacing between elements
            getRadius("card"), // Standard rounded corners
          ],
          className
        )}
      >
        {children}
      </div>
    );
  }
);

/**
 * Mobile-centered page wrapper that positions tool header at top on mobile
 * and centers the main content vertically. Desktop layout remains unchanged.
 */
type MobileCenteredPageProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  breadcrumb?: React.ReactNode;
};

export const MobileCenteredPage = React.memo<MobileCenteredPageProps>(
  ({
    children,
    title,
    description,
    className,
    maxWidth = "2xl",
    breadcrumb,
  }) => {
    const { isMobileOnly } = useResponsive();
    const maxWidthClass = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
    }[maxWidth];

    if (isMobileOnly) {
      // Mobile: Header at top, content centered
      // Account for layout spacers: h-2.5 (10px) at top and h-[calc(env(safe-area-inset-bottom)+35px)] at bottom
      return (
        <section
          className={cn(
            "flex flex-col bg-background px-4 text-foreground",
            // Use calc to subtract the spacers from 100vh to prevent scrollbars
            "min-h-[calc(100vh-2.5rem-env(safe-area-inset-bottom)-35px)]",
            className
          )}
        >
          {/* Fixed header at top */}
          <div className="py-4">
            <div className={cn("mx-auto w-full", maxWidthClass)}>
              <MobileToolHeader description={description} title={title} />
            </div>
          </div>

          {/* Centered content area */}
          <div className="flex flex-1 items-center">
            <div className={cn("mx-auto w-full", maxWidthClass)}>
              {children}
            </div>
          </div>
        </section>
      );
    }

    // Desktop: Original centered layout with breadcrumb at top, header included in content
    return (
      <section
        className={cn(
          "flex min-h-screen flex-col bg-background px-4 py-0 text-foreground",
          className
        )}
      >
        {/* Breadcrumb at the very top on desktop */}
        {breadcrumb && (
          <div className="pt-6">
            <div className={cn("w-full", maxWidthClass)}>{breadcrumb}</div>
          </div>
        )}

        {/* Centered content area */}
        <div className="flex flex-1 items-center justify-center">
          <div className={cn("mx-auto w-full", maxWidthClass)}>
            <MobileToolHeader description={description} title={title} />
            {children}
          </div>
        </div>
      </section>
    );
  }
);

/**
 * Mobile-optimized header component for tools that creates minimal headers on mobile
 * while preserving desktop styling.
 */
type MobileToolHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export const MobileToolHeader = React.memo<MobileToolHeaderProps>(
  ({ title, description, className }) => {
    const { isMobileOnly } = useResponsive();

    return (
      <header
        className={cn(
          // Desktop styling preserved
          "mb-6 sm:mb-8",
          // Mobile minimal styling - ultra tight spacing
          isMobileOnly && "mb-2",
          className
        )}
      >
        <h1
          className={cn(
            // Desktop styling preserved
            "font-sans font-semibold text-2xl tracking-tight sm:text-3xl",
            // Mobile minimal styling - even smaller but bold
            isMobileOnly && "font-bold text-lg"
          )}
        >
          {title}
        </h1>
        {description && !isMobileOnly && (
          <p className="mt-2 text-muted-foreground text-sm sm:text-base">
            {description}
          </p>
        )}
      </header>
    );
  }
);

/**
 * Helper function to get mobile input classes that prevent zoom on focus
 * by ensuring 16px font size (the minimum to prevent mobile zoom)
 */
export function getMobileInputClasses(isMobileOnly: boolean): string {
  return isMobileOnly ? "h-10 text-base" : "";
}
