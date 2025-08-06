'use client'

import { usePathname } from 'next/navigation'
import * as React from 'react'
import { 
  Home, 
  PenTool, 
  Folder, 
  User, 
  ExternalLink, 
  Github, 
  Twitter, 
  Linkedin 
} from 'lucide-react'

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
          icon: Home,
          trailingAccessory: null,
          isActive: pathname === '/',
          trailingAction: null,
          isExternal: false,
        },
        {
          href: '/writing',
          label: 'Writing',
          icon: PenTool,
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
          href: '/about',
          label: 'About',
          icon: User,
          trailingAccessory: null,
          isActive: pathname.startsWith('/about'),
          trailingAction: null,
          isExternal: false,
        },
        {
          href: '/stack',
          label: 'Stack',
          icon: Folder,
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
          icon: Folder,
          trailingAccessory: null,
          isActive: pathname.startsWith('/projects'),
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
          icon: Github,
          trailingAccessory: ExternalLink,
          isActive: false,
          trailingAction: null,
          isExternal: true,
        },
        {
          href: 'https://twitter.com/jaredtconnor',
          label: 'Twitter',
          icon: Twitter,
          trailingAccessory: ExternalLink,
          isActive: false,
          trailingAction: null,
          isExternal: true,
        },
        {
          href: 'https://linkedin.com/in/jaredtconnor',
          label: 'LinkedIn',
          icon: Linkedin,
          trailingAccessory: ExternalLink,
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
                className="px-2 pt-5 pb-2 text-xs font-semibold text-gray-1000 text-opacity-40"
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
