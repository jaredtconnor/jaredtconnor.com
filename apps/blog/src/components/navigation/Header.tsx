'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  return (
    <header className="max-w-content mx-auto px-6 py-8">
      <div className="flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xl font-semibold text-black hover:text-gray-500 transition-colors"
        >
          Jared Connor
        </Link>
        
        <nav className="flex items-center space-x-8">
          <Link 
            href="/"
            className={`text-sm ${
              pathname === '/' ? 'text-black' : 'text-gray-500 hover:text-black'
            } transition-colors`}
          >
            Home
          </Link>
          <Link 
            href="/writing"
            className={`text-sm ${
              pathname.startsWith('/writing') ? 'text-black' : 'text-gray-500 hover:text-black'
            } transition-colors`}
          >
            Writing
          </Link>
        </nav>
      </div>
    </header>
  )
}
