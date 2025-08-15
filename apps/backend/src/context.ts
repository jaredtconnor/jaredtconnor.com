import { inferAsyncReturnType } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type { Request, Response } from 'express';

export async function createContext({ req, res }: CreateExpressContextOptions): Promise<{
  req: Request;
  res: Response;
  mediaBucket?: string;
}> {
  return {
    req,
    res,
    mediaBucket: getMediaBucketName(),
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

// SST Resource access helper
export function getMediaBucketName(): string {
  // In SST development/production, this will be available via Resource linking
  try {
    // @ts-expect-error - SST Resource is injected at runtime
    return Resource?.MediaBucket?.name || process.env.MEDIA_BUCKET_NAME || '';
  } catch {
    return process.env.MEDIA_BUCKET_NAME || '';
  }
}