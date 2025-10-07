import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleBatchQr } from "../src/mcp/tools/batch-qr.js";
import { handleGetAvailableStyles } from "../src/mcp/tools/get-styles.js";
import { handlePreviewUrl } from "../src/mcp/tools/preview-url.js";

// Global storage for sessions (in production, use Redis or similar)
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};
const servers: { [sessionId: string]: McpServer } = {};

function createServer(): McpServer {
  const server = new McpServer(
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

  // Register tools
  server.tool(
    "generate_qr_url",
    "Generate QR code URLs with custom styling. Returns both a previewUrl (to view/customize in browser) and a downloadUrl (for direct SVG download). Both are working URLs to https://qr-tool-mcp.vercel.app.",
    {
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
    },
    // biome-ignore lint/suspicious/noExplicitAny: MCP SDK requires dynamic args
    // biome-ignore lint/suspicious/useAwait: MCP SDK requires async
    async (args: any) => {
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
  );

  server.tool(
    "get_available_styles",
    "Get a list of all available QR code style presets with their color schemes. Use this to discover styling options before generating QR codes.",
    {},
    // biome-ignore lint/suspicious/useAwait: MCP SDK requires async
    async () => {
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
  );

  server.tool(
    "generate_qr_urls_batch",
    "Generate QR code download URLs for multiple URLs at once. Perfect for batch processing CSV files or lists. Returns an array of results with index, original URL, and downloadUrl for each. Maximum 100 URLs per batch.",
    {
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
        description:
          "Style preset to apply to all QR codes. Default: slate-ember",
      },
    },
    // biome-ignore lint/suspicious/noExplicitAny: MCP SDK requires dynamic args
    // biome-ignore lint/suspicious/useAwait: MCP SDK requires async
    async (args: any) => {
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
  );

  return server;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle non-POST requests for server info
  if (req.method === "GET" || req.method === "HEAD") {
    // biome-ignore lint/style/noMagicNumbers: HTTP status code
    return res.status(200).json({
      name: "qr-tool-mcp",
      version: "1.0.0",
      description:
        "Generate beautiful, styled QR codes via MCP. Returns shareable URLs to https://qr-tool-mcp.vercel.app",
      tools: [
        "generate_qr_url",
        "get_available_styles",
        "generate_qr_urls_batch",
      ],
      transport: "streamable-http",
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
    // Check for existing session ID
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;
    let server: McpServer;

    if (sessionId && transports[sessionId] && servers[sessionId]) {
      // Reuse existing transport and server
      transport = transports[sessionId];
      server = servers[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        enableJsonResponse: true,
        onsessioninitialized: (newSessionId) => {
          // Store the transport and server by session ID
          transports[newSessionId] = transport;
          servers[newSessionId] = server;
        },
      });

      // Clean up on close
      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid) {
          delete transports[sid];
          delete servers[sid];
        }
      };

      // Create and connect server
      server = createServer();
      await server.connect(transport);

      // Handle the initialization request
      await transport.handleRequest(req, res, req.body);
      return;
    } else {
      // Invalid request
      // biome-ignore lint/style/noMagicNumbers: HTTP status code
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32_000,
          message: "Bad Request: No valid session ID provided",
        },
        id: null,
      });
      return;
    }

    // Handle the request with existing transport
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Needed for serverless logging
    console.error("MCP server error:", error);
    if (!res.headersSent) {
      // biome-ignore lint/style/noMagicNumbers: HTTP status code
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32_603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
}
