import { date, numeric, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core"
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod"

import { timestamps, uuidPrimaryKey } from "./utils"
import { usersTable } from "./users"

export const consumptionTable = pgTable(
  "consumption",
  {
    id: uuidPrimaryKey,
    user_id: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    amount: numeric("amount").default("0").notNull(),
    points: numeric("points").default("0").notNull(),
    date: date("date", { mode: "string" }).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("consumption_user_date_idx").on(table.user_id, table.date),
  ],
)

// zod validation used to validate payloads and generate schema for swagger
export const consumptionViewSchema = createSelectSchema(consumptionTable)
export const consumptionInsertSchema = createInsertSchema(consumptionTable)
export const consumptionUpdateSchema = createUpdateSchema(consumptionTable)

export type SelectConsumption = typeof consumptionTable.$inferSelect
export type InsertConsumption = typeof consumptionTable.$inferInsert
