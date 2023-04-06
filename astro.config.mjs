import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import worker, { cloudflare } from 'astro-service-worker/adapter';

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    tailwind({
      config: {
        applyBaseStyles: false,
      }
    })],
  output: 'server',
  adapter: cloudflare()
});
