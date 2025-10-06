import QRCodeStyling from "qr-code-styling";
import { type QrOptions, resolveStyle } from "./qr-styles";

export function createQrInstance(options: QrOptions) {
  const s = resolveStyle(options.styleId);
  return new QRCodeStyling({
    type: "svg",
    width: options.size,
    height: options.size,
    data: options.data || "https://kalyp.so",
    backgroundOptions: { color: "transparent" },
    qrOptions: { errorCorrectionLevel: "H" },
    dotsOptions: { color: s.dotColor, type: "dots" },
    cornersSquareOptions: { type: "extra-rounded", color: s.cornerSquare },
    cornersDotOptions: { color: s.cornerDot },
    margin: options.padding,
  });
}

// --- Refactoring for rebuildQr to reduce complexity and remove magic numbers ---

const SVG_NS = "http://www.w3.org/2000/svg";
const MIN_CORNER_RADIUS = 8;
const CORNER_RADIUS_FACTOR = 0.09;
const RANDOM_STRING_RADIX = 36;
const SLICE_START = 2;
const MIN_LOGO_SIZE_PERCENT = 4;
const MAX_LOGO_SIZE_PERCENT = 40;
const PERCENT_DIVISOR = 100;
const MIN_LOGO_STROKE_PX = 1;
const MAX_LOGO_STROKE_PX = 12;
const DEFAULT_LOGO_DIMENSION = "100";
const HALF = 2;

type Dimensions = { w: number; h: number };

function getSvgDimensions(svg: SVGSVGElement, defaultSize: number): Dimensions {
  const widthAttr = svg.getAttribute("width");
  const heightAttr = svg.getAttribute("height");
  const vb = svg.viewBox?.baseVal;
  const w = widthAttr ? Number(widthAttr) : vb?.width || defaultSize;
  const h = heightAttr ? Number(heightAttr) : vb?.height || defaultSize;
  return { w, h };
}

function applyQrCodeStyling(
  svg: SVGSVGElement,
  { w, h }: Dimensions,
  backgroundColor: string
) {
  const radius = Math.max(
    MIN_CORNER_RADIUS,
    Math.min(w, h) * CORNER_RADIUS_FACTOR
  );

  let defs = svg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS(SVG_NS, "defs");
    svg.insertBefore(defs, svg.firstChild);
  }

  const clipId = `qrClip-${Date.now().toString(
    RANDOM_STRING_RADIX
  )}-${Math.random().toString(RANDOM_STRING_RADIX).slice(SLICE_START)}`;
  const clipPath = document.createElementNS(SVG_NS, "clipPath");
  clipPath.setAttribute("id", clipId);

  const rect = document.createElementNS(SVG_NS, "rect");
  for (const [key, val] of Object.entries({
    x: "0",
    y: "0",
    width: String(w),
    height: String(h),
    rx: String(radius),
    ry: String(radius),
  })) {
    rect.setAttribute(key, val);
  }

  clipPath.appendChild(rect);
  defs.appendChild(clipPath);

  const bg = document.createElementNS(SVG_NS, "rect");
  for (const [key, val] of Object.entries({
    x: "0",
    y: "0",
    width: String(w),
    height: String(h),
    rx: String(radius),
    ry: String(radius),
    fill: backgroundColor,
  })) {
    bg.setAttribute(key, val);
  }

  const group = document.createElementNS(SVG_NS, "g");
  group.setAttribute("clip-path", `url(#${clipId})`);

  const children = Array.from(svg.childNodes);
  for (const n of children) {
    if ((n as Element).nodeName?.toLowerCase?.() !== "defs") {
      group.appendChild(n);
    }
  }
  svg.appendChild(bg);
  svg.appendChild(group);
}

