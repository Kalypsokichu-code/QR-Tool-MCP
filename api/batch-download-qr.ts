import { inflateSync } from "node:zlib";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import JSZip from "jszip";
import { generateQrCode } from "../src/mcp/qr-generator.js";

const PROTOCOL_REGEX = /^https?:\/\//;
const INDEX_PAD_LENGTH = 3;
const TIMESTAMP_LENGTH = 19;

/**
 * Sanitize a URL to be a valid filename
 * Removes protocol, replaces special characters with hyphens
 */
function sanitizeFilename(url: string, index: number): string {
  // Remove protocol
  let cleaned = url.replace(PROTOCOL_REGEX, "");

  // Replace invalid filename characters with hyphens
  cleaned = cleaned.replace(/[/:?#[\]@!$&'()*+,;=<>"|\\]/g, "-");

  // Replace multiple consecutive hyphens with single hyphen
  cleaned = cleaned.replace(/-+/g, "-");

  // Remove leading/trailing hyphens
  cleaned = cleaned.replace(/^-+|-+$/g, "");

  // Truncate if too long (keep it under 200 chars to be safe)
  const maxLength = 200;
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }

  // Add index prefix for ordering
  const paddedIndex = String(index + 1).padStart(INDEX_PAD_LENGTH, "0");

  return `${paddedIndex}-${cleaned}.svg`;
}

type ParsedUrls = {
  urls: string[];
  style: string;
};

function parseRequestUrls(req: VercelRequest): ParsedUrls {
  if (req.method === "POST") {
    const body = req.body;
    if (!(body && Array.isArray(body.urls))) {
      throw new Error("Request body must contain 'urls' array");
    }
    return {
      urls: body.urls,
      style: body.style || "slate-ember",
    };
  }

  // GET request - decode and decompress base64 encoded data
  const { data, style: styleParam } = req.query;

  if (!data || typeof data !== "string") {
    throw new Error(
      "Query parameter 'data' is required (compressed base64 encoded JSON with urls array)"
    );
  }

  try {
    // Decode from base64url (URL-safe base64)
    const compressedBuffer = Buffer.from(data, "base64url");

    // Decompress using inflate
    const decompressed = inflateSync(compressedBuffer);
    const jsonString = decompressed.toString("utf-8");

    const parsed = JSON.parse(jsonString);

    if (!Array.isArray(parsed.urls)) {
      throw new Error("Decoded data must contain 'urls' array");
    }

    return {
      urls: parsed.urls,
      style:
        parsed.style ||
        (typeof styleParam === "string" ? styleParam : "slate-ember"),
    };
  } catch (_error) {
    throw new Error("Could not decode/decompress base64 data parameter");
  }
}

async function generateQrCodesZip(
  urls: string[],
  style: string
): Promise<Buffer> {
  const zip = new JSZip();
  const size = 768;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];

    if (!url || typeof url !== "string" || url.trim() === "") {
      continue;
    }

    try {
      const base64Data = await generateQrCode({
        data: url,
        styleId: style,
        size,
        format: "svg",
      });

      const svgContent = Buffer.from(base64Data, "base64").toString("utf-8");
      const filename = sanitizeFilename(url, i);
      zip.file(filename, svgContent);
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: Needed for serverless logging
      console.error(`Failed to generate QR code for URL ${i}:`, error);
    }
  }

  return zip.generateAsync({ type: "nodebuffer" });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    // biome-ignore lint/style/noMagicNumbers: HTTP status code
    return res.status(405).json({
      error: "Method not allowed",
      message: "Only GET and POST requests are supported",
    });
  }

  try {
    const { urls, style } = parseRequestUrls(req);

    if (urls.length === 0) {
      // biome-ignore lint/style/noMagicNumbers: HTTP status code
      return res.status(400).json({
        error: "Empty URLs array",
        message: "At least one URL is required",
      });
    }

    const maxBatchSize = 100;
    if (urls.length > maxBatchSize) {
      // biome-ignore lint/style/noMagicNumbers: HTTP status code
      return res.status(400).json({
        error: "Batch size too large",
        message: `Maximum ${maxBatchSize} URLs allowed per batch`,
      });
    }

    const zipBuffer = await generateQrCodesZip(urls, style);

    // Generate filename with timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, TIMESTAMP_LENGTH);
    const filename = `qr-codes-${timestamp}.zip`;

    // Set headers for file download
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", zipBuffer.length.toString());
    res.setHeader("Cache-Control", "no-cache");

    // biome-ignore lint/style/noMagicNumbers: HTTP status code
    return res.status(200).send(zipBuffer);
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Needed for serverless logging
    console.error("Batch download QR error:", error);
    // biome-ignore lint/style/noMagicNumbers: HTTP status code
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
