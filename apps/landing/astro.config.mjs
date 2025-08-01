import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

const getSiteUrl = () => {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.NODE_ENV === "production") return "https://jaredconnor.dev";
  return "http://localhost:4321";
};

const getBlogUrl = () => {
  if (process.env.NODE_ENV === "production") return "https://blog.jaredconnor.dev";
  return "http://localhost:3001";
};

export default defineConfig({
  site: getSiteUrl(),
  integrations: [mdx(), react(), sitemap(), tailwind()],
  redirects: {
    '/blog': getBlogUrl(),
    '/blog/*': `${getBlogUrl()}/[...path]`
  },
  vite: {
    resolve: {
      alias: {
        "@repo/ui": new URL("../../packages/ui/src", import.meta.url).pathname,
      },
    },
  },
});
