'use client'

import { usePathname } from 'next/navigation'
import * as React from 'react'

import {
  HomeIcon,
  WritingIcon,
  BookmarksIcon,
  StackIcon,
  InformationIcon,
  ExternalLinkIcon,
  GitHubIcon,
  TwitterIcon,
} from '@/components/Icon'

import { NavigationLink } from './NavigationLink'

export function SidebarNavigation() {
  const pathname = usePathname()
  
  const sections = [
    {
      label: null,
      items: [
        {
          href: '/',
          label: 'Home',
          icon: HomeIcon,
          trailingAccessory: null,
          isActive: pathname === '/',
          trailingAction: null,
          isExternal: false,
        },
        {
          href: '/writing',
          label: 'Writing',
          icon: WritingIcon,
          trailingAccessory: null,
          isActive: pathname.startsWith('/writing'),
          trailingAction: null,
          isExternal: false,
        },
      ],
    },
    {
      label: 'Me',
      items: [
        { 
          href: '/bookmarks',
          label: 'Bookmarks',
          icon: BookmarksIcon,
          trailingAccessory: null,
          isActive: pathname.startsWith('/bookmarks'),
          trailingAction: null,
          isExternal: false,
        },
        {
          href: '/stack',
          label: 'Stack',
          icon: StackIcon,
          trailingAccessory: null,
          isActive: pathname.startsWith('/stack'),
          trailingAction: null,
          isExternal: false,
        },
      ],
    },
    {
      label: 'Projects',
      items: [
        {
          href: '/projects',
          label: 'Projects',
          icon: StackIcon,
          trailingAccessory: null,
          isActive: pathname.startsWith('/projects'),
          trailingAction: null,
          isExternal: false,
        },
        {
          href: '/information',
          label: 'Information',
          icon: InformationIcon,
          trailingAccessory: null,
          isActive: pathname.startsWith('/information'),
          trailingAction: null,
          isExternal: false,
        },
      ],
    },
    {
      label: 'Online',
      items: [
        {
          href: 'https://github.com/jaredtconnor',
          label: 'GitHub',
          icon: GitHubIcon,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          trailingAction: null,
          isExternal: true,
        },
        {
          href: 'https://twitter.com/jaredtconnor',
          label: 'Twitter',
          icon: TwitterIcon,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          trailingAction: null,
          isExternal: true,
        },
      ],
    },
  ]

  return (
    <div className="flex-1 px-3 py-3 space-y-1">
      {sections.map((section, i) => {
        return (
          <ul key={i} className="space-y-1">
            {section.label && (
              <h4
                key={i}
                className="px-2 pt-5 pb-2 text-xs font-semibold text-gray-1000 text-opacity-40 dark:text-white"
              >
                {section.label}
              </h4>
            )}
            {section.items.map((item, j) => (
              <NavigationLink key={j} link={item} />
            ))}
          </ul>
        )
      })}
    </div>
  )
}
