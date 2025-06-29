import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { HomeRouter } from "@/modules/home/server/procedures";

import { TRPCError } from "@trpc/server";
export const appRouter = createTRPCRouter({
  chats: HomeRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
