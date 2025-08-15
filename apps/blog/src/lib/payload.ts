import { getPosts as getPostsFromDB, getBookmarks as getBookmarksFromDB, type Bookmark } from '@repo/db'

// Re-export the database functions with cleaner names
export const getPosts = async () => {
  try {
    const response = await getPostsFromDB({
      where: { status: { equals: 'published' } },
      sort: '-publishedDate',
      limit: 50
    })
    return response.docs
  } catch (error) {
    console.warn('Failed to fetch posts:', error)
    return []
  }
}

export const getPost = async (slug: string) => {
  try {
    const response = await getPostsFromDB({
      where: { 
        slug: { equals: slug },
        status: { equals: 'published' }
      },
      limit: 1
    })
    return response.docs[0] || null
  } catch (error) {
    console.warn('Failed to fetch post:', error)
    return null
  }
}

export const getBookmarks = async () => {
  try {
    const response = await getBookmarksFromDB({
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 50,
      depth: 2
    })
    return response.docs
  } catch (error) {
    console.warn('Failed to fetch bookmarks:', error)
    return []
  }
}

export const getProjects = async () => {
  try {
    // Mock data for now - replace with actual project fetching when available
    return [
      {
        id: '1',
        title: 'Personal Blog Platform',
        description: 'A full-stack blog platform built with Next.js, PayloadCMS, and deployed on AWS with SST.',
        featuredImage: { url: '/images/blog-platform.jpg' },
        liveUrl: 'https://blog.jaredconnor.dev',
        githubUrl: 'https://github.com/jaredtconnor/blog',
        technologies: ['Next.js', 'PayloadCMS', 'AWS', 'SST'],
        createdAt: '2024-01-01',
      },
      {
        id: '2',
        title: 'Financial Data Pipeline',
        description: 'Real-time financial data processing system with Apache Kafka and PostgreSQL.',
        featuredImage: { url: '/images/data-pipeline.jpg' },
        liveUrl: null,
        githubUrl: 'https://github.com/jaredtconnor/financial-pipeline',
        technologies: ['Apache Kafka', 'PostgreSQL', 'Python', 'Docker'],
        createdAt: '2023-06-01',
      },
      {
        id: '3',
        title: 'Analytics Dashboard',
        description: 'Interactive dashboard for business intelligence and data visualization.',
        featuredImage: { url: '/images/analytics-dashboard.jpg' },
        liveUrl: 'https://analytics.example.com',
        githubUrl: null,
        technologies: ['React', 'D3.js', 'Node.js', 'MongoDB'],
        createdAt: '2023-03-01',
      },
    ]
  } catch (error) {
    console.warn('Failed to fetch projects:', error)
    return []
  }
}

// Utility function to calculate reading time
export const calculateReadingTime = (content: unknown): string => {
  if (!content) return '5 min read'
  
  // Convert content to plain text (simplified)
  const text = JSON.stringify(content).replace(/<[^>]*>/g, '')
  const wordsPerMinute = 200
  const words = text.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  
  return `${minutes} min read`
}

// Type definitions for better TypeScript support
export interface BlogPost {
  id: string
  title: string
  excerpt?: string
  content: unknown
  slug: string
  publishedDate?: string
  tags?: Array<string | { id: string; name: string }>
  readingTime?: string
}

export interface Project {
  id: string
  title: string
  description: string
  featuredImage?: { url: string }
  liveUrl?: string | null
  githubUrl?: string | null
  technologies?: string[]
  createdAt: string
}
