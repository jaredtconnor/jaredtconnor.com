import { getPayload, isPayloadInitialized } from './client.js'
import type { 
  Post, 
  Page, 
  Project, 
  Tag, 
  User, 
  Media,
  ContentQuery,
  ContentResponse 
} from './types.js'

// Re-export client functions
export { initializePayload, getPayload, isPayloadInitialized } from './client.js'

// Re-export types
export type {
  Post,
  Page,
  Project,
  Tag,
  User,
  Media,
  ContentQuery,
  ContentResponse
} from './types.js'

/**
 * Content fetching utilities
 * These functions provide a consistent interface for fetching content from PayloadCMS
 */

export async function getPosts(query: ContentQuery = {}): Promise<ContentResponse<Post>> {
  const payload = getPayload()
  const result = await payload.find({
    collection: 'posts',
    ...query,
  })
  return result as unknown as ContentResponse<Post>
}

export async function getPost(id: string, depth = 1): Promise<Post | null> {
  const payload = getPayload()
  try {
    const result = await payload.findByID({
      collection: 'posts',
      id,
      depth,
    })
    return result as unknown as Post
  } catch {
    return null
  }
}

export async function getPages(query: ContentQuery = {}): Promise<ContentResponse<Page>> {
  const payload = getPayload()
  const result = await payload.find({
    collection: 'pages',
    ...query,
  })
  return result as unknown as ContentResponse<Page>
}

export async function getPage(id: string, depth = 1): Promise<Page | null> {
  const payload = getPayload()
  try {
    const result = await payload.findByID({
      collection: 'pages',
      id,
      depth,
    })
    return result as unknown as Page
  } catch {
    return null
  }
}

export async function getProjects(query: ContentQuery = {}): Promise<ContentResponse<Project>> {
  const payload = getPayload()
  const result = await payload.find({
    collection: 'projects',
    ...query,
  })
  return result as unknown as ContentResponse<Project>
}

export async function getProject(id: string, depth = 1): Promise<Project | null> {
  const payload = getPayload()
  try {
    const result = await payload.findByID({
      collection: 'projects',
      id,
      depth,
    })
    return result as unknown as Project
  } catch {
    return null
  }
}

export async function getTags(query: ContentQuery = {}): Promise<ContentResponse<Tag>> {
  const payload = getPayload()
  const result = await payload.find({
    collection: 'tags',
    ...query,
  })
  return result as unknown as ContentResponse<Tag>
}

export async function getTag(id: string, depth = 1): Promise<Tag | null> {
  const payload = getPayload()
  try {
    const result = await payload.findByID({
      collection: 'tags',
      id,
      depth,
    })
    return result as unknown as Tag
  } catch {
    return null
  }
}

export async function getMedia(query: ContentQuery = {}): Promise<ContentResponse<Media>> {
  const payload = getPayload()
  const result = await payload.find({
    collection: 'media',
    ...query,
  })
  return result as unknown as ContentResponse<Media>
}
