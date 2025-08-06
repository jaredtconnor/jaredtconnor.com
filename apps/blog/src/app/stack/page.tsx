import { ListDetailView } from '@/components/layouts'

const techStack = {
  languages: [
    { name: 'TypeScript', description: 'Primary language for web development', experience: '3+ years' },
    { name: 'Python', description: 'Data engineering, automation, and backend systems', experience: '5+ years' },
    { name: 'C', description: 'Systems programming and performance-critical applications', experience: '2+ years' },
    { name: 'SQL', description: 'Database design and complex query optimization', experience: '6+ years' },
    { name: 'JavaScript', description: 'Frontend development and Node.js applications', experience: '4+ years' },
  ],
  
  frameworks: [
    { name: 'Next.js', description: 'Full-stack React framework for modern web apps', experience: '2+ years' },
    { name: 'React', description: 'Component-based UI development', experience: '3+ years' },
    { name: 'Flask', description: 'Lightweight Python web framework', experience: '3+ years' },
    { name: 'FastAPI', description: 'High-performance Python API development', experience: '2+ years' },
    { name: 'Astro', description: 'Static site generation with modern tooling', experience: '1+ year' },
  ],

  databases: [
    { name: 'PostgreSQL', description: 'Primary database for production applications', experience: '4+ years' },
    { name: 'MySQL', description: 'Relational database for various projects', experience: '3+ years' },
    { name: 'Redis', description: 'Caching and session storage', experience: '2+ years' },
  ],

  tools: [
    { name: 'Docker', description: 'Containerization and deployment', experience: '3+ years' },
    { name: 'Apache Airflow', description: 'Workflow orchestration for data pipelines', experience: '2+ years' },
    { name: 'Git', description: 'Version control and collaboration', experience: '6+ years' },
    { name: 'Linux/Unix', description: 'Server administration and scripting', experience: '5+ years' },
    { name: 'AWS', description: 'Cloud infrastructure and services', experience: '2+ years' },
  ],

  interests: [
    { name: 'Systems Programming', description: 'Low-level programming and performance optimization' },
    { name: 'Data Engineering', description: 'Building scalable data processing pipelines' },
    { name: 'Financial Technology', description: 'Intersection of finance and technology solutions' },
    { name: 'Web Performance', description: 'Optimizing user experience and loading times' },
    { name: 'Developer Tooling', description: 'Creating tools that improve developer productivity' },
  ]
}

export default function StackPage() {
  return (
    <ListDetailView
      list={
        <div className="p-8 space-y-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Stack
            </h1>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
              Here&apos;s an overview of the technologies I work with regularly, along with my experience 
              level and how I use them in my projects and professional work.
            </p>
          </div>

          {/* Languages */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Languages
            </h2>
            <div className="space-y-4">
              {techStack.languages.map((item, index) => (
                <StackItem key={index} item={item} />
              ))}
            </div>
          </section>

          {/* Frameworks */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Frameworks & Libraries
            </h2>
            <div className="space-y-4">
              {techStack.frameworks.map((item, index) => (
                <StackItem key={index} item={item} />
              ))}
            </div>
          </section>

          {/* Databases */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Databases
            </h2>
            <div className="space-y-4">
              {techStack.databases.map((item, index) => (
                <StackItem key={index} item={item} />
              ))}
            </div>
          </section>

          {/* Tools */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Tools & Platforms
            </h2>
            <div className="space-y-4">
              {techStack.tools.map((item, index) => (
                <StackItem key={index} item={item} />
              ))}
            </div>
          </section>

          {/* Interests */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Areas of Interest
            </h2>
            <div className="space-y-4">
              {techStack.interests.map((item, index) => (
                <StackItem key={index} item={item} showExperience={false} />
              ))}
            </div>
          </section>
        </div>
      }
      hasDetail={false}
      detail={null}
    />
  )
}

interface StackItemProps {
  item: {
    name: string
    description: string
    experience?: string
  }
  showExperience?: boolean
}

function StackItem({ item, showExperience = true }: StackItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {item.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {item.description}
        </p>
      </div>
      {showExperience && item.experience && (
        <div className="text-sm text-gray-500 dark:text-gray-500 flex-shrink-0">
          {item.experience}
        </div>
      )}
    </div>
  )
}