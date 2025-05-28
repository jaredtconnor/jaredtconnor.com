# CLAUDE.md - Development Guidelines

## Commands
- Build: `pnpm build` (runs build across all workspaces)
- Dev: `pnpm dev` (starts dev servers for all apps)
- Lint: `pnpm lint` (runs linting across all workspaces)
- Format: `pnpm format` (formats all files with Prettier)
- Type Check: `pnpm check-types` (runs TypeScript type checking)
- Single App Dev: `pnpm --filter <app-name> dev` (e.g., `pnpm --filter blog dev`)
- Single App Test: `pnpm --filter <app-name> test` (where applicable)

## Code Style Guidelines
- TypeScript for all new code, with strict type checking
- Use ES modules with named exports (avoid default exports)
- Component naming: PascalCase for components, camelCase for functions/variables
- Import order: React/framework imports, then external libs, then internal modules, then styles
- Error handling: Use try/catch with typed error handling
- CSS: Use module.css or .scss for styling with component-scoped classnames
- State management: Use React hooks for local state, avoid global state when possible
- Comments: Document complex logic and component props
- Monorepo structure: Respect workspace boundaries and dependencies in turbo.json

## Package Manager
- Use pnpm v9.0.0+ exclusively
- Node.js v18+ required