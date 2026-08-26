import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB, too small for the expert photo upload (up to 5MB).
      bodySizeLimit: "8mb",
    },
  },
  async redirects() {
    return [
      {
        // /nominate was retired in favor of /nominate-an-expert — keep old
        // links/bookmarks working instead of 404ing.
        source: "/nominate",
        destination: "/nominate-an-expert",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
