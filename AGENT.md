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

# MyApp Project

MyApp is a full-stack web application with TypeScript frontend and Node.js backend.
The core functionality lives in the `src/` folder, with separate client (`client/`)
and server (`server/`) components.

## Build & Commands

- Typecheck and lint everything: `pnpm check`
- Fix linting/formatting: `pnpm check:fix`
- Run tests: `pnpm test --run --no-color`
- Run single test: `pnpm test --run src/file.test.ts`
- Start development server: `pnpm dev`
- Build for production: `pnpm build`
- Preview production build: `pnpm preview`

### Development Environment

- Frontend dev server: http://localhost:3000
- Backend dev server: http://localhost:3001
- Database runs on port 5432
- Redis cache on port 6379

## Code Style

- TypeScript: Strict mode with exactOptionalPropertyTypes, noUncheckedIndexedAccess
- Tabs for indentation (2 spaces for YAML/JSON/MD)
- Single quotes, no semicolons, trailing commas
- Use JSDoc docstrings for documenting TypeScript definitions, not `//` comments
- 100 character line limit
- Imports: Use consistent-type-imports
- Use descriptive variable/function names
- In CamelCase names, use "URL" (not "Url"), "API" (not "Api"), "ID" (not "Id")
- Prefer functional programming patterns
- Use TypeScript interfaces for public APIs
- NEVER use `@ts-expect-error` or `@ts-ignore` to suppress type errors

## Testing

- Vitest for unit testing
- Testing Library for component tests
- Playwright for E2E tests
- When writing tests, do it one test case at a time
- Use `expect(VALUE).toXyz(...)` instead of storing in variables
- Omit "should" from test names (e.g., `it("validates input")` not `it("should validate input")`)
- Test files: `*.test.ts` or `*.spec.ts`
- Mock external dependencies appropriately

## Architecture

- Frontend: React with TypeScript
- Backend: Express.js with TypeScript
- Database: PostgreSQL with Prisma ORM
- State management: Zustand
- Styling: Tailwind CSS
- Build tool: Vite
- Package manager: pnpm

## Security

- Use appropriate data types that limit exposure of sensitive information
- Never commit secrets or API keys to repository
- Use environment variables for sensitive data
- Validate all user inputs on both client and server
- Use HTTPS in production
- Regular dependency updates
- Follow principle of least privilege

## Git Workflow

- ALWAYS run `pnpm check` before committing
- Fix linting errors with `pnpm check:fix`
- Run `pnpm build` to verify typecheck passes
- NEVER use `git push --force` on the main branch
- Use `git push --force-with-lease` for feature branches if needed
- Always verify current branch before force operations

## Configuration

When adding new configuration options, update all relevant places:
1. Environment variables in `.env.example`
2. Configuration schemas in `src/config/`
3. Documentation in README.md

All configuration keys use consistent naming and MUST be documented.