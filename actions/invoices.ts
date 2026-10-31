'use server'
// exports an async function which accepts data of type 'FormData'

import {auth} from '@clerk/nextjs/server'
import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { useUser } from '@clerk/nextjs'


export const createInvoice = async(formData : FormData) => {



    // verify user is logged in
    const user = await auth()
    const userId = user.userId
    console.log(userId)
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
        where tutor_id = ${userId}
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

export async function markAsPaid(invoiceId: string) {
    /*  
        processes invoice as marked
        returns success and errors (if any)
    */

    // validate user id exists
    const {userId} = await auth()
    if (!userId) return {
        success: false,
        errors: {
            _form: 'Unauthorised!'
        }
    }

    // update db
    try {
        // 1| sql query
        const result = await sql`
            update invoices
            set status = 'paid', paid_at = now()
            where id=${invoiceId} and tutor_id=${userId}
            returning id
        `

        // 2| error - return success as false + error
        if (result.length === 0) {
            return {
                success: false,
                errors: {
                    _form: 'Invoice not found'
                }
            }
        }

        // 3| redirect path
        revalidatePath('/home/invoices')

        // 4| no errors - return success as true
        return {
            success: true
        }

    } catch(err) {
        console.error('Failed to mark invoice as paid: ', err)
        return {
            success: false,
            errors: {
                _form: 'Oops! Something went wrong.'
            }
        }
    }
}