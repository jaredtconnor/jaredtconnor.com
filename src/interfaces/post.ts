export default interface Post {

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
