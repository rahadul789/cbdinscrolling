import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
export const createTRPCContext = cache(async () => {
  // eta always run kore no matter its public or private procedure
  // TODO: amr mone hocche eta jonno amr app kichu ta slow run korte pare
  // jehetu always call korche
  // tay amk eta change kore dekhte hobe route er jonno
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  // console.log("Its being called");

  // // this authId from better-auth , not from database
  // return { authId: session?.user.id };
  /////////////// ami uporer code ta comment kore disi
  return { userId: "user_123" };
});

// export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  //// ekhane const t = initTRPC.context<Context>().create({ chilo
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
// export const protectedProcedure = t.procedure.use(async function isAuthed({
//   ctx,
//   next,
// }) {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session) {
//     throw new TRPCError({
//       code: "UNAUTHORIZED",
//       message: "Unauthorized",
//     });
//   }

//   const [users] = await db // users disi schema r jonno
//     .select()
//     .from(user)
//     .where(eq(user.id, session.user.id))
//     .limit(1);

//   if (!users) {
//     throw new TRPCError({
//       code: "UNAUTHORIZED",
//       message: "Unauthorized",
//     });
//   }

//   // return opts.next({
//   //   ctx: { ...ctx, user: users, },
//   // });
//   return next({ ctx: { ...ctx, user: user } });
// });

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  return next({ ctx: { ...ctx, auth: session } });
});
