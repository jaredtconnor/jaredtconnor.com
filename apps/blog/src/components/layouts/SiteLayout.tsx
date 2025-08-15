'use client'

import React from 'react'
import { Sidebar } from '../Sidebar'

interface SiteLayoutProps {
  children: React.ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="relative flex h-full min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 bg-dots text-gray-1000 dark:text-gray-100">{children}</div>
    </div>
  )
}