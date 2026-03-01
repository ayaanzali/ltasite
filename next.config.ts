import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  runtime: "nodejs",
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
