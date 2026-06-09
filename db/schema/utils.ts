import { timestamp, uuid } from "drizzle-orm/pg-core"

export const timestamps = {
  updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  deleted_at: timestamp({ withTimezone: true }),
}

export const uuidPrimaryKey = uuid().defaultRandom().primaryKey()