function createLogoPart(
  sourceElement: SVGSVGElement,
  attributes: Record<string, string>
): SVGGElement {
  const group = document.createElementNS(SVG_NS, "g");
  group.innerHTML = sourceElement.innerHTML;
  for (const [key, value] of Object.entries(attributes)) {
    group.setAttribute(key, value);
  }
  return group;
}

function addLogo(
  svg: SVGSVGElement,
  params: {
    dimensions: Dimensions;
    logoSvgContent: string;
    logoSizePercent: number;
    logoStrokePx: number;
    logoPosition: { x: number; y: number };
    fillColor: string;
  }
) {
  const {
    dimensions: { w, h },
    logoSvgContent,
    logoSizePercent,
    logoStrokePx,
    logoPosition,
    fillColor,
  } = params;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = logoSvgContent;
  const svgElement = tempDiv.querySelector("svg");
  if (!svgElement) {
    return;
  }

  const diameter =
    (Math.min(w, h) *
      Math.max(
        MIN_LOGO_SIZE_PERCENT,
        Math.min(MAX_LOGO_SIZE_PERCENT, logoSizePercent)
      )) /
    PERCENT_DIVISOR;
  const strokeWidth = Math.max(
    MIN_LOGO_STROKE_PX,
    Math.min(MAX_LOGO_STROKE_PX, logoStrokePx)
  );
  const cx = w * logoPosition.x;
  const cy = h * logoPosition.y;

  const svgWidth =
    svgElement.viewBox?.baseVal?.width ||
    Number.parseFloat(
      svgElement.getAttribute("width") || DEFAULT_LOGO_DIMENSION
    );
  const svgHeight =
    svgElement.viewBox?.baseVal?.height ||
    Number.parseFloat(
      svgElement.getAttribute("height") || DEFAULT_LOGO_DIMENSION
    );
  const scale = diameter / Math.max(svgWidth, svgHeight);

  const logoGroup = document.createElementNS(SVG_NS, "g");
  logoGroup.setAttribute("transform", `translate(${cx}, ${cy})`);

  const svgGroup = document.createElementNS(SVG_NS, "g");
  svgGroup.setAttribute(
    "transform",
    `scale(${scale}) translate(-${svgWidth / HALF}, -${svgHeight / HALF})`
  );

  const strokeGroup = createLogoPart(svgElement, {
    fill: "none",
    stroke: "#ffffff",
    "stroke-width": String(strokeWidth / scale),
    "stroke-linejoin": "round",
    "stroke-linecap": "round",
  });

  const fillGroup = createLogoPart(svgElement, { fill: fillColor });
  for (const child of fillGroup.querySelectorAll("*")) {
    child.setAttribute("fill", fillColor);
  }

  svgGroup.appendChild(strokeGroup);
  svgGroup.appendChild(fillGroup);
  logoGroup.appendChild(svgGroup);
  svg.appendChild(logoGroup);
}

export async function rebuildQr(params: {
  container: HTMLDivElement;
  options: QrOptions;
  logoSvgContent: string | null;
  logoSizePercent: number;
  logoStrokePx: number;
  logoPosition: { x: number; y: number };
}): Promise<{ svg: SVGSVGElement | null; qr: QRCodeStyling | null }> {
  const {
    container,
    options,
    logoSvgContent,
    logoSizePercent,
    logoStrokePx,
    logoPosition,
  } = params;
  container.innerHTML = "";

  const qr = createQrInstance(options);
  await qr.append(container);

  const svg = container.querySelector("svg");
  if (!svg) {
    return { svg: null, qr };
  }

  try {
    const s = resolveStyle(options.styleId);
    const dimensions = getSvgDimensions(svg, options.size);

    applyQrCodeStyling(svg, dimensions, s.background);

    if (logoSvgContent) {
      addLogo(svg, {
        dimensions,
        logoSvgContent,
        logoSizePercent,
        logoStrokePx,
        logoPosition,
        fillColor: s.cornerDot,
      });
    }
  } catch {
    // ignore DOM failures
  }

  return { svg, qr };
}
