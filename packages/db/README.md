# @repo/db

Enhanced PayloadCMS integration layer with caching, error handling, and retry logic.

## Features

- 🔧 **Dual Mode Support**: Local Payload instance or REST API
- 🚀 **Caching**: In-memory caching with configurable TTL
- 🔄 **Retry Logic**: Exponential backoff for failed requests
- ⚡ **Error Handling**: Comprehensive error types and handling
- 🎯 **Type Safety**: Full TypeScript support
- 🌍 **Environment Configuration**: Dev/staging/production configs
- 📊 **Cache Management**: Statistics and invalidation utilities

## Installation

```bash
pnpm install @repo/db
```

## Quick Start

### Local Mode (CMS App)

```typescript
import { initializePayload } from '@repo/db'
import payload from 'payload'

// Initialize with local Payload instance
initializePayload(payload, {
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000 // 5 minutes
  }
})
```

### REST Mode (Frontend Apps)

```typescript
import { initializeRestClient } from '@repo/db'

// Initialize REST client
initializeRestClient({
  apiUrl: 'https://your-cms.com',
  apiKey: process.env.PAYLOAD_API_KEY,
  environment: 'production'
})
```

## Usage

### Fetching Content

```typescript
import { getPosts, getPost, getProjects } from '@repo/db'

// Get all posts with pagination
const posts = await getPosts({
  limit: 10,
  page: 1,
  where: {
    status: 'published'
  }
})

// Get single post by ID
const post = await getPost('post-id')

// Get projects with filtering
const projects = await getProjects({
  where: {
    featured: true
  },
  sort: '-createdAt'
})
```

### Error Handling

```typescript
import { 
  getPosts, 
  PayloadError, 
  PayloadNotFoundError,
  PayloadNetworkError 
} from '@repo/db'

try {
  const posts = await getPosts()
} catch (error) {
  if (error instanceof PayloadNotFoundError) {
    console.log('Posts not found')
  } else if (error instanceof PayloadNetworkError) {
    console.log('Network error:', error.message)
  } else if (error instanceof PayloadError) {
    console.log('API error:', error.code, error.statusCode)
  }
}
```

### Cache Management

```typescript
import { invalidateCache, getCacheStats } from '@repo/db'

// Invalidate cache for specific collection
invalidateCache('posts')

// Clear all cache
invalidateCache()

// Get cache statistics
const stats = getCacheStats()
console.log(\`Cache size: \${stats.size}/\${stats.maxSize}\`)
```

## Integration Examples

### Astro (Build-time fetching)

```typescript
// src/pages/blog/index.astro
---
import { initializeRestClient, getPosts } from '@repo/db'
import Layout from '../layouts/Layout.astro'

// Initialize REST client
initializeRestClient({
  apiUrl: import.meta.env.PAYLOAD_API_URL,
  environment: 'production'
})

// Fetch posts at build time
const posts = await getPosts({
  limit: 10,
  where: { status: 'published' }
})
---

<Layout title="Blog">
  <div class="posts">
    {posts.docs.map(post => (
      <article>
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
        <a href={\`/blog/\${post.slug}\`}>Read more</a>
      </article>
    ))}
  </div>
</Layout>
```

### Next.js App Router (SSR/SSG)

```typescript
// app/blog/page.tsx
import { initializeRestClient, getPosts } from '@repo/db'

// Initialize client
initializeRestClient({
  apiUrl: process.env.PAYLOAD_API_URL!,
  apiKey: process.env.PAYLOAD_API_KEY,
  environment: process.env.NODE_ENV as any
})

export default async function BlogPage() {
  const posts = await getPosts({
    limit: 10,
    where: { status: 'published' }
  })

  return (
    <div className="posts">
      {posts.docs.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <a href={\`/blog/\${post.slug}\`}>Read more</a>
        </article>
      ))}
    </div>
  )
}

// Optional: Enable ISR
export const revalidate = 3600 // Revalidate every hour
```

### Next.js API Routes

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { initializeRestClient, getPosts, PayloadError } from '@repo/db'

initializeRestClient({
  apiUrl: process.env.PAYLOAD_API_URL!,
  apiKey: process.env.PAYLOAD_API_KEY,
  environment: process.env.NODE_ENV as any
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    const posts = await getPosts({ limit, page })
    
    return NextResponse.json(posts)
  } catch (error) {
    if (error instanceof PayloadError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Configuration

### Environment Variables

```bash
# Required for REST mode
PAYLOAD_API_URL=https://your-cms.com
PAYLOAD_API_KEY=your-api-key

# Optional
NODE_ENV=production
```

### Configuration Options

```typescript
interface PayloadConfig {
  apiUrl: string
  apiKey?: string
  environment: 'development' | 'production' | 'staging'
  timeout?: number // Default: 10000ms
  retry?: {
    attempts: number // Default: 3
    delay: number // Default: 1000ms
    backoff?: 'linear' | 'exponential' // Default: 'exponential'
  }
  cache?: {
    enabled: boolean // Default: true
    ttl: number // Default: 5 minutes
    maxSize?: number // Default: 100
  }
}
```

## API Reference

### Core Functions

- `initializePayload(instance, config?)` - Initialize with local Payload instance
- `initializeRestClient(config)` - Initialize REST API client
- `executeWithRetry(fn, options?)` - Execute function with retry logic

### Content Functions

- `getPosts(query?)` - Get posts collection
- `getPost(id, depth?)` - Get single post
- `getPages(query?)` - Get pages collection
- `getPage(id, depth?)` - Get single page
- `getProjects(query?)` - Get projects collection
- `getProject(id, depth?)` - Get single project
- `getTags(query?)` - Get tags collection
- `getTag(id, depth?)` - Get single tag
- `getMedia(query?)` - Get media collection
- `getMediaItem(id, depth?)` - Get single media item

### Cache Functions

- `invalidateCache(collection?)` - Invalidate cache
- `getCacheStats()` - Get cache statistics

### Error Types

- `PayloadError` - Base error class
- `PayloadNetworkError` - Network-related errors
- `PayloadTimeoutError` - Request timeout errors
- `PayloadNotFoundError` - Resource not found errors
- `PayloadAuthError` - Authentication errors
- `PayloadValidationError` - Validation errors

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Type checking
pnpm check-types

# Watch mode
pnpm dev
```
