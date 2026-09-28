import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
            "https://shiftlink-p763.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
