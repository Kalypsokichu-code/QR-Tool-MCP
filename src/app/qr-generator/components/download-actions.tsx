"use client";

import { useCallback } from "react";
import { DownloadButton } from "@/components/ui/download-button";
import { blobToDataURL, downloadCanvas } from "@/lib/client-utils";

type Props = {
  svg: SVGSVGElement | null;
  fileName: string;
  size: number;
};

export function DownloadActions({ svg, fileName, size }: Props) {
  const handleDownloadSvg = useCallback(() => {
    if (!svg) {
      return;
    }
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [svg, fileName]);

  const handleDownloadPng = useCallback(async () => {
    if (!svg) {
      return;
    }
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const dataUrl = await blobToDataURL(blob);
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = dataUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.drawImage(img, 0, 0, size, size);
    downloadCanvas(canvas, `${fileName}.png`);
  }, [svg, size, fileName]);

  return (
    <div className="mt-4 flex gap-2">
      <DownloadButton disabled={!svg} onClick={handleDownloadSvg}>
        SVG
      </DownloadButton>
      <DownloadButton disabled={!svg} onClick={handleDownloadPng}>
        PNG
      </DownloadButton>
    </div>
  );
}
