// Import metascraper only on server-side to avoid webpack issues
let metascraper: any
let metascraperAuthor: any
let metascraperDate: any
let metascraperDescription: any
let metascraperImage: any
let metascraperLang: any
let metascraperTitle: any

// Only import on server-side (Node.js environment)
if (typeof window === 'undefined') {
  try {
    metascraper = require('metascraper')
    metascraperAuthor = require('metascraper-author')
    metascraperDate = require('metascraper-date')
    metascraperDescription = require('metascraper-description')
    metascraperImage = require('metascraper-image')
    metascraperLang = require('metascraper-lang')
    metascraperTitle = require('metascraper-title')
  } catch (error) {
    console.warn('Metascraper dependencies not available:', error)
  }
}

export interface ExtractedMetadata {
  host: string
  title: string
  description?: string
  image?: string
  author?: string
  publishDate?: Date
  language?: string
  keywords?: string
  faviconUrl?: string
  readingTime?: number
}

export interface MetadataExtractionOptions {
  timeout?: number
  userAgent?: string
  followRedirects?: boolean
}

export class MetadataService {
  private scraper: any

  constructor() {
    // Only initialize scraper on server-side
    if (typeof window === 'undefined' && metascraper) {
      this.scraper = metascraper([
        metascraperTitle(),
        metascraperDescription(),
        metascraperAuthor(),
        metascraperDate(),
        metascraperImage(),
        metascraperLang(),
      ])
    }
  }

  /**
   * Extract metadata from a URL
   */
  async extractFromUrl(
    url: string,
    options: MetadataExtractionOptions = {}
  ): Promise<ExtractedMetadata> {
    try {
      // Validate URL
      const urlObj = new URL(url)
      const host = urlObj.hostname

      // Fetch the HTML content
      const html = await this.fetchHtml(url, options)
      
      // Extract metadata using metascraper (only available server-side)
      let metadata: any = {}
      if (this.scraper) {
        metadata = await this.scraper({ html, url })
      }

      // Process and clean the metadata
      const result: ExtractedMetadata = {
        host,
        title: metadata.title || this.extractTitleFromUrl(url),
        description: metadata.description,
        image: metadata.image,
        author: metadata.author,
        language: metadata.lang || 'en',
      }

      // Parse date if available
      if (metadata.date) {
        const parsedDate = new Date(metadata.date)
        if (!isNaN(parsedDate.getTime())) {
          result.publishDate = parsedDate
        }
      }

      // Extract keywords from description
      if (result.description) {
        result.keywords = this.extractKeywords(result.description)
      }

      // Generate favicon URL
      result.faviconUrl = this.generateFaviconUrl(urlObj)

      // Estimate reading time
      if (result.description) {
        result.readingTime = this.estimateReadingTime(result.description)
      }

      return result
    } catch (error) {
      console.error('Metadata extraction failed:', error)
      
      // Return minimal metadata on error
      const urlObj = new URL(url)
      return {
        host: urlObj.hostname,
        title: this.extractTitleFromUrl(url),
        faviconUrl: this.generateFaviconUrl(urlObj),
      }
    }
  }

  /**
   * Fetch HTML content from URL
   */
  private async fetchHtml(
    url: string,
    options: MetadataExtractionOptions = {}
  ): Promise<string> {
    const {
      timeout = 10000,
      userAgent = 'Mozilla/5.0 (compatible; BlogBot/1.0; +https://yourdomain.com/bot)',
      followRedirects = true,
    } = options

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'DNT': '1',
          'Connection': 'keep-alive',
        },
        redirect: followRedirects ? 'follow' : 'manual',
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('text/html')) {
        throw new Error(`Invalid content type: ${contentType}`)
      }

      return await response.text()
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  /**
   * Extract title from URL as fallback
   */
  private extractTitleFromUrl(url: string): string {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      
      // Remove leading slash and file extension
      const title = pathname
        .split('/')
        .filter(Boolean)
        .pop()
        ?.replace(/\.[^.]*$/, '') // Remove extension
        ?.replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
        ?.replace(/\b\w/g, l => l.toUpperCase()) // Capitalize words
        || urlObj.hostname

      return title
    } catch {
      return 'Untitled'
    }
  }

  /**
   * Generate favicon URL for a given domain
   */
  private generateFaviconUrl(urlObj: URL): string {
    // Try common favicon locations
    const faviconPaths = [
      '/favicon.ico',
      '/favicon.png',
      '/apple-touch-icon.png',
    ]

    // Return the most common one
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`
  }

  /**
   * Extract keywords from text content
   */
  private extractKeywords(text: string, maxKeywords: number = 10): string {
    // Simple keyword extraction - remove common words and get most frequent
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have',
      'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
      'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    ])

    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word))

    // Count word frequency
    const frequency: Record<string, number> = {}
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1
    })

    // Get top keywords
    const keywords = Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word)

    return keywords.join(', ')
  }

  /**
   * Estimate reading time in minutes
   */
  private estimateReadingTime(text: string): number {
    const wordsPerMinute = 200 // Average reading speed
    const wordCount = text.trim().split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return Math.max(1, minutes) // Minimum 1 minute
  }

  /**
   * Validate if a URL is accessible and returns HTML
   */
  async validateUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BlogBot/1.0)',
        },
      })

      return response.ok
    } catch {
      return false
    }
  }

  /**
   * Get a preview of the content (first paragraph or description)
   */
  async getContentPreview(url: string, maxLength: number = 300): Promise<string> {
    try {
      const html = await this.fetchHtml(url)
      
      // Extract first paragraph or description
      const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i)
      if (descriptionMatch) {
        return this.truncateText(descriptionMatch[1], maxLength)
      }

      // Fallback to first paragraph
      const paragraphMatch = html.match(/<p[^>]*>([^<]+)<\/p>/i)
      if (paragraphMatch) {
        return this.truncateText(paragraphMatch[1], maxLength)
      }

      return ''
    } catch {
      return ''
    }
  }

  /**
   * Truncate text to specified length with ellipsis
   */
  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    
    const truncated = text.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...'
    }
    
    return truncated + '...'
  }
}

/**
 * Global instance for use throughout the application
 */
let metadataServiceInstance: MetadataService | null = null

export function getMetadataService(): MetadataService {
  if (!metadataServiceInstance) {
    metadataServiceInstance = new MetadataService()
  }
  return metadataServiceInstance
}