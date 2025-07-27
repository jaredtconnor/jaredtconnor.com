# Personal Website & Digital Garden - Technical Plan

## 🎯 Project Overview

A modern personal website and digital garden built as a monorepo with three distinct applications, designed for performance, content management flexibility, and developer experience.

### Core Applications
1. **Landing Site** - Fast, static personal website (Astro)
2. **Blog & Digital Garden** - Dynamic content platform (Next.js 15)
3. **Content Management System** - Headless CMS (PayloadCMS)

---

## 🏗️ Architecture & Tech Stack

### Current Stack ✅
```
┌─────────────────────────────────────────────────────────────┐
│                    Production Architecture                   │
├─────────────────────────────────────────────────────────────┤
│  CDN (AWS CloudFront)                                      │
│  ├── landing.jaredconnor.com (Astro Static)               │
│  ├── blog.jaredconnor.com (Next.js SSR/SSG)               │
│  └── cms.jaredconnor.com (PayloadCMS Admin)               │
│                                                             │
│  Database Layer                                             │
│  └── PostgreSQL (AWS RDS)                                  │
│                                                             │
│  Infrastructure                                             │
│  └── SST v3 (AWS CDK deployment)                          │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose | Status |
|-----------|------------|---------|--------|
| **Monorepo** | Turborepo | Build orchestration & caching | ✅ Complete |
| **Landing Site** | Astro 4.16 + TypeScript | Static site generation | 🔧 Setup |
| **Blog Platform** | Next.js 15 + App Router | Dynamic content rendering | 🔧 Setup |
| **CMS** | PayloadCMS 3.39 | Content management | 🔧 Setup |
| **Database** | PostgreSQL 16.4 | Data persistence | ✅ Complete |
| **Styling** | TailwindCSS | Consistent design system | ✅ Complete |
| **Deployment** | SST v3 + AWS | Infrastructure as code | ✅ Complete |
| **Content** | Lexical Editor | Rich text editing | ✅ Complete |

---

## 📱 Application Requirements

### 1. Landing Site (Astro) - `apps/landing`

**Purpose**: Fast-loading personal website showcasing professional profile

#### Technical Requirements
- **Framework**: Astro 4.16+ with TypeScript
- **Styling**: TailwindCSS with custom design system
- **Performance**: 
  - Lighthouse Score: 95+ all categories
  - First Contentful Paint: < 1.5s
  - Cumulative Layout Shift: < 0.1
- **SEO**: Complete meta tags, structured data, sitemap
- **Responsive**: Mobile-first design for all screen sizes

#### Content Requirements
- **Homepage**:
  - Hero section with personal introduction
  - Featured projects showcase (3-4 key projects)
  - Recent blog posts preview (latest 3)
  - Social links and contact call-to-action
- **About Page**:
  - Professional bio and personal story
  - Skills and technologies
  - Experience timeline
  - Downloadable resume
- **Projects Page**:
  - Comprehensive project portfolio
  - Project filtering by technology/category
  - Case study links to detailed project pages
- **Contact Page**:
  - Contact form with validation
  - Social media links
  - Professional networking info

#### Data Integration
- **API Consumption**: PayloadCMS REST API
- **Content Types**: Pages, Projects, Bio data
- **Build Time**: Static generation with ISR for dynamic content
- **Caching**: CDN caching with smart invalidation

### 2. Blog & Digital Garden (Next.js) - `apps/blog`

**Purpose**: Dynamic content platform for articles, notes, and knowledge sharing

#### Technical Requirements
- **Framework**: Next.js 15 with App Router
- **Runtime**: React 19 with concurrent features
- **Rendering**: Hybrid SSG/SSR with ISR
- **Performance**: 
  - Core Web Vitals: All "Good" ratings
  - Interactive features with < 100ms response time
- **Search**: Client-side search with full-text indexing
- **Navigation**: Smooth transitions and progressive enhancement

#### Content Features
- **Blog Posts**:
  - Rich content with MDX support
  - Code syntax highlighting with copy buttons
  - Interactive components and embeds
  - Table of contents auto-generation
  - Reading time estimation
  - Social sharing buttons
- **Digital Garden**:
  - Interconnected notes with backlinks
  - Bidirectional linking system
  - Knowledge graph visualization
  - Tag-based organization
  - Note templates and structures
- **Content Discovery**:
  - Category and tag pages
  - Related content suggestions
  - Full-text search functionality
  - Content recommendations
- **User Experience**:
  - Dark/light mode toggle
  - Reading progress indicator
  - Print-friendly layouts
  - Bookmark functionality

#### Data Architecture
- **Content Source**: PayloadCMS via API
- **Content Types**: Posts, Notes, Categories, Tags
- **Caching Strategy**: 
  - Static generation for stable content
  - ISR for dynamic updates
  - API route caching
- **Real-time Updates**: Webhook-based regeneration

### 3. Content Management System (PayloadCMS) - `apps/cms`

**Purpose**: Headless CMS for content creation and management

#### Technical Requirements
- **Framework**: PayloadCMS 3.39 on Next.js 15
- **Database**: PostgreSQL with connection pooling
- **Editor**: Lexical rich text editor
- **Authentication**: JWT-based admin authentication
- **API**: Auto-generated REST and GraphQL APIs
- **File Storage**: AWS S3 integration for media assets

#### Content Models

##### Core Collections
1. **Pages Collection**
   ```typescript
   interface Page {
     id: string
     title: string
     slug: string
     content: RichText
     metaTitle?: string
     metaDescription?: string
     featuredImage?: Media
     publishedAt: Date
     status: 'draft' | 'published'
   }
   ```

2. **Posts Collection**
   ```typescript
   interface Post {
     id: string
     title: string
     slug: string
     excerpt: string
     content: RichText
     featuredImage?: Media
     categories: Category[]
     tags: Tag[]
     publishedAt: Date
     readingTime: number
     status: 'draft' | 'published'
     seo: SEOFields
   }
   ```

3. **Notes Collection** (Digital Garden)
   ```typescript
   interface Note {
     id: string
     title: string
     slug: string
     content: RichText
     backlinks: Note[]
     forwardLinks: Note[]
     tags: Tag[]
     lastModified: Date
     status: 'private' | 'public'
     noteType: 'concept' | 'project' | 'resource'
   }
   ```

4. **Projects Collection**
   ```typescript
   interface Project {
     id: string
     title: string
     slug: string
     description: string
     longDescription: RichText
     technologies: Technology[]
     images: Media[]
     projectUrl?: string
     githubUrl?: string
     featured: boolean
     completedAt: Date
     status: 'active' | 'completed' | 'archived'
   }
   ```

5. **Categories & Tags Collections**
   ```typescript
   interface Category {
     id: string
     name: string
     slug: string
     description?: string
     color?: string
   }
   
   interface Tag {
     id: string
     name: string
     slug: string
     description?: string
   }
   ```

#### Admin Features
- **User Management**: Role-based access control
- **Media Library**: Drag-and-drop file uploads with optimization
- **Content Scheduling**: Publish date scheduling
- **Draft System**: Auto-save and version control
- **SEO Tools**: Meta tag management and preview
- **Analytics Integration**: Content performance tracking

---

## 🔧 Shared Infrastructure

### Packages Architecture - `packages/`

#### 1. UI Package (`@repo/ui`)
**Purpose**: Shared component library for consistent design

```typescript
// Component exports
export { Button, Card, Input, Modal } from './components'
export { cn } from './utils'
export type { ButtonProps, CardProps } from './types'

