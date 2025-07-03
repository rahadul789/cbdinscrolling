// import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

// export const usersTable = pgTable("users", {
//   id: integer().primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar({ length: 255 }).notNull(),
//   age: integer().notNull(),
//   email: varchar({ length: 255 }).notNull().unique(),
// });

import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  jsonb,
  timestamp,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  chats: many(chats),
  // projects: many(projects), eta ami add korsi, future a lagbe
}));

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});
/////////////////////////////////////////////////////////////////////////

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("name_idx").on(t.name)]
);

export const projectInsertSchema = createInsertSchema(projects);
export const projectUpdateSchema = createUpdateSchema(projects);
export const projectSelectSchema = createSelectSchema(projects);

export const projectRelations = relations(user, ({ many }) => ({
  chats: many(chats),
}));

export const chats = pgTable(
  "chats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    messages: text("messages").notNull(),
    images: jsonb("images").$type<string[]>().default([]),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null", // ekhane onDelete cascade hobe// check it in future // amra case cascade hobe
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
  // (t) => [uniqueIndex("title_index").on(t.title)]
);

// ey nicher chatRelationc code na likhlew hobe
export const chatRelations = relations(chats, ({ one }) => ({
  user: one(user, {
    fields: [chats.userId],
    references: [user.id],
  }),
  project: one(projects, {
    fields: [chats.projectId],
    references: [projects.id],
  }),
}));

// with relations can not work if i do not set relationship like avobes
// If i choose normal realtion like join then i do not need this avobe realtions
