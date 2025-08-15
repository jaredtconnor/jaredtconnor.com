# System Architecture Documentation

This document outlines the architectural decisions, system design, and technical structure of the Blog Monorepo project.

---

## 🏗 High-Level Architecture

### System Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (Payload CMS) │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                      │                      │                 │
├── Blog App           ├── CMS Admin         ├── Instapaper API │
├── Landing Page       ├── REST API          ├── AWS RDS        │
├── UI Components      ├── GraphQL API       ├── AWS S3         │
└── Shared Utils       └── Media Storage     └── CloudFront     │
```

### Technology Stack
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Backend**: Payload CMS 3.x + Node.js
- **Database**: PostgreSQL 15 (AWS RDS)
- **Hosting**: AWS (via SST - Serverless Stack)
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm (monorepo)
- **Build Tool**: Turbo (monorepo orchestration)

---

## 📁 Monorepo Structure {#monorepo}

### Directory Organization
```
blog/                           # Root monorepo
├── apps/                      # Applications
│   ├── blog/                  # Main blog frontend (Next.js)
│   ├── cms/                   # Payload CMS backend
│   ├── landing/               # Landing page (Astro)
│   └── backend/               # API backend services
├── packages/                  # Shared packages
│   └── ui/                    # Shared UI components
├── docs/                      # Documentation
│   ├── features/              # Feature documentation
│   ├── development/           # Development guides
│   ├── api/                   # API documentation
│   └── project-management/    # Planning & todos
├── sst.config.ts             # Infrastructure as code
├── turbo.json                # Monorepo build configuration
├── pnpm-workspace.yaml       # Package manager workspace
└── README.md                 # Project overview
```

### Package Dependencies
```
blog (root)
├── @repo/ui (shared components)
├── apps/blog → @repo/ui
├── apps/cms → independent
├── apps/landing → @repo/ui
└── packages/ui → independent
```

### Workspace Configuration
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

## 🎨 Frontend Architecture

### Next.js App Structure {#nextjs-setup}
```
apps/blog/src/
├── app/                       # Next.js 15 App Router
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   ├── globals.css           # Global styles
│   ├── writing/              # Blog posts
│   │   ├── page.tsx          # Posts list
│   │   └── [slug]/           # Individual post
│   ├── bookmarks/            # Bookmarks page
│   ├── projects/             # Projects page
│   ├── information/          # Information page
│   └── not-found.tsx         # 404 page
├── components/               # React components
│   ├── layouts/              # Page layouts
│   ├── content/              # Content-specific components
│   ├── shared/               # Shared layouts (Detail/List)
│   └── providers/            # React context providers
└── lib/                      # Utilities and integrations
    ├── payload.ts            # CMS integration
    ├── types.ts              # TypeScript definitions
    └── utils.ts              # Helper functions
```

### Component Architecture
```
Component Hierarchy:
├── RootLayout
│   ├── GlobalNavigationProvider
│   ├── SiteLayout
│   │   ├── Sidebar
│   │   │   ├── SidebarNavigation
│   │   │   └── NavigationLink[]
│   │   └── MainContent
│   │       ├── ListDetailView
│   │       │   ├── ListContainer (optional)
│   │       │   └── Detail.Container
│   │       │       └── Detail.ContentContainer
│   └── SidebarOverlay (mobile)
```

### State Management
- **Global State**: React Context for navigation
- **Server State**: Direct async components (RSC)
- **Client State**: useState/useReducer where needed
- **URL State**: Next.js router for navigation

### Data Fetching Strategy
```typescript
// Server Components (default)
export default async function PostsPage() {
  const posts = await getPosts() // Direct async call
  return <PostsList posts={posts} />
}

