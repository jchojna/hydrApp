import "dotenv/config"

import { hashPassword } from "@/lib/auth/password"
import { db } from "../index"
import { usersTable, consumptionTable } from "../schema"

type SeedUser = {
  email: string
  password: string
}

const usersToSeed: SeedUser[] = [
  {
    email: "a@a.com",
    password: "qq11QQ!!!",
  },
  {
    email: "b@b.com",
    password: "qq11QQ!!!",
  },
]

const baseDate = new Date()
baseDate.setHours(12, 0, 0, 0)

async function seed() {
  console.log("Starting database seeding...")

  // Clean up existing data
  // await db.delete(usersTable)
  // await db.delete(consumptionTable)

  for (const userToSeed of usersToSeed) {
    const hashedPassword = await hashPassword(userToSeed.password)

    const user = await db
      .insert(usersTable)
      .values({
        email: userToSeed.email,
        password: hashedPassword,
      })
      .onConflictDoNothing({
        target: usersTable.email,
      })
      .returning()
      .then((rows) => rows[0])

    console.log(`Created demo user: ${user.email}`)

    const consumptionValues = Array.from({ length: 21 }, (_, dayOffset) => {
      const day = new Date(baseDate)
      day.setDate(baseDate.getDate() - dayOffset)

      const amount =
        Math.floor(Math.random() * 3) + 0.25 * Math.floor(Math.random() * 4)

      return {
        user_id: user.id,
        date: day.toISOString().slice(0, 10),
        amount: amount.toString(),
      }
    })

    const consumptionRecords = await db
      .insert(consumptionTable)
      .values(consumptionValues)
      .onConflictDoNothing({
        target: [consumptionTable.user_id, consumptionTable.date],
      })
      .returning()

    console.log(`Created ${consumptionRecords.length} consumption records`)
  }
}

async function main() {
  await seed()
  console.log(
    "Seed completed: 2 users and 3 weeks of consumption data prepared.",
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    console.log("Seed script finished")
  })
