# Planned Features Documentation

This document contains detailed specifications for all planned features in the Blog Monorepo project. These features are designed and ready for development.

---

## 🔗 Instapaper Integration

### Instapaper API Integration {#instapaper-integration}
**Status**: 📋 Planned | **Priority**: High | **Target**: End of August 2024

**Overview**: 
Integration with Instapaper API to automatically sync bookmarks and create a curated bookmark publishing system.

**Requirements**:
- OAuth 1.0a authentication with Instapaper
- Bidirectional sync between Instapaper and Payload CMS
- Selective publishing of bookmarks
- Metadata enhancement for bookmarks
- Comment system for published bookmarks

**API Endpoints Used**:
- `POST /api/1/oauth/access_token` - Authentication
- `GET /api/1/bookmarks/list` - Fetch bookmarks
- `POST /api/1/bookmarks/add` - Add new bookmarks
- `POST /api/1/bookmarks/star` - Star bookmarks
- `POST /api/1/bookmarks/archive` - Archive bookmarks

**Implementation Plan**:
1. OAuth client setup with secure token storage
2. Bookmark sync service development
3. CMS collection schema creation
4. Frontend integration
5. Admin interface for bookmark management

### Bookmark Schema {#bookmark-schema}
**Collection**: `bookmarks`

**Fields**:
```typescript
{
  // Instapaper data
  instapaperID: string (unique, indexed)
  url: string (required, unique)
  title: string (required)
  description: text
  starred: boolean
  readingProgress: number (0-1)
  
  // Enhanced CMS fields
  featured: boolean
  publicNote: richText // Your commentary
  tags: relationship[] (to tags collection)
  category: relationship (to bookmark-categories)
  publishedAt: date
  status: 'draft' | 'published' | 'archived'
  
  // Sync metadata
  lastSyncedAt: date
  syncStatus: 'synced' | 'pending' | 'error'
  
  // Auto-extracted metadata
  host: string
  faviconUrl: string
  image: string
  twitterHandle: string
}
```

**Collection Hooks**:
- `beforeChange`: Sync with Instapaper on updates
- `afterChange`: Update Instapaper if needed
- `beforeDelete`: Archive in Instapaper instead of deleting

### Bookmark Sync Architecture {#bookmark-sync}
**Service**: `InstapaperSyncService`

**Sync Strategies**:

#### Pull-Based Sync (Primary)
```typescript
class InstapaperSyncService {
  async syncBookmarks() {
    // 1. Fetch from Instapaper API with pagination
    const instapaperBookmarks = await this.fetchAllBookmarks()
    
    // 2. Get existing bookmarks from CMS
    const existingBookmarks = await this.getExistingBookmarks()
    
    // 3. Compare and sync differences
    const { toCreate, toUpdate, toArchive } = this.compareSyncSets(
      instapaperBookmarks, 
      existingBookmarks
    )
    
    // 4. Apply changes
    await this.createBookmarks(toCreate)
    await this.updateBookmarks(toUpdate)
    await this.archiveBookmarks(toArchive)
    
    // 5. Update sync metadata
    await this.updateSyncTimestamp()
  }
}
```

#### Bidirectional Sync (Secondary)
- When bookmark created in CMS → Add to Instapaper
- When bookmark updated in CMS → Update Instapaper if needed
- When bookmark deleted in CMS → Archive in Instapaper
- Conflict resolution favors Instapaper as source of truth

**Sync Schedule**:
- **Real-time**: On CMS changes (CMS → Instapaper)
- **Periodic**: Every 15 minutes (Instapaper → CMS)
- **Manual**: Admin trigger for full resync

### Metadata Extraction Service {#metadata-extraction}
**Purpose**: Automatically enrich bookmarks with additional metadata

**Libraries Used**:
- `metascraper` - Extract metadata from URLs
- `unfurl` - Alternative metadata extraction
- `favicon` - Favicon extraction

