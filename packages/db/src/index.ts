import { 
  getPayload, 
  isPayloadInitialized, 
  isClientInitialized,
  getClientConfig,
  getCache,
  executeWithRetry,
  restRequest
} from './client.js'
import type { 
  Post, 
  Page, 
  Project, 
  Tag, 
  User, 
  Media,
  Bookmark,
  SiteSettings,
  ContentQuery,
  ContentResponse 
} from './types.js'
import { generateCacheKey, withCache } from './cache.js'
import { PayloadNotFoundError } from './errors.js'

// Re-export client functions
export { 
  initializePayload, 
  initializeRestClient,
  getPayload, 
  isPayloadInitialized,
  isClientInitialized,
  getClientConfig,
  getCache,
  executeWithRetry
} from './client.js'

// Re-export configuration
export type { PayloadConfig, ClientConfig } from './config.js'
export { createConfig, getEnvironmentConfig } from './config.js'

// Re-export cache
export { MemoryCache, defaultCache, generateCacheKey, withCache } from './cache.js'

// Re-export errors
export { 
  PayloadError, 
  PayloadNetworkError, 
  PayloadTimeoutError, 
  PayloadNotFoundError, 
  PayloadAuthError, 
  PayloadValidationError,
  isRetryableError,
  withRetry,
  withTimeout
} from './errors.js'

// Re-export types
export type {
  Post,
  Page,
  Project,
  Tag,
  User,
  Media,
  Bookmark,
  SiteSettings,
  ContentQuery,
  ContentResponse
} from './types.js'

/**
 * Content fetching utilities
 * These functions provide a consistent interface for fetching content from PayloadCMS
 * with built-in caching, error handling, and retry logic
 */

/**
 * Generic function to fetch content with caching
 */
async function fetchContent<T>(
  collection: string,
  operation: 'find' | 'findByID',
  params: any
): Promise<T> {
  const config = getClientConfig()
  
  // Generate cache key
  const cacheKey = generateCacheKey(collection, operation, params)
  
  // Try cache first if enabled
  if (config.cache?.enabled) {
    const cached = getCache().get<T>(cacheKey)
    if (cached !== null) {
      return cached
    }
  }
  
  // Execute with retry and timeout
  const result = await executeWithRetry(async () => {
    if (config.mode === 'local') {
      const payload = getPayload()
      if (operation === 'find') {
        return await payload.find({
          collection,
          ...params,
        })
      } else {
        return await payload.findByID({
          collection,
          ...params,
        })
      }
    } else {
      // REST API mode
      const endpoint = operation === 'find' 
        ? `/${collection}?${new URLSearchParams(params).toString()}`
        : `/${collection}/${params.id}?depth=${params.depth || 1}`
      
      return await restRequest(endpoint)
    }
  })
  
  // Cache the result if caching is enabled
  if (config.cache?.enabled && config.cache.ttl) {
    getCache().set(cacheKey, result, config.cache.ttl)
  }
  
  return result as T
}

export async function getPosts(query: ContentQuery = {}): Promise<ContentResponse<Post>> {
  return fetchContent<ContentResponse<Post>>('posts', 'find', query)
}

export async function getPost(id: string, depth = 1): Promise<Post | null> {
  try {
    return await fetchContent<Post>('posts', 'findByID', { id, depth })
  } catch (error) {
    if (error instanceof PayloadNotFoundError) {
      return null
    }
    throw error
  }
}

export async function getPages(query: ContentQuery = {}): Promise<ContentResponse<Page>> {
  return fetchContent<ContentResponse<Page>>('pages', 'find', query)
}

export async function getPage(id: string, depth = 1): Promise<Page | null> {
  try {
    return await fetchContent<Page>('pages', 'findByID', { id, depth })
  } catch (error) {
    if (error instanceof PayloadNotFoundError) {
      return null
    }
    throw error
  }
}

export async function getProjects(query: ContentQuery = {}): Promise<ContentResponse<Project>> {
  return fetchContent<ContentResponse<Project>>('projects', 'find', query)
}

export async function getProject(id: string, depth = 1): Promise<Project | null> {
  try {
    return await fetchContent<Project>('projects', 'findByID', { id, depth })
  } catch (error) {
    if (error instanceof PayloadNotFoundError) {
      return null
    }
    throw error
  }
}

export async function getTags(query: ContentQuery = {}): Promise<ContentResponse<Tag>> {
  return fetchContent<ContentResponse<Tag>>('tags', 'find', query)
}

export async function getTag(id: string, depth = 1): Promise<Tag | null> {
  try {
    return await fetchContent<Tag>('tags', 'findByID', { id, depth })
  } catch (error) {
    if (error instanceof PayloadNotFoundError) {
      return null
    }
    throw error
  }
}

