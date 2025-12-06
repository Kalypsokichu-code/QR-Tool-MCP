"use client";

import type React from "react";
import { useCallback, useRef } from "react";

import { Button } from "@/components/ui/button";

type FileSelectButtonProps = {
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: FileList) => void;
  children?: React.ReactNode;
  className?: string;
} & React.ComponentProps<typeof Button>;

export function FileSelectButton({
  accept = "*/*",
  multiple = false,
  onFilesSelected,
  children,
  className,
  onClick,
  ...buttonProps
}: FileSelectButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFilesSelected(files);
      }
      // Allow selecting the same file again by resetting value
      e.target.value = "";
    },
    [onFilesSelected],
  );

  return (
    <div className={className}>
      <input
        accept={accept}
        className="hidden"
        multiple={multiple}
        onChange={handleChange}
        ref={inputRef}
        type="file"
      />
      <Button
        onClick={(e) => {
          onClick?.(e);
          openPicker();
        }}
        size={buttonProps.size ?? "sm"}
        type="button"
        variant={buttonProps.variant ?? "outline"}
        {...buttonProps}
      >
        {children ?? "Select file"}
      </Button>
    </div>
  );
}
