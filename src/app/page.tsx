import QrCodeWrapper from "./qr-generator/client-wrapper";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
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
    </main>
  );
}
