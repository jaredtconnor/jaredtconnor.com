import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: "/blog",
  async rewrites() {
    return {
      beforeFiles: [
        // These rewrites are checked after headers/redirects
        // and before all files including _next/public files
        {
          source: '/blog/:path*',
          destination: '/:path*',
        },
      ],
    }
  },
};

export default nextConfig;
