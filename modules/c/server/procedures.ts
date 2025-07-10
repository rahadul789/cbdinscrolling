// import { db } from "@/lib/db";
// import { z } from "zod";
// import { chats, user } from "@/lib/db/schema";
// import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
// import { TRPCError } from "@trpc/server";
// import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";

// export const ChatRouter = createTRPCRouter({
//   getOne: protectedProcedure
//     .input(z.object({ id: z.string().uuid() }))
//     .query(async ({ input, ctx }) => {
//       const { id } = input;
//       const [existingChat] = await db
//         .select
//         // { ...getTableColumns(chats), user: {...getTableColumns(user)} } // its like spread(...) operatot
//         ()
//         .from(chats)
//         // .innerJoin(user, eq(chats.userId, user.id)) // this is working like populate
//         .where(and(eq(chats.id, id), eq(chats.userId, ctx.auth.user.id)));

//       if (!existingChat) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "No chats found",
//         });
//       }
//       return existingChat;
//     }),
// });