// Client Components (when needed)
'use client'
export function InteractiveComponent() {
  const [data, setData] = useState()
  // Client-side data fetching
}
```

---

## 🏠 Design System {#design-system}

### Color Palette
```css
:root {
  /* Grays */
  --gray-50: #fafafa;
  --gray-100: #f5f5f5;
  --gray-150: #ededed;
  --gray-200: #e5e5e5;
  --gray-300: #d4d4d4;
  --gray-500: #737373;
  --gray-600: #525252;
  --gray-700: #404040;
  --gray-800: #262626;
  --gray-900: #171717;
  --gray-1000: #0a0a0a;
  
  /* Theme colors */
  --primary: var(--gray-1000);
  --secondary: var(--gray-600);
  --tertiary: var(--gray-500);
  
  /* Dark mode overrides */
  --text-primary: var(--gray-1000);
  --bg-primary: white;
}

[data-theme="dark"] {
  --text-primary: var(--gray-100);
  --bg-primary: var(--gray-900);
}
```

### Typography Scale
```css
/* Font families */
--font-sans: Inter, system-ui, sans-serif;
--font-mono: 'SF Mono', Monaco, 'Inconsolata', monospace;

/* Font sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-4xl: 2.25rem;   /* 36px */
```

### Layout System
```css
/* Max widths */
--max-w-3xl: 48rem;    /* 768px - main content */
--max-w-4xl: 56rem;    /* 896px - wide content */
--max-w-7xl: 80rem;    /* 1280px - full width */

/* Grid system */
.grid-cols-12 {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

/* Spacing scale */
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-16: 4rem;      /* 64px */
```

### Responsive Breakpoints
```css
/* Mobile-first breakpoints */
--screen-sm: 640px;    /* Small devices */
--screen-md: 768px;    /* Medium devices */
--screen-lg: 1024px;   /* Large devices */
--screen-xl: 1280px;   /* Extra large */
--screen-2xl: 1536px;  /* 2X Extra large */
```

---

## 🗄 Backend Architecture

### Payload CMS Structure
```
cms/src/
├── collections/              # Content collections
│   ├── Posts.ts             # Blog posts schema
│   ├── Projects.ts          # Projects schema
│   ├── Tags.ts              # Tags schema
│   ├── Media.ts             # File uploads schema
│   └── Users.ts             # Admin users schema
├── globals/                 # Global settings
│   └── SiteSettings.ts      # Site-wide configuration
├── migrations/              # Database migrations
├── payload.config.ts        # Main Payload configuration
└── payload-types.ts         # Generated TypeScript types
```

### Content Collections Schema

#### Posts Collection
```typescript
const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt']
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'content',
      type: 'richText',
      required: true
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 200
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media'
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published'],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar'
      }
    }
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.slug) {
          data.slug = generateSlug(data.title)
        }
        return data
      }
    ]
  }
}
```

### API Architecture
```
API Layer:
├── REST API (auto-generated by Payload)
│   ├── GET /api/posts
│   ├── GET /api/posts/:id
│   ├── POST /api/posts
│   └── ...
├── GraphQL API (planned)
│   └── Single endpoint with schema
└── Custom API Routes
    ├── /api/sync/instapaper
    ├── /api/search
    └── /api/analytics
```

---

## 🗃 Database Design {#database}

### Entity Relationship Diagram
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Posts    │    │    Tags     │    │   Media     │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ title       │    │ name        │    │ filename    │
│ slug        │◄──┐│ description │    │ mimeType    │
│ content     │   ││ color       │    │ filesize    │
│ excerpt     │   │└─────────────┘    │ url         │
│ status      │   │                   │ alt         │
│ publishedAt │   │                   └─────────────┘
│ featuredImg ├───┘                           ▲
└─────────────┘                               │
       │                                      │
       ▼                                      │
┌─────────────┐    ┌─────────────┐           │
│ Posts_Tags  │    │  Projects   │───────────┘
├─────────────┤    ├─────────────┤
│ post_id     │    │ id (PK)     │
│ tag_id      │    │ title       │
└─────────────┘    │ description │
                   │ liveUrl     │
                   │ githubUrl   │
                   │ status      │
                   └─────────────┘
```

### Database Indexes
```sql
-- Performance indexes
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_tags_name ON tags(name);

-- Full-text search indexes
CREATE INDEX idx_posts_search ON posts 
USING gin(to_tsvector('english', title || ' ' || content));
```

