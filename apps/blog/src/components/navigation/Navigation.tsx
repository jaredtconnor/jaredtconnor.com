'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NavigationItem {
  name: string
  href: string
  external?: boolean
  icon?: string
}

interface NavigationSection {
  title?: string
  items: NavigationItem[]
}

interface NavigationProps {
  currentPath?: string
  onNavigate?: () => void
}

const navigationSections: NavigationSection[] = [
  {
    // Unnamed section
    items: [
      { name: 'Home', href: '/' },
      { name: 'Writing', href: '/writing' },
    ]
  },
  {
    title: 'Me',
    items: [
      { name: 'About', href: '/about' },
      { name: 'Projects', href: '/projects' },
      { name: 'Stack', href: '/stack' },
    ]
  },
  {
    title: 'Online',
    items: [
      { name: 'GitHub', href: 'https://github.com/jaredtconnor', external: true },
      { name: 'Email', href: 'mailto:jaredconnor301@gmail.com', external: true },
    ]
  }
]

export function Navigation({ currentPath, onNavigate }: NavigationProps) {
  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return currentPath === '/'
    }
    return currentPath?.startsWith(href) ?? false
  }

  const handleNavigation = () => {
    if (onNavigate) {
      onNavigate()
    }
  }

  return (
    <nav className="p-6 space-y-8">
      {navigationSections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {section.title && (
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
          )}
          <ul className="space-y-1">
            {section.items.map((item) => {
              const isActive = !item.external && isActiveRoute(item.href)
              
              if (item.external) {
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleNavigation}
                      className={cn(
                        'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                        'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                        'dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'
                      )}
                    >
                      <span>{item.name}</span>
                      <svg className="ml-2 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </li>
                )
              }

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={handleNavigation}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}