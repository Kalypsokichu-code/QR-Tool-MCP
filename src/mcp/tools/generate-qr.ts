import { generateQrCode } from "../qr-generator.js";
import type { GenerateQrCodeInput } from "../schemas.js";

export async function handleGenerateQrCode(
  input: GenerateQrCodeInput,
): Promise<string> {
  const { url, style = "slate-ember", size = 768 } = input;

  try {
    const base64Data = await generateQrCode({
      data: url,
      styleId: style,
      size,
      format: "svg",
    });

    const result = {
      success: true,
      format: "svg",
      size,
      style,
      data: `data:image/svg+xml;base64,${base64Data}`,
      message: `QR code generated successfully for: ${url.substring(0, 50)}${url.length > 50 ? "..." : ""}`,
    };

    return JSON.stringify(result, null, 2);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return JSON.stringify(
      {
        success: false,
        error: errorMessage,
        message: "Failed to generate QR code",
      },
      null,
      2,
    );
  }
}
