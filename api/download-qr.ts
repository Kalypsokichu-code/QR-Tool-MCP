import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateQrCode } from "../src/mcp/qr-generator.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== "GET") {
    // biome-ignore lint/style/noMagicNumbers: HTTP status code
    return res.status(405).json({
      error: "Method not allowed",
      message: "Only GET requests are supported",
    });
  }

  try {
    const { data, style } = req.query;

    // Validate required parameters
    if (!data || typeof data !== "string") {
      // biome-ignore lint/style/noMagicNumbers: HTTP status code
      return res.status(400).json({
        error: "Missing required parameter",
        message: "Query parameter 'data' is required",
      });
    }

    // Generate QR code with default settings for download
    const styleId = typeof style === "string" ? style : "slate-ember";
    const size = 768;

    const base64Data = await generateQrCode({
      data,
      styleId,
      size,
      format: "svg",
    });

    // Decode base64 to get the SVG content
    const svgContent = Buffer.from(base64Data, "base64").toString("utf-8");

    // Generate filename from data URL (safely)
    const filename = `qr-code-${Date.now()}.svg`;

    // Set headers for file download
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour

    // biome-ignore lint/style/noMagicNumbers: HTTP status code
    return res.status(200).send(svgContent);
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Needed for serverless logging
    console.error("Download QR error:", error);
    // biome-ignore lint/style/noMagicNumbers: HTTP status code
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
