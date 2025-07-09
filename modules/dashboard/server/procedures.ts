import { db } from "@/lib/db";
import { z } from "zod";
import { chats, playlistChats, projects } from "@/lib/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, inArray, lt, notExists, or } from "drizzle-orm";

export const ChatsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;

      const data = await db
        .select()
        .from(chats)
        .where(
          and(
            eq(chats.userId, ctx.auth.user.id),
            notExists(
              db
                .select()
                .from(playlistChats)
                .where(eq(playlistChats.chatId, chats.id))
            ),
            cursor
              ? or(
                  lt(chats.updatedAt, cursor.updatedAt),
                  and(
                    eq(chats.updatedAt, cursor.updatedAt),
                    lt(chats.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(chats.updatedAt), desc(chats.id))
        // Add 1 to the limit to check there has more data
        .limit(limit + 1);

      const hasMore = data.length > limit;
      //Remove the last item if there is more data
      const items = hasMore ? data.slice(0, -1) : data;
      // Set the next cursor to the last item if there is more data
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };

      // await new Promise((resolve) => setTimeout(resolve, 5000));
      // throw new TRPCError({ code: "BAD_REQUEST", message: "Specific Message" }); // ekhane error ashle eta unhandled rernder hote thake , eta @tanstack/react-query uhandled rerender likhe research korley solution pawa jabe, suggested solution holo lower version use kora and another package install kora type

      // return data;
    }),
});
