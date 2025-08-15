// PayloadCMS content types
// These will be dynamically set by the CMS app when it initializes

export interface Post {
  id: string
  title: string
  content?: any
  slug: string
  excerpt?: string
  publishedDate?: string
  tags?: Tag[]
  author?: User
  featured?: boolean
  createdAt: string
  updatedAt: string
}

export interface Page {
  id: string
  title: string
  content?: any
  slug: string
  excerpt?: string
  featuredImage?: Media
  status?: 'draft' | 'published' | 'archived'
  template?: string
  showInNavigation?: boolean
  navigationOrder?: number
  seo?: {
    title?: string
    description?: string
    keywords?: string
    ogImage?: Media
  }
  meta?: {
    title?: string
    description?: string
    image?: Media
  }
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  title: string
  description?: string
  content?: any
  slug: string
  image?: Media
  gallery?: Media[]
  links?: Array<{
    label: string
    url: string
  }>
  technologies?: string[]
  featured?: boolean
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  color?: string
  createdAt: string
  updatedAt: string
}

export interface Bookmark {
  id: string
  instapaperID?: string
  url: string
  title: string
  description?: string
  featured?: boolean
  publicNote?: any
  privateNote?: any
  tags?: Tag[]
  category?: 'development' | 'design' | 'technology' | 'business' | 'personal' | 'tutorial' | 'article' | 'tool' | 'resource' | 'other'
  status: 'draft' | 'published' | 'archived'
  publishedAt?: string
  instapaperData?: {
    starred: boolean
    readingProgress: number
    addedAt: string
  }
  metadata?: {
    host: string
    faviconUrl?: string
    image?: string
    author?: string
    publishDate?: string
    readingTime?: number
    language?: string
    keywords?: string
  }
  syncStatus: 'synced' | 'pending' | 'error' | 'manual'
  lastSyncedAt?: string
  syncError?: string
  seo?: {
    title?: string
    description?: string
    keywords?: string
  }
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name?: string
  bio?: string
  avatar?: Media
  createdAt: string
  updatedAt: string
}

export interface Media {
  id: string
  filename: string
  alt?: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  url: string
  createdAt: string
  updatedAt: string
}

// Global content types - simplified structure
export interface SiteSettings {
  id: string
  siteName: string
  siteDescription: string
  siteUrl: string
  logo?: Media
  favicon?: Media
  navLinks?: Array<{
    label: string
    type: 'page' | 'url' | 'path'
    page?: Page
    url?: string
    path?: string
    newTab: boolean
  }>
  email?: string
  phone?: string
  socialLinks?: Array<{
    platform: 'github' | 'linkedin' | 'twitter' | 'instagram' | 'youtube' | 'discord' | 'other'
    url: string
    label?: string
  }>
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  seoImage?: Media
  twitterHandle?: string
  copyrightText?: string
  footerLinks?: Array<{
    label: string
    url: string
    newTab: boolean
  }>
  footerContent?: any
  primaryColor?: string
  secondaryColor?: string
  fontFamily?: 'inter' | 'roboto' | 'open-sans' | 'lato' | 'poppins'
  googleAnalyticsId?: string
  googleTagManagerId?: string
  facebookPixelId?: string
  createdAt: string
  updatedAt: string
}

// Additional utility types for content operations
export interface ContentQuery {
  where?: Record<string, any>
  limit?: number
  page?: number
  sort?: string
  depth?: number
}

export interface ContentResponse<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}