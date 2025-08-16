import React from 'react';
import { cn } from '../utils/cn';

interface TimelineItemProps {
  period: string;
  title: string;
  subtitle?: string;
  description?: string;
  isLast?: boolean;
}

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

export function TimelineItem({ 
  period, 
  title, 
  subtitle, 
  description, 
  isLast = false 
}: TimelineItemProps) {
  return (
    <div className="relative flex items-start group">
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center mr-6">
        <div className="w-3 h-3 bg-primary-500 dark:bg-primary-400 rounded-full border-2 border-white dark:border-gray-900 shadow-sm group-hover:scale-110 transition-transform duration-200" />
        {!isLast && (
          <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 mt-2" />
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium shrink-0">
            {period}
          </div>
        </div>
        {description && (
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export function Timeline({ children, className }: TimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  );
}

// Helper component for easier usage
interface TimelineWrapperProps {
  items: Array<{
    period: string;
    title: string;
    subtitle?: string;
    description?: string;
  }>;
  className?: string;
}

export function TimelineWrapper({ items, className }: TimelineWrapperProps) {
  return (
    <Timeline className={className}>
      {items.map((item, index) => (
        <TimelineItem
          key={`${item.title}-${index}`}
          period={item.period}
          title={item.title}
          subtitle={item.subtitle}
          description={item.description}
          isLast={index === items.length - 1}
        />
      ))}
    </Timeline>
  );
}

export type { TimelineItemProps, TimelineProps, TimelineWrapperProps };