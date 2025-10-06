"use client";

import { X } from "lucide-react";
import { useCallback } from "react";
import { FileSelectButton } from "@/components/ui/file-select";
import { Label } from "@/components/ui/label";
import { getRadius } from "@/lib/radius";
import { readFileAsSvg } from "../domain-icons";

type Props = {
  logoSvgContent: string | null;
  onSetLogoContent: (svg: string | null) => void;
};

export function LogoOptionsPanel({ logoSvgContent, onSetLogoContent }: Props) {
  const handleClearLogo = useCallback(() => {
    onSetLogoContent(null);
  }, [onSetLogoContent]);

  return (
    <div>
      <Label className="mb-2 block text-sm">Logo upload</Label>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileSelectButton
            accept=".svg"
            onFilesSelected={async (files) => {
              const file = files[0];
              if (!file) {
                return;
              }
              const svgContent = await readFileAsSvg(file);
              if (svgContent) {
                onSetLogoContent(svgContent);
              }
            }}
          >
            Select SVG file
          </FileSelectButton>
          {logoSvgContent ? (
            <button
              aria-label="Clear logo"
              className={`inline-flex size-8 items-center justify-center ${getRadius("button")} border text-muted-foreground hover:bg-accent`}
              onClick={handleClearLogo}
              type="button"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
