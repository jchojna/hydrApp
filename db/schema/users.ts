import { pgTable, text, uniqueIndex, varchar } from "drizzle-orm/pg-core"
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
