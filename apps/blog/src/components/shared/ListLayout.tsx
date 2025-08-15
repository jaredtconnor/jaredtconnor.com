import { ListDetailView } from '@/components/Layouts'
import { Detail } from '@/components/ListDetail/Detail'

interface ListLayoutProps {
  children: React.ReactNode
  'data-cy'?: string
}

export function ListLayout({ children, 'data-cy': dataCy }: ListLayoutProps) {
  return (
    <ListDetailView 
      list={null} 
      hasDetail 
      detail={
        <Detail.Container data-cy={dataCy}>
          <Detail.ContentContainer>
            {children}
          </Detail.ContentContainer>
        </Detail.Container>
      }
    />
  )
}