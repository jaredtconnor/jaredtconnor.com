import type { CollectionConfig } from 'payload'

export const Bookmarks: CollectionConfig = {
  slug: 'bookmarks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'featured', 'syncStatus', 'publishedAt', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: ({ req: { user } }) => {
      // Published bookmarks are publicly readable
      if (!user) {
        return {
          status: {
            equals: 'published',
          },
        }
      }
      // Admin users can read all bookmarks
      return true
    },
  },
  fields: [
    // Instapaper Integration Fields
    {
      name: 'instapaperID',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Unique identifier from Instapaper API',
        readOnly: true,
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      unique: true,
      validate: (value: string | null | undefined) => {
        if (value && !/^https?:\/\/.+/.test(value)) {
          return 'Please enter a valid URL starting with http:// or https://'
        }
        return true
      },
      admin: {
        description: 'The bookmark URL',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Bookmark title (from Instapaper or manually entered)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Original description from the source',
      },
    },
    
    // Instapaper Metadata
    {
      name: 'instapaperData',
      type: 'group',
      label: 'Instapaper Data',
      admin: {
        condition: (data) => !!data?.instapaperID,
        description: 'Data synced from Instapaper',
      },
      fields: [
        {
          name: 'starred',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Starred in Instapaper',
            readOnly: true,
          },
        },
        {
          name: 'readingProgress',
          type: 'number',
          min: 0,
          max: 1,
          admin: {
            description: 'Reading progress (0-1) from Instapaper',
            readOnly: true,
          },
        },
        {
          name: 'addedAt',
          type: 'date',
          admin: {
            description: 'When bookmark was added to Instapaper',
            readOnly: true,
          },
        },
      ],
    },

    // Enhanced CMS Fields
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this bookmark prominently',
      },
    },
    {
      name: 'publicNote',
      type: 'richText',
      admin: {
        description: 'Your commentary and thoughts about this bookmark (public)',
      },
    },
    {
      name: 'privateNote',
      type: 'richText',
      admin: {
        description: 'Private notes (only visible in admin)',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        description: 'Categorize this bookmark',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Development', value: 'development' },
        { label: 'Design', value: 'design' },
        { label: 'Technology', value: 'technology' },
        { label: 'Business', value: 'business' },
        { label: 'Personal', value: 'personal' },
        { label: 'Tutorial', value: 'tutorial' },
        { label: 'Article', value: 'article' },
        { label: 'Tool', value: 'tool' },
        { label: 'Resource', value: 'resource' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Primary category for this bookmark',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      admin: {
        description: 'Publication status',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When this bookmark should be published',
      },
    },

    // Auto-extracted Metadata
    {
      name: 'metadata',
      type: 'group',
      label: 'Extracted Metadata',
      admin: {
        description: 'Automatically extracted from the URL',
      },
      fields: [
        {
          name: 'host',
          type: 'text',
          admin: {
            description: 'Domain name (e.g., github.com)',
            readOnly: true,
          },
        },
        {
          name: 'faviconUrl',
          type: 'text',
          admin: {
            description: 'URL to the site favicon',
            readOnly: true,
          },
        },
        {
          name: 'image',
          type: 'text',
          admin: {
            description: 'Featured image URL (og:image)',
            readOnly: true,
          },
        },
        {
          name: 'author',
          type: 'text',
          admin: {
            description: 'Content author if available',
            readOnly: true,
          },
        },
        {
          name: 'publishDate',
          type: 'date',
          admin: {
            description: 'Original publication date',
            readOnly: true,
          },
        },
        {
          name: 'readingTime',
          type: 'number',
          admin: {
            description: 'Estimated reading time in minutes',
            readOnly: true,
          },
        },
        {
          name: 'language',
          type: 'text',
          admin: {
            description: 'Content language',
            readOnly: true,
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'Extracted keywords',
            readOnly: true,
          },
        },
      ],
    },

    // Sync Management
    {
      name: 'syncStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Synced',
          value: 'synced',
        },
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Error',
          value: 'error',
        },
        {
          label: 'Manual',
          value: 'manual',
        },
      ],
      admin: {
        description: 'Sync status with Instapaper',
      },
    },
    {
      name: 'lastSyncedAt',
      type: 'date',
      admin: {
        description: 'Last successful sync with Instapaper',
        readOnly: true,
      },
    },
    {
      name: 'syncError',
      type: 'textarea',
      admin: {
        condition: (data) => data?.syncStatus === 'error',
        description: 'Error message from last sync attempt',
        readOnly: true,
      },
    },

    // SEO Fields
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Custom SEO title (falls back to bookmark title)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Meta description for search engines',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'Comma-separated keywords',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Extract host from URL
        if (data?.url && !data?.metadata?.host) {
          try {
            const urlObj = new URL(data.url)
            if (!data.metadata) data.metadata = {}
            data.metadata.host = urlObj.hostname
          } catch (error) {
            // Invalid URL, validation will catch this
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        // TODO: Trigger sync with Instapaper after bookmark changes
        if (operation === 'create' && !doc.instapaperID) {
          // This is a manually created bookmark, consider syncing to Instapaper
          console.log(`New manual bookmark created: ${doc.title}`)
        }
      },
    ],
  },
  timestamps: true,
}