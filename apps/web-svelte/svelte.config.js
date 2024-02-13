import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [vitePreprocess({})],

  kit: {
    adapter: adapter({
      // NOTES: [Node servers](https://kit.svelte.dev/docs/adapter-node)
      // without this build will be in apps/web/build and can be run'ed with `node build/index.js` or equivalent `node build` (assumes index file)
      // run with node ../server/dist/web/index.js fails with
      // SyntaxError: Cannot use import statement outside a module
      // apps/server/package.json change `"#type": "module"` to `"#type": "module"` and it works

      // leave commented to use default web folder `apps/web/build`
      // out: "../server/dist/web",
      precompress: true,
    }),
  },
  // inspector
  vitePlugin: {
    inspector: {
      showToggleButton: "never",
    },
  },
};

export default config;
