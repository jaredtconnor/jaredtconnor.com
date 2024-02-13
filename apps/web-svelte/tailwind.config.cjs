/** @type {import('tailwindcss').Config}*/
const config = {
  // skeleton-ui: apply the dark mode class setting
  darkMode: 'class',
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    // skeleton-ui: append the path for the Skeleton NPM package and files
    require('path').join(require.resolve(
      '@skeletonlabs/skeleton'),
      '../**/*.{html,js,svelte,ts}'
    )
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // skeleton-ui: append the Skeleton plugin to the end of this list
    ...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()
  ],
};

module.exports = config;