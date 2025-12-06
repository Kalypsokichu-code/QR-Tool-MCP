"use client";

import { parseAsString, useQueryStates } from "nuqs";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getMobileInputClasses,
  MobileButtonGroup,
  MobileCard,
  MobileControlPanel,
  MobileFormGroup,
  MobileToolWrapper,
} from "@/components/mobile-tool-wrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useResponsive } from "@/hooks/use-breakpoint";
import { getRadius } from "@/lib/radius";
import { DownloadActions } from "./components/download-actions";
import { LogoOptionsPanel } from "./components/logo-options-panel";
import { Preview } from "./components/preview";
import { rebuildQr } from "./qr-render";
import { type QrOptions, STYLES } from "./qr-styles";

// Constants for magic numbers
const DEFAULT_LOGO_SIZE_PERCENT = 20;
const DEFAULT_LOGO_STROKE_PX = 20;
const CENTER_POSITION_THRESHOLD = 0.01;
const CENTER_POSITION_VALUE = 0.5;
const BOTTOM_RIGHT_THRESHOLD = 0.75;

// Stable position objects to avoid inline object creation
const CENTER_POSITION = { x: 0.5, y: 0.5 };
const BOTTOM_RIGHT_POSITION = { x: 0.82, y: 0.82 };

export function QrClient() {
  const urlId = useId();
  const styleId = useId();
  const { isMobileOnly } = useResponsive();

  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<SVGSVGElement | null>(null);

  const [fileName] = useState("qr-code");
  const [logoSvgContent, setLogoSvgContent] = useState<string | null>(null);
  const [logoSizePercent] = useState<number>(DEFAULT_LOGO_SIZE_PERCENT);
  const [logoPosition, setLogoPosition] = useState<{ x: number; y: number }>({
    x: CENTER_POSITION_VALUE,
    y: CENTER_POSITION_VALUE,
  });
  const [logoStrokePx] = useState<number>(DEFAULT_LOGO_STROKE_PX);

  const [qs, setQs] = useQueryStates(
    {
      data: parseAsString.withDefault("https://instagram.com/kalypsodesigns"),
      style: parseAsString.withDefault(STYLES[0]?.id || "slate-ember"),
    },
    { history: "replace" },
  );

  const DEFAULT_SIZE = 768;
  const [options, setOptions] = useState<QrOptions>({
    data: qs.data,
    size: DEFAULT_SIZE,
    styleId: qs.style,
    padding: 10,
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      data: qs.data,
      styleId: qs.style,
      padding: 10,
    }));
  }, [qs]);

  const rebuild = useCallback(async () => {
    if (!containerRef.current) {
      return;
    }
    const { svg: newSvg } = await rebuildQr({
      container: containerRef.current,
      options,
      logoSvgContent,
      logoSizePercent,
      logoStrokePx,
      logoPosition,
    });
    setSvg(newSvg);
  }, [options, logoSvgContent, logoSizePercent, logoStrokePx, logoPosition]);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    rebuild();
  }, [mounted, rebuild]);

  const setPositionCenter = useCallback(() => {
    setLogoPosition(CENTER_POSITION);
  }, []);

  const setPositionBottomRight = useCallback(() => {
    setLogoPosition(BOTTOM_RIGHT_POSITION);
  }, []);

  const positionLabel = useMemo(() => {
    const { x, y } = logoPosition;
    if (
      Math.abs(x - CENTER_POSITION_VALUE) < CENTER_POSITION_THRESHOLD &&
      Math.abs(y - CENTER_POSITION_VALUE) < CENTER_POSITION_THRESHOLD
    ) {
      return "Center";
    }
    if (x > BOTTOM_RIGHT_THRESHOLD && y > BOTTOM_RIGHT_THRESHOLD) {
      return "Bottom right";
    }
    return "Custom";
  }, [logoPosition]);

  if (!mounted) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <MobileToolWrapper>
      <Preview containerRef={containerRef} />

      <DownloadActions fileName={fileName} size={options.size} svg={svg} />

      <MobileCard className={isMobileOnly ? "mt-2" : "mt-6"}>
        <MobileControlPanel>
          <MobileFormGroup label="Content URL or Text" labelId={urlId}>
            <Input
              className={getMobileInputClasses(isMobileOnly)}
              id={urlId}
              onChange={(e) => {
                setOptions((o) => ({ ...o, data: e.target.value }));
                setQs({ data: e.target.value });
              }}
              placeholder="https://…"
              value={options.data}
            />
          </MobileFormGroup>

          <MobileFormGroup label="Style" labelId={styleId}>
            <Select onValueChange={(v) => setQs({ style: v })} value={qs.style}>
              <SelectTrigger
                className={`w-full ${getMobileInputClasses(isMobileOnly)}`}
                id={styleId}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STYLES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </MobileFormGroup>
        </MobileControlPanel>

        {logoSvgContent && (
          <MobileControlPanel>
            <LogoOptionsPanel
              logoSvgContent={logoSvgContent}
              onSetLogoContent={(content) => {
                setLogoSvgContent(content);
              }}
            />

            <MobileFormGroup label="Logo position">
              <div
                className={`${getRadius("medium")} overflow-hidden border bg-muted/30 p-3 ${isMobileOnly ? "p-2" : ""}`}
              >
                <div
                  className={`mb-2 text-muted-foreground text-xs ${isMobileOnly ? "mb-1.5 text-xs" : ""}`}
                >
                  Current: <span className="font-medium">{positionLabel}</span>
                </div>
                <MobileButtonGroup>
                  <button
                    className={`h-8 ${getRadius("buttonSmall")} border px-2.5 py-1.5 text-xs transition-colors ${
                      Math.abs(logoPosition.x - CENTER_POSITION_VALUE) <
                        CENTER_POSITION_THRESHOLD &&
                      Math.abs(logoPosition.y - CENTER_POSITION_VALUE) <
                        CENTER_POSITION_THRESHOLD
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                    onClick={setPositionCenter}
                    type="button"
                  >
                    Center
                  </button>
                  <button
                    className={`h-8 ${getRadius("buttonSmall")} border px-2.5 py-1.5 text-xs transition-colors ${
                      logoPosition.x > BOTTOM_RIGHT_THRESHOLD &&
                      logoPosition.y > BOTTOM_RIGHT_THRESHOLD
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                    onClick={setPositionBottomRight}
                    type="button"
                  >
                    Bottom right
                  </button>
                </MobileButtonGroup>
              </div>
            </MobileFormGroup>
          </MobileControlPanel>
        )}

        {!logoSvgContent && (
          <LogoOptionsPanel
            logoSvgContent={logoSvgContent}
            onSetLogoContent={(content) => {
              setLogoSvgContent(content);
            }}
          />
        )}
      </MobileCard>
    </MobileToolWrapper>
  );
}
