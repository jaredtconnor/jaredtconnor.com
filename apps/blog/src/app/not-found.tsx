import Link from 'next/link'
import { ListLayout } from '@/components/shared/ListLayout'

export default function NotFound() {
  return (
    <ListLayout data-cy="not-found-page">
      <div className="pb-24 sm:pt-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/writing"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Browse Posts
            </Link>
          </div>
        </div>
      </div>
    </ListLayout>
  )
}