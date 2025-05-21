/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class', // For dark mode toggle
    theme: {
      extend: {
        colors: {
          primary: '#3490dc',
          secondary: '#ffed4a',
          dark: '#121212',
        },
        typography: {
          DEFAULT: {
            css: {
              maxWidth: '65ch',
              color: 'inherit',
              a: {
                color: 'var(--tw-prose-links)',
                textDecoration: 'underline',
                fontWeight: '500',
              },
              // Add other typography customizations here
            },
          },
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'), // For blog content styling
    ],
  }