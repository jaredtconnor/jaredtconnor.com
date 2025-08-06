import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: ['@payloadcms/ui']
  }
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
