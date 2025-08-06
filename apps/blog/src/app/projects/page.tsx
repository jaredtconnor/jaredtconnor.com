import Link from 'next/link'
import { ListDetailView } from '@/components/layouts'

export default function ProjectsPage() {
  const projects = [
    {
      title: "Personal Blog Platform",
      description: "A full-stack blog platform built with Next.js, PayloadCMS, and deployed on AWS with SST.",
      year: "2024",
      slug: "blog-platform"
    },
    {
      title: "Financial Data Pipeline",
      description: "Real-time financial data processing system with Apache Kafka and PostgreSQL.",
      year: "2023",
      slug: "data-pipeline"
    },
    {
      title: "Analytics Dashboard",
      description: "Interactive dashboard for business intelligence and data visualization.",
      year: "2023",
      slug: "analytics-dashboard"
    },
    {
      title: "Investment Portfolio Tracker",
      description: "Personal finance app for tracking investment portfolios and market performance.",
      year: "2022",
      slug: "portfolio-tracker"
    },
    {
      title: "Task Management API",
      description: "RESTful API for task management with authentication and real-time updates.",
      year: "2022",
      slug: "task-api"
    }
  ]

  return (
    <ListDetailView
      list={
        <div className="flex flex-col space-y-8 p-8 pb-16">
          {/* Header */}
          <section>
            <h1 className="text-2xl font-semibold text-gray-1000 mb-6">Projects</h1>
            <p className="text-gray-700">
              A collection of projects I&apos;ve built over the years.
            </p>
          </section>
          
          {/* Projects List */}
          <section>
            <ul className="space-y-6">
              {projects.map((project) => (
                <li key={project.slug} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <Link 
                      href={`/projects/${project.slug}`}
                      className="text-gray-1000 hover:text-gray-700 transition-colors flex-1 font-medium"
                    >
                      {project.title}
                    </Link>
                    <span className="text-gray-500 text-sm ml-4 flex-shrink-0">
                      {project.year}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      }
      hasDetail={false}
      detail={null}
    />
  )
}