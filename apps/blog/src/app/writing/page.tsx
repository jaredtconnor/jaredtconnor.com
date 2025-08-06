import Link from 'next/link'
import { ListDetailView } from '@/components/layouts'
import { getPosts, type Post } from '@repo/db'

export default async function WritingPage() {
  let posts: Post[] = []

  // Only try to fetch posts if CMS is available
  if (process.env.NEXT_PUBLIC_PAYLOAD_API_URL) {
    try {
      const { initializeRestClient } = await import('@repo/db')
      initializeRestClient({
        apiUrl: process.env.NEXT_PUBLIC_PAYLOAD_API_URL,
        environment: 'development',
        cache: {
          enabled: true,
          ttl: 5 * 60 * 1000, // 5 minutes
          maxSize: 100,
        },
        timeout: 5000, // Reduced timeout for build
        retry: {
          attempts: 1, // Reduced retry attempts for build
          delay: 500,
          backoff: 'exponential'
        },
      })

      const postsResponse = await getPosts({
        where: { status: { equals: 'published' } },
        sort: '-publishedDate',
        limit: 50 // Reasonable limit for now
      })
      posts = postsResponse.docs
    } catch (error) {
      console.warn('CMS not available, showing empty posts list:', error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <ListDetailView
      list={
        <div className="flex flex-col space-y-8 p-8 pb-16">
          {/* Header */}
          <section>
            <h1 className="text-2xl font-semibold text-gray-1000 mb-6">Writing</h1>
            <p className="text-gray-700">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </p>
          </section>
          
          {/* Posts List */}
          {posts.length > 0 ? (
            <section>
              <ul className="space-y-6">
                {posts.map((post) => (
                  <li key={post.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <Link 
                        href={`/writing/${post.slug}`}
                        className="text-gray-1000 hover:text-gray-700 transition-colors flex-1 font-medium"
                      >
                        {post.title}
                      </Link>
                      {post.publishedDate && (
                        <span className="text-gray-500 text-sm ml-4 flex-shrink-0">
                          {new Date(post.publishedDate).getFullYear()}
                        </span>
                      )}
                    </div>
                    {post.excerpt && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section>
              <p className="text-gray-700">No posts available yet.</p>
            </section>
          )}
        </div>
      }
      hasDetail={false}
      detail={null}
    />
  )
}