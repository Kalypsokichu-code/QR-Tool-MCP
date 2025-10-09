export function handleBatchQr(input) {
    const { urls, style } = input;
    // Validate input
    if (!Array.isArray(urls) || urls.length === 0) {
        return JSON.stringify({
            success: false,
            error: "Missing or invalid required parameter: urls",
            message: "The 'urls' parameter is required and must be a non-empty array",
        }, null, 2);
    }
    // Check batch size limit
    const maxBatchSize = 100;
    if (urls.length > maxBatchSize) {
        return JSON.stringify({
            success: false,
            error: "Batch size too large",
            message: `Maximum ${maxBatchSize} URLs allowed per batch. You provided ${urls.length} URLs.`,
        }, null, 2);
    }
    try {
        // Validate URLs
        const invalidUrls = urls
            .map((url, index) => ({ url, index }))
            .filter(({ url }) => !url || typeof url !== "string" || url.trim() === "");
        if (invalidUrls.length > 0) {
            return JSON.stringify({
                success: false,
                error: "Invalid URLs detected",
                message: `Found ${invalidUrls.length} invalid or empty URLs at indices: ${invalidUrls.map((u) => u.index).join(", ")}`,
                invalidUrls,
            }, null, 2);
        }
        // Encode the data as base64 for the URL
        const baseUrl = "https://qr-tool-mcp.vercel.app";
        const payload = JSON.stringify({
            urls,
            style: style || "slate-ember",
        });
        const encodedData = Buffer.from(payload).toString("base64");
        const downloadUrl = `${baseUrl}/api/batch-download-qr?data=${encodeURIComponent(encodedData)}`;
        const result = {
            success: true,
            count: urls.length,
            style: style || "slate-ember",
            downloadUrl,
            message: `Generated batch download URL for ${urls.length} QR codes. Download the ZIP file to get all QR codes with filenames based on their URLs.`,
            note: "The ZIP file will contain SVG files named like: 001-example-com-page.svg, 002-github-com-user.svg, etc.",
        };
        return JSON.stringify(result, null, 2);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return JSON.stringify({
            success: false,
            error: errorMessage,
            message: "Failed to generate batch QR code download URL",
        }, null, 2);
    }
}
//# sourceMappingURL=batch-qr.js.map