#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { handleBatchQr } from "./tools/batch-qr.js";
import { handleGenerateQrCode } from "./tools/generate-qr.js";
import { handleGetAvailableStyles } from "./tools/get-styles.js";
import { handlePreviewUrl } from "./tools/preview-url.js";
const server = new Server({
    name: "qr-tool-mcp",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// biome-ignore lint/suspicious/useAwait: MCP SDK requires async
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "generate_qr_code",
                description: "Generate a QR code with custom styling. Returns base64-encoded image data that can be saved or displayed. Supports multiple visual styles and optional logo embedding.",
                inputSchema: {
                    type: "object",
                    properties: {
                        url: {
                            type: "string",
                            description: "The URL or text content to encode in the QR code",
                        },
                        style: {
                            type: "string",
                            enum: [
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
                            ],
                            description: "Visual style preset for the QR code. Default: slate-ember",
                        },
                        format: {
                            type: "string",
                            enum: ["svg", "png"],
                            description: "Output format. Default: svg",
                        },
                        size: {
                            type: "number",
                            minimum: 256,
                            maximum: 2048,
                            description: "QR code dimensions in pixels. Default: 768. Range: 256-2048",
                        },
                        logoUrl: {
                            type: "string",
                            description: "Optional URL to a logo/icon to embed in the QR code",
                        },
                        logoPosition: {
                            type: "string",
                            enum: ["center", "bottom-right"],
                            description: "Logo placement. Default: center",
                        },
                    },
                    required: ["url"],
                },
            },
            {
                name: "get_available_styles",
                description: "Get a list of all available QR code style presets with their color schemes. Use this to discover styling options before generating QR codes.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "preview_qr_url",
                description: "Generate a shareable web preview URL for a QR code. Returns a link to the web interface where users can view, customize, and download the QR code.",
                inputSchema: {
                    type: "object",
                    properties: {
                        url: {
                            type: "string",
                            description: "The URL or text to encode",
                        },
                        style: {
                            type: "string",
                            description: "Style preset ID. Default: slate-ember",
                        },
                    },
                    required: ["url"],
                },
            },
            {
                name: "generate_qr_urls_batch",
                description: "Generate QR code download URLs for multiple URLs at once. Perfect for batch processing CSV files or lists. Returns a single ZIP file download URL containing all QR codes with filenames based on the URLs. Maximum 100 URLs per batch.",
                inputSchema: {
                    type: "object",
                    properties: {
                        urls: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            maxItems: 100,
                            description: "Array of URLs or text content to encode (max 100)",
                        },
                        style: {
                            type: "string",
                            enum: [
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
                            ],
                            description: "Style preset to apply to all QR codes. Default: slate-ember",
                        },
                    },
                    required: ["urls"],
                },
            },
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case "generate_qr_code": {
                // biome-ignore lint/suspicious/noExplicitAny: MCP SDK requires dynamic args
                const result = await handleGenerateQrCode(args);
                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            }
            case "get_available_styles": {
                const result = handleGetAvailableStyles();
                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            }
            case "preview_qr_url": {
                // biome-ignore lint/suspicious/noExplicitAny: MCP SDK requires dynamic args
                const result = handlePreviewUrl(args);
                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            }
            case "generate_qr_urls_batch": {
                // biome-ignore lint/suspicious/noExplicitAny: MCP SDK requires dynamic args
                const result = handleBatchQr(args);
                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        success: false,
                        error: errorMessage,
                        message: `Tool execution failed: ${name}`,
                    }, null, 2),
                },
            ],
            isError: true,
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // biome-ignore lint/suspicious/noConsole: Needed for stdio logging
    console.error("QR Tool MCP Server running on stdio");
}
main().catch((error) => {
    // biome-ignore lint/suspicious/noConsole: Needed for error logging
    console.error("Fatal error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map