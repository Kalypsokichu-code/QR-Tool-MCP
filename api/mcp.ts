import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleGenerateQrCode } from "../src/mcp/tools/generate-qr.js";
import { handleGetAvailableStyles } from "../src/mcp/tools/get-styles.js";
import { handlePreviewUrl } from "../src/mcp/tools/preview-url.js";

const server = new Server(
  {
    name: "qr-tool-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// biome-ignore lint/suspicious/useAwait: MCP SDK requires async
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_qr_code",
        description:
          "Generate a QR code with custom styling. Returns base64-encoded image data that can be saved or displayed. Supports multiple visual styles and optional logo embedding.",
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
              description:
                "Visual style preset for the QR code. Default: slate-ember",
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
              description:
                "QR code dimensions in pixels. Default: 768. Range: 256-2048",
            },
            logoUrl: {
              type: "string",
              description:
                "Optional URL to a logo/icon to embed in the QR code",
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
        description:
          "Get a list of all available QR code style presets with their color schemes. Use this to discover styling options before generating QR codes.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "preview_qr_url",
        description:
          "Generate a shareable web preview URL for a QR code. Returns a link to the web interface where users can view, customize, and download the QR code.",
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
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "generate_qr_code": {
        // biome-ignore lint/suspicious/noExplicitAny: MCP SDK requires dynamic args
        const result = await handleGenerateQrCode(args as any);
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
        const result = handlePreviewUrl(args as any);
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
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: errorMessage,
              message: `Tool execution failed: ${name}`,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle GET and HEAD requests with server info (HEAD is used for health checks)
  if (req.method === "GET" || req.method === "HEAD") {
    // biome-ignore lint/style/noMagicNumbers: HTTP status code
    return res.status(200).json({
      name: "qr-tool-mcp",
      version: "1.0.0",
      description: "Generate beautiful, styled QR codes via MCP",
      tools: ["generate_qr_code", "get_available_styles", "preview_qr_url"],
      transport: "http",
    });
  }

  if (req.method !== "POST") {
    // biome-ignore lint/style/noMagicNumbers: HTTP status code
    return res.status(405).json({
      error: "Method not allowed",
      message: "This MCP server only accepts GET, HEAD, and POST requests",
    });
  }

  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => `qr-session-${Date.now()}`,
    });

    await server.connect(transport);

    // Set proper headers before handling
    res.setHeader("Content-Type", "application/json");

    // The transport.handleRequest will write to the response
    await transport.handleRequest(req.body, res);

    // Only send response if headers haven't been sent yet
    if (!res.headersSent) {
      // biome-ignore lint/style/noMagicNumbers: HTTP status code
      res.status(200).end();
    }
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Needed for serverless logging
    console.error("MCP server error:", error);
    if (!res.headersSent) {
      // biome-ignore lint/style/noMagicNumbers: HTTP status code
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
