/**
 * Simple in-memory cache for API responses
 * For production apps, consider using Redis or another persistent cache
 */

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>()
  private maxSize: number
  
  constructor(maxSize = 100) {
    this.maxSize = maxSize
  }
  
  /**
   * Get an item from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }
  
  /**
   * Set an item in cache
   */
  set<T>(key: string, data: T, ttl: number): void {
    // Remove oldest entries if at max size
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }
  
  /**
   * Delete an item from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }
  
  /**
   * Clear all cached items
   */
  clear(): void {
    this.cache.clear()
  }
  
  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys())
    }
  }
  
  /**
   * Clean expired entries
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

/**
 * Default cache instance
 */
export const defaultCache = new MemoryCache()

/**
 * Generate cache key for API requests
 */
export function generateCacheKey(collection: string, operation: string, params?: Record<string, any>): string {
  const paramString = params ? JSON.stringify(params) : ''
  return `${collection}:${operation}:${paramString}`
}

/**
 * Cache decorator for async functions
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl: number,
  cache: MemoryCache = defaultCache
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args)
    
    // Try to get from cache first
    const cached = cache.get(key)
    if (cached !== null) {
      return cached
    }
    
    // Execute function and cache result
    const result = await fn(...args)
    cache.set(key, result, ttl)
    
    return result
  }) as T
}
