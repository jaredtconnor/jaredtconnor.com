import {initTRPC} from '@trpc/server'
import SuperJson from 'superjson';

export const t = initTRPC.context<{}>().create({
    transformer: SuperJson,
  });
  


export const router = t.router;
export const procedure = t.procedure;
