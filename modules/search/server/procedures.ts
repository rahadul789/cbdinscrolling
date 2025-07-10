import { db } from "@/lib/db";
import { z } from "zod";
import { chats, projectChats, projects } from "@/lib/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, ilike, inArray, lt, notExists, or } from "drizzle-orm";

export const SearchRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        query: z.string().nullish(),
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
      const { cursor, limit, query } = input;

      const data = await db
        .select()
        .from(chats)
        .where(
          and(
            ilike(chats.title, `%${query}%`),
            eq(chats.userId, ctx.auth.user.id),
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
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
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
    }),
});
