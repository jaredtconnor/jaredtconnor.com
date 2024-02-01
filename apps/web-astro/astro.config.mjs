import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";

const siteUrl =
  process.env.VERCEL_ENV === "production"
    ? "https://turbo-hybrid-astro-on-vercel.vercel.app/" // 'your.prod.domain.here'
    : "http://localhost:3000/";

console.log("siteUrl", siteUrl);

// https://astro.build/config
export default defineConfig({
  trailingSlash: "ignore",
  output: "server",
  site: siteUrl,

  publicDir: "../../public",
  vite: {
    base: "./",
  },
  integrations: [mdx(), tailwind()],
});
