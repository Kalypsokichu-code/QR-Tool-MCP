import { generatePreviewUrl } from "../qr-generator.js";
export function handlePreviewUrl(input) {
    const { url, style } = input;
    try {
        const previewUrl = generatePreviewUrl(url, style);
        const result = {
            success: true,
            previewUrl,
            message: `Preview URL generated. Open this link to view and customize the QR code in your browser.`,
        };
        return JSON.stringify(result, null, 2);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return JSON.stringify({
            success: false,
            error: errorMessage,
            message: "Failed to generate preview URL",
        }, null, 2);
    }
}
//# sourceMappingURL=preview-url.js.map