### Data Migration Strategy
```typescript
// Migration example
export async function up({ payload }: MigrationContext) {
  // Add new field to existing collection
  await payload.db.schema.alterTable('posts', (table) => {
    table.integer('reading_time').defaultTo(0)
  })
  
  // Update existing records
  const posts = await payload.find({
    collection: 'posts',
    limit: 1000
  })
  
  for (const post of posts.docs) {
    const readingTime = calculateReadingTime(post.content)
    await payload.update({
      collection: 'posts',
      id: post.id,
      data: { readingTime }
    })
  }
}
```

---

## 🚀 Infrastructure Architecture

### AWS Infrastructure (via SST)
```typescript
// sst.config.ts
export default {
  config() {
    return {
      name: "blog",
      region: "us-east-1"
    }
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      // Database
      const rds = new RDS(stack, "Database", {
        engine: "postgresql15.4",
        defaultDatabaseName: "blog",
        migrations: "cms/migrations"
      })
      
      // File storage
      const bucket = new Bucket(stack, "uploads")
      
      // CMS backend
      const cms = new NextjsSite(stack, "CMS", {
        path: "cms/",
        bind: [rds, bucket],
        environment: {
          DATABASE_URL: rds.connectionString,
          PAYLOAD_SECRET: Config.Secret.value(stack, "PAYLOAD_SECRET")
        }
      })
      
      // Frontend app
      const blog = new NextjsSite(stack, "Blog", {
        path: "apps/blog/",
        bind: [rds],
        environment: {
          NEXT_PUBLIC_PAYLOAD_URL: cms.url
        }
      })
      
      return {
        BlogUrl: blog.url,
        CMSUrl: cms.url
      }
    })
  }
}
```

### Deployment Architecture
```
Internet
    ↓
CloudFront CDN
    ↓
├── Static Assets (S3)
├── Blog App (Lambda@Edge)
└── CMS API (Lambda)
    ↓
RDS PostgreSQL
```

### Environment Configuration
```typescript
// Environment-specific configs
const environments = {
  development: {
    database: 'local postgres',
    storage: 'local filesystem',
    cdn: 'none'
  },
  staging: {
    database: 'AWS RDS (smaller instance)',
    storage: 'AWS S3',
    cdn: 'CloudFront'
  },
  production: {
    database: 'AWS RDS (production instance)',
    storage: 'AWS S3',
    cdn: 'CloudFront + custom domain'
  }
}
```

---

## 🔗 Integration Architecture

### External Service Integrations
```
Blog App
    ├── Instapaper API
    │   ├── OAuth 1.0a authentication
    │   ├── Bookmark synchronization
    │   └── Metadata extraction
    ├── AWS Services
    │   ├── RDS (PostgreSQL)
    │   ├── S3 (file storage)
    │   ├── CloudFront (CDN)
    │   └── Lambda (serverless functions)
    └── Future Integrations
        ├── Analytics (Plausible/Fathom)
        ├── Email (SendGrid/Mailgun)
        └── Monitoring (Sentry)
```

### Data Flow Architecture
```
User Request
    ↓
Next.js App Router
    ↓
Server Component
    ↓
Payload API Client
    ↓
Payload CMS
    ↓
PostgreSQL Database

Instapaper Sync:
Instapaper API → Sync Service → Payload CMS → Database
```

---

## 🔐 Security Architecture

### Authentication & Authorization
```typescript
// Security layers
interface SecurityLayers {
  // Network level
  cloudflare: 'DDoS protection, WAF'
  aws: 'VPC, Security Groups, IAM'
  
  // Application level
  payload: 'Admin authentication, RBAC'
  nextjs: 'CSRF protection, headers'
  
  // Data level
  database: 'Connection encryption, backup encryption'
  storage: 'S3 bucket policies, signed URLs'
}
```

### Security Headers
```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: cspHeader
  }
]
```

---

## ⚡ Performance Architecture

