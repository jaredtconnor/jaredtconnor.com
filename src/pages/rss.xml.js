
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function get(context) {

  const allPosts = await getCollection('blog', (post) => {
    return post;
  });

  const sortedPosts = allPosts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const posts = sortedPosts

  return rss({
    xmlns: { h: 'http://www.w3.org/TR/html4/' },
    title: 'my title',
    description: 'my description',
    site: context.site,
    customData: '<language>en-us</language>',
    items: posts.map((post) => ({
      title: `Post ${post.data.id}`,
      pubDate: post.data.date,
      description:
        post.data.description || post.data.excerpt || post.data.content || '',
      link: `/post/${post.data.id}/`,
    })),
  });
}
