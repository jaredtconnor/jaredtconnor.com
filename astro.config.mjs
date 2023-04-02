import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://jaredtconnor.com",
  integrations: [tailwind({
    // Providing custom path to tailwind config
    config: { path: "./tailwind.config.cjs" }
  })]
});
