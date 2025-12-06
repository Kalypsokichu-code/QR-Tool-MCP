"use client";

import { forwardRef } from "react";
import { useResponsive } from "@/hooks/use-breakpoint";
import { getRadius } from "@/lib/radius";
import { cn } from "@/lib/utils";

type PreviewProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export const Preview = forwardRef<HTMLDivElement, PreviewProps>(
  function PreviewComponent({ containerRef }, _ref) {
    const { isMobileOnly } = useResponsive();

    return (
      <div className={cn("mt-6 space-y-4", isMobileOnly && "mt-2")}>
        <div
          className={cn(
            `flex flex-col ${getRadius("preview")} overflow-hidden border`,
            isMobileOnly ? "min-h-36" : "min-h-48",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between border-b px-3 py-2",
              isMobileOnly && "px-2 py-1.5",
            )}
          >
            <span
              className={cn(
                "font-medium text-sm",
                isMobileOnly && "text-xs uppercase tracking-wide",
              )}
            >
              Preview
            </span>
          </div>
          <div
            className={cn(
              "grid place-items-center bg-background",
              isMobileOnly ? "p-4" : "p-6",
            )}
          >
            <div
              className={cn(
                "[&_svg]:h-auto [&_svg]:w-auto [&_svg]:max-w-full",
                isMobileOnly ? "[&_svg]:max-h-72" : "[&_svg]:max-h-96",
              )}
              ref={containerRef}
            />
          </div>
        </div>
      </div>
    );
  },
);
