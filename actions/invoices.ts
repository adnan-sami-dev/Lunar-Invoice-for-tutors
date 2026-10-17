'use server'
// exports an async function which accepts data of type 'FormData'

import {auth} from '@clerk/nextjs/server'
import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'


export const CreateInvoice = async(formData : FormData) => {



    // verify user is logged in
    const userId = await auth()
    if (!userId) {
        return {
            success: false,
            errors: { _form: 'Unauthorised'}
        }
    }



    // store form data in variables
    const amount = parseFloat(formData.get('amount') as string)             // HTML input always returns a string | File | null
                                                                            // we need a number, so convert to Number with parseFloat
                                                                            // 'as string' assertion because TS gives warning otherwise
                                                                            // for the input can be string | null
                                                                            // we lie to TS saying we 'know' it's a string

    const description = (formData.get('description') as string)?.trim()     // trim() does ...
    const dueDate = new Date(formData.get('dueDate') as string)
    const studentId = formData.get('studentId') as string



    // declare an errors object to hold key:value pairs (errors)
    const errors : Record<string, string> = {}


    // _________ Input Validation

    if (isNaN(amount) || amount <= 0) {
        errors.amount = "Amount must be positive and more than zero"
    }

    if (!description || description.length < 3) {
        errors.description = "Description must be at least 3 characters"
    }

    const today = new Date()
    today.setHours(0,0,0,0)

    if (isNaN(dueDate.getTime())) {
        errors.dueDate = "Please enter a valid date"
    } 

    if (dueDate < today) {
        errors.dueDate = "Due date can not be in the past"
    }

    if (!studentId) {
        errors.studentId = "Please select a student"
    }


    // return if errors
    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            errors
        }
    }


    // once input is okay, verify if the student belongs to this tutor
    const studentCheck = await sql`
        select id from students
        where id = ${studentId} and tutor_id = ${userId}
    `

    if (studentCheck.length === 0) {
        return {
            success : false,
            errors : {studentId : "Student ID not found"}
        }
    }
    
    

    // ______ after input validation
    try {
        await sql `
            INSERT INTO invoices(id, tutor_id, student_id, amount_owing, invoice_description, status, due_date )
            VALUES (
                gen_random_uuid()::text,
                ${userId},
                ${studentId},
                ${amount},
                ${description},
                'pending',
                ${dueDate}
            )
        `

        revalidatePath('/home/invoices')
        return {
            success : true
        }
    } catch(error) {
        console.error(error)
        return {
            success : false,
            errors : {_form : 'Something went wrong!'}
        }
    }
}