**Extracted Data**:
```typescript
interface ExtractedMetadata {
  title: string
  description: string
  image: string // og:image or primary image
  favicon: string
  author: string
  publishedDate: Date
  readingTime: number // estimated
  language: string
  keywords: string[]
}
```

**Implementation**:
```typescript
async function enrichBookmark(url: string): Promise<ExtractedMetadata> {
  try {
    const metadata = await metascraper({
      html: await fetch(url).then(res => res.text()),
      url
    })
    
    return {
      title: metadata.title || 'Untitled',
      description: metadata.description || '',
      image: metadata.image || '',
      favicon: await getFavicon(url),
      author: metadata.author || '',
      publishedDate: metadata.date ? new Date(metadata.date) : null,
      readingTime: estimateReadingTime(metadata.description),
      language: metadata.lang || 'en',
      keywords: extractKeywords(metadata.description)
    }
  } catch (error) {
    console.error('Failed to extract metadata:', error)
    return defaultMetadata(url)
  }
}
```

### Bookmark Frontend Integration {#bookmark-frontend}
**Updates Required**:

1. **Replace Mock Data**: Update `/bookmarks` page to use real Payload data
2. **Add Sync Controls**: Admin interface for manual sync triggers  
3. **Status Indicators**: Show sync status and last update time
4. **Filtering**: Filter by sync status, featured, categories
5. **Publishing Interface**: Convert private bookmarks to public posts

**Component Updates**:
```typescript
// Updated BookmarksPage component
export default async function BookmarksPage() {
  const bookmarks = await getBookmarks({
    where: { status: { equals: 'published' } },
    sort: '-publishedAt'
  })
  
  return (
    <ListDetailView 
      list={<BookmarksList bookmarks={bookmarks} />}
      hasDetail={false}
    />
  )
}
```

---

## 💬 Comment System

### Comments Schema {#comments-schema}
**Collection**: `comments`

**Fields**:
```typescript
{
  // Content
  content: richText (required)
  
  // Author information
  author: string (required)
  email: email (required)
  website: string
  
  // Polymorphic relationship
  commentableType: 'bookmarks' | 'posts' | 'projects'
  commentableID: string (required)
  
  // Moderation
  status: 'pending' | 'approved' | 'spam' | 'rejected'
  moderatedAt: date
  moderatedBy: relationship (to users)
  moderationNote: text
  
  // Threading
  parentComment: relationship (to comments, self-reference)
  threadDepth: number (calculated)
  
  // Metadata
  ipAddress: string
  userAgent: string
  referrer: string
  
  // Engagement
  helpful: number (upvotes)
  flagged: number (spam reports)
}
```

**Indexes**:
- `commentableType + commentableID` (for fetching comments)
- `status` (for moderation queries)
- `parentComment` (for threading)
- `createdAt` (for sorting)

### Comments API {#comments-api}
**Endpoints**:

#### Public Endpoints
```typescript
// Get comments for content
GET /api/comments?type=bookmarks&id=123&status=approved

// Create new comment
POST /api/comments
Body: {
  content: string
  author: string
  email: string
  website?: string
  commentableType: string
  commentableID: string
  parentComment?: string
}

// Report spam
POST /api/comments/:id/flag
```

#### Admin Endpoints
```typescript
// Moderate comments
PATCH /api/comments/:id/moderate
Body: {
  status: 'approved' | 'rejected' | 'spam'
  moderationNote?: string
}

// Bulk moderation
POST /api/comments/bulk-moderate
Body: {
  commentIds: string[]
  status: string
}

// Get moderation queue
GET /api/comments/moderation-queue
```

**Spam Protection**:
- Rate limiting (max 3 comments per 15 minutes per IP)
- Content filtering (banned words, excessive links)
- Akismet integration for spam detection
- Manual moderation for first-time commenters

### Comment Moderation {#comment-moderation}
**Moderation Interface**:

**Dashboard Features**:
- Pending comments queue
- Bulk approval/rejection
- Comment analytics (total, approved, spam rates)
- Commenter history and reputation

**Moderation Tools**:
```typescript
interface ModerationTools {
  // Quick actions
  approve(commentId: string): Promise<void>
  reject(commentId: string, reason?: string): Promise<void>
  markSpam(commentId: string): Promise<void>
  
  // Bulk actions
  bulkApprove(commentIds: string[]): Promise<void>
  bulkReject(commentIds: string[]): Promise<void>
  
  // Commenter management
  banCommenter(email: string): Promise<void>
  trustCommenter(email: string): Promise<void>
  
  // Analytics
  getModerationStats(): Promise<ModerationStats>
}
```

**Auto-Moderation Rules**:
- Auto-approve trusted commenters
- Auto-flag comments with excessive links
- Auto-flag comments with banned words
- Auto-flag comments from banned IP ranges

---

## 🔍 Search & Discovery

### Search Implementation {#search}
**Approach**: Full-text search with PostgreSQL + optional Elasticsearch

**Search Scope**:
- Blog posts (title, content, excerpt)
- Bookmarks (title, description, personal notes)
- Projects (title, description)
- Tags (name, description)

**Database Implementation**:
```sql
-- Add full-text search indexes
CREATE INDEX posts_search_idx ON posts 
USING gin(to_tsvector('english', title || ' ' || content || ' ' || excerpt));

CREATE INDEX bookmarks_search_idx ON bookmarks 
USING gin(to_tsvector('english', title || ' ' || description || ' ' || public_note));
```

**Search API**:
```typescript
interface SearchOptions {
  query: string
  types?: ('posts' | 'bookmarks' | 'projects')[]
  limit?: number
  offset?: number
  filters?: {
    tags?: string[]
    dateRange?: { from: Date; to: Date }
    status?: string[]
  }
}

interface SearchResult {
  id: string
  type: 'post' | 'bookmark' | 'project'
  title: string
  excerpt: string
  url: string
  relevanceScore: number
  highlights: string[]
  tags: string[]
  publishedAt: Date
}

// Search endpoint
POST /api/search
Body: SearchOptions
Response: {
  results: SearchResult[]
  total: number
  facets: {
    types: { [key: string]: number }
    tags: { [key: string]: number }
    years: { [key: string]: number }
  }
}
```

### Filtering System {#filtering}
**Filter Types**:

#### Content Type Filters
- Posts only
- Bookmarks only  
- Projects only
- All content types

#### Metadata Filters
- By tags (multiple selection)
- By publication date (date range)
- By status (published, featured, etc.)
- By reading time (for posts)

#### Advanced Filters
- By bookmark source (Instapaper vs manual)
- By project status (active, completed, archived)
- By engagement (most commented, most viewed)

**Filter UI Components**:
```typescript
interface FilterProps {
  activeFilters: FilterState
  onFilterChange: (filters: FilterState) => void
  availableOptions: FilterOptions
}

// Filter components
<SearchFilters {...filterProps} />
<TagFilter tags={availableTags} selected={selectedTags} />
<DateRangeFilter range={dateRange} onChange={setDateRange} />
<ContentTypeFilter types={contentTypes} selected={selectedTypes} />
```

---

## 🚀 Performance & Infrastructure

### Image Optimization {#image-optimization}
**Implementation**: Next.js Image + AWS S3 + CloudFront

**Features**:
- Automatic format conversion (WebP, AVIF)
- Multiple size generation (responsive images)
- Lazy loading with placeholder
- CDN distribution
- Cache optimization

**Image Pipeline**:
```typescript
// Upload processing
async function processImageUpload(file: File) {
  // 1. Upload original to S3
  const originalUrl = await uploadToS3(file)
  
  // 2. Generate optimized versions
  const sizes = [400, 800, 1200, 1600]
  const formats = ['webp', 'jpeg']
  
  const variants = await Promise.all(
    sizes.flatMap(size => 
      formats.map(format => 
        generateImageVariant(originalUrl, { size, format })
      )
    )
  )
  
  // 3. Update media record
  return {
    original: originalUrl,
    variants: variants,
    alt: extractAltText(file),
    metadata: getImageMetadata(file)
  }
}
```