### Optimization Strategy
```typescript
interface PerformanceOptimizations {
  // Build time
  bundleOptimization: 'Code splitting, tree shaking'
  imageOptimization: 'Next.js Image, WebP/AVIF'
  cssOptimization: 'Tailwind purging, critical CSS'
  
  // Runtime
  serverRendering: 'SSR for initial load'
  staticGeneration: 'ISR for content pages'
  caching: 'CDN, browser, database query cache'
  
  // User experience
  lazyLoading: 'Images, components, routes'
  prefetching: 'Next.js link prefetching'
  streaming: 'React 18 streaming SSR'
}
```

### Caching Strategy
```
Cache Layers:
├── CDN (CloudFront)
│   ├── Static assets: 1 year
│   ├── Images: 1 month
│   └── API responses: 5 minutes
├── Application (Redis - planned)
│   ├── Database queries: 15 minutes
│   ├── Search results: 10 minutes
│   └── Computed data: 1 hour
└── Database
    ├── Query plan cache
    └── Connection pooling
```

---

## 📊 Monitoring & Observability

### Monitoring Stack (Planned)
```typescript
interface MonitoringArchitecture {
  // Error tracking
  errorMonitoring: 'Sentry'
  
  // Performance monitoring
  apm: 'New Relic / DataDog'
  realUserMonitoring: 'Core Web Vitals'
  
  // Infrastructure monitoring
  infrastructure: 'AWS CloudWatch'
  logs: 'CloudWatch Logs'
  
  // Business metrics
  analytics: 'Plausible / Fathom'
  customMetrics: 'Custom tracking events'
}
```

### Health Checks
```typescript
// Health check endpoints
const healthChecks = {
  '/api/health': 'Basic app health',
  '/api/health/database': 'Database connectivity',
  '/api/health/instapaper': 'External API health',
  '/api/health/deep': 'Comprehensive system check'
}
```

---

## 🎯 Scalability Considerations

### Horizontal Scaling Strategy
```typescript
interface ScalingStrategy {
  // Application tier
  compute: 'AWS Lambda (auto-scaling)'
  
  // Database tier
  reads: 'Read replicas for analytics'
  writes: 'Connection pooling, query optimization'
  
  // Storage tier
  files: 'S3 with CloudFront CDN'
  cache: 'Redis cluster (when needed)'
  
  // Content delivery
  cdn: 'Global CloudFront distribution'
  regions: 'Multi-region deployment (future)'
}
```

### Performance Targets
```typescript
interface PerformanceTargets {
  // Core Web Vitals
  LCP: '< 2.5s'  // Largest Contentful Paint
  FID: '< 100ms' // First Input Delay
  CLS: '< 0.1'   // Cumulative Layout Shift
  
  // Custom metrics
  TTFB: '< 600ms'  // Time to First Byte
  TTI: '< 3.5s'    // Time to Interactive
  
  // API performance
  apiResponse: '< 500ms for 95th percentile'
  databaseQuery: '< 100ms average'
}
```

---

## 🔮 Future Architecture Considerations

### Planned Enhancements
```typescript
interface FutureArchitecture {
  // Microservices evolution
  services: {
    'content-service': 'Posts, projects management'
    'bookmark-service': 'Instapaper integration'
    'comment-service': 'User comments and moderation'
    'analytics-service': 'Usage tracking and insights'
  }
  
  // Real-time features
  realtime: {
    comments: 'WebSocket for live comments'
    notifications: 'Real-time admin notifications'
    collaboration: 'Multi-user content editing'
  }
  
  // Advanced features
  ml: {
    recommendations: 'Content recommendation engine'
    autoTagging: 'AI-powered content tagging'
    spamDetection: 'ML-based comment moderation'
  }
}
```

### Migration Strategy
```typescript
// Incremental migration approach
const migrationPhases = {
  phase1: 'Extract bookmark service',
  phase2: 'Add GraphQL gateway',
  phase3: 'Implement event sourcing',
  phase4: 'Add real-time features',
  phase5: 'ML/AI enhancements'
}
```

---

*Last updated: August 14, 2024*