import { cn } from '../utils'

interface PostMetaProps {
  publishedAt?: string
  readingTime?: string
  author?: string
  className?: string
}

export function PostMeta({
  publishedAt,
  readingTime,
  author,
  className
}: PostMetaProps) {
  const items = []
  
  if (publishedAt) {
    items.push(
      <time 
        key="published"
        dateTime={publishedAt}
        className="text-gray-500"
      >
        {new Date(publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </time>
    )
  }
  
  if (readingTime) {
    items.push(
      <span key="reading-time" className="text-gray-500">
        {readingTime}
      </span>
    )
  }
  
  if (author) {
    items.push(
      <span key="author" className="text-gray-500">
        by {author}
      </span>
    )
  }
  
  if (items.length === 0) {
    return null
  }
  
  return (
    <div className={cn('flex items-center gap-3 text-sm', className)}>
      {items.map((item, index) => (
        <span key={index}>
          {item}
          {index < items.length - 1 && (
            <span className="mx-3 text-gray-300">•</span>
          )}
        </span>
      ))}
    </div>
  )
}
