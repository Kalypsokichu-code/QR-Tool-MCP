"use client";

import { Download } from "lucide-react";
import type React from "react";

import { Button } from "@/components/ui/button";

type DownloadButtonProps = {
  disabled?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
};

export function DownloadButton({
  disabled,
  onClick,
  children,
  className,
}: DownloadButtonProps) {
  return (
    <Button
      className={`h-9 ${className ?? ""}`}
      disabled={disabled}
      onClick={onClick}
      variant="outline"
    >
      <Download className="mr-2 size-4" /> {children ?? "Download"}
    </Button>
  );
}
