'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ListDetailViewProps {
  list: React.ReactNode
  detail?: React.ReactNode
  hasDetail?: boolean
  className?: string
}

export function ListDetailView({ 
  list, 
  detail, 
  hasDetail = false, 
  className 
}: ListDetailViewProps) {
  return (
    <div className={cn('flex h-full', className)}>
      {/* List Panel */}
      <div className={cn(
        'flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50',
        hasDetail ? 'w-80 hidden md:block' : 'flex-1'
      )}>
        <div className="h-full overflow-y-auto">
          {list}
        </div>
      </div>

      {/* Detail Panel */}
      {hasDetail && detail && (
        <div className="flex-1 bg-white dark:bg-gray-900">
          <div className="h-full overflow-y-auto">
            {detail}
          </div>
        </div>
      )}

      {/* Mobile List View (when hasDetail is true but no detail is selected) */}
      {hasDetail && !detail && (
        <div className="flex-1 md:hidden bg-white dark:bg-gray-900">
          <div className="h-full overflow-y-auto">
            {list}
          </div>
        </div>
      )}
    </div>
  )
}