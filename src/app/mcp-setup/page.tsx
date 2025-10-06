"use client";

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
    <div className="flex min-h-screen items-center bg-background">
      <div className="container mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-3 font-bold text-4xl tracking-tight">
            QR Tool MCP
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate beautiful, styled QR codes via Model Context Protocol
          </p>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8">
            {/* What is this */}
            <div>
              <h2 className="mb-3 font-semibold text-xl">What is this</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                An MCP server that lets AI assistants generate custom-styled QR
                codes. Works with Claude Desktop, Cursor, and other MCP-enabled
                tools. Create QR codes with 10 beautiful preset styles, custom
                logos, and multiple export formats.
              </p>
            </div>

            {/* Setup */}
            <div>
              <h2 className="mb-4 font-semibold text-xl">Setup</h2>
              <div className="space-y-3">
                {/* Cursor / IDEs */}
                <Card className="relative bg-secondary/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Cursor / IDEs</CardTitle>
                      <Button
                        className="opacity-70 transition-opacity hover:opacity-100"
                        onClick={() => copyToClipboard(httpConfig, "http")}
                        size="sm"
                        variant="ghost"
                      >
                        {copiedId === "http" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-x-auto text-xs">
                      <code>{httpConfig}</code>
                    </pre>
                  </CardContent>
                </Card>

                {/* Claude Desktop */}
                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle>Claude Desktop</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground text-xs">
                    <div>
                      <p className="mb-1">1. Clone the repository:</p>
                      <code className="rounded bg-background/50 px-2 py-1 text-xs">
                        git clone
                        https://github.com/Kalypsokichu-code/QR-Tool-MCP.git
                      </code>
                    </div>
                    <div>
                      <p className="mb-1">2. Install dependencies and build:</p>
                      <code className="rounded bg-background/50 px-2 py-1 text-xs">
                        npm install && npm run build:mcp
                      </code>
                    </div>
                    <div>
                      <p className="mb-1">3. Add to Claude Desktop config:</p>
                      <div className="relative mt-2">
                        <Button
                          className="absolute top-2 right-2 opacity-70 transition-opacity hover:opacity-100"
                          onClick={() => copyToClipboard(stdioConfig, "stdio")}
                          size="sm"
                          variant="ghost"
                        >
                          {copiedId === "stdio" ? "Copied!" : "Copy"}
                        </Button>
                        <pre className="rounded bg-background/50 p-3 text-xs">
                          <code>{stdioConfig}</code>
                        </pre>
                      </div>
                    </div>
                    <p>4. Restart Claude Desktop</p>
                  </CardContent>
                </Card>

                {/* Restart Note */}
                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle>Restart after config</CardTitle>
                    <CardDescription>
                      Tools available after restart
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Tools */}
            <div>
              <h2 className="mb-4 font-semibold text-xl">Tools</h2>
              <div className="space-y-3">
                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="font-mono">
                      generate_qr_code
                    </CardTitle>
                    <CardDescription>
                      Generate a styled QR code with custom options. Supports 10
                      visual styles, logo embedding, and multiple formats
                      (SVG/PNG).
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="font-mono">
                      get_available_styles
                    </CardTitle>
                    <CardDescription>
                      List all available QR code style presets with their color
                      schemes. Perfect for discovering styling options.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="font-mono">preview_qr_url</CardTitle>
                    <CardDescription>
                      Generate a shareable web preview URL where users can view,
                      customize, and download the QR code.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Available Styles */}
            <div>
              <h2 className="mb-4 font-semibold text-xl">Available styles</h2>
              <Card className="bg-secondary/50">
                <CardHeader>
                  <CardTitle>10 Beautiful Presets</CardTitle>
                  <CardDescription>
                    Each style features carefully crafted color combinations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-muted-foreground text-xs">
                    <div className="flex justify-between">
                      <span>slate-ember</span>
                      <span className="text-muted-foreground/60">
                        Dark slate × orange
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ink-lime</span>
                      <span className="text-muted-foreground/60">
                        Deep black × lime
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>charcoal-cyan</span>
                      <span className="text-muted-foreground/60">
                        Navy × cyan
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>night-sky</span>
                      <span className="text-muted-foreground/60">
                        Midnight × sky blue
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>graphite-gold</span>
                      <span className="text-muted-foreground/60">
                        Dark graphite × gold
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>espresso-rose</span>
                      <span className="text-muted-foreground/60">
                        Dark brown × rose
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>plum-ice</span>
                      <span className="text-muted-foreground/60">
                        Deep purple × lavender
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>forest-mint</span>
                      <span className="text-muted-foreground/60">
                        Forest × mint
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>cocoa-orange</span>
                      <span className="text-muted-foreground/60">
                        Warm brown × orange
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>mono-high</span>
                      <span className="text-muted-foreground/60">
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
        <div className="border-border border-t pt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-muted-foreground text-xs">
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
            <div className="text-muted-foreground text-xs">
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
    </div>
  );
}
