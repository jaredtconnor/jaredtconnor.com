import { Metadata } from 'next'
import { ListDetailView } from '@/components/Layouts/ListDetailView'
import { getBookmarks } from '@/lib/payload'
import type { Bookmark } from '@repo/db'

export const metadata: Metadata = {
  title: 'Bookmarks',
  description: 'A collection of interesting links and resources I\'ve saved.',
}


function BookmarksListItem({ bookmark, active = false }: { bookmark: Bookmark, active?: boolean }) {
  const host = bookmark.metadata?.host || new URL(bookmark.url).hostname
  const faviconUrl = bookmark.metadata?.faviconUrl || `https://${host}/favicon.ico`
  
  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex space-x-3 border-b border-gray-100 py-3 px-3.5 text-sm dark:border-gray-900 lg:rounded-lg lg:border-none lg:py-2 ${
        active 
          ? 'bg-black text-white hover:bg-black hover:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'
          : 'sm:hover:bg-gray-200 sm:dark:hover:bg-gray-800'
      }`}
    >
      {/* Favicon */}
      <div className="flex-shrink-0 pt-1">
        <img 
          src={faviconUrl} 
          alt={`${host} favicon`}
          className="w-4 h-4 rounded-sm"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
      
      <div className="flex flex-col justify-center space-y-1 flex-1 min-w-0">
        <div className="font-medium line-clamp-3 text-gray-1000 dark:text-gray-100">
          {bookmark.title}
          {bookmark.featured && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Featured
            </span>
          )}
        </div>
        
        {bookmark.description && (
          <div className="line-clamp-2 text-gray-700 dark:text-gray-300 text-xs">
            {bookmark.description}
          </div>
        )}
        
        {bookmark.publicNote && (
          <div className="line-clamp-2 text-gray-600 dark:text-gray-400 text-xs italic border-l-2 border-gray-200 dark:border-gray-700 pl-2">
            {/* Simple text extraction from rich text - you may want to improve this */}
            {JSON.stringify(bookmark.publicNote).replace(/[{}"\[\]]/g, '').substring(0, 150)}...
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-1000 text-opacity-40 dark:text-white dark:text-opacity-60">
            <span className="text-xs">{host}</span>
            <span className="text-xs">•</span>
            <span className="text-xs">
              {new Date(bookmark.publishedAt || bookmark.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            {bookmark.metadata?.readingTime && (
              <>
                <span className="text-xs">•</span>
                <span className="text-xs">{bookmark.metadata.readingTime} min</span>
              </>
            )}
          </div>
          
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="flex gap-1">
              {bookmark.tags.slice(0, 2).map((tag) => (
                <span 
                  key={typeof tag === 'string' ? tag : tag.id}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs dark:bg-gray-800 dark:text-gray-400"
                >
                  {typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
              {bookmark.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs dark:bg-gray-800 dark:text-gray-400">
                  +{bookmark.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Category indicator */}
        {bookmark.category && (
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 capitalize">
              {bookmark.category}
            </span>
          </div>
        )}
      </div>
    </a>
  )
}

function BookmarksList({ bookmarks }: { bookmarks: Bookmark[] }) {
  return (
    <div className="relative h-full max-h-screen min-h-screen w-full flex-none overflow-y-auto border-r border-gray-150 bg-white dark:border-gray-800 dark:bg-gray-900 lg:w-80 lg:bg-gray-50 lg:dark:bg-gray-900 xl:w-96">
      <div className="sticky top-0 z-10 flex flex-col justify-center px-3 py-2 bg-white dark:bg-gray-900 border-b border-gray-150 dark:border-gray-800" style={{minHeight: '48px'}}>
        <div className="flex items-center justify-between flex-none">
          <h2 className="text-sm font-bold text-primary transform-gpu line-clamp-1">
            Bookmarks
          </h2>
        </div>
      </div>
      <div className="lg:space-y-1 lg:p-3">
        {bookmarks.length > 0 ? (
          bookmarks.map((bookmark) => (
            <BookmarksListItem 
              key={bookmark.id} 
              bookmark={bookmark}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">No bookmarks available yet.</p>
            <p className="text-xs mt-1">Connect your Instapaper account to sync bookmarks.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default async function BookmarksPage() {
  const bookmarks = await getBookmarks()

  return (
    <div className="bg-dots min-h-screen w-full">
      <ListDetailView
        list={<BookmarksList bookmarks={bookmarks} />}
        hasDetail={false}
        detail={null}
      />
    </div>
  )
}