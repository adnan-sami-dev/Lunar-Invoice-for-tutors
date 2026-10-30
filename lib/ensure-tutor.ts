import { currentUser } from "@clerk/nextjs/server";
import { sql } from "./db";

export async function ensureTutor() {
    const user = await currentUser()
    if (!user) return null

    const userId = user.id
    const email = user.emailAddresses[0]?.emailAddress || ''

    await sql`
        insert into tutors (id, email)
        values (${userId}, ${email})
        on conflict (id) do nothing
    `

    return userId
}