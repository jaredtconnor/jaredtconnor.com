const colors = require('tailwindcss/colors')

const mono = [
  'ui-monospace',
  'SFMono-Regular',
  'Menlo',
  'Monaco',
  'Consolas',
  'Liberation Mono',
  'Courier New',
  'monospace',
]

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Include UI package components
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Enhanced color palette matching our design system
        white: '#fff',
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
        gray: {
          50: "#f8fafc",
          100: "#f1f5f9",
          150: '#EEEFF2',
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
          1000: '#050505',
        },
        black: '#050505',
        // Consistent with landing page
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        accent: {
          blue: "#0ea5e9",
          purple: "#8b5cf6",
          emerald: "#10b981",
          amber: "#f59e0b",
        },
        // Keep existing brand colors for compatibility
        'design-details': '#458886',
        'design-details-light': '#EEF3F3',
        'design-details-dark': '#273F3F',
        'hacker-news': '#FF965A',
        twitter: '#479BEA',
        current: 'currentColor',
      },
      fontSize: {
        // Enhanced typography scale
        "xs": ["0.75rem", { lineHeight: "1rem" }],
        "sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "base": ["1rem", { lineHeight: "1.5rem" }],
        "lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      spacing: {
        // Extended spacing scale
        "18": "4.5rem",
        "88": "22rem",
        "112": "28rem",
        "128": "32rem",
      },
      backgroundImage: {
        // Gradient utilities
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-soft": "linear-gradient(135deg, var(--tw-gradient-stops))",
      },
      boxShadow: {
        xs: '0 1px 2px 0px rgba(0,0,0,0.03)',
        subtle: '0 4px 32px rgba(0,0,0,0.03)',
        cardHover:
          '0 4px 4.1px rgba(0, 0, 0, 0.012),0 4.9px 5.8px rgba(0, 0, 0, 0.018),0 6.3px 8.4px rgba(0, 0, 0, 0.029),0 8.8px 12.9px rgba(0, 0, 0, 0.05),0 15px 23px rgba(0, 0, 0, 0.11)',
      },
      animation: {
        modalEnter: 'modal-enter 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        // Enhanced animations
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        'modal-enter': {
          '0%': { opacity: 0, transform: 'translate(-50%, -50%) scale(.96)' },
          '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'serif'],
        mono,
      },
      maxWidth: {
        'content': '800px',
      },
      lineHeight: {
        'relaxed': '1.6',
        'loose': '1.8',
      },
      screens: {
        '3xl': '1600px',
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), 
    require('@tailwindcss/forms'),
    // Add custom utilities
    function({ addUtilities }) {
      const newUtilities = {
        ".text-gradient": {
          background: "linear-gradient(135deg, theme('colors.primary.600'), theme('colors.accent.purple'))",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
          "background-clip": "text",
        },
        ".glass": {
          background: "rgba(255, 255, 255, 0.05)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".glass-dark": {
          background: "rgba(0, 0, 0, 0.05)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
}

