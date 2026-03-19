import {
  integer,
  numeric,
  pgTable,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core"
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod"

import { timestamps, uuidPrimaryKey } from "./utils"

export const usersTable = pgTable(
  "users",
  {
    id: uuidPrimaryKey,
    email: varchar("email", { length: 255 }).notNull(),
    password: text("password").notNull(),
    username: varchar("username", { length: 255 }).notNull().default(""),
    age: integer("age").notNull().default(18),
    sex: varchar("sex", { length: 20 }).notNull().default("male"),
    max_water_per_day: numeric("max_water_per_day").notNull().default("3"),
    glass_volume: numeric("glass_volume").notNull().default("0.25"),
    ...timestamps,
  },
  (table) => [uniqueIndex().on(table.email)],
)

// zod validation used to validate payloads and generate schema for swagger
export const userViewSchema = createSelectSchema(usersTable)
export const userInsertSchema = createInsertSchema(usersTable)
export const userUpdateSchema = createUpdateSchema(usersTable)

export type SelectUser = typeof usersTable.$inferSelect
export type InsertUser = typeof usersTable.$inferInsert
