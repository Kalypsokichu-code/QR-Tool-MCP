import { generateDownloadUrl } from "../qr-generator.js";
import type { BatchUrlInput } from "../schemas.js";

export function handleBatchQr(input: BatchUrlInput): string {
  const { urls, style } = input;

  // Validate input
  if (!Array.isArray(urls) || urls.length === 0) {
    return JSON.stringify(
      {
        success: false,
        error: "Missing or invalid required parameter: urls",
        message:
          "The 'urls' parameter is required and must be a non-empty array",
      },
      null,
      2
    );
  }

  try {
    const results = urls.map((url, index) => {
      // Validate each URL
      if (!url || typeof url !== "string" || url.trim() === "") {
        return {
          index,
          url,
          error: "Invalid or empty URL",
          downloadUrl: null,
        };
      }

      return {
        index,
        url,
        downloadUrl: generateDownloadUrl(url, style),
      };
    });

    const result = {
      success: true,
      count: urls.length,
      results,
      message: `Generated ${urls.length} QR code download URLs. Each result includes the URL and downloadUrl for instant SVG download.`,
    };

    return JSON.stringify(result, null, 2);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return JSON.stringify(
      {
        success: false,
        error: errorMessage,
        message: "Failed to generate batch QR code URLs",
      },
      null,
      2
    );
  }
}
