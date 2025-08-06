import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'settings',
  label: 'Site Settings',
  dbName: 'settings', // Short table name
  access: {
    read: () => true, // Public read access
    update: ({ req: { user } }) => !!user, // Only authenticated users can update
  },
  fields: [
    // Basic Site Information
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Jared Connor',
      admin: {
        description: 'The name of your website',
      },
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      required: true,
      defaultValue: 'Personal website and digital garden of Jared Connor',
      admin: {
        description: 'Brief description of your website',
      },
    },
    {
      name: 'siteUrl',
      type: 'text',
      required: true,
      defaultValue: 'https://jaredtconnor.com',
      admin: {
        description: 'Full URL of your website (used for SEO and social sharing)',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Site logo',
      },
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Site favicon',
      },
    },

    // Navigation - simplified
    {
      name: 'navLinks',
      type: 'array',
      label: 'Navigation Links',
      dbName: 'nav', // Short table name
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Internal Page', value: 'page' },
            { label: 'External URL', value: 'url' },
            { label: 'Custom Path', value: 'path' },
          ],
          defaultValue: 'page',
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'page',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'url',
          },
        },
        {
          name: 'path',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'path',
            description: 'Custom path like /blog, /projects, etc.',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },

    // Contact Information - flattened
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Primary contact email',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Contact phone number',
      },
    },

    // Social Media - simplified
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      dbName: 'social', // Short table name
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'GitHub', value: 'github' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Twitter/X', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Discord', value: 'discord' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.platform === 'other',
            description: 'Custom label for "Other" platform',
          },
        },
      ],
    },

    // SEO - flattened
    {
      name: 'seoTitle',
      type: 'text',
      admin: {
        description: 'Default title template (e.g., "%s | Jared Connor")',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      admin: {
        description: 'Default meta description when page-specific description is not provided',
      },
    },
    {
      name: 'seoKeywords',
      type: 'text',
      admin: {
        description: 'Default keywords (comma-separated)',
      },
    },
    {
      name: 'seoImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Default Open Graph image for social sharing',
      },
    },
    {
      name: 'twitterHandle',
      type: 'text',
      admin: {
        description: 'Twitter handle (without @) for Twitter Card metadata',
      },
    },

    // Footer - simplified
    {
      name: 'copyrightText',
      type: 'text',
      defaultValue: '© 2024 Jared Connor. All rights reserved.',
    },
    {
      name: 'footerLinks',
      type: 'array',
      label: 'Footer Links',
      dbName: 'footer', // Short table name
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'newTab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'footerContent',
      type: 'richText',
      admin: {
        description: 'Additional footer content (rich text)',
      },
    },

    // Theme - flattened
    {
      name: 'primaryColor',
      type: 'text',
      admin: {
        description: 'Primary brand color (hex code)',
      },
    },
    {
      name: 'secondaryColor',
      type: 'text',
      admin: {
        description: 'Secondary brand color (hex code)',
      },
    },
    {
      name: 'fontFamily',
      type: 'select',
      options: [
        { label: 'Inter', value: 'inter' },
        { label: 'Roboto', value: 'roboto' },
        { label: 'Open Sans', value: 'open-sans' },
        { label: 'Lato', value: 'lato' },
        { label: 'Poppins', value: 'poppins' },
      ],
      defaultValue: 'inter',
    },

    // Analytics - flattened
    {
      name: 'googleAnalyticsId',
      type: 'text',
      admin: {
        description: 'Google Analytics tracking ID (GA4)',
      },
    },
    {
      name: 'googleTagManagerId',
      type: 'text',
      admin: {
        description: 'Google Tag Manager container ID',
      },
    },
    {
      name: 'facebookPixelId',
      type: 'text',
      admin: {
        description: 'Facebook Pixel ID',
      },
    },
  ],
  versions: {
    drafts: true,
  },
}