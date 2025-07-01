import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { projectInsertSchema } from "../schemas";
import { z } from "zod";
import { and, desc, eq, lt, or } from "drizzle-orm";

export const projectsRouter = createTRPCRouter({
  create: protectedProcedure
    // .input(projectInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [newChat] = await db
        .insert(projects)
        .values({
          name: "Untitled" + new Date().getTime().toString(),
          userId: ctx.auth.user.id,
        })
        .returning();

      return newChat;
    }),

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
        .from(projects)
        .where(
          and(
            eq(projects.userId, ctx.auth.user.id),
            cursor
              ? or(
                  lt(projects.updatedAt, cursor.updatedAt),
                  and(
                    eq(projects.updatedAt, cursor.updatedAt),
                    lt(projects.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(projects.updatedAt), desc(projects.id))
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
    }),

  // .query(async ({ ctx, input }) => {
  //       const { cursor, limit } = input;
  //       const data = await db
  //         .select()
  //         .from(chats)
  // .where(
  //   and(
  //     eq(chats.userId, ctx.auth.user.id),
  //     cursor
  //       ? or(
  //           lt(chats.updatedAt, cursor.updatedAt),
  //           and(
  //             eq(chats.updatedAt, cursor.updatedAt),
  //             lt(chats.id, cursor.id)
  //           )
  //         )
  //       : undefined
  //   )
  // )
  //   .orderBy(desc(chats.updatedAt), desc(chats.id))
  //   // Add 1 to the limit to check there has more data
  //   .limit(limit + 1);

  // const hasMore = data.length > limit;
  // //Remove the last item if there is more data
  // const items = hasMore ? data.slice(0, -1) : data;
  // // Set the next cursor to the last item if there is more data
  // const lastItem = items[items.length - 1];
  // const nextCursor = hasMore
  //   ? {
  //       id: lastItem.id,
  //       updatedAt: lastItem.updatedAt,
  //     }
  //   : null;

  // return {
  //   items,
  //   nextCursor,
  // };
  // }),
});
