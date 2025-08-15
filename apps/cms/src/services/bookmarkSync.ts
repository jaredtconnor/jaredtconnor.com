import type { Payload } from 'payload'
import { getInstapaperService, type InstapaperBookmark } from './instapaper'
import { getMetadataService, type ExtractedMetadata } from './metadata'

export interface SyncResult {
  success: boolean
  created: number
  updated: number
  errors: number
  errorMessages: string[]
}

export interface SyncOptions {
  limit?: number
  forceRefresh?: boolean
  enrichMetadata?: boolean
}

export interface BookmarkSyncStatus {
  lastSyncAt: Date
  totalBookmarks: number
  syncedBookmarks: number
  errors: string[]
}

export class BookmarkSyncService {
  constructor(private payload: Payload) {}

  /**
   * Main sync function - pulls bookmarks from Instapaper and syncs to CMS
   */
  async syncBookmarks(options: SyncOptions = {}): Promise<SyncResult> {
    const {
      limit = 100,
      forceRefresh = false,
      enrichMetadata = true,
    } = options

    const result: SyncResult = {
      success: false,
      created: 0,
      updated: 0,
      errors: 0,
      errorMessages: [],
    }

    try {
      console.log('Starting bookmark sync...')
      
      // Get Instapaper service
      const instapaper = getInstapaperService()
      
      // Verify authentication
      const isAuthenticated = await instapaper.verifyCredentials()
      if (!isAuthenticated) {
        throw new Error('Instapaper authentication failed')
      }

      // Get bookmarks from Instapaper
      console.log(`Fetching up to ${limit} bookmarks from Instapaper...`)
      const instapaperBookmarks = await instapaper.listBookmarks({ limit })
      
      console.log(`Found ${instapaperBookmarks.length} bookmarks in Instapaper`)

      // Get existing bookmarks from CMS
      const existingBookmarks = await this.getExistingBookmarks()
      const existingByInstapaperID = new Map(
        existingBookmarks.map(b => [b.instapaperID, b])
      )

      // Process each Instapaper bookmark
      for (const instapaperBookmark of instapaperBookmarks) {
        try {
          const existing = existingByInstapaperID.get(instapaperBookmark.bookmark_id.toString())
          
          if (existing) {
            // Update existing bookmark if needed
            if (forceRefresh || this.shouldUpdate(existing, instapaperBookmark)) {
              await this.updateBookmark(String(existing.id), instapaperBookmark, enrichMetadata)
              result.updated++
              console.log(`Updated bookmark: ${instapaperBookmark.title}`)
            }
          } else {
            // Create new bookmark
            await this.createBookmark(instapaperBookmark, enrichMetadata)
            result.created++
            console.log(`Created bookmark: ${instapaperBookmark.title}`)
          }
        } catch (error) {
          result.errors++
          const errorMessage = `Failed to sync bookmark ${instapaperBookmark.title}: ${error}`
          result.errorMessages.push(errorMessage)
          console.error(errorMessage)
        }
      }

      // Update sync timestamp
      await this.updateSyncTimestamp()

      result.success = result.errors === 0 || result.created > 0 || result.updated > 0
      
      console.log(`Sync completed: ${result.created} created, ${result.updated} updated, ${result.errors} errors`)
      
      return result
    } catch (error) {
      console.error('Bookmark sync failed:', error)
      result.errorMessages.push(`Sync failed: ${error}`)
      return result
    }
  }

  /**
   * Get existing bookmarks from CMS
   */
  private async getExistingBookmarks() {
    const { docs } = await this.payload.find({
      collection: 'bookmarks',
      limit: 1000, // Adjust based on expected bookmark count
      select: {
        id: true,
        instapaperID: true,
        url: true,
        title: true,
        lastSyncedAt: true,
        syncStatus: true,
      },
    })

    return docs
  }

