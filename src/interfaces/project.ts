export default interface Project {

  id: number
  attributes: {
    title: string
    excerpt: string
    published: boolean
    author: string
    tags: string[]
    published_date: string
    content: string
    slug: string
  }
}
