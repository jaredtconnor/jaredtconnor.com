import Link from 'next/link'
import { ListDetailView } from '@/components/layouts'
import { getPosts, type Post } from '@repo/db'

export default async function HomePage() {
  let recentPosts: Post[] = []

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
        limit: 5
      })
      recentPosts = postsResponse.docs
    } catch (error) {
      console.warn('CMS not available, showing empty recent posts:', error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <ListDetailView
      list={
        <div className="flex flex-col space-y-16 p-8 pb-16">
          {/* Me */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-1000 mb-6">Me</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                I&apos;m a developer, data engineer, and financial analyst. I build scalable systems 
                and explore the intersection of data, finance, and technology.
              </p>
              <p>
                I work with modern web technologies, distributed systems, and data pipelines. 
                I&apos;m passionate about building tools that help teams make better decisions with data.
              </p>
            </div>
          </section>

          {/* Online */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-1000 mb-6">Online</h2>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="https://github.com/jaredtconnor" 
                  className="text-gray-700 hover:text-gray-1000 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link 
                  href="https://linkedin.com/in/jaredtconnor" 
                  className="text-gray-700 hover:text-gray-1000 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link 
                  href="https://twitter.com/jaredtconnor" 
                  className="text-gray-700 hover:text-gray-1000 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </Link>
              </li>
            </ul>
          </section>

          {/* Writing */}
          {recentPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-1000 mb-6">Writing</h2>
              <ul className="space-y-4">
                {recentPosts.slice(0, 5).map((post) => (
                  <li key={post.id} className="flex justify-between items-start">
                    <Link 
                      href={`/writing/${post.slug}`}
                      className="text-gray-700 hover:text-gray-1000 transition-colors flex-1"
                    >
                      {post.title}
                    </Link>
                    {post.publishedDate && (
                      <span className="text-gray-500 text-sm ml-4 flex-shrink-0">
                        {new Date(post.publishedDate).getFullYear()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link 
                  href="/writing"
                  className="text-gray-700 hover:text-gray-1000 transition-colors"
                >
                  View all writing →
                </Link>
              </div>
            </section>
          )}

          {/* Projects */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-1000 mb-6">Projects</h2>
            <ul className="space-y-4">
              <li className="flex justify-between items-start">
                <Link 
                  href="/projects/blog-platform"
                  className="text-gray-700 hover:text-gray-1000 transition-colors flex-1"
                >
                  Personal Blog Platform
                </Link>
                <span className="text-gray-500 text-sm ml-4 flex-shrink-0">
                  2024
                </span>
              </li>
              <li className="flex justify-between items-start">
                <Link 
                  href="/projects/data-pipeline"
                  className="text-gray-700 hover:text-gray-1000 transition-colors flex-1"
                >
                  Financial Data Pipeline
                </Link>
                <span className="text-gray-500 text-sm ml-4 flex-shrink-0">
                  2023
                </span>
              </li>
              <li className="flex justify-between items-start">
                <Link 
                  href="/projects/analytics-dashboard"
                  className="text-gray-700 hover:text-gray-1000 transition-colors flex-1"
                >
                  Analytics Dashboard
                </Link>
                <span className="text-gray-500 text-sm ml-4 flex-shrink-0">
                  2023
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <Link 
                href="/projects"
                className="text-gray-700 hover:text-gray-1000 transition-colors"
              >
                View all projects →
              </Link>
            </div>
          </section>

          {/* Work */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-1000 mb-6">Work</h2>
            <ul className="space-y-4">
              <li className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-gray-700 hover:text-gray-1000 transition-colors">
                    Senior Software Engineer
                  </div>
                  <div className="text-gray-500 text-sm">
                    Building scalable data systems
                  </div>
                </div>
                <span className="text-gray-500 text-sm ml-4 flex-shrink-0">
                  2023–Present
                </span>
              </li>
              <li className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-gray-700 hover:text-gray-1000 transition-colors">
                    Data Engineer
                  </div>
                  <div className="text-gray-500 text-sm">
                    Financial data platforms
                  </div>
                </div>
                <span className="text-gray-500 text-sm ml-4 flex-shrink-0">
                  2021–2023
                </span>
              </li>
              <li className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-gray-700 hover:text-gray-1000 transition-colors">
                    Financial Analyst
                  </div>
                  <div className="text-gray-500 text-sm">
                    Investment analysis and modeling
                  </div>
                </div>
                <span className="text-gray-500 text-sm ml-4 flex-shrink-0">
                  2019–2021
                </span>
              </li>
            </ul>
          </section>
        </div>
      }
      hasDetail={false}
      detail={null}
    />
  )
}