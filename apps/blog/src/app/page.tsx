import Link from 'next/link'
import { getPosts, getSiteSettings, type Post } from '@repo/db'

export default async function BlogHome() {
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

  // Fetch posts and site settings
  let posts: Post[] = []
  let siteSettings = null

  try {
    const [postsResponse, settings] = await Promise.all([
      getPosts({
        where: { status: { equals: 'published' } },
        sort: '-publishedDate',
        limit: 10
      }),
      getSiteSettings()
    ])
    posts = postsResponse.docs
    siteSettings = settings
  } catch (error) {
    console.error('Failed to fetch blog data:', error)
  }

  const siteName = siteSettings?.siteName || 'Jared Connor'
  const siteDescription = siteSettings?.siteDescription || 'Personal blog and digital garden'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-16">
          <Link href="/" className="inline-block group">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {siteName}
            </h1>
          </Link>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {siteDescription}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link 
              href="http://localhost:4321" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              ← Back to Main Site
            </Link>
            <Link 
              href="/about" 
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              About
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {posts.length > 0 ? (
            <section>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
                Latest Posts
              </h2>
              <div className="grid gap-8">
                {posts.map((post) => (
                  <article 
                    key={post.id} 
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-8">
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                        {post.publishedDate && (
                          <time dateTime={post.publishedDate}>
                            {new Date(post.publishedDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </time>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span 
                                key={tag.id}
                                className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-medium"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Link href={`/posts/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      
                      {post.excerpt && (
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Link 
                          href={`/posts/${post.slug}`}
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                          Read more →
                        </Link>
                        
                        {post.author && (
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <span>by</span>
                            <span className="font-medium">{post.author.name || post.author.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : (
            // Fallback content when no posts are available
            <section className="text-center py-16">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                  Welcome to the Blog
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  This is where I share my thoughts on technology, economics, development, and life. 
                  Posts will appear here once they're published through the CMS.
                </p>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-8 text-left">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Coming Soon:
                  </h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li>• Deep dives into modern web development</li>
                    <li>• Economic analysis and market insights</li>
                    <li>• Personal projects and technical tutorials</li>
                    <li>• Thoughts on building scalable systems</li>
                    <li>• Book notes and learning reflections</li>
                  </ul>
                </div>
                <div className="mt-8">
                  <Link 
                    href="http://localhost:3000/admin" 
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Go to CMS Admin →
                  </Link>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 dark:text-slate-400">
              {siteSettings?.copyrightText || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
            </p>
            <div className="flex gap-4">
              <Link 
                href="http://localhost:4321" 
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Main Site
              </Link>
              <Link 
                href="/rss" 
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                RSS
              </Link>
              {siteSettings?.socialLinks?.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors capitalize"
                >
                  {social.label || social.platform}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}