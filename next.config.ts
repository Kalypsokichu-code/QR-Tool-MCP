import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  turbopack: {
    resolveAlias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  experimental: {
    inlineCss: true,
  },
};

export default nextConfig;
