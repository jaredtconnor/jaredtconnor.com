/**
 * API Integration Layer for Blog App
 * 
 * This module provides a type-safe, cached interface to PayloadCMS
 * with error handling and retry logic.
 */

import { Post, Page, Project, BookClipping, Note, ReadingList } from '@repo/db';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_TIMEOUT = 10000; // 10 seconds

// Error types
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Cache configuration
interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of cached items
}

const CACHE_CONFIG: Record<string, CacheConfig> = {
  posts: { ttl: 300000, maxSize: 100 }, // 5 minutes
  pages: { ttl: 600000, maxSize: 50 },  // 10 minutes
  projects: { ttl: 600000, maxSize: 50 }, // 10 minutes
  bookClippings: { ttl: 300000, maxSize: 200 }, // 5 minutes
  notes: { ttl: 180000, maxSize: 500 }, // 3 minutes
  readingLists: { ttl: 600000, maxSize: 20 }, // 10 minutes
};

// Simple in-memory cache implementation
class SimpleCache<T> {
  private cache = new Map<string, { data: T; timestamp: number }>();
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key: string, data: T): void {
    // Evict oldest items if cache is full
    if (this.cache.size >= this.config.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Create cache instances
const caches = {
  posts: new SimpleCache<Post[]>(CACHE_CONFIG.posts),
  post: new SimpleCache<Post>(CACHE_CONFIG.posts),
  pages: new SimpleCache<Page[]>(CACHE_CONFIG.pages),
  page: new SimpleCache<Page>(CACHE_CONFIG.pages),
  projects: new SimpleCache<Project[]>(CACHE_CONFIG.projects),
  project: new SimpleCache<Project>(CACHE_CONFIG.projects),
  bookClippings: new SimpleCache<BookClipping[]>(CACHE_CONFIG.bookClippings),
  bookClipping: new SimpleCache<BookClipping>(CACHE_CONFIG.bookClippings),
  notes: new SimpleCache<Note[]>(CACHE_CONFIG.notes),
  note: new SimpleCache<Note>(CACHE_CONFIG.notes),
  readingLists: new SimpleCache<ReadingList[]>(CACHE_CONFIG.readingLists),
  readingList: new SimpleCache<ReadingList>(CACHE_CONFIG.readingLists),
};

// HTTP client with retry logic
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new APIError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (retries > 0 && error instanceof APIError && error.status !== 404) {
      // Exponential backoff
      const delay = Math.pow(2, 3 - retries) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1);
    }

    throw error;
  }
}

// API response wrapper
interface APIResponse<T> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
}

