import { buildConfig } from 'payload/config'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import path from 'path'
import Posts from '@/collections/Posts'
import Users from '@/collections/Users'
import Media from '@/collections/Media'

export default buildConfig({
  serverURL: process.env.PAYLOAD_URL,
  admin: {
    bundler: webpackBundler(),
    user: Users.slug,
    webpack: config => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@': path.resolve(__dirname, './'),
        },
      },
    }),
  },
  collections: [Posts, Users, Media],
  typescript: {
    outputFile: path.resolve('/', 'payload-types.ts'),
  },
  editor: lexicalEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI,
  }),
})
