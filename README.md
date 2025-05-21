# Full-Stack Monorepo Starter: tRPC, Next.js, Prisma & TanStack Query

A sophisticated, production-ready monorepo built with Turborepo, combining multiple Next.js applications with shared packages. This starter template provides a solid foundation for building full-stack TypeScript applications with type-safety across the entire stack.

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![tRPC](https://img.shields.io/badge/tRPC-%232596BE.svg?style=for-the-badge&logo=trpc&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)

## Features

- **Type-safe API**: End-to-end type safety with tRPC
- **Modern stack**: Next.js 15+ with App Router
- **Data management**: Efficient data fetching with TanStack Query
- **Database access**: Prisma ORM with schema migrations
- **Monorepo structure**: Optimized with Turborepo for efficient builds
- **Shared packages**: Reusable UI components, configurations, and utilities
- **Code generators**: Scaffolding tools for common patterns
- **Developer experience**: Fast builds, strict typechecking, and linting


## Repository Structure
```bash

├── apps/                  # Application directory
│   ├── backend/           # Backend application (express.js)
│   ├── docs/              # Documentation site (Next.js)
│   └── web/               # Main web application (Next.js)
├── packages/              # Shared packages
│   ├── db/                # Database package
│   ├── eslint-config/     # Shared ESLint configuration
│   ├── trpc/              # tRPC configuration
│   ├── typescript-config/ # Shared TypeScript configuration
│   └── ui/                # Shared UI components
├── .gitignore
├── .npmrc
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml    # PNPM workspace configuration
├── README.md
└── turbo.json             # Turborepo configuration
```


## Getting Started
### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- [pnpm](https://pnpm.io/) (v8 or later)
- PostgreSQL, MySQL, or SQLite database (depending on your preference)


### Installation

```bash
# Clone the repository
git clone https://github.com/Olabayoji/Starter-Monorepo-Turborepo-.git
cd your-repo-name
# Install dependencies
pnpm install
```

### Configuration

1. Set up your database connection in `.env` files:

```bash
# In packages/db/.env
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
# Or for MySQL
# DATABASE_URL="mysql://username:password@localhost:3306/mydb"
# Or for **SQLite**
# DATABASE_URL="file:./dev.db"
```
2. Initialize your database:
> **Important**: Ensure you have a running instance of your chosen database before proceeding with the configuration steps. For PostgreSQL or MySQL, make sure the database service is running on your machine or server.


```bash
# Generate Prisma client
pnpm --filter @repo/db db:generate

# Push schema to database during development
pnpm --filter @repo/db db:push

# Or run migrations for production
pnpm --filter @repo/db db:migrate
```

#### Database Exploration with Prisma Studio
To explore and manipulate your database, you can use Prisma Studio:

```bash
pnpm --filter @repo/db studio
```


### Development
```bash
# Run all applications in development mode
pnpm dev (Alternatively, use turbo dev)

# Run a specific application
pnpm --filter docs dev
pnpm --filter web dev
pnpm --filter backend dev
```
### Development servers:
- Web: http://localhost:3000
- Docs: http://localhost:3001
- Backend: http://localhost:4000

### Build
```bash
# Build all applications and packages
pnpm build

# Build a specific application or package
pnpm --filter web build
pnpm --filter docs build
```

### Lint
```bash
# Lint all applications and packages
pnpm lint

# Lint a specific application or package
pnpm --filter web lint
```

### Type Checking
```bash
# Type check all applications and packages
pnpm check-types

# Type check a specific application or package
pnpm --filter web check-types
```

## Working with the Monorepo
### Adding a New Package Dependency
```bash
# Add a dependency to a specific package or app
pnpm --filter <package-name> add <dependency-name>

# Example: Add axios to the web app
pnpm --filter web add axios
```

### Using Shared Packages
Shared packages are available as dependencies to all applications. For example, to use the UI package:

```bash
import { Button } from "@repo/ui";

export default function MyComponent() {
  return <Button>Click me</Button>;
}
```

### Using Generators
This project includes several code generators to help you scaffold components and routes quickly.

#### Generating Components
##### Web Application Components
Generate components in the web application:

This creates a new component in apps/web/app/_components/ with:

- **Component file** (ComponentName.tsx)
- **Styles file** (ComponentName.module.scss)
- **Test file** (ComponentName.spec.tsx)

##### UI Library Components
Generate shared components in the UI package:

This creates a new component in components with:

- **Component file**
- **Styles file**
- **Test file**
- Automatically exports the component from the index file (optional)

#### Generating Routes
Create new routes in the web application with Next.js App Router structure:

When running the command, you'll be prompted for:

- **Route name**
- **Target directory** (defaults to app)
- Optional files to include:
- **loading.tsx** (loading state)
- **error.tsx** (error handling)
- **layout.tsx** (layout wrapper)
- **template.tsx** (template wrapper)
- **not-found.tsx** (404 handling)

The generator will create the appropriate files based on your selections, with:

- **Main page file** (page.tsx)
- **Styles file** (styles.module.scss)
- **Test file** (test.spec.ts)
- Any selected optional files

Example Usage:
```bash 
# Generate a new route
pnpm --filter web generate:route
# > What is the name of the route? dashboard
# > What is the target directory for the route? app
# > Include loading.tsx? Yes
# > Include error.tsx? Yes
# > Include layout.tsx? No
# > Include template.tsx? No
# > Include not-found.tsx? No

# Generate a new component
pnpm --filter web generate:component
# > What is the name of the component? UserProfile
```

This would generate:

- A dashboard route with page, loading, error files
- A UserProfile component with all associated files

## Learn More
[Turborepo Documentation](https://turbo.build/)
[Next.js Documentation](https://nextjs.org/)
[tRPC Documentation](https://trpc.io/docs)
[Prisma Documentation](https://www.prisma.io/)
[TanStack Query Documentation](https://tanstack.com/query/latest)
[pnpm Workspaces](https://pnpm.io/workspaces)