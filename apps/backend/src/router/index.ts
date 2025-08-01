import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { Context } from '../context.js';

const t = initTRPC.context<Context>().create();

const router = t.router;
const publicProcedure = t.procedure;

// Health check procedure
const healthRouter = router({
  check: publicProcedure
    .query(() => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'Backend API is running'
      };
    }),
});

// Posts router (placeholder for future CMS integration)
const postsRouter = router({
  getAll: publicProcedure
    .query(async () => {
      // TODO: Implement with actual database queries
      return [
        {
          id: '1',
          title: 'Welcome to the Blog',
          content: 'This is a sample post',
          createdAt: new Date().toISOString()
        }
      ];
    }),
  
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // TODO: Implement with actual database queries
      return {
        id: input.id,
        title: 'Sample Post',
        content: 'This is a sample post content',
        createdAt: new Date().toISOString()
      };
    }),
});

// Projects router
const projectsRouter = router({
  getAll: publicProcedure
    .query(async () => {
      // TODO: Implement with actual database queries
      return [
        {
          id: '1',
          title: 'Sample Project',
          description: 'A sample project description',
          technologies: ['TypeScript', 'React', 'Next.js'],
          githubUrl: 'https://github.com/jaredtconnor/sample-project',
          liveUrl: 'https://sample-project.com'
        }
      ];
    }),
});

// Combined app router
const appRouter = router({
  health: healthRouter,
  posts: postsRouter,
  projects: projectsRouter,
});

export { appRouter };
export type AppRouter = typeof appRouter;