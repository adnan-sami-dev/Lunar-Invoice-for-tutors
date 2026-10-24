// ability to add new student (email as id, first name, and last name)
// display student list (with ability to remove student)
// server component fetches students list from Neon, client component displays it, server action saves to Neon

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import StudentsClient from "./StudentsClient"

type Student = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
}

const StudentPage = async() => {

    // verify user is signed in
    const {userId} = await auth()
    if (!userId) {
        redirect('/sign-in')
    }

    // retrieve the list of students if user signed in
    const students: Student[] = await sql`
        select id, first_name, last_name, created_at, email
        from students
        where tutor_id = ${userId}
        order by first_name asc
    ` as Student[]

    return (
        <StudentsClient students={students} />
    )

}

export default StudentPage