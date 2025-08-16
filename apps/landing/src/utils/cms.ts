import {
  initializeRestClient,
  getSiteSettings,
  getNavigation,
  getSiteInfo,
  getSocialLinks,
  getFooterContent,
  getPages,
  getProjects,
  type SiteSettings,
  type Page,
  type Project
} from "@repo/db";

// Rich text types for Lexical editor
interface LexicalNode {
  type: string;
  children?: LexicalNode[];
  text?: string;
  tag?: string; // For heading nodes
}

interface RichTextData {
  root?: LexicalNode;
}

// Initialize the CMS client for build-time data fetching
let isInitialized = false;

export async function initializeCMS() {
  if (isInitialized) return;
  
  try {
    // Use environment variables with proper fallbacks
    const environment = (process.env.NODE_ENV as "development" | "staging" | "production") || "development";
    const apiUrl = process.env.PAYLOAD_API_URL || (environment === "production" 
      ? "https://cms.jaredconnor.dev/api" 
      : "http://localhost:3002/api"); // Updated default port to match CMS
    
    initializeRestClient({
      apiUrl,
      environment,
      cache: {
        enabled: true,
        ttl: 5 * 60 * 1000, // 5 minutes for build-time caching
        maxSize: 100,
      },
      timeout: 10000,
      retry: {
        attempts: 3,
        delay: 1000,
        backoff: "exponential"
      },
    });
    isInitialized = true;
    console.log(`CMS initialized for ${environment} environment with URL: ${apiUrl}`);
  } catch (error) {
    console.error("Failed to initialize CMS client:", error);
  }
}

// Utility function to safely fetch CMS data with fallbacks
export async function fetchCMSData<T>(
  fetcher: () => Promise<T>,
  fallback: T,
  errorMessage = "Failed to fetch CMS data"
): Promise<T> {
  try {
    await initializeCMS();
    return await fetcher();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    return fallback;
  }
}

// Site Settings Utilities
export async function getSiteSettingsWithFallback(): Promise<SiteSettings | null> {
  return await fetchCMSData(
    () => getSiteSettings(2),
    null,
    "Failed to fetch site settings"
  );
}

export async function getSiteInfoWithFallback() {
  return await fetchCMSData(
    () => getSiteInfo(),
    {
      siteName: "Jared Connor",
      siteDescription: "Personal website and digital garden of Jared Connor",
      siteUrl: "https://jaredtconnor.com",
      logo: undefined,
      favicon: undefined,
    },
    "Failed to fetch site info"
  );
}

export async function getNavigationWithFallback() {
  return await fetchCMSData(
    () => getNavigation(),
    [
      { label: "Home", type: "path" as const, path: "/", newTab: false },
      { label: "About", type: "path" as const, path: "/about", newTab: false },
      { label: "Work", type: "path" as const, path: "/work", newTab: false },
      { label: "Blog", type: "url" as const, url: "/blog", newTab: false },
    ],
    "Failed to fetch navigation"
  );
}

export async function getSocialLinksWithFallback() {
  return await fetchCMSData(
    () => getSocialLinks(),
    [
      { platform: "github" as const, url: "https://github.com/jaredtconnor" },
      { platform: "linkedin" as const, url: "https://linkedin.com/in/jaredtconnor" },
    ],
    "Failed to fetch social links"
  );
}

export async function getFooterContentWithFallback() {
  return await fetchCMSData(
    () => getFooterContent(),
    {
      copyrightText: "© 2024 Jared Connor. All rights reserved.",
      footerLinks: [],
      footerContent: null,
    },
    "Failed to fetch footer content"
  );
}

// Content Utilities
export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  return await fetchCMSData(
    async () => {
      const result = await getProjects({
        where: { featured: { equals: true } },
        limit,
        sort: "-createdAt"
      });
      return result.docs;
    },
    [],
    "Failed to fetch featured projects"
  );
}

export async function getPublishedPages(): Promise<Page[]> {
  return await fetchCMSData(
    async () => {
      const result = await getPages({
        where: { status: { equals: "published" } },
        sort: "navigationOrder"
      });
      return result.docs;
    },
    [],
    "Failed to fetch published pages"
  );
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  return await fetchCMSData(
    async () => {
      const result = await getPages({
        where: { slug: { equals: slug } },
        limit: 1
      });
      return result.docs[0] || null;
    },
    null,
    `Failed to fetch page with slug: ${slug}`
  );
}

// Rich Text Utilities
export function processRichText(richText: RichTextData | null | undefined): string {
  // Simple rich text processing - convert Lexical JSON to HTML
  // This is a basic implementation - you might want to use a proper Lexical renderer
  if (!richText || !richText.root) return "";
  
  try {
    return extractTextFromLexical(richText.root);
  } catch (error) {
    console.error("Error processing rich text:", error);
    return "";
  }
}

function extractTextFromLexical(node: LexicalNode): string {
  if (!node || !node.children) return "";
  
  return node.children.map((child: LexicalNode) => {
    if (child.type === "text") {
      return child.text || "";
    } else if (child.type === "paragraph") {
      return `<p>${extractTextFromLexical(child)}</p>`;
    } else if (child.type === "heading") {
      const level = child.tag || "h2";
      return `<${level}>${extractTextFromLexical(child)}</${level}>`;
    } else if (child.children) {
      return extractTextFromLexical(child);
    }
    return "";
  }).join("");
}

// SEO Utilities
export function buildPageTitle(pageTitle?: string, siteSettings?: SiteSettings | null): string {
  const siteName = siteSettings?.siteName || "Jared Connor";
  const titleTemplate = siteSettings?.seoTitle || "%s | %s";
  
  if (!pageTitle) return siteName;
  
  if (titleTemplate.includes("%s")) {
    return titleTemplate.replace("%s", pageTitle).replace("%s", siteName);
  }
  
  return `${pageTitle} | ${siteName}`;
}

export function buildPageDescription(pageDescription?: string, siteSettings?: SiteSettings | null): string {
  return pageDescription || 
         siteSettings?.seoDescription || 
         siteSettings?.siteDescription ||
         "Personal website and digital garden of Jared Connor";
}

// URL Utilities  
export function resolveNavigationUrl(navItem: NonNullable<SiteSettings["navLinks"]>[0]): string {
  switch (navItem.type) {
    case "page":
      return navItem.page?.slug ? `/${navItem.page.slug}` : "/";
    case "url":
      return navItem.url || "/";
    case "path":
      return navItem.path || "/";
    default:
      return "/";
  }
}

export function formatSocialPlatformName(platform: string): string {
  const platformNames: Record<string, string> = {
    github: "GitHub",
    linkedin: "LinkedIn",
    twitter: "Twitter/X",
    instagram: "Instagram",
    youtube: "YouTube",
    discord: "Discord",
  };
  
  return platformNames[platform] || platform;
}