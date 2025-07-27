import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'role', 'updatedAt'],
  },
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return `<p>Please verify your email by clicking <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/verify/${token}">here</a>.</p>`
      },
    },
  },
  access: {
    read: ({ req: { user } }) => {
      // Admin can read all users
      if (user?.role === 'admin') {
        return true
      }
      // Users can only read their own data
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    update: ({ req: { user } }) => {
      // Admin can update all users
      if (user?.role === 'admin') {
        return true
      }
      // Users can only update their own data
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      // Only admin can delete users
      return user?.role === 'admin'
    },
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Brief description about the user',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile picture',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'author',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Author',
          value: 'author',
        },
        {
          label: 'Viewer',
          value: 'viewer',
        },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Links',
      fields: [
        {
          name: 'website',
          type: 'text',
          admin: {
            description: 'Personal website URL',
          },
        },
        {
          name: 'twitter',
          type: 'text',
          admin: {
            description: 'Twitter/X handle (without @)',
          },
        },
        {
          name: 'github',
          type: 'text',
          admin: {
            description: 'GitHub username',
          },
        },
        {
          name: 'linkedin',
          type: 'text',
          admin: {
            description: 'LinkedIn profile URL',
          },
        },
      ],
    },
    {
      name: 'preferences',
      type: 'group',
      label: 'Preferences',
      fields: [
        {
          name: 'theme',
          type: 'select',
          defaultValue: 'auto',
          options: [
            {
              label: 'Auto',
              value: 'auto',
            },
            {
              label: 'Light',
              value: 'light',
            },
            {
              label: 'Dark',
              value: 'dark',
            },
          ],
        },
        {
          name: 'emailNotifications',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Receive email notifications',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
