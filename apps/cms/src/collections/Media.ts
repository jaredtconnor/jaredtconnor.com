import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'mimeType', 'filesize', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alternative text for accessibility and SEO',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption for the image',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Detailed description of the image',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Photo credit or attribution',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        description: 'Tags to help organize media files',
      },
    },
    {
      name: 'focal',
      type: 'point',
      admin: {
        description: 'Focal point for responsive image cropping',
      },
    },
  ],
  upload: {
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'desktop',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf'],
  },
  timestamps: true,
}