// Design tokens
export const colors = { ... }
export const typography = { ... }
export const spacing = { ... }
```

**Requirements**:
- Consistent component API across apps
- TailwindCSS integration
- TypeScript strict mode
- Accessibility compliance (WCAG 2.1 AA)
- Documentation with Storybook

#### 2. Database Package (`@repo/db`)
**Purpose**: Shared database utilities and type definitions

```typescript
// PayloadCMS client
export const payloadClient = new PayloadAPI()
export type { Post, Note, Project, Page } from './types'

// Utility functions
export { formatDate, slugify, generateExcerpt } from './utils'
```

#### 3. TypeScript Config (`@repo/typescript-config`)
**Purpose**: Shared TypeScript configurations

- **Base Config**: Common compiler options
- **Next.js Config**: Next.js-specific settings  
- **Astro Config**: Astro-specific settings
- **Node Config**: Server-side configurations

#### 4. ESLint Config (`@repo/eslint-config`)
**Purpose**: Consistent code quality standards

- **Base Rules**: Common ESLint rules
- **React Rules**: React-specific linting
- **TypeScript Rules**: Type-aware linting
- **Accessibility Rules**: a11y compliance

---

## 🚀 Deployment & Infrastructure

### SST v3 Configuration
**Current Setup**: AWS-based infrastructure with CDK

```typescript
// sst.config.ts structure
export default $config({
  app: "personal-site",
  
  resources: {
    vpc: new sst.aws.Vpc("VPC"),
    database: new sst.aws.Postgres("Database", {
      database: "personal-site",
      version: "16.4"
    }),
    
    apps: {
      landing: new sst.aws.Astro("Landing"),
      blog: new sst.aws.Nextjs("Blog"),
      cms: new sst.aws.Nextjs("CMS")
    }
  }
})
```

### Environment Strategy
- **Development**: Local database + hot reloading
- **Staging**: AWS staging environment with production data subset
- **Production**: Full AWS deployment with monitoring

### Performance Requirements
- **Landing Site**: Static delivery via CloudFront CDN
- **Blog**: Edge rendering with ISR caching
- **CMS**: Admin-only access with proper authentication
- **Database**: Connection pooling and query optimization
- **Monitoring**: Real-time performance and error tracking

---

## 📋 Implementation Phases

### Phase 1: Foundation (Current - 95% Complete)
- ✅ Monorepo setup with Turborepo
- ✅ All three applications scaffolded
- ✅ Database and CMS infrastructure
- ✅ Deployment pipeline with SST
- 🔄 Shared packages configuration

### Phase 2: Content Management (Next Priority)
**Duration**: 2-3 weeks
**Goal**: Complete CMS setup with all content models

**Deliverables**:
- [ ] All PayloadCMS collections configured
- [ ] Admin interface customized
- [ ] API endpoints tested and documented
- [ ] Media management working
- [ ] Seed data for development

### Phase 3: Landing Site Implementation
**Duration**: 3-4 weeks  
**Goal**: Production-ready personal website

**Deliverables**:
- [ ] Homepage with dynamic content
- [ ] About and projects pages
- [ ] Contact form functionality
- [ ] SEO optimization complete
- [ ] Performance targets met

### Phase 4: Blog Platform Development
**Duration**: 4-5 weeks
**Goal**: Full-featured blog and digital garden

**Deliverables**:
- [ ] Blog post rendering with rich features
- [ ] Digital garden with backlinks
- [ ] Search functionality
- [ ] Knowledge graph visualization
- [ ] Content discovery features

### Phase 5: Integration & Polish
**Duration**: 2-3 weeks
**Goal**: Seamless user experience across all apps

**Deliverables**:
- [ ] Cross-app navigation
- [ ] Design system consistency
- [ ] Performance optimization
- [ ] Accessibility compliance
- [ ] Analytics integration

### Phase 6: Launch & Optimization
**Duration**: 1-2 weeks
**Goal**: Production deployment and launch

**Deliverables**:
- [ ] Production deployment
- [ ] Domain configuration
- [ ] SSL certificates
- [ ] Monitoring setup
- [ ] Launch content ready

---

## 🎯 Success Criteria

### Technical Metrics
- **Performance**: Lighthouse scores 95+ across all apps
- **Accessibility**: WCAG 2.1 AA compliance
- **SEO**: Core Web Vitals in "Good" range
- **Security**: No critical vulnerabilities
- **Uptime**: 99.9% availability target

### User Experience Metrics  
- **Loading Speed**: < 2s page load times
- **Mobile Experience**: Fully responsive design
- **Content Management**: Easy content creation workflow
- **Navigation**: Intuitive user journeys

### Content Goals
- **Discoverability**: Search engine optimization
- **Engagement**: Clear content hierarchy and navigation
- **Accessibility**: Screen reader and keyboard navigation support
- **Performance**: Fast content delivery globally

---

## 📚 Technical Documentation

### API Documentation
- PayloadCMS auto-generated API docs
- Custom endpoint documentation
- Content model relationships
- Authentication and permissions

### Development Guide
- Local development setup
- Content creation workflow
- Deployment procedures
- Troubleshooting guide

### Maintenance Plan
- Regular dependency updates
- Performance monitoring
- Security patch management
- Content backup procedures

---

**Last Updated**: January 26, 2025  
**Next Review**: After Phase 2 completion  
**Estimated Completion**: 12-15 weeks total
