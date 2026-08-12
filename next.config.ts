import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB, too small for the expert photo upload (up to 5MB).
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
