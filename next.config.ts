import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['ui-avatars.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;
