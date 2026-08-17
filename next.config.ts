import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.orientbell.com",
      },
      {
        protocol: "https",
        hostname: "server.orientbell.com",
      },
    ],
  },
};

export default nextConfig;