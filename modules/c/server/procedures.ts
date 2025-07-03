import { db } from "@/lib/db";
import { z } from "zod";
import { chats } from "@/lib/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, lt, or } from "drizzle-orm";

export const ChatRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const [existingChat] = await db
        .select()
        .from(chats)
        // .where(eq(chats.id, id));
        .where(and(eq(chats.id, id), eq(chats.userId, ctx.auth.user.id)));

      if (!existingChat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No chats found",
        });
      }
      return existingChat;
    }),
});
