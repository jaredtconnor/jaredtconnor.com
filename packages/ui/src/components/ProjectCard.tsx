'use client'

import { ExternalLink, Github } from 'lucide-react'
import { cn } from '../utils'

interface ProjectCardProps {
  title: string
  description: string
  image?: string
  url?: string | null
  github?: string | null
  tech?: string[]
  className?: string
}

export function ProjectCard({
  title,
  description,
  image,
  url,
  github,
  tech = [],
  className
}: ProjectCardProps) {
  return (
    <div className={cn('group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-cardHover', className)}>
      {image && (
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img 
            src={image} 
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-1000 group-hover:text-gray-700 transition-colors">
            {title}
          </h3>
          
          <div className="flex gap-2 ml-4">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-1000 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={16} />
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-1000 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={16} />
              </a>
            )}
          </div>
        </div>
        
        <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>
        
        {tech.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tech.map((technology) => (
              <span 
                key={technology}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
              >
                {technology}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
