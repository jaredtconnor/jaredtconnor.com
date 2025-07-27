import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPost, getPosts, getSiteSettings } from '@repo/db'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  try {
    const { initializeRestClient } = await import('@repo/db')
    initializeRestClient({
      apiUrl: process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000/api',
      environment: 'development',
      cache: {
        enabled: true,
        ttl: 5 * 60 * 1000,
        maxSize: 100,
      },
      timeout: 10000,
      retry: {
        attempts: 3,
        delay: 1000,
        backoff: 'exponential'
      },
    })

    const postsResponse = await getPosts({
      where: { status: { equals: 'published' } },
      limit: 100
    })

    return postsResponse.docs.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

export default async function BlogPost({ params }: PageProps) {
  // Initialize CMS client
  try {
    const { initializeRestClient } = await import('@repo/db')
    initializeRestClient({
      apiUrl: process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000/api',
      environment: 'development',
      cache: {
        enabled: true,
        ttl: 5 * 60 * 1000,
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

  // Fetch post and site settings
  let post = null
  let siteSettings = null

  try {
    const postsResponse = await getPosts({
      where: { slug: { equals: params.slug } },
      limit: 1
    })
    post = postsResponse.docs[0] || null
    siteSettings = await getSiteSettings()
  } catch (error) {
    console.error('Failed to fetch post:', error)
  }

  if (!post) {
    notFound()
  }

  const siteName = siteSettings?.siteName || 'Jared Connor'

  // Simple rich text processing for Lexical content
  const processRichText = (richText: any): string => {
    if (!richText || !richText.root) return ''
    
    try {
      return extractTextFromLexical(richText.root)
    } catch (error) {
      console.error('Error processing rich text:', error)
      return ''
    }
  }

  const extractTextFromLexical = (node: any): string => {
    if (!node || !node.children) return ''
    
    return node.children.map((child: any) => {
      if (child.type === 'text') {
        return child.text || ''
      } else if (child.type === 'paragraph') {
        return `<p class="mb-4">${extractTextFromLexical(child)}</p>`
      } else if (child.type === 'heading') {
        const level = child.tag || 'h2'
        const classes = level === 'h1' ? 'text-3xl font-bold mb-6 mt-8' :
                       level === 'h2' ? 'text-2xl font-bold mb-4 mt-6' :
                       level === 'h3' ? 'text-xl font-bold mb-3 mt-5' :
                       'text-lg font-bold mb-2 mt-4'
        return `<${level} class="${classes} text-slate-900 dark:text-slate-100">${extractTextFromLexical(child)}</${level}>`
      } else if (child.type === 'list') {
        const tag = child.listType === 'number' ? 'ol' : 'ul'
        const classes = child.listType === 'number' ? 'list-decimal list-inside mb-4 space-y-1' : 'list-disc list-inside mb-4 space-y-1'
        return `<${tag} class="${classes}">${extractTextFromLexical(child)}</${tag}>`
      } else if (child.type === 'listitem') {
        return `<li class="text-slate-600 dark:text-slate-400">${extractTextFromLexical(child)}</li>`
      } else if (child.type === 'quote') {
        return `<blockquote class="border-l-4 border-blue-500 pl-4 italic mb-4 text-slate-600 dark:text-slate-400">${extractTextFromLexical(child)}</blockquote>`
      } else if (child.children) {
        return extractTextFromLexical(child)
      }
      return ''
    }).join('')
  }

  const processedContent = processRichText(post.content)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <header className="mb-12">
          <nav className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              ← Back to Blog
            </Link>
          </nav>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
            <div className="mb-6">
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
                    {post.tags.map((tag) => (
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
              
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                  {post.excerpt}
                </p>
              )}
              
              {post.author && (
                <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">by</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {post.author.name || post.author.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <article className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
            {processedContent ? (
              <div 
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Content is being processed...
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  If this persists, the post content may need to be published in the CMS.
                </p>
              </div>
            )}
          </article>
        </main>

        {/* Footer */}
        <footer className="mt-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Thanks for Reading!
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Want to discuss this post or have questions? Feel free to reach out.
                </p>
              </div>
              <div className="flex gap-4">
                <Link 
                  href="/" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  More Posts
                </Link>
                <a
                  href="mailto:jaredconnor301@gmail.com"
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              {siteSettings?.copyrightText || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}