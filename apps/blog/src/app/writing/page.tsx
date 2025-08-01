import { ListDetailView } from '@/components/layouts'
import { PostsList } from '@/components/content'
import { getPosts, type Post } from '@repo/db'

export default async function WritingPage() {
  // Initialize CMS client for server-side rendering
  try {
    const { initializeRestClient } = await import('@repo/db')
    initializeRestClient({
      apiUrl: process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000/api',
      environment: 'development',
      cache: {
        enabled: true,
        ttl: 5 * 60 * 1000, // 5 minutes
        maxSize: 100,
      },
      timeout: 10000,
      retry: {
        attempts: 3,
        delay: 1000,
        backoff: 'exponential'
      },
    })
  } catch (error) {
    console.error('Failed to initialize CMS client:', error)
  }

  // Fetch all published posts
  let posts: Post[] = []

  try {
    const postsResponse = await getPosts({
      where: { status: { equals: 'published' } },
      sort: '-publishedDate',
      limit: 50 // Reasonable limit for now
    })
    posts = postsResponse.docs
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  }

  return (
    <ListDetailView
      list={
        <div>
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Writing
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </p>
          </div>
          
          {/* Posts List */}
          <PostsList posts={posts} />
        </div>
      }
      hasDetail={false}
    />
  )
}