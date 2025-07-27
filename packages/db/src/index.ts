import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// PayloadCMS types are available from the CMS app:
// import type { Post, User, Page, Project, Tag, Media } from '@repo/cms/src/payload-types'

// The main content models (User, Post, Page, Project, Tag, Media) are now managed by PayloadCMS
// Use the PayloadCMS REST API or GraphQL API to interact with content data
