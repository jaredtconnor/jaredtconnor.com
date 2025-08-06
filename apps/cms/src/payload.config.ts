// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { Projects } from './collections/Projects'
import { Tags } from './collections/Tags'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Posts, Pages, Projects, Tags, Media],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    schemaName: 'payload',
    migrationDir: './migrations',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    s3Storage({
      collections: {
        media: {
          prefix: process.env.NODE_ENV || 'development',
          generateFileURL: ({ filename, prefix }) => {
            const bucketName = process.env.MEDIA_BUCKET_NAME || 'default-bucket';
            return `https://${bucketName}.s3.us-west-2.amazonaws.com/${prefix}/${filename}`;
          }
        }
      },
      bucket: process.env.MEDIA_BUCKET_NAME || 'default-bucket',
      config: {
        forcePathStyle: false,
        region: 'us-west-2',
        endpoint: undefined, // Use default AWS endpoint
      },
    }),
  ],
})
