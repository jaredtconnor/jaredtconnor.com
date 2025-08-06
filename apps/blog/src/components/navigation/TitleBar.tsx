'use client'

import Link from 'next/link'
import * as React from 'react'
import { Menu, X, ArrowLeft } from 'lucide-react'
import { GlobalNavigationContext } from '../providers'

interface Props {
  title: string
  globalMenu?: boolean
  backButton?: boolean
  backButtonHref?: string
  scrollContainerRef?: React.MutableRefObject<HTMLElement | null> | null
  children?: React.ReactNode
  leadingAccessory?: React.ReactNode
  trailingAccessory?: React.ReactNode
}

export function TitleBar({
  title,
  globalMenu = true,
  backButton = false,
  backButtonHref,
  leadingAccessory = null,
  trailingAccessory = null,
  children,
}: Props) {
  const { isOpen, setIsOpen } = React.useContext(GlobalNavigationContext)

  return (
    <>
      <div
        className="filter-blur sticky top-0 z-10 flex items-center justify-between border-b border-gray-150 bg-white bg-opacity-80 px-3 py-2"
      >
        <div className="flex items-center space-x-3">
          {globalMenu && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center p-2 rounded-md cursor-pointer hover:bg-gray-200 lg:hidden"
            >
              {isOpen ? (
                <X size={16} />
              ) : (
                <Menu size={16} />
              )}
            </button>
          )}

          {backButton && (
            <Link
              href={backButtonHref || '/'}
              className="flex items-center justify-center p-2 rounded-md cursor-pointer hover:bg-gray-200"
            >
              <ArrowLeft size={16} />
            </Link>
          )}

          {leadingAccessory && <>{leadingAccessory}</>}

          <h2 className="text-sm font-bold text-gray-1000 line-clamp-1">
            {title}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          {trailingAccessory && <>{trailingAccessory}</>}
        </div>
      </div>
      {children}
    </>
  )
}
