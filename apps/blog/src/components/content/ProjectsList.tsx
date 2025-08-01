'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// For now using static data - will integrate with CMS later
const projects = [
  {
    id: '1',
    name: 'Smallsh',
    description: 'A Unix-based shell written in C with support for built-in commands, signal handling, and background processes.',
    technologies: ['C', 'Unix', 'Systems Programming'],
    url: 'https://github.com/jaredtconnor/smallsh',
    status: 'completed',
    year: '2021'
  },
  {
    id: '2',
    name: 'Reddit Archiver',
    description: 'Flask CRUD web application with MySQL backend for archiving and searching Reddit posts and comments.',
    technologies: ['Python', 'Flask', 'MySQL', 'REST API'],
    url: 'https://github.com/jaredtconnor/reddit-archiver',
    status: 'completed',
    year: '2020'
  },
  {
    id: '3',
    name: 'Wikipedia Table Scraper',
    description: 'Python REST API that parses and extracts data from Wikipedia tables with configurable output formats.',
    technologies: ['Python', 'REST API', 'Web Scraping', 'BeautifulSoup'],
    url: 'https://github.com/jaredtconnor/wikipedia-table-scraper',
    status: 'completed',
    year: '2020'
  },
  {
    id: '4',
    name: 'Personal Blog & CMS',
    description: 'Modern blog platform built with Next.js, PayloadCMS, and PostgreSQL. Features real-time content management and responsive design.',
    technologies: ['Next.js', 'PayloadCMS', 'PostgreSQL', 'TypeScript', 'Tailwind CSS'],
    url: 'https://github.com/jaredtconnor/blog',
    status: 'in-progress',
    year: '2024'
  },
  {
    id: '5',
    name: 'Financial Data Pipeline',
    description: 'Scalable ETL pipeline for processing millions of financial records with real-time reporting capabilities.',
    technologies: ['Python', 'Apache Airflow', 'PostgreSQL', 'Docker'],
    url: null, // Private/proprietary
    status: 'completed',
    year: '2023'
  }
]

interface ProjectsListProps {
  limit?: number
  showAll?: boolean
  className?: string
}

export function ProjectsList({ limit, showAll = false, className }: ProjectsListProps) {
  const displayProjects = limit ? projects.slice(0, limit) : projects

  return (
    <div className={cn('space-y-6', className)}>
      {showAll && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            A collection of projects I&apos;ve built over the years, ranging from systems programming 
            to web applications and data engineering solutions.
          </p>
        </div>
      )}
      
      <div className="space-y-6">
        {displayProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {!showAll && limit && projects.length > limit && (
        <div className="pt-4">
          <Link 
            href="/projects"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            View all projects ({projects.length}) →
          </Link>
        </div>
      )}
    </div>
  )
}

interface ProjectCardProps {
  project: typeof projects[0]
}

function ProjectCard({ project }: ProjectCardProps) {
  const CardWrapper = project.url ? 'a' : 'div'
  const cardProps = project.url 
    ? { 
        href: project.url, 
        target: '_blank', 
        rel: 'noopener noreferrer' 
      } 
    : {}

  return (
    <CardWrapper 
      {...cardProps}
      className={cn(
        'block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg',
        project.url 
          ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer group'
          : ''
      )}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className={cn(
              'text-xl font-semibold text-gray-900 dark:text-white',
              project.url ? 'group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' : ''
            )}>
              {project.name}
              {project.url && (
                <svg className="inline ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              )}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {project.year}
              </span>
              <span className={cn(
                'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
                project.status === 'completed' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              )}>
                {project.status === 'completed' ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span 
              key={tech}
              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </CardWrapper>
  )
}