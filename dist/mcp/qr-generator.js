import { JSDOM } from "jsdom";
import QRCodeStyling from "qr-code-styling";
import { STYLES } from "../app/qr-generator/qr-styles.js";
const SVG_NS = "http://www.w3.org/2000/svg";
const MIN_CORNER_RADIUS = 8;
const CORNER_RADIUS_FACTOR = 0.09;
const _DEFAULT_LOGO_STROKE_PX = 20;
function resolveStyle(styleId) {
    return STYLES.find((s) => s.id === styleId) ?? STYLES[0];
}
function setupDOMEnvironment() {
    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
        pretendToBeVisual: true,
    });
    global.window = dom.window;
    global.document = dom.window.document;
    global.HTMLElement = dom.window.HTMLElement;
    global.SVGElement = dom.window.SVGElement;
    global.Image = dom.window.Image;
    return dom;
}
function applyStyling(svg, width, height, backgroundColor) {
    const radius = Math.max(MIN_CORNER_RADIUS, Math.min(width, height) * CORNER_RADIUS_FACTOR);
    let defs = svg.querySelector("defs");
    if (!defs) {
        defs = document.createElementNS(SVG_NS, "defs");
        svg.insertBefore(defs, svg.firstChild);
    }
    // biome-ignore lint/style/noMagicNumbers: Base-36 for random string generation
    const clipId = `qrClip-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const clipPath = document.createElementNS(SVG_NS, "clipPath");
    clipPath.setAttribute("id", clipId);
    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", String(width));
    rect.setAttribute("height", String(height));
    rect.setAttribute("rx", String(radius));
    rect.setAttribute("ry", String(radius));
    clipPath.appendChild(rect);
    defs.appendChild(clipPath);
    const bg = document.createElementNS(SVG_NS, "rect");
    bg.setAttribute("x", "0");
    bg.setAttribute("y", "0");
    bg.setAttribute("width", String(width));
    bg.setAttribute("height", String(height));
    bg.setAttribute("rx", String(radius));
    bg.setAttribute("ry", String(radius));
    bg.setAttribute("fill", backgroundColor);
    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute("clip-path", `url(#${clipId})`);
    const children = Array.from(svg.childNodes);
    for (const node of children) {
        if (node.nodeName?.toLowerCase?.() !== "defs") {
            group.appendChild(node);
        }
    }
    svg.appendChild(bg);
    svg.appendChild(group);
}
export async function generateQrCode(options) {
    setupDOMEnvironment();
    const style = resolveStyle(options.styleId) || STYLES[0];
    if (!style) {
        throw new Error("Failed to resolve QR code style");
    }
    // biome-ignore lint/suspicious/noExplicitAny: QRCodeStyling has constructor type issues
    const qr = new QRCodeStyling({
        type: "svg",
        width: options.size,
        height: options.size,
        data: options.data || "https://kalyp.so",
        backgroundOptions: { color: "transparent" },
        qrOptions: { errorCorrectionLevel: "H" },
        dotsOptions: { color: style.dotColor, type: "dots" },
        cornersSquareOptions: { type: "extra-rounded", color: style.cornerSquare },
        cornersDotOptions: { color: style.cornerDot },
        margin: 10,
    });
    const container = document.createElement("div");
    document.body.appendChild(container);
    await qr.append(container);
    const svg = container.querySelector("svg");
    if (!svg) {
        throw new Error("Failed to generate QR code SVG");
    }
    applyStyling(svg, options.size, options.size, style.background);
    const svgContent = svg.outerHTML;
    if (options.format === "svg") {
        return Buffer.from(svgContent).toString("base64");
    }
    throw new Error("PNG format not yet implemented");
}
export function getAvailableStyles() {
    return STYLES.map((style) => ({
        id: style.id,
        name: style.name,
        colors: {
            background: style.background,
            dots: style.dotColor,
            corners: style.cornerSquare,
            accent: style.cornerDot,
        },
    }));
}
export function generatePreviewUrl(data, styleId) {
    if (!data) {
        throw new Error("Data parameter is required");
    }
    const baseUrl = "https://qr-tool-mcp.vercel.app";
    const params = new URLSearchParams({
        data,
        ...(styleId && { style: styleId }),
    });
    return `${baseUrl}/?${params.toString()}`;
}
export function generateDownloadUrl(data, styleId) {
    if (!data) {
        throw new Error("Data parameter is required");
    }
    const baseUrl = "https://qr-tool-mcp.vercel.app";
    const params = new URLSearchParams({
        data,
        ...(styleId && { style: styleId }),
    });
    return `${baseUrl}/api/download-qr?${params.toString()}`;
}
//# sourceMappingURL=qr-generator.js.map