  /**
   * Determine if a bookmark should be updated
   */
  private shouldUpdate(existing: any, instapaperBookmark: InstapaperBookmark): boolean {
    // Update if title changed
    if (existing.title !== instapaperBookmark.title) return true
    
    // Update if starred status changed
    const isStarred = instapaperBookmark.starred === '1'
    if (existing.instapaperData?.starred !== isStarred) return true
    
    // Update if progress changed significantly (more than 10%)
    const progress = instapaperBookmark.progress
    const existingProgress = existing.instapaperData?.readingProgress || 0
    if (Math.abs(progress - existingProgress) > 0.1) return true
    
    // Update if last sync was more than 24 hours ago
    const lastSync = existing.lastSyncedAt ? new Date(existing.lastSyncedAt) : new Date(0)
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    if (lastSync < dayAgo) return true

    return false
  }

  /**
   * Create a new bookmark in CMS
   */
  private async createBookmark(instapaperBookmark: InstapaperBookmark, enrichMetadata: boolean = true) {
    let metadata: ExtractedMetadata | null = null
    
    if (enrichMetadata) {
      try {
        const metadataService = getMetadataService()
        metadata = await metadataService.extractFromUrl(instapaperBookmark.url)
      } catch (error) {
        console.warn(`Failed to extract metadata for ${instapaperBookmark.url}:`, error)
      }
    }

    const bookmarkData = {
      instapaperID: instapaperBookmark.bookmark_id.toString(),
      url: instapaperBookmark.url,
      title: instapaperBookmark.title || metadata?.title || 'Untitled',
      description: instapaperBookmark.description || metadata?.description,
      
      // Instapaper data
      instapaperData: {
        starred: instapaperBookmark.starred === '1',
        readingProgress: instapaperBookmark.progress,
        addedAt: new Date(instapaperBookmark.time * 1000).toISOString(),
      },
      
      // Metadata
      metadata: metadata ? {
        host: metadata.host,
        faviconUrl: metadata.faviconUrl,
        image: metadata.image,
        author: metadata.author,
        publishDate: metadata.publishDate?.toISOString(),
        readingTime: metadata.readingTime,
        language: metadata.language,
        keywords: metadata.keywords,
      } : undefined,
      
      // Default status
      status: 'draft' as const,
      syncStatus: 'synced' as const,
      lastSyncedAt: new Date().toISOString(),
      
      // Auto-categorize based on host
      category: this.categorizeByHost(metadata?.host || new URL(instapaperBookmark.url).hostname),
    }

    return await this.payload.create({
      collection: 'bookmarks',
      data: bookmarkData,
    })
  }

  /**
   * Update an existing bookmark in CMS
   */
  private async updateBookmark(
    bookmarkId: string,
    instapaperBookmark: InstapaperBookmark,
    enrichMetadata: boolean = true
  ) {
    let metadata: ExtractedMetadata | null = null
    
    if (enrichMetadata) {
      try {
        const metadataService = getMetadataService()
        metadata = await metadataService.extractFromUrl(instapaperBookmark.url)
      } catch (error) {
        console.warn(`Failed to extract metadata for ${instapaperBookmark.url}:`, error)
      }
    }

    const updateData = {
      title: instapaperBookmark.title || metadata?.title,
      description: instapaperBookmark.description || metadata?.description,
      
      // Update Instapaper data
      instapaperData: {
        starred: instapaperBookmark.starred === '1',
        readingProgress: instapaperBookmark.progress,
        addedAt: new Date(instapaperBookmark.time * 1000).toISOString(),
      },
      
      // Update metadata if extracted
      ...(metadata && {
        metadata: {
          host: metadata.host,
          faviconUrl: metadata.faviconUrl,
          image: metadata.image,
          author: metadata.author,
          publishDate: metadata.publishDate?.toISOString(),
          readingTime: metadata.readingTime,
          language: metadata.language,
          keywords: metadata.keywords,
        },
      }),
      
      syncStatus: 'synced' as const,
      lastSyncedAt: new Date().toISOString(),
    }

    return await this.payload.update({
      collection: 'bookmarks',
      id: bookmarkId,
      data: updateData,
    })
  }

