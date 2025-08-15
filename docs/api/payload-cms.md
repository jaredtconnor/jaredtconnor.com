# Payload CMS API Documentation

This document provides comprehensive documentation for the Payload CMS API endpoints, schemas, and integration patterns used in the Blog Monorepo project.

---

## 🔗 API Base URLs

### Environment URLs
- **Development**: `http://localhost:3001/api`
- **Production**: `https://cms.yourdomain.com/api`

### Authentication
Most API endpoints require authentication for write operations. Read operations for published content are publicly accessible.

```typescript
// Admin authentication
POST /api/users/login
Body: {
  email: string
  password: string
}
Response: {
  token: string
  user: User
}
```

---

## 📝 Posts API

### Schema
```typescript
interface Post {
  id: string
  title: string
  slug: string
  content: RichTextContent
  excerpt?: string
  featuredImage?: Media
  tags: Tag[]
  status: 'draft' | 'published'
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### Endpoints

#### Get All Posts
```http
GET /api/posts
```

**Query Parameters**:
- `limit` (number): Number of posts to return (default: 10, max: 100)
- `page` (number): Page number for pagination (default: 1)
- `sort` (string): Sort field (e.g., `-publishedAt` for desc order)
- `where[status][equals]` (string): Filter by status
- `where[tags][in]` (string): Filter by tag IDs (comma-separated)
- `depth` (number): Relationship depth to populate (default: 1)

**Example**:
```http
GET /api/posts?limit=5&where[status][equals]=published&sort=-publishedAt&depth=2
```

**Response**:
```json
{
  "docs": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Getting Started with Next.js",
      "slug": "getting-started-nextjs",
      "content": { /* RichText content */ },
      "excerpt": "Learn how to build modern web applications...",
      "featuredImage": {
        "id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "url": "/media/featured-image.jpg",
        "alt": "Next.js logo"
      },
      "tags": [
        {
          "id": "64f8a1b2c3d4e5f6a7b8c9d2",
          "name": "Next.js",
          "description": "React framework"
        }
      ],
      "status": "published",
      "publishedAt": "2024-08-14T10:00:00.000Z",
      "createdAt": "2024-08-14T09:00:00.000Z",
      "updatedAt": "2024-08-14T10:00:00.000Z"
    }
  ],
  "totalDocs": 25,
  "limit": 5,
  "totalPages": 5,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2
}
```

#### Get Single Post
```http
GET /api/posts/:id
GET /api/posts/slug/:slug
```

**Parameters**:
- `id` (string): Post ID
- `slug` (string): Post slug

**Query Parameters**:
- `depth` (number): Relationship depth (default: 1)

**Response**:
```json
{
  "id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "title": "Getting Started with Next.js",
  "slug": "getting-started-nextjs",
  "content": {
    "root": {
      "type": "root",
      "children": [
        {
          "type": "paragraph",
          "children": [
            {
              "type": "text",
              "text": "This is the post content..."
            }
          ]
        }
      ]
    }
  },
  /* ... other fields */
}
```

#### Create Post
```http
POST /api/posts
Authorization: Bearer {token}
```

**Body**:
```json
{
  "title": "New Blog Post",
  "slug": "new-blog-post",
  "content": {
    "root": {
      "type": "root",
      "children": [
        {
          "type": "paragraph",
          "children": [
            {
              "type": "text",
              "text": "Post content here..."
            }
          ]
        }
      ]
    }
  },
  "excerpt": "Brief description...",
  "tags": ["64f8a1b2c3d4e5f6a7b8c9d2"],
  "status": "draft"
}
```

#### Update Post
```http
PATCH /api/posts/:id
Authorization: Bearer {token}
```

#### Delete Post
```http
DELETE /api/posts/:id
Authorization: Bearer {token}
```

---

## 🚀 Projects API

### Schema
```typescript
interface Project {
  id: string
  title: string
  description: string
  featuredImage?: Media
  liveUrl?: string
  githubUrl?: string
  technologies: string[]
  status: 'planning' | 'in-progress' | 'completed' | 'archived'
  startDate?: Date
  completionDate?: Date
  createdAt: Date
  updatedAt: Date
}
```

### Endpoints

#### Get All Projects
```http
GET /api/projects
```

**Query Parameters**: Same as Posts API

**Example**:
```http
GET /api/projects?where[status][equals]=completed&sort=-completionDate
```

#### Get Single Project
```http
GET /api/projects/:id
```

#### Create/Update/Delete
Similar to Posts API with authentication required.

---

## 🔖 Tags API

### Schema
```typescript
interface Tag {
  id: string
  name: string
  description?: string
  color?: string
  createdAt: Date
  updatedAt: Date
}
```

### Endpoints

#### Get All Tags
```http
GET /api/tags
```

**Response**:
```json
{
  "docs": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "name": "Next.js",
      "description": "React framework for production",
      "color": "#000000"
    }
  ],
  "totalDocs": 15,
  "hasNextPage": false
}
```

---

## 📎 Media API

### Schema
```typescript
interface Media {
  id: string
  filename: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  url: string
  alt?: string
  createdAt: Date
  updatedAt: Date
}
```

### Endpoints

#### Upload Media
```http
POST /api/media
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body** (form-data):
- `file`: File upload
- `alt`: Alt text (optional)

**Response**:
```json
{
  "doc": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "filename": "image.jpg",
    "mimeType": "image/jpeg",
    "filesize": 156789,
    "width": 1200,
    "height": 800,
    "url": "/media/image.jpg",
    "alt": "Description of image"
  }
}
```

#### Get Media Files
```http
GET /api/media
```

#### Delete Media
```http
DELETE /api/media/:id
Authorization: Bearer {token}
```

---

