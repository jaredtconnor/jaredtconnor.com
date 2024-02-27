const plugin = require('tailwindcss/plugin')
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  plugins: [
    require("@tailwindcss/typography"), 
    require("postcss-color-scheme/tailwind")
  ],
  theme: {
    // Remove the following screen breakpoint or add other breakpoints
    // if one breakpoint is not enough for you
    screens: {
      sm: "640px",
    },
    extend: { 
      darkMode: 'class',
      typography: {
        DEFAULT: {
          css: {

            // Override specific styles if necessary
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },

            // Ensure preformatted text is not overly styled by Tailwind
            pre: false,
            code: false, 

            // Set line height for styles
            lineHeight: '1.35rem'
          },
        },
      },
    },
  },

};
