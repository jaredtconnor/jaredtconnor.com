import { getPosts, type Post } from '@repo/db'
import { DetailLayout, SectionTitle, SectionContent, SectionContainer, TableRow } from '@/components/shared/DetailLayout'

const projects = [
  {
    href: '/projects',
    title: 'Personal Blog Platform',
    subtitle: '',
    date: '2024',
    internal: true,
  },
  {
    href: '/projects',
    title: 'Financial Data Pipeline',
    subtitle: '',
    date: '2023',
    internal: true,
  },
  {
    href: '/projects',
    title: 'Analytics Dashboard',
    subtitle: '',
    date: '2023',
    internal: true,
  },
]

const workHistory = [
  {
    href: '#',
    title: 'Senior Software Engineer',
    subtitle: 'Building scalable data systems',
    date: '2023—Present',
  },
  {
    href: '#',
    title: 'Data Engineer',
    subtitle: 'Financial data platforms',
    date: '2021—23',
  },
  {
    href: '#',
    title: 'Financial Analyst',
    subtitle: 'Investment analysis and modeling',
    date: '2019—21',
  },
]

export default async function HomePage() {
  let recentPosts: Post[] = []

  // Only try to fetch posts if CMS is available
  if (process.env.NEXT_PUBLIC_PAYLOAD_API_URL) {
    try {
      const { initializeRestClient } = await import('@repo/db')
      initializeRestClient({
        apiUrl: process.env.NEXT_PUBLIC_PAYLOAD_API_URL,
        environment: 'development',
        cache: {
          enabled: true,
          ttl: 5 * 60 * 1000, // 5 minutes
          maxSize: 100,
        },
        timeout: 5000, // Reduced timeout for build
        retry: {
          attempts: 1, // Reduced retry attempts for build
          delay: 500,
          backoff: 'exponential'
        },
      })

      const postsResponse = await getPosts({
        where: { status: { equals: 'published' } },
        sort: '-publishedDate',
        limit: 5
      })
      recentPosts = postsResponse.docs
    } catch (error) {
      console.warn('CMS not available, showing empty recent posts:', error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <DetailLayout data-cy="home-intro">
      <SectionContainer>
        <SectionTitle />
        <SectionContent>
          <div className="prose text-primary">
            <p>
              Hey, I&apos;m Jared. I&apos;m a developer, data engineer, and financial analyst. 
              I build scalable systems and explore the intersection of data, finance, and technology.
            </p>
            <p>
              I work with modern web technologies, distributed systems, and data pipelines. 
              I&apos;m passionate about building tools that help teams make better decisions with data.
            </p>
          </div>
        </SectionContent>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>Online</SectionTitle>
        <SectionContent>
          <div className="flex flex-col gap-5 lg:gap-3">
            <TableRow
              href="https://github.com/jaredtconnor"
              title="GitHub"
              subtitle="Follow"
              date=""
            />
            <TableRow
              href="https://linkedin.com/in/jaredtconnor"
              title="LinkedIn"
              subtitle="Connect"
              date=""
            />
            <TableRow
              href="https://twitter.com/jaredtconnor"
              title="Twitter"
              subtitle="Follow"
              date=""
            />
          </div>
        </SectionContent>
      </SectionContainer>

      {recentPosts.length > 0 && (
        <SectionContainer>
          <SectionTitle>Writing</SectionTitle>
          <SectionContent>
            <div className="flex flex-col space-y-3">
              {recentPosts.slice(0, 5).map((post) => (
                <TableRow
                  key={post.id}
                  internal
                  href={`/writing/${post.slug}`}
                  title={post.title}
                  date={post.publishedDate ? new Date(post.publishedDate).getFullYear().toString() : undefined}
                />
              ))}
            </div>
          </SectionContent>
        </SectionContainer>
      )}

      <SectionContainer>
        <SectionTitle>Work</SectionTitle>
        <SectionContent>
          <div className="flex flex-col space-y-3">
            {workHistory.map((job) => (
              <TableRow
                href={job.href}
                title={job.title}
                subtitle={job.subtitle}
                date={job.date}
                key={job.title}
              />
            ))}
          </div>
        </SectionContent>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>Projects</SectionTitle>
        <SectionContent>
          <div className="flex flex-col gap-5 lg:gap-3">
            {projects.map((project) => (
              <TableRow
                internal={project.internal}
                href={project.href}
                title={project.title}
                subtitle={project.subtitle}
                date={project.date}
                key={project.title}
              />
            ))}
          </div>
        </SectionContent>
      </SectionContainer>
    </DetailLayout>
  )
}