## 🔍 Advanced Querying

### Complex Filters
```http
GET /api/posts?where[or][0][title][contains]=Next&where[or][1][content][contains]=React
```

### Population (Relationships)
```http
GET /api/posts?depth=2&populate[featuredImage]=true&populate[tags]=true
```

### Field Selection
```http
GET /api/posts?select=title,excerpt,publishedAt
```

### Sorting
```http
GET /api/posts?sort=-publishedAt,title
```

---

## 🔧 Integration Functions

### TypeScript Client Functions
```typescript
// lib/payload.ts

export interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export async function getPosts(options?: {
  limit?: number
  page?: number
  status?: 'draft' | 'published'
  tags?: string[]
}): Promise<PayloadResponse<Post>> {
  const params = new URLSearchParams()
  
  if (options?.limit) params.append('limit', options.limit.toString())
  if (options?.page) params.append('page', options.page.toString())
  if (options?.status) params.append('where[status][equals]', options.status)
  if (options?.tags?.length) {
    params.append('where[tags][in]', options.tags.join(','))
  }
  
  const response = await fetch(`${PAYLOAD_URL}/api/posts?${params}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`)
  }
  
  return response.json()
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/posts/slug/${slug}?depth=2`)
    
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Failed to fetch post: ${response.statusText}`)
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/projects?where[status][not_equals]=archived&sort=-createdAt`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.docs
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function getTags(): Promise<Tag[]> {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/tags?limit=100&sort=name`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.docs
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}
```

### React Hooks (Client-side)
```typescript
// hooks/usePayload.ts
'use client'

import { useState, useEffect } from 'react'

export function usePosts(options?: {
  status?: 'draft' | 'published'
  limit?: number
}) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const data = await getPosts(options)
        setPosts(data.docs)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [options])
  
  return { posts, loading, error }
}
```

---

## 🔒 Authentication & Permissions

### Admin Authentication
```typescript
// Login
const loginResponse = await fetch('/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password'
  })
})

const { token, user } = await loginResponse.json()

// Use token for authenticated requests
const createPostResponse = await fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(postData)
})
```

### User Roles & Permissions
```typescript
interface User {
  id: string
  email: string
  role: 'admin' | 'editor' | 'author'
  permissions: {
    posts: {
      create: boolean
      read: boolean
      update: boolean
      delete: boolean
    }
    media: {
      create: boolean
      read: boolean
      delete: boolean
    }
  }
}
```

---

## 📊 Error Handling

### Error Response Format
```json
{
  "errors": [
    {
      "message": "Validation failed",
      "field": "title",
      "value": ""
    }
  ]
}
```

### Common Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

### Error Handling in Code
```typescript
async function handlePayloadRequest<T>(
  request: () => Promise<Response>
): Promise<T> {
  try {
    const response = await request()
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new PayloadError(
        errorData.errors?.[0]?.message || 'Request failed',
        response.status,
        errorData.errors
      )
    }
    
    return response.json()
  } catch (error) {
    if (error instanceof PayloadError) {
      throw error
    }
    throw new PayloadError('Network error', 0, [])
  }
}

class PayloadError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors: any[]
  ) {
    super(message)
    this.name = 'PayloadError'
  }
}
```

---

## ⚡ Performance Optimization

### Caching Strategy
```typescript
// Cache GET requests for 5 minutes
const cachedRequest = cache(async (url: string) => {
  const response = await fetch(url)
  return response.json()
}, {
  maxAge: 5 * 60 * 1000, // 5 minutes
  staleWhileRevalidate: 10 * 60 * 1000 // 10 minutes
})
```

### Pagination Best Practices
```typescript
// Efficient pagination
async function getPaginatedPosts(page: number = 1, limit: number = 10) {
  return getPosts({
    page,
    limit,
    status: 'published'
  })
}

// Infinite scroll implementation
async function getNextPosts(after: string, limit: number = 10) {
  return fetch(`/api/posts?after=${after}&limit=${limit}`)
}
```

### Optimistic Updates
```typescript
// Optimistic UI updates
async function createPostOptimistic(postData: Partial<Post>) {
  // Immediately update UI
  const tempPost = { ...postData, id: 'temp-' + Date.now() }
  updateLocalPosts(posts => [...posts, tempPost as Post])
  
  try {
    // Make actual API request
    const newPost = await createPost(postData)
    
    // Replace temp post with real post
    updateLocalPosts(posts => 
      posts.map(p => p.id === tempPost.id ? newPost : p)
    )
  } catch (error) {
    // Remove temp post on error
    updateLocalPosts(posts => 
      posts.filter(p => p.id !== tempPost.id)
    )
    throw error
  }
}
```

---

## 🔮 Future API Enhancements

### Planned Endpoints
```typescript
// Search API
POST /api/search
Body: {
  query: string
  types: ('posts' | 'projects' | 'bookmarks')[]
  filters: {
    tags?: string[]
    dateRange?: { from: Date, to: Date }
  }
}

// Bulk operations
POST /api/posts/bulk
Body: {
  operation: 'update' | 'delete'
  ids: string[]
  data?: Partial<Post>
}

// Analytics
GET /api/analytics/posts/:id/views
GET /api/analytics/popular-content
```

### GraphQL Schema (Planned)
```graphql
type Query {
  posts(
    first: Int
    after: String
    where: PostFilters
  ): PostConnection!
  
  post(id: ID, slug: String): Post
  
  search(
    query: String!
    types: [ContentType!]
  ): SearchConnection!
}

type Mutation {
  createPost(input: PostInput!): Post!
  updatePost(id: ID!, input: PostInput!): Post!
  deletePost(id: ID!): Boolean!
}
```

---

*Last updated: August 14, 2024*