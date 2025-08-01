import { ListDetailView } from '@/components/layouts'
import { ProjectsList } from '@/components/content'

export default function ProjectsPage() {
  return (
    <ListDetailView
      list={
        <div className="p-8">
          <ProjectsList showAll />
        </div>
      }
      hasDetail={false}
    />
  )
}