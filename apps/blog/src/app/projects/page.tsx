import { Metadata } from 'next'
import { ListDetailView } from '@/components/Layouts/ListDetailView'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A showcase of projects I\'ve worked on, from side projects to professional work.',
}

// Mock projects data - replace with Payload CMS integration later
const mockProjects = [
  {
    id: 1,
    title: 'Blog Platform',
    description: 'A modern blog platform built with Next.js, TypeScript, and Payload CMS. Features include markdown editing, SEO optimization, and responsive design.',
    technologies: ['Next.js', 'TypeScript', 'Payload CMS', 'Tailwind CSS'],
    status: 'In Progress',
    date: '2024-08-01',
    url: null,
    github: 'https://github.com/example/blog-platform'
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
    technologies: ['React', 'Node.js', 'Socket.io', 'PostgreSQL'],
    status: 'Completed',
    date: '2024-06-15',
    url: 'https://taskmanager.example.com',
    github: 'https://github.com/example/task-manager'
  },
  {
    id: 3,
    title: 'E-commerce Dashboard',
    description: 'A comprehensive dashboard for e-commerce analytics with data visualization, sales tracking, and inventory management.',
    technologies: ['Vue.js', 'D3.js', 'Express.js', 'MongoDB'],
    status: 'Completed',
    date: '2024-04-20',
    url: 'https://dashboard.example.com',
    github: null
  },
  {
    id: 4,
    title: 'Weather Forecast Widget',
    description: 'A customizable weather widget with location-based forecasts, multiple themes, and API integration.',
    technologies: ['JavaScript', 'CSS3', 'Weather API'],
    status: 'Completed',
    date: '2024-03-10',
    url: 'https://weather.example.com',
    github: 'https://github.com/example/weather-widget'
  },
  {
    id: 5,
    title: 'Code Snippet Manager',
    description: 'A tool for developers to organize, search, and share code snippets with syntax highlighting and tagging system.',
    technologies: ['Python', 'Flask', 'SQLite', 'Prism.js'],
    status: 'Planning',
    date: '2024-08-15',
    url: null,
    github: null
  }
]

const statusColors = {
  'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Planning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'On Hold': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
}

function ProjectsListItem({ project, active = false }: { project: typeof mockProjects[0], active?: boolean }) {
  return (
    <div
      className={`border-b border-gray-100 py-3 px-3.5 text-sm dark:border-gray-900 lg:rounded-lg lg:border-none lg:py-3 ${
        active 
          ? 'bg-black text-white hover:bg-black hover:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'
          : 'sm:hover:bg-gray-200 sm:dark:hover:bg-gray-800'
      }`}
    >
      <div className="flex flex-col space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col space-y-1 flex-1">
            <div className="font-medium line-clamp-2 text-gray-1000 dark:text-gray-100">
              {project.title}
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[project.status as keyof typeof statusColors] || statusColors['Planning']}`}>
                {project.status}
              </span>
              <span className="text-gray-1000 text-opacity-40 dark:text-white dark:text-opacity-60 text-xs">
                {new Date(project.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short' 
                })}
              </span>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2 ml-4">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-1000 transition-colors p-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m7 17 10-10M17 7H7v10"/>
                </svg>
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-1000 transition-colors p-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <div className="line-clamp-3 text-gray-700 dark:text-gray-300 text-sm">
            {project.description}
          </div>
        )}

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.technologies.map((tech) => (
              <span 
                key={tech}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs dark:bg-gray-800 dark:text-gray-400"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectsList() {
  return (
    <div className="relative h-full max-h-screen min-h-screen w-full flex-none overflow-y-auto border-r border-gray-150 bg-white dark:border-gray-800 dark:bg-gray-900 lg:w-80 lg:bg-gray-50 lg:dark:bg-gray-900 xl:w-96">
      <div className="sticky top-0 z-10 flex flex-col justify-center px-3 py-2 bg-white dark:bg-gray-900 border-b border-gray-150 dark:border-gray-800" style={{minHeight: '48px'}}>
        <div className="flex items-center justify-between flex-none">
          <h2 className="text-sm font-bold text-primary transform-gpu line-clamp-1">
            Projects
          </h2>
        </div>
      </div>
      <div className="lg:space-y-1 lg:p-3">
        {mockProjects.map((project) => (
          <ProjectsListItem 
            key={project.id} 
            project={project}
          />
        ))}
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <div className="bg-dots min-h-screen w-full">
      <ListDetailView
        list={<ProjectsList />}
        hasDetail={false}
        detail={null}
      />
    </div>
  )
}