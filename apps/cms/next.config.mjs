import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: ['@payloadcms/ui']
  },
  webpack: (config, { isServer }) => {
    // Handle native modules and binary files
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    })

    // Handle re2 and other native modules in server-side bundles
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('re2')
    }

    // Ignore node modules for client bundles that shouldn't be bundled
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: 'crypto-browserify',
      }
    }

    return config
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
