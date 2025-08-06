'use client'

import Link from 'next/link'
import * as React from 'react'
import { GlobalNavigationContext } from '../providers'

interface NavigationLinkProps {
  link: {
    href: string
    label: string
    icon: React.ComponentType<{ size?: number }>
    trailingAccessory?: React.ComponentType<{ size?: number }> | null
    trailingAction?: React.ComponentType<{ size?: number }> | null
    isActive: boolean
    isExternal: boolean
  }
}

export function NavigationLink({
  link: {
    href,
    label,
    icon: Icon,
    trailingAccessory: Accessory,
    trailingAction: Action,
    isActive,
    isExternal,
  },
}: NavigationLinkProps) {
  const { setIsOpen } = React.useContext(GlobalNavigationContext)
  
  return (
    <li
      className="flex items-stretch space-x-1"
      onClick={() => setIsOpen(false)}
    >
      <Link
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={`flex flex-1 items-center space-x-3 rounded-md px-2 py-1.5 text-sm font-medium ${
          isActive
            ? 'bg-gray-1000 text-white hover:bg-gray-1000 hover:text-white'
            : 'text-gray-700 sm:hover:bg-gray-200 sm:hover:text-gray-900'
        }`}
      >
        <span className="flex items-center justify-center w-4">
          <Icon size={16} />
        </span>
        <span className="flex-1">{label}</span>
        {Accessory && (
          <span className="flex items-center justify-center w-4 text-gray-1000 text-opacity-40">
            <Accessory size={12} />
          </span>
        )}
      </Link>
      {Action && <Action />}
    </li>
  )
}
