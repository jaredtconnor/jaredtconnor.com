import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'featured', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Published projects are publicly readable
      if (!user) {
        return {
          status: {
            equals: 'published',
          },
        }
      }
      // Admin users can read all projects
      return true
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the project title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief description of the project',
      },
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        description: 'Detailed project information',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main project image/screenshot',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
      admin: {
        description: 'Additional project images',
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
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this project on the homepage',
      },
    },
    {
      name: 'projectStatus',
      type: 'select',
      defaultValue: 'completed',
      options: [
        {
          label: 'In Progress',
          value: 'in-progress',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Ongoing',
          value: 'ongoing',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      admin: {
        description: 'Current status of the project',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        description: 'When the project was started',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        description: 'When the project was completed (if applicable)',
      },
    },
    {
      name: 'technologies',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Icon name or emoji for the technology',
          },
        },
      ],
      admin: {
        description: 'Technologies used in this project',
      },
    },
    {
      name: 'links',
      type: 'group',
      label: 'Project Links',
      fields: [
        {
          name: 'live',
          type: 'text',
          admin: {
            description: 'Link to live/deployed project',
          },
        },
        {
          name: 'github',
          type: 'text',
          admin: {
            description: 'Link to GitHub repository',
          },
        },
        {
          name: 'demo',
          type: 'text',
          admin: {
            description: 'Link to demo or preview',
          },
        },
        {
          name: 'documentation',
          type: 'text',
          admin: {
            description: 'Link to project documentation',
          },
        },
      ],
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
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
            description: 'Custom SEO title (falls back to project title)',
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
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Custom image for social media sharing',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-generate slug from title if not provided
        if (data?.title && !data?.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
  },
  timestamps: true,
}
