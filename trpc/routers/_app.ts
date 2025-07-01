import { ChatsRouter } from "@/modules/dashboard/server/procedures";
import { createTRPCRouter } from "../init";

import { projectsRouter } from "@/modules/projects/server/procedures";
export const appRouter = createTRPCRouter({
  chats: ChatsRouter,
  projects: projectsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
