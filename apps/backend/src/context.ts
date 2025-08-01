import { inferAsyncReturnType } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type { Request, Response } from 'express';

export async function createContext({ req, res }: CreateExpressContextOptions): Promise<{
  req: Request;
  res: Response;
}> {
  return {
    req,
    res,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;