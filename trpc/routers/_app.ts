import { createTRPCRouter } from "../init";

import { ChatRouter } from "@/modules/c/server/procedures";
import { ChatsRouter } from "@/modules/chats/server/procedures";
import { projectsRouter } from "@/modules/projects/server/procedures";
export const appRouter = createTRPCRouter({
  chat: ChatRouter,
  chats: ChatsRouter,
  projects: projectsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
