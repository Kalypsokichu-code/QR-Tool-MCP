import { z } from "zod";
export const GenerateQrCodeSchema = {
    url: z.string().describe("The URL or text content to encode in the QR code"),
    style: z
        .enum([
        "slate-ember",
        "ink-lime",
        "charcoal-cyan",
        "night-sky",
        "graphite-gold",
        "espresso-rose",
        "plum-ice",
        "forest-mint",
        "cocoa-orange",
        "mono-high",
    ])
        .optional()
        .describe("Visual style preset for the QR code. Default: slate-ember"),
    format: z
        .enum(["svg", "png"])
        .optional()
        .describe("Output format. Default: svg"),
    size: z
        .number()
        .min(256)
        .max(2048)
        .optional()
        .describe("QR code dimensions in pixels. Default: 768"),
    logoUrl: z
        .string()
        .url()
        .optional()
        .describe("Optional URL to a logo/icon to embed in the QR code"),
    logoPosition: z
        .enum(["center", "bottom-right"])
        .optional()
        .describe("Logo placement. Default: center"),
};
export const GetStylesSchema = {};
export const PreviewUrlSchema = {
    url: z.string().describe("The URL or text to encode"),
    style: z
        .string()
        .optional()
        .describe("Style preset ID. Default: slate-ember"),
};
//# sourceMappingURL=schemas.js.map