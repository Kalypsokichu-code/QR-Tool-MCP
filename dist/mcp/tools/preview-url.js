import { generateDownloadUrl, generatePreviewUrl } from "../qr-generator.js";
export function handlePreviewUrl(input) {
    const { url, style } = input;
    try {
        const previewUrl = generatePreviewUrl(url, style);
        const downloadUrl = generateDownloadUrl(url, style);
        const result = {
            success: true,
            previewUrl,
            downloadUrl,
            message: "QR code ready. Use downloadUrl for direct SVG download, or previewUrl to view and customize in browser.",
        };
        return JSON.stringify(result, null, 2);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return JSON.stringify({
            success: false,
            error: errorMessage,
            message: "Failed to generate URLs",
        }, null, 2);
    }
}
//# sourceMappingURL=preview-url.js.map