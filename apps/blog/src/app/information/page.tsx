import { Metadata } from 'next'
import { ListDetailView } from '@/components/Layouts/ListDetailView'

export const metadata: Metadata = {
  title: 'Information',
  description: 'Resources, guides, and useful information collected over time.',
}

// Mock information data - replace with Payload CMS integration later
const mockInformation = [
  {
    id: 1,
    title: 'Developer Setup Guide',
    description: 'A comprehensive guide for setting up a modern development environment with essential tools and configurations.',
    category: 'Development',
    date: '2024-08-10',
    url: '#',
    featured: true
  },
  {
    id: 2,
    title: 'Design System Resources',
    description: 'Collection of design system examples, tools, and best practices for building scalable design systems.',
    category: 'Design',
    date: '2024-08-08',
    url: '#',
    featured: true
  },
  {
    id: 3,
    title: 'React Performance Tips',
    description: 'Essential techniques and patterns for optimizing React applications for better performance and user experience.',
    category: 'Development',
    date: '2024-08-05',
    url: '#',
    featured: false
  },
  {
    id: 4,
    title: 'Typography Guidelines',
    description: 'Best practices for web typography including font selection, spacing, and hierarchy principles.',
    category: 'Design',
    date: '2024-08-03',
    url: '#',
    featured: false
  },
  {
    id: 5,
    title: 'API Design Principles',
    description: 'Guidelines for designing RESTful APIs that are scalable, maintainable, and developer-friendly.',
    category: 'Backend',
    date: '2024-08-01',
    url: '#',
    featured: false
  },
  {
    id: 6,
    title: 'Accessibility Checklist',
    description: 'A comprehensive checklist for ensuring web applications are accessible to all users.',
    category: 'Development',
    date: '2024-07-28',
    url: '#',
    featured: true
  },
  {
    id: 7,
    title: 'Database Optimization',
    description: 'Strategies for optimizing database queries and improving application performance.',
    category: 'Backend',
    date: '2024-07-25',
    url: '#',
    featured: false
  }
]

const categoryColors = {
  'Development': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Design': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Backend': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'General': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
}

function InformationListItem({ item, active = false }: { item: typeof mockInformation[0], active?: boolean }) {
  return (
    <a
      href={item.url}
      className={`flex space-x-3 border-b border-gray-100 py-3 px-3.5 text-sm dark:border-gray-900 lg:rounded-lg lg:border-none lg:py-2 ${
        active 
          ? 'bg-black text-white hover:bg-black hover:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'
          : 'sm:hover:bg-gray-200 sm:dark:hover:bg-gray-800'
      }`}
    >
      <div className="flex flex-col justify-center space-y-1 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="font-medium line-clamp-2 text-gray-1000 dark:text-gray-100">
            {item.title}
          </div>
          {item.featured && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500 flex-shrink-0">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          )}
        </div>
        
        {item.description && (
          <div className="line-clamp-2 text-gray-700 dark:text-gray-300 text-xs mb-2">
            {item.description}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[item.category as keyof typeof categoryColors] || categoryColors['General']}`}>
              {item.category}
            </span>
          </div>
          <div className="line-clamp-1 text-gray-1000 text-opacity-40 dark:text-white dark:text-opacity-60 text-xs">
            {new Date(item.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </a>
  )
}

function InformationList() {
  const featuredItems = mockInformation.filter(item => item.featured)
  const regularItems = mockInformation.filter(item => !item.featured)

  return (
    <div className="relative h-full max-h-screen min-h-screen w-full flex-none overflow-y-auto border-r border-gray-150 bg-white dark:border-gray-800 dark:bg-gray-900 lg:w-80 lg:bg-gray-50 lg:dark:bg-gray-900 xl:w-96">
      <div className="sticky top-0 z-10 flex flex-col justify-center px-3 py-2 bg-white dark:bg-gray-900 border-b border-gray-150 dark:border-gray-800" style={{minHeight: '48px'}}>
        <div className="flex items-center justify-between flex-none">
          <h2 className="text-sm font-bold text-primary transform-gpu line-clamp-1">
            Information
          </h2>
        </div>
      </div>
      <div className="lg:space-y-1 lg:p-3">
        {/* Featured Section */}
        {featuredItems.length > 0 && (
          <>
            <div className="px-3.5 py-2 text-xs font-semibold text-gray-1000 text-opacity-40 dark:text-white lg:px-2">
              FEATURED
            </div>
            {featuredItems.map((item) => (
              <InformationListItem 
                key={item.id} 
                item={item}
              />
            ))}
          </>
        )}
        
        {/* Regular Items Section */}
        {regularItems.length > 0 && (
          <>
            {featuredItems.length > 0 && (
              <div className="px-3.5 py-2 text-xs font-semibold text-gray-1000 text-opacity-40 dark:text-white lg:px-2 pt-5">
                ALL RESOURCES
              </div>
            )}
            {regularItems.map((item) => (
              <InformationListItem 
                key={item.id} 
                item={item}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default function InformationPage() {
  return (
    <div className="bg-dots min-h-screen w-full">
      <ListDetailView
        list={<InformationList />}
        hasDetail={false}
        detail={null}
      />
    </div>
  )
}