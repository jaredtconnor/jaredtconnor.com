import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Remove basePath for local development - will be handled by deployment config
  // basePath: "/blog",
  transpilePackages: ["@repo/ui", "@repo/db"],
};

export default nextConfig;
