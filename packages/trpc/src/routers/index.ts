import {   router } from "../trpc";
import { publicProcedure } from "../procedures";
import { userRouter } from "./user";



export const appRouter = router({
  user: userRouter, 
});

export type AppRouter = typeof appRouter;