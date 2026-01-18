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
  // Adding empty turbopack config as suggested by the Next.js 16 error message
  // this acknowledges we are using custom webpack for the ggwave library fallbacks.
  turbopack: {},
};

export default nextConfig;
