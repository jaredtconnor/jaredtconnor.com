import Link from 'next/link'
import { ListDetailView } from '@/components/layouts'
import { AboutSection, ProjectsList } from '@/components/content'
import { getPosts, type Post } from '@repo/db'

export default async function HomePage() {
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

  // Fetch recent posts for preview
  let recentPosts: Post[] = []

  try {
    const postsResponse = await getPosts({
      where: { status: { equals: 'published' } },
      sort: '-publishedDate',
      limit: 5
    })
    recentPosts = postsResponse.docs
  } catch (error) {
    console.error('Failed to fetch recent posts:', error)
  }

  return (
    <ListDetailView
      list={
        <div className="p-8 space-y-12">
          {/* About Section */}
          <AboutSection />
          
          {/* Recent Posts Preview */}
          {recentPosts.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Writing
              </h3>
              <div className="space-y-3">
                {recentPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="group">
                    <Link 
                      href={`/writing/${post.slug}`}
                      className="block space-y-1"
                    >
                      <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </div>
                      {post.publishedDate && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(post.publishedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Link 
                  href="/writing"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  View all writing →
                </Link>
              </div>
            </section>
          )}

          {/* Featured Projects Preview */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Projects
            </h3>
            <ProjectsList limit={2} />
          </section>
        </div>
      }
      hasDetail={false}
    />
  )
}