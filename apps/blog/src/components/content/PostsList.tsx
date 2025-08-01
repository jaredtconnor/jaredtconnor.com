'use client'

import React from 'react'
import Link from 'next/link'
import { type Post } from '@repo/db'
import { cn } from '@/lib/utils'

interface PostsListProps {
  posts: Post[]
  className?: string
}

export function PostsList({ posts, className }: PostsListProps) {
  if (posts.length === 0) {
    return (
      <div className={cn('p-8', className)}>
        <div className="text-center space-y-4">
          <div className="text-gray-400 dark:text-gray-600">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">No posts yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Posts will appear here once published.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('divide-y divide-gray-200 dark:divide-gray-800', className)}>
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </div>
  )
}

interface PostListItemProps {
  post: Post
}

function PostListItem({ post }: PostListItemProps) {
  return (
    <Link href={`/writing/${post.slug}`} className="block hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <article className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {post.title}
          </h3>
          {post.publishedDate && (
            <time 
              dateTime={post.publishedDate}
              className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4"
            >
              {new Date(post.publishedDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          )}
        </div>

        {post.excerpt && (
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag.id}
                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              >
                {tag.name}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </article>
    </Link>
  )
}