import { cn } from '../utils'

interface PostCardProps {
  title: string
  excerpt: string
  publishedAt?: string
  readingTime?: string
  href: string
  tags?: string[]
  className?: string
  LinkComponent?: React.ComponentType<{ href: string; className?: string; children: React.ReactNode }> | string
}

export function PostCard({
  title,
  excerpt,
  publishedAt,
  readingTime,
  href,
  tags = [],
  className,
  LinkComponent = 'a'
}: PostCardProps) {
  return (
    <article className={cn('group', className)}>
      <LinkComponent href={href} className="block">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-1000 group-hover:text-gray-700 transition-colors line-clamp-2">
              {title}
            </h2>
            {publishedAt && (
              <time 
                dateTime={publishedAt}
                className="text-sm text-gray-500 ml-4 flex-shrink-0"
              >
                {new Date(publishedAt).getFullYear()}
              </time>
            )}
          </div>
          
          {excerpt && (
            <p className="text-gray-700 leading-relaxed line-clamp-3">
              {excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            {readingTime && <span>{readingTime}</span>}
            {tags.length > 0 && (
              <div className="flex gap-2">
                {tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </LinkComponent>
    </article>
  )
}
