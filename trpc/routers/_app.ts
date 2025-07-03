import { ChatsRouter } from "@/modules/dashboard/server/procedures";
import { createTRPCRouter } from "../init";

import { projectsRouter } from "@/modules/projects/server/procedures";
import { ChatRouter } from "@/modules/c/server/procedures";
export const appRouter = createTRPCRouter({
  chat: ChatRouter,
  chats: ChatsRouter,
  projects: projectsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
