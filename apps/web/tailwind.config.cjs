const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  plugins: [
    require("@tailwindcss/typography"),
    require("postcss-color-scheme/tailwind"),
    plugin(function ({ addVariant }) {
      addVariant("color", ':root[class~="color"] &')
    }),
  ],
  darkMode: "class",
  theme: {
    extend: {

      colors: {
        bgColor: "var(--color-bgColor)",
        contentColor: "var(--color-contentColor)",
      },
      typography: {
        DEFAULT: {
          css: {
            pre: {
              color: false,
            },
            code: {
              color: false,
            },
          },
          // Set line height for styles
          lineHeight: "1.35rem",
        },
      },
    },
  },
};
