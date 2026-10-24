'use server'

// purpose : add/remove student to database
// -> export two async functions

import {auth} from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { sql } from '@/lib/db'

export async function addStudent(formData : FormData) {
    // returns an object with first key as "success" with bool value, (and the second key as "errors" if any)
    // processes DB updates if input is valid and student doesn't already exist

    // verify user is logged in, otherwise send error
    const {userId} = await auth()
    if (!userId) {
        return {
            success : false,
            errors : {
                _form : 'Unauthorised!'
            }
        }
    }

    // get the inputs from form data
    const firstName = (formData.get('firstName') as string)?.trim()
    const lastName = (formData.get('lastName') as string)?.trim()
    const email = (formData.get('email') as string).trim().toLowerCase()    // why lower case ?

    // validate inputs
    const errors: Record<string, string> = {}   // record ? -> TS utility that creates an obj type with specified keys and values

    if (!firstName || firstName.length < 1) {
        errors.firstName = "First name is required"
    }

    if (!lastName || lastName.length < 1) {
        errors.lastName = "Last name is required"
    }

    // email validation
    // ...

    if (Object.keys(errors).length > 0) {
        return {
            success : false,
            errors
        }
    }

    // check if email entered already exists among the tutor's student list
    const existing = await sql`
        select id from students
        where tutor_id = ${userId} and email = ${email}
    `

    if (existing.length > 0) {
        return {
            success: false,
            errors: {
                email: "A student with this email already exists"
            }
        }
    }

    // once everything is checked, update the DB
    try {
        await sql`
            insert into students(id, first_name, last_name, tutor_id, email)
            values (
                gen_random_uuid()::text,
                ${firstName},
                ${lastName},
                ${userId},
                ${email}
            )
        `
        revalidatePath('/home/students')
        return {
            success: true
        }
    } catch(error) {
        console.error('Failed to add student: ', error)
        return {
            success: false,
            errors: {
                _form: "Oops! Something went wrong."
            }
        }
    }
}

export async function removeStudent(id: string) {

    // check if user is valid
    const {userId} = await auth()
    if (!userId) {
        return {
            success: false,
            errors: {
                _form: 'Unauthorised'
            }
        }
    }

    try {  
        // only delete if student belongs to this tutor
        const studentDeleted = await sql`
            delete from students
            where id = ${id} and tutor_id = ${userId}
            returning id
        `

        if (studentDeleted.length === 0) {
            return {
                success: false,
                errors: {
                    _form: 'Student not found!'
                }
            }
        }

        revalidatePath('/home/students')
        return {
            success: true
        }

    } catch(error) {
        console.error('Failed to delete student: ', error)
        return {
            success: false,
            errors: {
                _form: 'Something went wrong!'
            }
        }
    }
}   