export async function getMedia(query: ContentQuery = {}): Promise<ContentResponse<Media>> {
  return fetchContent<ContentResponse<Media>>('media', 'find', query)
}

export async function getMediaItem(id: string, depth = 1): Promise<Media | null> {
  try {
    return await fetchContent<Media>('media', 'findByID', { id, depth })
  } catch (error) {
    if (error instanceof PayloadNotFoundError) {
      return null
    }
    throw error
  }
}

export async function getBookmarks(query: ContentQuery = {}): Promise<ContentResponse<Bookmark>> {
  return fetchContent<ContentResponse<Bookmark>>('bookmarks', 'find', query)
}

export async function getBookmark(id: string, depth = 1): Promise<Bookmark | null> {
  try {
    return await fetchContent<Bookmark>('bookmarks', 'findByID', { id, depth })
  } catch (error) {
    if (error instanceof PayloadNotFoundError) {
      return null
    }
    throw error
  }
}

/**
 * Global content fetching utilities
 * These functions provide access to global site settings and configuration
 */

/**
 * Generic function to fetch global content with caching
 */
async function fetchGlobal<T>(
  globalSlug: string,
  params: any = {}
): Promise<T> {
  const config = getClientConfig()
  
  // Generate cache key
  const cacheKey = generateCacheKey(`global:${globalSlug}`, 'find', params)
  
  // Try cache first if enabled
  if (config.cache?.enabled) {
    const cached = getCache().get<T>(cacheKey)
    if (cached !== null) {
      return cached
    }
  }
  
  // Execute with retry and timeout
  const result = await executeWithRetry(async () => {
    if (config.mode === 'local') {
      const payload = getPayload()
      return await payload.findGlobal({
        slug: globalSlug,
        ...params,
      })
    } else {
      // REST API mode
      const endpoint = `/globals/${globalSlug}?depth=${params.depth || 1}`
      return await restRequest(endpoint)
    }
  })
  
  // Cache the result if caching is enabled
  if (config.cache?.enabled && config.cache.ttl) {
    getCache().set(cacheKey, result, config.cache.ttl)
  }
  
  return result as T
}

export async function getSiteSettings(depth = 2): Promise<SiteSettings | null> {
  try {
    return await fetchGlobal<SiteSettings>('settings', { depth })
  } catch (error) {
    if (error instanceof PayloadNotFoundError) {
      return null
    }
    throw error
  }
}

/**
 * Utility function to get navigation data specifically
 */
export async function getNavigation(): Promise<SiteSettings['navLinks'] | []> {
  try {
    const settings = await getSiteSettings(2)
    return settings?.navLinks || []
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return []
  }
}

/**
 * Utility function to get site info specifically
 */
export async function getSiteInfo(): Promise<Pick<SiteSettings, 'siteName' | 'siteDescription' | 'siteUrl' | 'logo' | 'favicon'> | null> {
  try {
    const settings = await getSiteSettings(1)
    if (!settings) return null
    
    return {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      siteUrl: settings.siteUrl,
      logo: settings.logo,
      favicon: settings.favicon,
    }
  } catch (error) {
    console.error('Error fetching site info:', error)
    return null
  }
}

/**
 * Utility function to get social media links specifically
 */
export async function getSocialLinks(): Promise<SiteSettings['socialLinks'] | []> {
  try {
    const settings = await getSiteSettings(1)
    return settings?.socialLinks || []
  } catch (error) {
    console.error('Error fetching social links:', error)
    return []
  }
}

/**
 * Utility function to get footer content specifically
 */
export async function getFooterContent(): Promise<Pick<SiteSettings, 'copyrightText' | 'footerLinks' | 'footerContent'> | null> {
  try {
    const settings = await getSiteSettings(1)
    if (!settings) return null
    
    return {
      copyrightText: settings.copyrightText,
      footerLinks: settings.footerLinks,
      footerContent: settings.footerContent,
    }
  } catch (error) {
    console.error('Error fetching footer content:', error)
    return null
  }
}

/**
 * Utility function to invalidate cache for a specific collection or global
 */
export function invalidateCache(collection?: string): void {
  const cache = getCache()
  
  if (collection) {
    // Remove entries for specific collection or global
    const stats = cache.getStats()
    stats.keys.forEach(key => {
      if (key.startsWith(`${collection}:`) || key.startsWith(`global:${collection}:`)) {
        cache.delete(key)
      }
    })
  } else {
    // Clear all cache
    cache.clear()
  }
}

/**
 * Utility function to invalidate cache for site settings specifically
 */
export function invalidateSiteSettingsCache(): void {
  invalidateCache('settings')
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return getCache().getStats()
}
