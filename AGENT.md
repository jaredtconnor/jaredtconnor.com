# Agent Guide for Blog Monorepo

## Build/Test/Lint Commands
- Build all: `pnpm build`
- Dev mode: `pnpm dev`
- Lint all: `pnpm lint`
- Format code: `pnpm format`
- Type checking: `pnpm check-types`
- Run single app: `pnpm --filter <app-name> dev` (e.g., `pnpm --filter blog dev`)
- Build single app: `pnpm --filter <app-name> build`
- Lint single app: `pnpm --filter <app-name> lint`

## Code Style Guidelines
- TypeScript is used throughout the project
- Double quotes for strings with template literals allowed
- Semicolons required
- Use the import alias pattern `@/` for imports from src directory
- Follow directory-based organization for components, pages, and utils
- Error handling should use try/catch blocks with appropriate logging
- Use TailwindCSS for styling (with clsx/tailwind-merge for conditionals)
- Follow ESLint rules (varies by app - landing uses Astro, blog uses Next.js)
- Use TypeScript's strict mode (strictNullChecks enabled)