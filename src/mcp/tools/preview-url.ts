import { generateDownloadUrl, generatePreviewUrl } from "../qr-generator.js";
import type { PreviewUrlInput } from "../schemas.js";

export function handlePreviewUrl(input: PreviewUrlInput): string {
  const { url, style } = input;

  // Validate that url is provided
  if (!url || typeof url !== "string" || url.trim() === "") {
    return JSON.stringify(
      {
        success: false,
        error: "Missing required parameter: url",
        message:
          "The 'url' parameter is required and must be a non-empty string",
      },
      null,
      2
    );
  }

  try {
    const previewUrl = generatePreviewUrl(url, style);
    const downloadUrl = generateDownloadUrl(url, style);

    const result = {
      success: true,
      previewUrl,
      downloadUrl,
      message:
        "QR code ready. Use downloadUrl for direct SVG download, or previewUrl to view and customize in browser.",
    };

    return JSON.stringify(result, null, 2);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return JSON.stringify(
      {
        success: false,
        error: errorMessage,
        message: "Failed to generate URLs",
      },
      null,
      2
    );
  }
}
