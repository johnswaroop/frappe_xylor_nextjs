import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  basePath: "/xylor-ai",
  webpack: (config) => {
    // Add path aliases for better module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
      "@/lib": path.resolve(__dirname, "lib"),
      "@/components": path.resolve(__dirname, "components"),
      "@/app": path.resolve(__dirname, "app"),
      "@/hooks": path.resolve(__dirname, "hooks"),
    };

    // Ensure proper module resolution
    config.resolve.modules = [
      path.resolve(__dirname),
      path.resolve(__dirname, "node_modules"),
      "node_modules",
    ];

    return config;
  },
  /* config options here */
};

export default nextConfig;