  /**
   * Auto-categorize bookmark based on hostname
   */
  private categorizeByHost(host: string): 'development' | 'design' | 'technology' | 'business' | 'personal' | 'tutorial' | 'article' | 'tool' | 'resource' | 'other' {
    const categoryMap: Record<string, 'development' | 'design' | 'technology' | 'business' | 'personal' | 'tutorial' | 'article' | 'tool' | 'resource' | 'other'> = {
      'github.com': 'development',
      'stackoverflow.com': 'development',
      'dev.to': 'development',
      'medium.com': 'article',
      'blog.': 'article',
      'dribbble.com': 'design',
      'behance.net': 'design',
      'figma.com': 'design',
      'youtube.com': 'tutorial',
      'youtu.be': 'tutorial',
      'docs.': 'resource',
      'wikipedia.org': 'resource',
    }

    for (const [pattern, category] of Object.entries(categoryMap)) {
      if (host.includes(pattern)) {
        return category
      }
    }

    return 'other'
  }

  /**
   * Add bookmark to Instapaper (for manually created bookmarks)
   */
  async addToInstapaper(bookmarkId: string): Promise<void> {
    try {
      const bookmark = await this.payload.findByID({
        collection: 'bookmarks',
        id: bookmarkId,
      })

      if (bookmark.instapaperID) {
        throw new Error('Bookmark already exists in Instapaper')
      }

      const instapaper = getInstapaperService()
      const instapaperBookmark = await instapaper.addBookmark(bookmark.url, {
        title: bookmark.title,
        description: bookmark.description || undefined,
      })

      // Update the bookmark with Instapaper ID
      await this.payload.update({
        collection: 'bookmarks',
        id: bookmarkId,
        data: {
          instapaperID: instapaperBookmark.bookmark_id.toString(),
          instapaperData: {
            starred: instapaperBookmark.starred === '1',
            readingProgress: instapaperBookmark.progress,
            addedAt: new Date(instapaperBookmark.time * 1000).toISOString(),
          },
          syncStatus: 'synced' as const,
          lastSyncedAt: new Date().toISOString(),
        },
      })

      console.log(`Added bookmark to Instapaper: ${bookmark.title}`)
    } catch (error) {
      console.error('Failed to add bookmark to Instapaper:', error)
      
      // Update sync status to error
      await this.payload.update({
        collection: 'bookmarks',
        id: bookmarkId,
        data: {
          syncStatus: 'error',
          syncError: `Failed to add to Instapaper: ${error}`,
        },
      })
      
      throw error
    }
  }

  /**
   * Get sync status and statistics
   */
  async getSyncStatus(): Promise<BookmarkSyncStatus> {
    const [totalResult, syncedResult] = await Promise.all([
      this.payload.count({ collection: 'bookmarks' }),
      this.payload.count({
        collection: 'bookmarks',
        where: { syncStatus: { equals: 'synced' } },
      }),
    ])

    // Get recent errors
    const { docs: errorBookmarks } = await this.payload.find({
      collection: 'bookmarks',
      where: { syncStatus: { equals: 'error' } },
      limit: 10,
      sort: '-updatedAt',
      select: { syncError: true, title: true },
    })

    const errors = errorBookmarks
      .map(b => `${b.title}: ${b.syncError}`)
      .filter(Boolean)

    return {
      lastSyncAt: new Date(), // TODO: Store this in global settings
      totalBookmarks: totalResult.totalDocs,
      syncedBookmarks: syncedResult.totalDocs,
      errors,
    }
  }

  /**
   * Update the last sync timestamp
   */
  private async updateSyncTimestamp(): Promise<void> {
    // TODO: Store this in site settings global
    console.log('Sync timestamp updated:', new Date().toISOString())
  }

  /**
   * Manual refresh of a single bookmark
   */
  async refreshBookmark(bookmarkId: string): Promise<void> {
    const bookmark = await this.payload.findByID({
      collection: 'bookmarks',
      id: bookmarkId,
    })

    if (!bookmark.instapaperID) {
      throw new Error('Bookmark is not synced with Instapaper')
    }

    const instapaper = getInstapaperService()
    const bookmarks = await instapaper.listBookmarks()
    const instapaperBookmark = bookmarks.find(
      b => b.bookmark_id.toString() === bookmark.instapaperID
    )

    if (!instapaperBookmark) {
      throw new Error('Bookmark not found in Instapaper')
    }

    await this.updateBookmark(bookmarkId, instapaperBookmark, true)
  }
}

/**
 * Factory function to create BookmarkSyncService
 */
export function createBookmarkSyncService(payload: Payload): BookmarkSyncService {
  return new BookmarkSyncService(payload)
}