### Caching Strategy {#caching}
**Multi-Layer Caching**:

#### CDN Layer (CloudFront)
- Static assets: 1 year cache
- API responses: 5 minutes cache
- Images: 1 month cache
- Cache invalidation on deployments

#### Application Layer (Redis)
```typescript
interface CacheStrategy {
  // Content caching
  posts: '15 minutes'
  bookmarks: '5 minutes' // Shorter due to sync updates
  projects: '1 hour'
  
  // Search caching
  searchResults: '10 minutes'
  searchSuggestions: '1 hour'
  
  // API response caching
  metadata: '1 day'
  analytics: '1 hour'
}
```

#### Database Layer
- Query result caching
- Connection pooling
- Read replicas for analytics

**Cache Invalidation**:
- Automatic on content updates
- Manual cache busting for admins
- Time-based expiration as fallback

---

## 📊 API Enhancements

### GraphQL API {#graphql-api}
**Purpose**: Replace REST API with GraphQL for complex queries and better frontend development experience

**Schema Design**:
```graphql
type Post {
  id: ID!
  title: String!
  slug: String!
  content: RichText!
  excerpt: String
  featuredImage: Media
  tags: [Tag!]!
  publishedAt: DateTime
  readingTime: Int
  comments(status: CommentStatus): [Comment!]!
  commentCount: Int!
}

type Bookmark {
  id: ID!
  url: String!
  title: String!
  description: String
  host: String!
  faviconUrl: String
  featured: Boolean!
  publicNote: RichText
  tags: [Tag!]!
  instapaperData: InstapaperData
  comments: [Comment!]!
}

type Query {
  posts(
    first: Int
    after: String
    where: PostFilters
    sort: PostSort
  ): PostConnection!
  
  post(id: ID, slug: String): Post
  
  bookmarks(
    first: Int
    after: String
    where: BookmarkFilters
  ): BookmarkConnection!
  
  search(
    query: String!
    types: [ContentType!]
    filters: SearchFilters
  ): SearchConnection!
}

type Mutation {
  createComment(input: CommentInput!): Comment!
  moderateComment(id: ID!, status: CommentStatus!): Comment!
  syncBookmarks: SyncResult!
}
```

**Benefits**:
- Single endpoint for all data needs
- Reduced over-fetching
- Strong typing
- Real-time subscriptions capability
- Better developer experience

### Custom API Endpoints {#custom-apis}
**Specialized Endpoints**:

#### Analytics API
```typescript
GET /api/analytics/content/:id/views
GET /api/analytics/popular-content
GET /api/analytics/engagement-metrics
POST /api/analytics/track-event
```

#### Utility APIs
```typescript
POST /api/utils/extract-metadata
Body: { url: string }
Response: ExtractedMetadata

POST /api/utils/generate-excerpt
Body: { content: string, maxLength: number }
Response: { excerpt: string }

GET /api/utils/reading-time/:postId
Response: { minutes: number, words: number }
```

#### Import/Export APIs
```typescript
POST /api/import/bookmarks
Body: { source: 'instapaper' | 'browser', data: any }

GET /api/export/bookmarks?format=json|opml
POST /api/export/content?types[]=posts&types[]=bookmarks
```

---

## 🎨 Content Enhancement

### Syntax Highlighting {#syntax-highlighting}
**Implementation**: Prism.js with custom themes

**Features**:
- Multiple language support
- Line numbering
- Code copying functionality
- Custom syntax themes (light/dark)
- Language detection

