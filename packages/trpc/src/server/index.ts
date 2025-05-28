import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from '../routers'
import { createContext } from '../context'


export const trpcExpress = createExpressMiddleware({
  router: appRouter,
  createContext: createContext,
})