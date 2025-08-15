import { getPost, calculateReadingTime } from '@/lib/payload'
import { PostMeta } from '@repo/ui/components'
import { RichText } from '@/components/PayloadComponents/RichText'
import { ListLayout } from '@/components/shared/ListLayout'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    notFound()
  }
  
  return (
    <ListLayout data-cy={`post-${slug}`}>
      <article className="pb-24 sm:pt-16">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-1000 mb-4 text-balance">
            {post.title}
          </h1>
          <PostMeta 
            publishedAt={post.publishedDate}
            readingTime={calculateReadingTime(post.content)}
            className="text-gray-500"
          />
        </header>
        
        <div className="prose prose-lg">
          <RichText content={post.content} />
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span 
                  key={typeof tag === 'string' ? tag : tag.id}
                  className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full"
                >
                  {typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
            </div>
          </footer>
        )}
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link 
            href="/writing"
            className="inline-flex items-center text-gray-700 hover:text-gray-1000 font-medium transition-colors"
          >
            ← Back to Writing
          </Link>
        </div>
      </article>
    </ListLayout>
  )
}
