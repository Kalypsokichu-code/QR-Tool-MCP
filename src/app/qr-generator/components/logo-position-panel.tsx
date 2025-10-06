"use client";

import { Label } from "@/components/ui/label";
import { getRadius } from "@/lib/radius";

// Constants for logo positioning
const CENTER_POSITION = 0.5;
const CENTER_TOLERANCE = 0.01;
const BOTTOM_RIGHT_THRESHOLD = 0.75;
const BOTTOM_RIGHT_POSITION = 0.82;

type Props = {
  logoPosition: { x: number; y: number };
  onSetPosition: (pos: { x: number; y: number }) => void;
};

export function LogoPositionPanel({ logoPosition, onSetPosition }: Props) {
  const isCenter =
    Math.abs(logoPosition.x - CENTER_POSITION) < CENTER_TOLERANCE &&
    Math.abs(logoPosition.y - CENTER_POSITION) < CENTER_TOLERANCE;
  const isBottomRight =
    logoPosition.x > BOTTOM_RIGHT_THRESHOLD &&
    logoPosition.y > BOTTOM_RIGHT_THRESHOLD;

  const getPositionLabel = () => {
    if (isCenter) {
      return "Center";
    }
    if (isBottomRight) {
      return "Bottom right";
    }
    return "Custom";
  };

  return (
    <div>
      <Label className="mb-2 block text-sm">Logo position</Label>
      <div
        className={`${getRadius("toolContainer")} overflow-hidden border bg-muted/30 p-3`}
      >
        <div className="mb-2 text-muted-foreground text-xs">
          Current: <span className="font-medium">{getPositionLabel()}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded border px-2 py-1 text-xs transition-colors ${
              isCenter
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-muted"
            }`}
            onClick={() =>
              onSetPosition({ x: CENTER_POSITION, y: CENTER_POSITION })
            }
            type="button"
          >
            Circle
          </button>
          <button
            className={`rounded border px-2 py-1 text-xs transition-colors ${
              isBottomRight
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-muted"
            }`}
            onClick={() =>
              onSetPosition({
                x: BOTTOM_RIGHT_POSITION,
                y: BOTTOM_RIGHT_POSITION,
              })
            }
            type="button"
          >
            Bottom right
          </button>
        </div>
      </div>
    </div>
  );
}
