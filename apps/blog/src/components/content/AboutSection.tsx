'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface AboutSectionProps {
  className?: string
}

const workHistory = [
  {
    company: 'Umpqua Bank',
    title: 'Financial Analyst, Treasury',
    period: 'Oct 2017 – Present',
    description: 'Building scalable systems and APIs, managing millions of records for real-time liquidity reporting.'
  },
  {
    company: 'Simple Finance',
    title: 'Customer Relations',
    period: 'Aug 2016 – Aug 2017',
    description: 'Customer support and relations for digital banking platform.'
  }
]

const education = [
  {
    school: 'Oregon State University',
    degree: 'B.S. Computer Science',
    year: '2021'
  },
  {
    school: 'University of Oregon', 
    degree: 'B.S. Economics',
    year: '2016'
  }
]

const projects = [
  {
    name: 'Smallsh',
    description: 'A Unix-based shell written in C',
    url: 'https://github.com/jaredtconnor/smallsh'
  },
  {
    name: 'Reddit Archiver',
    description: 'Flask CRUD web app with MySQL backend',
    url: 'https://github.com/jaredtconnor/reddit-archiver'
  },
  {
    name: 'Wikipedia Table Scraper',
    description: 'Python REST API for parsing Wikipedia tables',
    url: 'https://github.com/jaredtconnor/wikipedia-table-scraper'
  }
]

export function AboutSection({ className }: AboutSectionProps) {
  return (
    <div className={cn('max-w-2xl space-y-8', className)}>
      {/* Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          About
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            I&apos;m a developer, data engineer, and financial analyst at Umpqua Bank. I build 
            scalable systems and APIs, wrangle millions of records for real-time liquidity 
            reporting, and love solving problems at the intersection of data, finance, and technology.
          </p>
          <p>
            Whether I&apos;m designing microservices, building econometric models, or hacking 
            together a new shell in C, I&apos;m always looking for ways to make an impact. 
            I believe in the power of tech to solve real-world problems.
          </p>
        </div>
      </section>

      {/* Work Experience */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Work
        </h3>
        <div className="space-y-4">
          {workHistory.map((job, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  {job.company}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {job.title}
                </div>
                {job.description && (
                  <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {job.description}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500 flex-shrink-0">
                {job.period}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Featured Projects
        </h3>
        <div className="space-y-3">
          {projects.map((project, index) => (
            <div key={index}>
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.name}
                  <svg className="inline ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {project.description}
                </div>
              </a>
            </div>
          ))}
        </div>
        <div className="pt-2">
          <Link 
            href="/projects"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            View all projects →
          </Link>
        </div>
      </section>

      {/* Education */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Education
        </h3>
        <div className="space-y-3">
          {education.map((edu, index) => (
            <div key={index}>
              <div className="font-medium text-gray-900 dark:text-white">
                {edu.school}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {edu.degree}, {edu.year}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Get in Touch
        </h3>
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300">
            I&apos;m always interested in new opportunities and conversations about technology, 
            finance, and building great products.
          </p>
          <div className="flex gap-4 pt-2">
            <a 
              href="mailto:jaredconnor301@gmail.com"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Email me
            </a>
            <a 
              href="https://github.com/jaredtconnor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}