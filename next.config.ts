import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
  // Adding empty turbopack config to allow custom webpack config in Next.js 16
  experimental: {
    turbo: {},
  },
};

export default nextConfig;
