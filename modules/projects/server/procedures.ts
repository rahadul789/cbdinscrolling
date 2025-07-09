import { db } from "@/lib/db";
import { chats, projectChats, projects, user } from "@/lib/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { z } from "zod";
import {
  and,
  desc,
  eq,
  exists,
  getTableColumns,
  lt,
  ne,
  notExists,
  or,
  sql,
} from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";
const generateId = () => uuidv4().replace(/-/g, "");

export const projectsRouter = createTRPCRouter({
  // CREATE PROJECT
  createProject: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { name } = input;

      const [newProjects] = await db
        .insert(projects)
        .values({
          url: generateId().toString(), // no need this ; delete it later
          name,
          userId: ctx.auth.user.id,
        })
        .returning();

      if (!newProjects) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return newProjects;
    }),

  // UPDATE PROJECT NAME
  update: protectedProcedure
    .input(z.object({ name: z.string(), id: z.string().uuid() }))
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

  // REMOVE PROJECT
  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(chats).where(
        exists(
          db
            .select()
            .from(projectChats)
            .where(
              and(
                eq(projectChats.projectId, input.id),
                eq(projectChats.chatId, chats.id)
              )
            )
        )
      );

      const [removedProject] = await db
        .delete(projects)
        .where(
          and(eq(projects.id, input.id), eq(projects.userId, ctx.auth.user.id))
        )
        .returning();

      if (!removedProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return removedProject;
    }),

  // GET ALL PROJECTS
  getProjects: protectedProcedure
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
        .select({
          ...getTableColumns(projects),
          chatCount: db.$count(
            projectChats,
            eq(projects.id, projectChats.projectId)
          ),
          user: user,
        })
        .from(projects)
        .innerJoin(user, eq(projects.userId, user.id))
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

  // FETCHING PROJECTS FOR ADD TO PROJECT
  getAddToProject: protectedProcedure
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

  // ADD TO PROJECT
  addToProject: protectedProcedure
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
      // if(existingPlaylist.userId !== ctx.auth.user.id){
      //   throw new TRPCError({code: "FORBIDDEN"})
      // }

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

      const [existingProjectChat] = await db
        .select()
        .from(projectChats)
        .where(
          and(
            eq(projectChats.projectId, projectId),
            eq(projectChats.chatId, chatId)
          )
        );

      if (existingProjectChat) {
        throw new TRPCError({ code: "CONFLICT" });
      }

      const [createdProjectlistChat] = await db
        .insert(projectChats)
        .values({ projectId, chatId })
        .returning();

      return createdProjectlistChat;
    }),

  // GET PROJECT BY URL
  getProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const [existingPlaylist] = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, id), eq(projects.userId, ctx.auth.user.id)));

      if (!existingPlaylist) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return existingPlaylist;
    }),

  // GET ALL PROJECT'S CHAT
  getProjectChats: protectedProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
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
      const { cursor, limit, projectId } = input;

      const [existingProject] = await db
        .select()
        .from(projects)
        .where(
          and(eq(projects.id, projectId), eq(projects.userId, ctx.auth.user.id))
        );

      if (!existingProject) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const chatsFromProjects = db.$with("project_chats").as(
        db
          .select({
            chatId: projectChats.chatId,
          })
          .from(projectChats)
          .where(eq(projectChats.projectId, projectId)) // it will brings array of element
      );

      // console.log("pppppppppppppppppp:>", chatsFromProjects);

      const data = await db
        .with(chatsFromProjects)
        .select({
          ...getTableColumns(chats),
          user: user,
          // chatCount: db.$count(
          //   projectChats,
          //   eq(projects.id, projectChats.projectId)
          // ),
        })
        .from(chats)
        .innerJoin(user, eq(chats.userId, user.id))
        .innerJoin(chatsFromProjects, eq(chats.id, chatsFromProjects.chatId))
        .where(
          // and(
          // eq(projects.userId, ctx.auth.user.id),
          cursor
            ? or(
                lt(chats.updatedAt, cursor.updatedAt),
                and(
                  eq(chats.updatedAt, cursor.updatedAt),
                  lt(projects.id, cursor.id)
                )
              )
            : undefined
          // )
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

  // GET ALL PROJECTS EXCEPT FOR THE CURRENT CHAT INCLUDED PROJECT
  getProjectsEcxeptCurrentOne: protectedProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
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
      const { cursor, limit, projectId } = input;
      const data = await db
        .select()
        .from(projects)
        .where(
          and(
            ne(projects.id, projectId),
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

  // MOVE CHAT ONE PROJECT TO ANOTHER PROJECCT
  moveChat: protectedProcedure
    .input(
      z.object({
        fromProjectId: z.string().uuid(),
        toProjectId: z.string().uuid(),
        chatId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { fromProjectId, toProjectId, chatId } = input;

      const [updateChatProject] = await db
        .update(projectChats)
        .set({
          projectId: toProjectId,
        })
        .where(
          and(
            eq(projectChats.projectId, fromProjectId),
            eq(projectChats.chatId, chatId)
          )
        )
        .returning();

      if (!updateChatProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      return updateChatProject;
    }),
});
