import Link from "next/link";
import QrCodeWrapper from "./qr-generator/client-wrapper";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="mb-2 font-bold text-3xl tracking-tight">
            QR Code Generator
          </h1>
          <p className="text-muted-foreground">
            Design beautiful QR codes with custom styles and export as SVG or
            PNG
          </p>
        </header>
        <QrCodeWrapper />
      </div>

      {/* MCP Link - Bottom Left */}
      <Link
        className="fixed bottom-6 left-6 text-muted-foreground text-xs underline underline-offset-4 transition-colors hover:text-foreground"
        href="/mcp-setup"
      >
        MCP Setup
      </Link>
    </main>
  );
}
