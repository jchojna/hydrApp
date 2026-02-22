import { db } from "@/db"
import { usersTable } from "@/db/schema"
import { hashPassword } from "./password"

export async function createUser(email: string, password: string) {
  const hashedPassword = await hashPassword(password)

  try {
    const user = await db.insert(usersTable).values({
      email,
      password: hashedPassword,
    })

    return { id: user.id, email }
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}
