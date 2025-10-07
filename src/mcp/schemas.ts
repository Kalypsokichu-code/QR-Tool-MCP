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
    // biome-ignore lint/style/noMagicNumbers: QR code size constraints
    .min(256)
    // biome-ignore lint/style/noMagicNumbers: QR code size constraints
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

export const BatchUrlSchema = {
  urls: z
    .array(z.string())
    // biome-ignore lint/style/noMagicNumbers: Batch processing limit
    .max(100)
    .describe("Array of URLs or text content to encode (max 100)"),
  style: z
    .string()
    .optional()
    .describe("Style preset ID to apply to all QR codes. Default: slate-ember"),
};

export type GenerateQrCodeInput = {
  url: string;
  style?: string;
  format?: "svg" | "png";
  size?: number;
  logoUrl?: string;
  logoPosition?: "center" | "bottom-right";
};

export type PreviewUrlInput = {
  url: string;
  style?: string;
};

export type BatchUrlInput = {
  urls: string[];
  style?: string;
};
