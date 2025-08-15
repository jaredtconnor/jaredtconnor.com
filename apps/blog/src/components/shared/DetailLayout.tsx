import { ListDetailView } from '@/components/Layouts'
import { Detail } from '@/components/ListDetail/Detail'

interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode
}

export function SectionTitle({ children, ...props }: SectionTitleProps) {
  return (
    <h4
      className="col-span-2 pt-8 text-lg font-extrabold text-black dark:text-white md:pt-0 md:text-right md:text-base md:font-normal md:text-opacity-40"
      {...props}
    >
      {children}
    </h4>
  )
}

export function SectionContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="col-span-10" {...props} />
}

export function SectionContainer(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="grid items-start grid-cols-1 gap-6 md:grid-cols-12"
      {...props}
    />
  )
}

interface TableRowProps {
  internal?: boolean
  href: string
  title: string
  date?: string
  subtitle?: string
  className?: string
}

export function TableRow({
  internal = false,
  href,
  title,
  subtitle,
  date,
  className = '',
}: TableRowProps) {
  return (
    <a
      target={internal ? '_self' : '_blank'}
      rel={internal ? '' : 'noopener noreferrer'}
      href={href}
      className={`flex sm:items-center flex-col sm:flex-row gap-0.5 sm:gap-4 group ${className}`}
    >
      <strong className="line-clamp-2 font-medium text-gray-1000 group-hover:text-blue-600 group-hover:underline dark:text-gray-100 dark:group-hover:text-blue-500">
        {title}
      </strong>
      <span className="hidden sm:flex flex-1 border-t border-gray-300 border-dashed shrink dark:border-gray-800" />
      {subtitle && <span className="flex-none text-tertiary">{subtitle}</span>}
      {date && (
        <span className="flex-none font-mono text-quaternary">{date}</span>
      )}
    </a>
  )
}

interface DetailLayoutProps {
  children: React.ReactNode
  'data-cy'?: string
}

export function DetailLayout({ children, 'data-cy': dataCy }: DetailLayoutProps) {
  return (
    <ListDetailView 
      list={null} 
      hasDetail 
      detail={
        <Detail.Container data-cy={dataCy}>
          <Detail.ContentContainer>
            <div className="pb-24 sm:pt-16 space-y-8 md:space-y-16">
              {children}
            </div>
          </Detail.ContentContainer>
        </Detail.Container>
      }
    />
  )
}