**Usage in Rich Text**:
```typescript
// Code block component for rich text editor
interface CodeBlockProps {
  language: string
  code: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  filename?: string
}

<CodeBlock 
  language="typescript"
  filename="example.ts"
  showLineNumbers
  highlightLines={[3, 7]}
  code={`
    function example() {
      return "highlighted code"
    }
  `}
/>
```

### RSS Feed {#rss}
**Implementation**: Auto-generated RSS feeds for content syndication

**Feed Types**:
- `/rss.xml` - All published posts
- `/bookmarks/rss.xml` - Published bookmarks with commentary
- `/projects/rss.xml` - Project updates
- `/feed.json` - JSON Feed format

**RSS Generation**:
```typescript
async function generateRSSFeed() {
  const posts = await getPosts({ status: 'published' })
  
  return new RSS({
    title: 'Blog RSS Feed',
    description: 'Latest posts and bookmarks',
    feed_url: 'https://yourdomain.com/rss.xml',
    site_url: 'https://yourdomain.com',
    language: 'en',
    items: posts.map(post => ({
      title: post.title,
      description: post.excerpt,
      url: `https://yourdomain.com/writing/${post.slug}`,
      date: post.publishedAt,
      guid: post.id
    }))
  })
}
```

---

## 🔐 Authentication & Security

### Authentication System {#authentication}
**Purpose**: Optional user accounts for enhanced features

**Features**:
- OAuth integration (GitHub, Google, Twitter)
- Email/password authentication
- Magic link sign-in
- Session management
- Role-based permissions

**User Schema**:
```typescript
{
  email: string (unique)
  name: string
  avatar: string
  role: 'reader' | 'commenter' | 'moderator' | 'admin'
  
  // OAuth data
  githubId?: string
  googleId?: string
  twitterId?: string
  
  // Preferences
  emailNotifications: boolean
  commentNotifications: boolean
  theme: 'light' | 'dark' | 'system'
  
  // Engagement
  bookmarkedPosts: relationship[] (to posts)
  likedComments: relationship[] (to comments)
}
```

**Benefits for Users**:
- Save bookmarks/favorites
- Comment without re-entering info
- Follow comment threads
- Personalized content recommendations

---

## 📈 Analytics & Monitoring

### Content Analytics {#content-analytics}
**Metrics Tracked**:
- Page views and unique visitors
- Reading time and completion rates
- Most popular content
- Referral sources
- Search queries

**Implementation**:
```typescript
interface ContentAnalytics {
  postViews: {
    postId: string
    views: number
    uniqueViews: number
    avgReadingTime: number
    completionRate: number
  }
  
  bookmarkClicks: {
    bookmarkId: string
    clicks: number
    clickThroughRate: number
    referrers: { [domain: string]: number }
  }
  
  searchAnalytics: {
    queries: { [query: string]: number }
    resultsClicked: { [contentId: string]: number }
    zeroResultQueries: string[]
  }
}
```

### Error Monitoring {#error-monitoring}
**Tools**: Sentry or similar error tracking

**Monitored Errors**:
- JavaScript runtime errors
- API request failures
- Database connection issues
- Third-party integration failures
- Performance regressions

**Alert Conditions**:
- Error rate > 1%
- API response time > 2s
- Database query time > 1s
- Failed Instapaper syncs

### Performance Analytics {#performance-analytics}
**Core Web Vitals Tracking**:
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- First Contentful Paint (FCP)

**Custom Performance Metrics**:
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Speed Index
- Bundle size tracking

---

## 🚀 Deployment & DevOps

### CI/CD Pipeline {#ci-cd}
**GitHub Actions Workflow**:

```yaml
name: Deploy Blog
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Type check
        run: pnpm check-types
      
      - name: Lint
        run: pnpm lint
  
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to AWS
        run: pnpm sst deploy --stage production
```

**Pipeline Features**:
- Automated testing on PR
- Type checking and linting
- Automatic deployment on main branch
- Environment-specific deployments
- Rollback capabilities
- Slack/Discord notifications

---

*Last updated: August 14, 2024*