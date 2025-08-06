import { ListDetailView } from '@/components/layouts'
import { AboutSection } from '@/components/content'

export default function AboutPage() {
  return (
    <ListDetailView
      list={
        <div className="p-8">
          <AboutSection />
        </div>
      }
      hasDetail={false}
      detail={null}
    />
  )
}