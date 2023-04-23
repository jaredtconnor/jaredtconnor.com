import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://jaredtconnor.com",
  integrations: [mdx(), tailwind({
    config: {
      applyBaseStyles: false
    }
  })],
  output: "server",
  adapter: cloudflare()
});