// Generic fetch function
async function fetchFromAPI<T>(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<APIResponse<T>> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const url = `${API_BASE_URL}/api/${endpoint}?${searchParams.toString()}`;
  
  try {
    const response = await fetchWithRetry(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// Posts API
export const postsAPI = {
  async getAll(params: {
    limit?: number;
    page?: number;
    where?: any;
    sort?: string;
  } = {}): Promise<Post[]> {
    const cacheKey = `posts-${JSON.stringify(params)}`;
    const cached = caches.posts.get(cacheKey);
    if (cached) return cached;

    const response = await fetchFromAPI<Post>('posts', params);
    const posts = response.docs;
    
    caches.posts.set(cacheKey, posts);
    return posts;
  },

  async getBySlug(slug: string): Promise<Post | null> {
    const cacheKey = `post-${slug}`;
    const cached = caches.post.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetchFromAPI<Post>('posts', {
        where: { slug: { equals: slug } },
        limit: 1
      });
      
      const post = response.docs[0] || null;
      if (post) {
        caches.post.set(cacheKey, post);
      }
      
      return post;
    } catch (error) {
      if (error instanceof APIError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async getFeatured(): Promise<Post[]> {
    return this.getAll({
      where: { featured: { equals: true } },
      sort: '-publishedAt',
      limit: 6
    });
  },

  async getRecent(limit = 5): Promise<Post[]> {
    return this.getAll({
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit
    });
  }
};

// Book Clippings API
export const bookClippingsAPI = {
  async getAll(params: {
    limit?: number;
    page?: number;
    where?: any;
    sort?: string;
  } = {}): Promise<BookClipping[]> {
    const cacheKey = `bookClippings-${JSON.stringify(params)}`;
    const cached = caches.bookClippings.get(cacheKey);
    if (cached) return cached;

    const response = await fetchFromAPI<BookClipping>('book-clippings', params);
    const clippings = response.docs;
    
    caches.bookClippings.set(cacheKey, clippings);
    return clippings;
  },

  async getRecent(limit = 4): Promise<BookClipping[]> {
    return this.getAll({
      where: { status: { equals: 'public' } },
      sort: '-dateAdded',
      limit
    });
  },

  async getByBook(bookTitle: string): Promise<BookClipping[]> {
    return this.getAll({
      where: { bookTitle: { contains: bookTitle } },
      sort: 'pageNumber'
    });
  }
};

// Notes API (Digital Garden)
export const notesAPI = {
  async getAll(params: {
    limit?: number;
    page?: number;
    where?: any;
    sort?: string;
  } = {}): Promise<Note[]> {
    const cacheKey = `notes-${JSON.stringify(params)}`;
    const cached = caches.notes.get(cacheKey);
    if (cached) return cached;

    const response = await fetchFromAPI<Note>('notes', params);
    const notes = response.docs;
    
    caches.notes.set(cacheKey, notes);
    return notes;
  },

  async getBySlug(slug: string): Promise<Note | null> {
    const cacheKey = `note-${slug}`;
    const cached = caches.note.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetchFromAPI<Note>('notes', {
        where: { slug: { equals: slug } },
        limit: 1
      });
      
      const note = response.docs[0] || null;
      if (note) {
        caches.note.set(cacheKey, note);
      }
      
      return note;
    } catch (error) {
      if (error instanceof APIError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async getByMaturity(maturity: 'seedling' | 'budding' | 'evergreen'): Promise<Note[]> {
    return this.getAll({
      where: { 
        maturity: { equals: maturity },
        status: { equals: 'public' }
      },
      sort: '-lastModified'
    });
  },

  async getConnected(noteId: string): Promise<Note[]> {
    // This would need custom endpoint for backlinks/forwardlinks
    return this.getAll({
      where: {
        or: [
          { backlinks: { in: [noteId] } },
          { forwardLinks: { in: [noteId] } }
        ]
      }
    });
  }
};

// Reading Lists API
export const readingListsAPI = {
  async getAll(): Promise<ReadingList[]> {
    const cacheKey = 'readingLists-all';
    const cached = caches.readingLists.get(cacheKey);
    if (cached) return cached;

    const response = await fetchFromAPI<ReadingList>('reading-lists', {
      where: { isPublic: { equals: true } },
      sort: '-updatedAt'
    });
    const lists = response.docs;
    
    caches.readingLists.set(cacheKey, lists);
    return lists;
  },

  async getBySlug(slug: string): Promise<ReadingList | null> {
    const cacheKey = `readingList-${slug}`;
    const cached = caches.readingList.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetchFromAPI<ReadingList>('reading-lists', {
        where: { slug: { equals: slug } },
        limit: 1
      });
      
      const list = response.docs[0] || null;
      if (list) {
        caches.readingList.set(cacheKey, list);
      }
      
      return list;
    } catch (error) {
      if (error instanceof APIError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }
};

// Utility functions
export const apiUtils = {
  // Clear all caches
  clearCache(): void {
    Object.values(caches).forEach(cache => cache.clear());
  },

  // Get cache statistics
  getCacheStats(): Record<string, number> {
    return Object.entries(caches).reduce((stats, [key, cache]) => {
      stats[key] = cache.size();
      return stats;
    }, {} as Record<string, number>);
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
};

// Export all APIs
export const api = {
  posts: postsAPI,
  bookClippings: bookClippingsAPI,
  notes: notesAPI,
  readingLists: readingListsAPI,
  utils: apiUtils
};

export default api;