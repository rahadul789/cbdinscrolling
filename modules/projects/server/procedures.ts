import { db } from "@/lib/db";
import { projects, projectUpdateSchema } from "@/lib/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { z } from "zod";
import { and, desc, eq, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const projectsRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const [newChat] = await db
      .insert(projects)
      .values({
        name: "Untitled-" + new Date().getTime().toString(),
        userId: ctx.auth.user.id,
      })
      .returning();

    return newChat;
  }),

  update: protectedProcedure
    .input(projectUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Project id is required",
        });
      }
      const [updatedChat] = await db
        .update(projects)
        .set({
          name: input.name,
        })
        .where(
          and(eq(projects.id, input.id), eq(projects.userId, ctx.auth.user.id))
        )
        .returning();

      if (!updatedChat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      return updatedChat;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [removedChat] = await db
        .delete(projects)
        .where(
          and(eq(projects.id, input.id), eq(projects.userId, ctx.auth.user.id))
        )
        .returning();

      if (!removedChat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      return removedChat;
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
});
