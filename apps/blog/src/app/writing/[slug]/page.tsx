import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPosts } from '@repo/db'
import { ListDetailView } from '@/components/layouts'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  // Skip static generation during build if CMS is not available
  if (process.env.NODE_ENV === 'production' || !process.env.NEXT_PUBLIC_PAYLOAD_API_URL) {
    return []
  }

  try {
    const { initializeRestClient } = await import('@repo/db')
    initializeRestClient({
      apiUrl: process.env.NEXT_PUBLIC_PAYLOAD_API_URL,
      environment: 'development',
      cache: {
        enabled: true,
        ttl: 5 * 60 * 1000,
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
      limit: 100
    })

    return postsResponse.docs.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.warn('CMS not available during build, skipping static generation:', error instanceof Error ? error.message : String(error))
    return []
  }
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  
  // Check if CMS is available
  if (!process.env.NEXT_PUBLIC_PAYLOAD_API_URL) {
    notFound()
  }

  // Initialize CMS client
  try {
    const { initializeRestClient } = await import('@repo/db')
    initializeRestClient({
      apiUrl: process.env.NEXT_PUBLIC_PAYLOAD_API_URL,
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
    notFound()
  }

  // Fetch post
  let post = null

  try {
    const postsResponse = await getPosts({
      where: { slug: { equals: slug } },
      limit: 1
    })
    post = postsResponse.docs[0] || null
    // siteSettings = await getSiteSettings() // Not currently used
  } catch (error) {
    console.error('Failed to fetch post:', error)
  }

  if (!post) {
    notFound()
  }

  // const siteName = siteSettings?.siteName || 'Jared Connor'

  // Simple rich text processing for Lexical content
  const processRichText = (richText: unknown): string => {
    const richTextData = richText as { root?: unknown }
    if (!richTextData || !richTextData.root) return ''
    
    try {
      return extractTextFromLexical(richTextData.root)
    } catch (error) {
      console.error('Error processing rich text:', error)
      return ''
    }
  }

  const extractTextFromLexical = (node: unknown): string => {
    const nodeData = node as { children?: unknown[] }
    if (!nodeData || !nodeData.children) return ''
    
    return nodeData.children.map((child: unknown) => {
      const childData = child as {
        type?: string
        text?: string
        tag?: string
        listType?: string
        children?: unknown[]
      }
      
      if (childData.type === 'text') {
        return childData.text || ''
      } else if (childData.type === 'paragraph') {
        return `<p class="mb-4">${extractTextFromLexical(child)}</p>`
      } else if (childData.type === 'heading') {
        const level = childData.tag || 'h2'
        const classes = level === 'h1' ? 'text-3xl font-bold mb-6 mt-8' :
                       level === 'h2' ? 'text-2xl font-bold mb-4 mt-6' :
                       level === 'h3' ? 'text-xl font-bold mb-3 mt-5' :
                       'text-lg font-bold mb-2 mt-4'
        return `<${level} class="${classes} text-slate-900 dark:text-slate-100">${extractTextFromLexical(child)}</${level}>`
      } else if (childData.type === 'list') {
        const tag = childData.listType === 'number' ? 'ol' : 'ul'
        const classes = childData.listType === 'number' ? 'list-decimal list-inside mb-4 space-y-1' : 'list-disc list-inside mb-4 space-y-1'
        return `<${tag} class="${classes}">${extractTextFromLexical(child)}</${tag}>`
      } else if (childData.type === 'listitem') {
        return `<li class="text-slate-600 dark:text-slate-400">${extractTextFromLexical(child)}</li>`
      } else if (childData.type === 'quote') {
        return `<blockquote class="border-l-4 border-blue-500 pl-4 italic mb-4 text-slate-600 dark:text-slate-400">${extractTextFromLexical(child)}</blockquote>`
      } else if (childData.children) {
        return extractTextFromLexical(child)
      }
      return ''
    }).join('')
  }

  const processedContent = processRichText(post.content)

  return (
    <ListDetailView
      list={
        <div className="p-8 space-y-8">
          {/* Header */}
          <header>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
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
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {post.excerpt}
              </p>
            )}
            
            {post.author && (
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">by</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {post.author.name || post.author.email}
                </span>
              </div>
            )}
          </header>

          {/* Content */}
          <main>
            {processedContent ? (
              <div 
                className="prose prose-gray dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Content is being processed...
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  If this persists, the post content may need to be published in the CMS.
                </p>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Thanks for reading! Have thoughts or questions?
              </p>
              <div className="flex justify-center gap-4">
                <Link 
                  href="/writing" 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  ← All posts
                </Link>
                <a
                  href="mailto:jaredconnor301@gmail.com"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Email me
                </a>
              </div>
            </div>
          </footer>
        </div>
      }
      hasDetail={false}
      detail={null}
    />
  )
}