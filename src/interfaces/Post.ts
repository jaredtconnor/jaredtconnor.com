import type Author from './Author'
import type Tag from "./Tag"

export default interface Post {

  id: number
  attributes: {
    Title: string
    Excerpt: string
    Published: boolean
    Published_date: string
    content: string
    slug: string
    Author: {data: Author[] };
    Tags: {data: Tag[]};
  }
}
