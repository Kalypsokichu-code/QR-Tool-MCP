export type QrStyle = {
  id: string;
  name: string;
  dotColor: string;
  background: string;
  cornerSquare: string;
  cornerDot: string;
};

export type QrOptions = {
  data: string;
  size: number;
  styleId: string;
  padding: number;
};

export const STYLES: QrStyle[] = [
  {
    id: "slate-ember",
    name: "Slate Ember (default)",
    background: "#111111",
    dotColor: "#a3a3a3",
    cornerSquare: "#3f3f46",
    cornerDot: "#f97316",
  },
  {
    id: "ink-lime",
    name: "Ink Lime",
    background: "#0b0b0b",
    dotColor: "#d4d4d4",
    cornerSquare: "#1f2937",
    cornerDot: "#84cc16",
  },
  {
    id: "charcoal-cyan",
    name: "Charcoal Cyan",
    background: "#0f172a",
    dotColor: "#cbd5e1",
    cornerSquare: "#334155",
    cornerDot: "#22d3ee",
  },
  {
    id: "night-sky",
    name: "Night Sky",
    background: "#0b1120",
    dotColor: "#e2e8f0",
    cornerSquare: "#1e293b",
    cornerDot: "#38bdf8",
  },
  {
    id: "graphite-gold",
    name: "Graphite Gold",
    background: "#0a0a0a",
    dotColor: "#d6d3d1",
    cornerSquare: "#262626",
    cornerDot: "#f59e0b",
  },
  {
    id: "espresso-rose",
    name: "Espresso Rose",
    background: "#121212",
    dotColor: "#e7e5e4",
    cornerSquare: "#3a3a3a",
    cornerDot: "#fb7185",
  },
  {
    id: "plum-ice",
    name: "Plum Ice",
    background: "#09090b",
    dotColor: "#fafafa",
    cornerSquare: "#3f3f46",
    cornerDot: "#a78bfa",
  },
  {
    id: "forest-mint",
    name: "Forest Mint",
    background: "#0b0f0c",
    dotColor: "#e5e7eb",
    cornerSquare: "#1f2937",
    cornerDot: "#34d399",
  },
  {
    id: "cocoa-orange",
    name: "Cocoa Orange",
    background: "#161514",
    dotColor: "#e5e7eb",
    cornerSquare: "#3f3f46",
    cornerDot: "#fb923c",
  },
  {
    id: "mono-high",
    name: "Mono High Contrast",
    background: "#ffffff",
    dotColor: "#000000",
    cornerSquare: "#000000",
    cornerDot: "#000000",
  },
];

export function resolveStyle(styleId: string): QrStyle {
  return STYLES.find((s) => s.id === styleId) ?? (STYLES[0] as QrStyle);
}
