import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type ChatGetOneOutput = inferRouterOutputs<AppRouter>["chat"]["getOne"];
