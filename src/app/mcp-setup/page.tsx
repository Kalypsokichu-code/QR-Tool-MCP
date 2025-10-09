"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const COPY_RESET_DELAY_MS = 2000;

export default function McpSetupPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), COPY_RESET_DELAY_MS);
    });
  };

  const httpConfig = `{
  "mcpServers": {
    "qr-tool": {
      "url": "https://qr-tool-mcp.vercel.app/api/mcp"
    }
  }
}`;

  const stdioConfig = `{
  "mcpServers": {
    "qr-tool": {
      "command": "node",
      "args": ["/path/to/qr-tool-mcp/dist/index.js"]
    }
  }
}`;

  return (
    <div className="flex min-h-screen w-full items-center overflow-x-hidden bg-background">
      <div className="container mx-auto w-full max-w-5xl px-4 py-6 pb-20 sm:px-6 sm:py-12 sm:pb-24">
        {/* Header */}
        <div className="mb-6 sm:mb-12">
          <h1 className="mb-2 font-bold text-2xl tracking-tight sm:mb-3 sm:text-4xl">
            QR Tool MCP
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-lg">
            Generate beautiful QR code URLs with instant preview and download
            links via Model Context Protocol
          </p>
        </div>

        <div className="mb-6 grid w-full gap-4 sm:mb-12 sm:gap-8 md:grid-cols-2">
          {/* Left Column */}
          <div className="min-w-0 space-y-4 sm:space-y-8">
            {/* What is this */}
            <div>
              <h2 className="mb-2 font-semibold text-lg sm:mb-3 sm:text-xl">
                What is this
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                An MCP server that lets AI assistants generate custom-styled QR
                codes. Returns both preview URLs and direct download links.
              </p>
            </div>

            {/* Setup */}
            <div>
              <h2 className="mb-3 font-semibold text-lg sm:mb-4 sm:text-xl">
                Setup
              </h2>
              <div className="space-y-3">
                {/* Cursor / IDEs */}
                <Card className="relative w-full overflow-hidden bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base sm:text-lg">
                        Cursor / IDEs
                      </CardTitle>
                      <Button
                        className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
                        onClick={() => copyToClipboard(httpConfig, "http")}
                        size="sm"
                        variant="ghost"
                      >
                        {copiedId === "http" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="overflow-hidden">
                    <pre className="max-w-full overflow-x-auto rounded bg-background/50 p-2 text-[11px] leading-relaxed sm:text-xs">
                      <code className="break-all">{httpConfig}</code>
                    </pre>
                  </CardContent>
                </Card>

                {/* Claude Desktop */}
                <Card className="w-full overflow-hidden bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Claude Desktop
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 overflow-hidden text-muted-foreground text-xs sm:text-sm">
                    <div>
                      <p className="mb-2 font-medium">
                        1. Clone the repository:
                      </p>
                      <div className="max-w-full overflow-x-auto rounded bg-background/50 p-2">
                        <code className="whitespace-nowrap text-[11px] sm:text-xs">
                          git clone
                          https://github.com/Kalypsokichu-code/QR-Tool-MCP.git
                        </code>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 font-medium">
                        2. Install dependencies and build:
                      </p>
                      <div className="max-w-full overflow-x-auto rounded bg-background/50 p-2">
                        <code className="whitespace-nowrap text-[11px] sm:text-xs">
                          npm install && npm run build:mcp
                        </code>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 font-medium">
                        3. Add to Claude Desktop config:
                      </p>
                      <div className="relative mt-2 max-w-full overflow-hidden">
                        <Button
                          className="absolute top-2 right-2 z-10 shrink-0 opacity-70 transition-opacity hover:opacity-100"
                          onClick={() => copyToClipboard(stdioConfig, "stdio")}
                          size="sm"
                          variant="ghost"
                        >
                          {copiedId === "stdio" ? "Copied!" : "Copy"}
                        </Button>
                        <pre className="max-w-full overflow-x-auto rounded bg-background/50 p-3 pr-20 text-[11px] leading-relaxed sm:text-xs">
                          <code>{stdioConfig}</code>
                        </pre>
                      </div>
                    </div>
                    <p className="font-medium">4. Restart Claude Desktop</p>
                  </CardContent>
                </Card>

                {/* Restart Note */}
                <Card className="w-full overflow-hidden bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Restart after config
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Tools available after restart
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="min-w-0 space-y-4 sm:space-y-8">
            {/* Tools */}
            <div>
              <h2 className="mb-3 font-semibold text-lg sm:mb-4 sm:text-xl">
                Tools
              </h2>
              <div className="space-y-3">
                <Card className="w-full overflow-hidden bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="break-all font-mono text-sm sm:text-base">
                      generate_qr_url
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Generate QR codes with custom styling.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="w-full overflow-hidden bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="break-all font-mono text-sm sm:text-base">
                      get_available_styles
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      List all available QR code style presets with their color
                      schemes. Perfect for discovering styling options.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="w-full overflow-hidden bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="break-all font-mono text-sm sm:text-base">
                      generate_qr_urls_batch
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Generate QR code download URLs for multiple URLs at once.
                      Perfect for batch processing lists. Maximum 100 URLs per
                      batch.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Available Styles */}
            <div>
              <h2 className="mb-3 font-semibold text-lg sm:mb-4 sm:text-xl">
                Available styles
              </h2>
              <Card className="w-full overflow-hidden bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    10 Beautiful Presets
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Each style features carefully crafted color combinations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-[11px] text-muted-foreground sm:text-xs">
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">slate-ember</span>
                      <span className="text-right text-muted-foreground/60">
                        Dark slate × orange
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">ink-lime</span>
                      <span className="text-right text-muted-foreground/60">
                        Deep black × lime
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">charcoal-cyan</span>
                      <span className="text-right text-muted-foreground/60">
                        Navy × cyan
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">night-sky</span>
                      <span className="text-right text-muted-foreground/60">
                        Midnight × sky blue
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">graphite-gold</span>
                      <span className="text-right text-muted-foreground/60">
                        Dark graphite × gold
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">espresso-rose</span>
                      <span className="text-right text-muted-foreground/60">
                        Dark brown × rose
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">plum-ice</span>
                      <span className="text-right text-muted-foreground/60">
                        Deep purple × lavender
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">forest-mint</span>
                      <span className="text-right text-muted-foreground/60">
                        Forest × mint
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">cocoa-orange</span>
                      <span className="text-right text-muted-foreground/60">
                        Warm brown × orange
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">mono-high</span>
                      <span className="text-right text-muted-foreground/60">
                        High contrast B&W
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-border border-t pt-4 sm:pt-6">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <div className="flex flex-wrap gap-3 text-muted-foreground text-xs sm:gap-4 sm:text-sm">
              <a
                className="transition-colors hover:text-foreground"
                href="https://github.com/Kalypsokichu-code/QR-Tool-MCP"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              <a
                className="transition-colors hover:text-foreground"
                href="https://qr-tool-mcp.vercel.app"
                rel="noopener noreferrer"
                target="_blank"
              >
                Web App
              </a>
              <a
                className="transition-colors hover:text-foreground"
                href="https://qr-tool-mcp.vercel.app/api/mcp"
                rel="noopener noreferrer"
                target="_blank"
              >
                API
              </a>
            </div>
            <div className="text-muted-foreground text-xs sm:text-sm">
              Created by{" "}
              <a
                className="text-primary transition-opacity hover:opacity-80"
                href="https://kalyp.so"
                rel="noopener noreferrer"
                target="_blank"
              >
                Kalypso
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home Link - Bottom Left */}
      <Link
        className="fixed bottom-3 left-3 z-50 text-muted-foreground text-xs underline underline-offset-4 transition-colors hover:text-foreground sm:bottom-6 sm:left-6"
        href="/"
      >
        ← Back to Generator
      </Link>
    </div>
  );
}
