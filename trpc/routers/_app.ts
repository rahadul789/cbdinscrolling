import { createTRPCRouter } from "../init";

// import { ChatRouter } from "@/modules/c/server/procedures";
import { ChatsRouter } from "@/modules/chats/server/procedures";
import { projectsRouter } from "@/modules/projects/server/procedures";
import { SearchRouter } from "@/modules/search/server/procedures";
export const appRouter = createTRPCRouter({
  // chat: ChatRouter,
  chats: ChatsRouter,
  projects: projectsRouter,
  search: SearchRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
