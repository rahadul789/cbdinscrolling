import { z } from "zod";

export const projectInsertSchema = z.object({
  name: z.string().min(1, { message: "Title is required" }).default("Untitled"),
  description: z
    .string()
    .min(1, { message: "Messages is required" })
    .default("Nothing"),
});
