import { db } from "@/lib/db";
import { z } from "zod";
import { chats, projectChats, projects } from "@/lib/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, inArray, lt, notExists, or } from "drizzle-orm";

export const ChatsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const [existingChat] = await db
        .select
        // { ...getTableColumns(chats), user: {...getTableColumns(user)} } // its like spread(...) operatot
        ()
        .from(chats)
        // .innerJoin(user, eq(chats.userId, user.id)) // this is working like populate
        .where(and(eq(chats.id, id), eq(chats.userId, ctx.auth.user.id)));

      if (!existingChat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No chats found",
        });
      }
      return existingChat;
    }),
  getChats: protectedProcedure
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
                .from(projectChats)
                .where(eq(projectChats.chatId, chats.id))
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

  // REMOVE CHAT FROM PROJECTs
  removeChat: protectedProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        chatId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, chatId } = input;

      const [existingPlaylist] = await db
        .select()
        .from(projects)
        .where(
          and(eq(projects.id, projectId), eq(projects.userId, ctx.auth.user.id))
        );

      if (!existingPlaylist) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [existingChat] = await db
        .select()
        .from(chats)
        .where(eq(chats.id, chatId));

      if (!existingChat) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [existingPlaylistChat] = await db
        .select()
        .from(projectChats)
        .where(
          and(
            eq(projectChats.projectId, projectId),
            eq(projectChats.chatId, chatId)
          )
        );

      if (!existingPlaylistChat) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [deletedPlaylistChat] = await db
        .delete(projectChats)
        .where(
          and(
            eq(projectChats.projectId, projectId),
            eq(projectChats.chatId, chatId)
          )
        )
        .returning();

      return deletedPlaylistChat;
    }),

  // DELETE CHAT
  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [removedChat] = await db
        .delete(chats)
        .where(and(eq(chats.id, input.id), eq(chats.userId, ctx.auth.user.id)))
        .returning();

      if (!removedChat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      return removedChat;
    }),

  // UPDATE CHAT NAME
  update: protectedProcedure
    .input(z.object({ title: z.string(), id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Chat id is required",
        });
      }
      const [updatedChat] = await db
        .update(chats)
        .set({
          title: input.title,
        })
        .where(and(eq(chats.id, input.id), eq(chats.userId, ctx.auth.user.id)))
        .returning();

      if (!updatedChat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      return updatedChat;
    }),
});
