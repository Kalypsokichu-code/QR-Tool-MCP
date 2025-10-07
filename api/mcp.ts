import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { handleBatchQr } from "../dist/mcp/tools/batch-qr.js";
import { handleGetAvailableStyles } from "../dist/mcp/tools/get-styles.js";
import { handlePreviewUrl } from "../dist/mcp/tools/preview-url.js";

// Create the MCP handler using mcp-handler for proper Vercel support
const handler = createMcpHandler(
  (server) => {
    server.tool(
      "generate_qr_url",
      "Generate QR code URLs with custom styling. Returns both a previewUrl (to view/customize in browser) and a downloadUrl (for direct SVG download). Both are working URLs to https://qr-tool-mcp.vercel.app.",
      {
        url: z
          .string()
          .describe("The URL or text content to encode in the QR code"),
        style: z
          .enum([
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
          ])
          .optional()
          .describe(
            "Visual style preset for the QR code. Default: slate-ember"
          ),
      },
      // biome-ignore lint/suspicious/useAwait: MCP SDK handler signature requires async
      async ({ url, style }) => {
        try {
          // biome-ignore lint/suspicious/noConsole: Debug logging
          console.log("generate_qr_url params:", { url, style });
          const result = handlePreviewUrl({ url, style });
          return {
            content: [
              {
                type: "text",
                text: result,
              },
            ],
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          // biome-ignore lint/suspicious/noConsole: Error logging
          console.error("generate_qr_url error:", errorMessage);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    success: false,
                    error: errorMessage,
                    receivedParams: { url, style },
                    message: "Tool execution failed",
                  },
                  null,
                  2
                ),
              },
            ],
            isError: true,
          };
        }
      }
    );

    server.tool(
      "get_available_styles",
      "Get a list of all available QR code style presets with their color schemes. Use this to discover styling options before generating QR codes.",
      {},
      // biome-ignore lint/suspicious/useAwait: MCP SDK handler signature requires async
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
        urls: z
          .array(z.string())
          // biome-ignore lint/style/noMagicNumbers: Max batch size limit
          .max(100)
          .describe("Array of URLs or text content to encode (max 100)"),
        style: z
          .enum([
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
          ])
          .optional()
          .describe(
            "Style preset to apply to all QR codes. Default: slate-ember"
          ),
      },
      // biome-ignore lint/suspicious/useAwait: MCP SDK handler signature requires async
      async ({ urls, style }) => {
        try {
          // biome-ignore lint/suspicious/noConsole: Debug logging
          console.log("generate_qr_urls_batch params:", {
            urlsCount: urls?.length,
            style,
          });
          const result = handleBatchQr({ urls, style });
          return {
            content: [
              {
                type: "text",
                text: result,
              },
            ],
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          // biome-ignore lint/suspicious/noConsole: Error logging
          console.error("generate_qr_urls_batch error:", errorMessage);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    success: false,
                    error: errorMessage,
                    receivedParams: { urlsCount: urls?.length, style },
                    message: "Tool execution failed",
                  },
                  null,
                  2
                ),
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
  {
    // Server options
  },
  {
    // Handler options
    basePath: "/api",
    maxDuration: 60,
    verboseLogs: true,
  }
);

export { handler as GET, handler as POST };
