import { cache } from "react"
import { eq } from "drizzle-orm"

import { db } from "@/db"
import { getSession } from "@/lib/auth/session"
// import { issues, users } from "@/db/schema"
// import { unstable_cacheTag as cacheTag } from "next/cache"
import { usersTable } from "@/db/schema"

export const getCurrentUser = cache(async () => {
  const session = await getSession()
  if (!session) return null

  // Skip database query during prerendering if we don't have a session
  // hack until we have PPR https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering
  if (
    typeof window === "undefined" &&
    process.env.NEXT_PHASE === "phase-production-build"
  ) {
    return null
  }

  try {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, session.userId))

    return result[0] || null
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
})

export const getUserByEmail = cache(async (email: string) => {
  try {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
    return result[0] || null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
})

// // Fetcher functions for React Query
// export async function getIssue(id: number) {
//   try {
//     const result = await db.query.issues.findFirst({
//       where: eq(issues.id, id),
//       with: {
//         user: true,
//       },
//     })
//     return result
//   } catch (error) {
//     console.error(`Error fetching issue ${id}:`, error)
//     throw new Error("Failed to fetch issue")
//   }
// }

// export async function getIssues() {
//   "use cache"
//   cacheTag("issues")
//   try {
//     const result = await db.query.issues.findMany({
//       with: {
//         user: true,
//       },
//       orderBy: (issues, { desc }) => [desc(issues.createdAt)],
//     })
//     return result
//   } catch (error) {
//     console.error("Error fetching issues:", error)
//     throw new Error("Failed to fetch issues")
//   }
// }
