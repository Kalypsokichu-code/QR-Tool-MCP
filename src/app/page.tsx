import Link from "next/link";
import QrCodeWrapper from "./qr-generator/client-wrapper";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-background px-3 py-6 pb-20 sm:px-4 sm:py-8 sm:pb-24">
      <div className="w-full max-w-2xl">
        <header className="mb-6 text-center sm:mb-8">
          <h1 className="mb-2 font-bold text-2xl tracking-tight sm:text-3xl">
            QR Code Generator
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Design beautiful QR codes with custom styles and export as SVG or
            PNG
          </p>
        </header>
        <QrCodeWrapper />
      </div>

      {/* MCP Link - Bottom Left */}
      <Link
        className="fixed bottom-3 left-3 z-50 text-muted-foreground text-xs underline underline-offset-4 transition-colors hover:text-foreground sm:bottom-6 sm:left-6"
        href="/mcp-setup"
      >
        MCP Setup
      </Link>
    </main>
  );
}
