"use client";

import React from "react";
import { useResponsive } from "@/hooks/use-breakpoint";
import { getRadius } from "@/lib/radius";
import { cn } from "@/lib/utils";

type MobileToolWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export const MobileToolWrapper = React.memo<MobileToolWrapperProps>(
  ({ children, className }) => {
    const { isMobileOnly } = useResponsive();

    return (
      <div className={cn(className, isMobileOnly && "space-y-3")}>
        {children}
      </div>
    );
  },
);

type MobileControlPanelProps = {
  children: React.ReactNode;
  className?: string;
  desktopCols?: 2 | 3;
};

export const MobileControlPanel = React.memo<MobileControlPanelProps>(
  ({ children, className, desktopCols = 2 }) => {
    const { isMobileOnly } = useResponsive();
    const desktopGridClass =
      desktopCols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          desktopGridClass,
          isMobileOnly && "space-y-2.5",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

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
      <div className={cn(className, isMobileOnly && "space-y-1")}>
        {label && (
          <label
            className={cn(
              "mb-2 block text-sm",
              isMobileOnly &&
                "text-xs font-medium mb-0.5 uppercase tracking-wide",
            )}
            htmlFor={labelId}
          >
            {label}
          </label>
        )}
        {children}
      </div>
    );
  },
);

type MobileButtonGroupProps = {
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical" | "auto";
};

export const MobileButtonGroup = React.memo<MobileButtonGroupProps>(
  ({ children, className, orientation = "auto" }) => {
    const { isMobileOnly } = useResponsive();

    return (
      <div
        className={cn(
          "flex gap-2",
          !isMobileOnly &&
            (orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"),
          isMobileOnly && [
            orientation === "auto" || orientation === "vertical"
              ? "flex-col"
              : "flex-row flex-wrap",
            "gap-3",
          ],
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

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
          `space-y-4 ${getRadius("card")} border bg-card p-4`,
          isMobileOnly && ["p-3", "space-y-3", getRadius("card")],
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

export function getMobileInputClasses(isMobileOnly: boolean): string {
  return isMobileOnly ? "h-10 text-base" : "";
}
