
export async function getStaticPaths({ paginate, rss }) {
  const allPosts = Astro.fetchContent('./*.md');
  const sortedPosts = allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  rss({
    title: "Jared Connor| Blog",
    description: "Atomic Thougghts",
    customData: `<language>en-us</language>`,

    items: allPosts.map((item) => {

      const customData = `<guid isPermaLink="true">https://rainsberger.ca${item.url}</guid>`

      return {
        title: item.title,
        description: item.description,
        link: item.url,
        pubDate: item.date,
        customData,
      }
    }),

    dest: "/feed.xml",

  })

  return paginate(sortedPosts, { pageSize: 25 })
}
