import Link from 'next/link'
import { getPosts, calculateReadingTime } from '@/lib/payload'
import { PostCard } from '@repo/ui/components'
import { ListLayout } from '@/components/shared/ListLayout'

export default async function WritingPage() {
  const posts = await getPosts()

  return (
    <ListLayout data-cy="writing-page">
      <div className="pb-24 sm:pt-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-1000 dark:text-gray-100 mb-4">Writing</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Thoughts on design, development, and building products that matter.
          </p>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </div>
        </div>
        
        <div className="space-y-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt || ''}
                publishedAt={post.publishedDate}
                readingTime={calculateReadingTime(post.content)}
                href={`/writing/${post.slug}`}
                tags={post.tags?.map(tag => typeof tag === 'string' ? tag : tag.name) || []}
                LinkComponent={Link}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-700 dark:text-gray-300 text-lg">No posts available yet.</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Check back soon for new content!</p>
            </div>
          )}
        </div>
      </div>
    </ListLayout>
  )
}