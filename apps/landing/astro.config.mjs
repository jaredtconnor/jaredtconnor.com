import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://astro-nano-demo.vercel.app",
  integrations: [mdx(), react(), sitemap(), tailwind()],
  redirects: {
    '/blog': 'http://localhost:3001',
    '/blog/*': 'http://localhost:3001/[...path]'
  },
  vite: {
    resolve: {
      alias: {
        "@repo/ui": new URL("../../packages/ui/src", import.meta.url).pathname,
      },
    },
  },
});
