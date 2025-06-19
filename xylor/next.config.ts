import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  basePath: "/xylor-ai",

  // Server-specific optimizations
  experimental: {
    esmExternals: true,
  },

  webpack: (config, { isServer }) => {
    // Add path aliases for better module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(process.cwd()),
      "@/lib": path.resolve(process.cwd(), "lib"),
      "@/components": path.resolve(process.cwd(), "components"),
      "@/app": path.resolve(process.cwd(), "app"),
      "@/hooks": path.resolve(process.cwd(), "hooks"),
    };

    // Ensure proper module resolution for both server and client
    config.resolve.modules = [
      path.resolve(process.cwd()),
      path.resolve(process.cwd(), "node_modules"),
      "node_modules",
    ];

    // Server-specific configuration
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    // Ensure file extensions are resolved properly
    config.resolve.extensions = [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".json",
      ...config.resolve.extensions,
    ];

    return config;
  },
  /* config options here */
};

export default nextConfig;
