import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
  plugins: [
    sveltekit(),
  ],
  server: {
    port: 3080,
    host: '0.0.0.0'
  }
};

export default config;
