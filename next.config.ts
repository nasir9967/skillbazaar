import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration (now stable in Next.js 15+)
  turbopack: {
    // Custom rules for file processing (updated syntax)
    rules: {
      // Example: SVG handling if needed
      // "*.svg": ["@svgr/webpack"],
    },
  },
  
  // External packages for server components (moved from experimental)
  serverExternalPackages: ['mongoose'],
};

export default nextConfig;
