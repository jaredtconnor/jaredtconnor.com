import React from 'react';
import { cn } from '../utils/cn';

interface TechBadgeProps {
  tech: string;
  variant?: 'default' | 'accent';
}

interface ProjectCardProps {
  title: string;
  description: string;
  technologies?: string[];
  href?: string;
  external?: boolean;
  featured?: boolean;
  className?: string;
}

interface ProjectShowcaseProps {
  children: React.ReactNode;
  className?: string;
  layout?: 'grid' | 'list';
}

function TechBadge({ tech, variant = 'default' }: TechBadgeProps) {
  const variants = {
    default: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    accent: "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors",
      variants[variant]
    )}>
      {tech}
    </span>
  );
}

export function ProjectCard({ 
  title, 
  description, 
  technologies = [], 
  href, 
  external = false, 
  featured = false,
  className 
}: ProjectCardProps) {
  const CardWrapper = href ? 'a' : 'div';
  const cardProps = href ? {
    href,
    target: external ? '_blank' : undefined,
    rel: external ? 'noopener noreferrer' : undefined,
  } : {};

  return (
    <CardWrapper
      {...cardProps}
      className={cn(
        "group relative block p-6 rounded-xl border transition-all duration-300",
        "hover:border-primary-300 dark:hover:border-primary-600",
        "hover:shadow-lg hover:shadow-primary-500/10 dark:hover:shadow-primary-400/10",
        featured 
          ? "bg-gradient-to-br from-primary-50 to-white dark:from-primary-950/50 dark:to-gray-900 border-primary-200 dark:border-primary-800" 
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
        "hover:-translate-y-1 active:translate-y-0",
        className
      )}
    >
      {featured && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full animate-float" />
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex items-center gap-2">
            {title}
            {external && (
              <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            )}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((tech, index) => (
              <TechBadge 
                key={tech} 
                tech={tech} 
                variant={featured && index === 0 ? 'accent' : 'default'} 
              />
            ))}
          </div>
        )}
      </div>
    </CardWrapper>
  );
}

export function ProjectShowcase({ children, className, layout = 'grid' }: ProjectShowcaseProps) {
  const layoutClasses = {
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    list: "space-y-4"
  };

  return (
    <div className={cn(layoutClasses[layout], className)}>
      {children}
    </div>
  );
}

// Helper component for easier usage with data arrays
interface ProjectGridProps {
  projects: Array<{
    title: string;
    description: string;
    technologies?: string[];
    href?: string;
    external?: boolean;
    featured?: boolean;
  }>;
  layout?: 'grid' | 'list';
  className?: string;
}

export function ProjectGrid({ projects, layout = 'grid', className }: ProjectGridProps) {
  return (
    <ProjectShowcase layout={layout} className={className}>
      {projects.map((project, index) => (
        <ProjectCard
          key={`${project.title}-${index}`}
          title={project.title}
          description={project.description}
          technologies={project.technologies}
          href={project.href}
          external={project.external}
          featured={project.featured}
        />
      ))}
    </ProjectShowcase>
  );
}

export type { ProjectCardProps, ProjectShowcaseProps, ProjectGridProps, TechBadgeProps };