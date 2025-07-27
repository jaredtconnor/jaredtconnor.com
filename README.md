# Personal Blog & Portfolio Monorepo

A modern, production-ready personal website and blog built with cutting-edge technologies. This monorepo combines a high-performance landing site, dynamic blog platform, and headless CMS in a cohesive TypeScript ecosystem.

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Astro](https://img.shields.io/badge/astro-%23000000.svg?style=for-the-badge&logo=astro&logoColor=white)
![PayloadCMS](https://img.shields.io/badge/PayloadCMS-000000?style=for-the-badge&logo=payload&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Features

- **Lightning Fast**: Astro landing site with island architecture
- **Modern Blog**: Next.js 15 with App Router and React 19
- **Headless CMS**: PayloadCMS with rich content management
- **Type-Safe Database**: PostgreSQL with full TypeScript integration
- **Shared Components**: Reusable UI library with TailwindCSS
- **Optimized Builds**: Turborepo for lightning-fast development
- **Modern DevEx**: ESLint, Prettier, TypeScript strict mode
- **Production Ready**: SST v3 deployment infrastructure

## Architecture

```bash
├── apps/
│   ├── landing/          # Astro landing site (static)
│   ├── blog/             # Next.js blog platform (dynamic)
│   └── cms/              # PayloadCMS admin (headless CMS)
├── packages/
│   ├── ui/               # Shared React components
│   ├── db/               # Database utilities
│   ├── eslint-config/    # ESLint configuration
│   └── typescript-config/ # TypeScript configuration
├── .env                  # Environment variables
├── turbo.json           # Turborepo configuration
└── sst.config.ts        # SST deployment config
```

### Tech Stack

| Component | Technology | Purpose | Status |
|-----------|------------|---------|---------|
| **Landing Site** | Astro 4.16 + TypeScript | Fast static site | Complete |
| **Blog Platform** | Next.js 15 + App Router | Dynamic content rendering | Complete |
| **CMS** | PayloadCMS 3.39 | Content management | Complete |
| **Database** | PostgreSQL (Neon) | Data persistence | Complete |
| **Styling** | TailwindCSS v4 | Design system | Complete |
| **Deployment** | SST v3 + AWS | Infrastructure as code | Complete |

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ 
- [pnpm](https://pnpm.io/) v9+
- [PostgreSQL](https://postgresql.org/) database (or Neon account)

### Installation

```bash
# Clone the repository
git clone https://github.com/jaredtconnor/jaredtconnor.com.git
cd jaredtconnor.com

# Install dependencies
pnpm install
```

### Environment Setup

1. **Create root `.env` file**:
```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database"

# PayloadCMS
PAYLOAD_SECRET="your-secret-key-here"
PAYLOAD_PUBLIC_SERVER_URL="http://localhost:3000"

# Development URLs
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
```

2. **Run database migrations**:
```bash
# Run PayloadCMS migrations
pnpm cms:migrate

# Generate PayloadCMS types
pnpm cms:types
```

### Development

```bash
# Start all applications
pnpm dev

# Or start individual apps
pnpm --filter landing dev    # http://localhost:4321
pnpm --filter blog dev       # http://localhost:3001  
pnpm --filter cms dev        # http://localhost:3000
```

## Applications

### Landing Site (`apps/landing`)
- **Framework**: Astro 4.16 with TypeScript
- **Purpose**: Fast-loading personal website and portfolio
- **Features**: Static generation, SEO optimization, responsive design
- **URL**: http://localhost:4321

### Blog Platform (`apps/blog`)
- **Framework**: Next.js 15 with App Router and React 19  
- **Purpose**: Dynamic blog with content from PayloadCMS
- **Features**: Server components, dynamic routing, TailwindCSS v4
- **URL**: http://localhost:3001

### Content Management (`apps/cms`)
- **Framework**: PayloadCMS 3.39 with PostgreSQL
- **Purpose**: Headless CMS for content management
- **Features**: Rich text editor, media management, user roles
- **URL**: http://localhost:3000/admin

## Shared Packages

### `@repo/ui`
Shared React components built with TailwindCSS:
```typescript
import { Button, Card, Code } from '@repo/ui'

export default function MyComponent() {
  return (
    <Card>
      <Button variant="primary">Click me</Button>
      <Code language="typescript">console.log('Hello')</Code>
    </Card>
  )
}
```

### `@repo/db`
Database utilities and PayloadCMS type integration:
```typescript
// PayloadCMS types are available
import type { Post, User, Media } from '@repo/cms/src/payload-types'
```

## Development Commands

### Build Commands
```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter landing build
pnpm --filter blog build  
pnpm --filter cms build
```

### Code Quality
```bash
# Lint and type-check everything
pnpm check

# Fix linting issues
pnpm check:fix

# Type checking only
pnpm check-types
```

### Testing
```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test src/components/Button.test.ts
```

## Deployment

This project uses SST v3 for AWS deployment:

```bash
# Deploy to staging
pnpm deploy

# Deploy to production
pnpm deploy --stage production
```

### Infrastructure
- **CDN**: CloudFront for static assets
- **Compute**: Lambda functions for SSR
- **Database**: Neon PostgreSQL 
- **Storage**: S3 for media files

## Content Management

### Creating Content
1. Access the CMS admin at `/admin`
2. Create posts, pages, projects using the rich editor
3. Upload and manage media files
4. Configure SEO metadata and social sharing

### Content Types
- **Posts**: Blog articles with rich text, tags, and metadata
- **Pages**: Static pages like About, Contact
- **Projects**: Portfolio projects with galleries and links
- **Tags**: Content categorization with color coding
- **Media**: Images, videos, and documents with responsive sizing

## Advanced Usage

### Adding Dependencies
```bash
# Add to specific app
pnpm --filter @repo/blog add lodash
pnpm --filter @repo/landing add @astrojs/sitemap

# Add to workspace root
pnpm add -D prettier
```

### Database Operations
```bash
# Generate types from PayloadCMS
pnpm cms:types

# Run migrations
pnpm cms:migrate

# Reset database (development only)
pnpm --filter @repo/cms payload migrate:reset
```

### Performance Optimization
- **Astro**: Automatic static optimization and island architecture
- **Next.js**: App Router with React Server Components
- **Images**: Automatic optimization with responsive sizes
- **Caching**: Built-in CDN and edge caching

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Learn More

- [Astro Documentation](https://docs.astro.build/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PayloadCMS Documentation](https://payloadcms.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [SST Documentation](https://docs.sst.dev/)
- [Turborepo Documentation](https://turbo.build/repo/docs)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built by [Jared Connor](https://github.com/jaredtconnor)**
