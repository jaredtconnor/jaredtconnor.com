import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function get(context) {
  const blog = await getCollection('blog');
  return rss({
    title: 'OverIndex',
    description: 'Writings about non-indexed knowledge around economics, technology, software, and finance',
    site: context.site,
    items: blog.map((post) => ({
      link: `/blog/${post.slug}/`,
      // Note: this will not process components or JSX expressions in MDX files.
      content: sanitizeHtml(parser.render(post.body)),
      ...post.data,
    })),
  });
}

