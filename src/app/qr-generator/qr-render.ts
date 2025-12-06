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

const SVG_NS = "http://www.w3.org/2000/svg";

type Dimensions = { w: number; h: number };

function getSvgDimensions(svg: SVGSVGElement, defaultSize: number): Dimensions {
  const widthAttr = svg.getAttribute("width");
  const heightAttr = svg.getAttribute("height");
  const vb = svg.viewBox?.baseVal;
  return {
    w: widthAttr ? Number(widthAttr) : vb?.width || defaultSize,
    h: heightAttr ? Number(heightAttr) : vb?.height || defaultSize,
  };
}

function applyQrCodeStyling(
  svg: SVGSVGElement,
  { w, h }: Dimensions,
  backgroundColor: string,
) {
  const radius = Math.max(8, Math.min(w, h) * 0.09);

  let defs = svg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS(SVG_NS, "defs");
    svg.insertBefore(defs, svg.firstChild);
  }

  const clipId = `qrClip-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
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
  attributes: Record<string, string>,
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
  },
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
  if (!svgElement) return;

  const diameter =
    (Math.min(w, h) * Math.max(4, Math.min(40, logoSizePercent))) / 100;
  const strokeWidth = Math.max(1, Math.min(12, logoStrokePx));
  const cx = w * logoPosition.x;
  const cy = h * logoPosition.y;

  const svgWidth =
    svgElement.viewBox?.baseVal?.width ||
    Number.parseFloat(svgElement.getAttribute("width") || "100");
  const svgHeight =
    svgElement.viewBox?.baseVal?.height ||
    Number.parseFloat(svgElement.getAttribute("height") || "100");
  const scale = diameter / Math.max(svgWidth, svgHeight);

  const logoGroup = document.createElementNS(SVG_NS, "g");
  logoGroup.setAttribute("transform", `translate(${cx}, ${cy})`);

  const svgGroup = document.createElementNS(SVG_NS, "g");
  svgGroup.setAttribute(
    "transform",
    `scale(${scale}) translate(-${svgWidth / 2}, -${svgHeight / 2})`,
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
  if (!svg) return { svg: null, qr };

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
    // Ignore DOM failures
  }

  return { svg, qr };
}
