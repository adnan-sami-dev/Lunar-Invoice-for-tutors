'use client'

import {useState, useEffect} from 'react'
import { createInvoice } from '@/actions/invoices'


type Student = {
    id : string;
    first_name : string;
    last_name : string;
}

type FormErrors = {
    amount?: string;
    description?: string;
    dueDate?: string;
    studentId?: string;
    _form?: string;
}

const CreateInvoiceModal = ({students, onClose} : {
    students : Student[];
    onClose : () => void;
}) => {

    // state for holding any errors in form input or processing database update
    const [errors, setErrors] = useState<FormErrors>({})
    // state for blocking/ un-blocking form submit button
    const [isSubmitting, setIsSubmitting] = useState(false)



    // __________ close modal form when Esc key pressed on keyboard
    useEffect( () => {

        
        const handleEscape = (event: KeyboardEvent) => {
            // function to handle Esc press

            if (event.key === 'Escape') onClose()                 // recall : onClose() makes isModalOpen false!
        }

        // create keyboard event listener
        window.addEventListener('keydown', handleEscape)          // keydown : ...

        // remove event listener - ...
        return () => {
            window.removeEventListener('keydown', handleEscape)
        }
    }, [onClose])


    
    // ___________ prevent body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);



    // ___________ handle form submission asynchronously
    const handleSubmit = async(formData : FormData) => {
        // takes input of built-in type FormData
        // processes it

        setIsSubmitting(true)           // -> disables submit button : prevents repeated submission clicks
        setErrors({})                   // -> refreshes errors state upon new submission request

        const result = await createInvoice(formData)        // using custom server action to process form inputs

        if (result?.success) {                              // recall : result is a returned object with first key as 'success'
                                                            // and second key as 'errors' if any were created
            onClose()
        } else if (result && !result.success) {
            setErrors(result.errors as FormErrors)          // assertion to remove TS warnings
            setIsSubmitting(false)
        }
    }

    return (
        <div className = 'fixed inset-0 flex justify-center items-center max-sm:text-xs'>
            {/* ___ Backdrop ___ */}
            <div
                className = 'absolute inset-0 bg-black/50 backdrop-blur-2xl'
                onClick={onClose}
                aria-hidden = 'true'
            ></div>


            {/* ___ Modal ___ */}
            <div className='bg-white/80 text-black z-50 rounded-2xl py-10 px-15 max-sm:px-5 max-w-200 w-3/4'>
                <h1 className='font-bold text-2xl text-center mb-10'>Create Invoice</h1>

                <form action={handleSubmit} className='space-y-4'>

                    {errors._form && (
                        <div className="p-3 bg-red-100 text-red-800 rounded text-sm max-sm:text-xs">
                            {errors._form}
                        </div>
                    )}

                    {/* Choose a student - required */}
                    <div className='flex flex-col gap-2'>
                        <label className='text-gray-500'>Student</label>
                        <select name='studentId' required 
                            className='w-full rounded-lg bg-black/10 p-2 text-sm max-sm:text-xs'>
                            <option value=''>
                                Select a student
                            </option>

                            {
                                students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        <span>{student.first_name}</span>
                                        <span>{student.last_name}</span>
                                    </option>
                                ))
                            }
                        </select>

                        {
                            errors.studentId && (
                                <span className="p-3 bg-red-100 text-red-800 rounded text-sm max-sm:text-xs">{errors.studentId}</span>
                            )
                        }
                    </div>

                    {/* Enter an Amount - required */}
                    <div className='flex flex-col gap-2'>
                        <label className='text-gray-500'>Amount</label>
                        <input name='amount' type='number' required step='0.01' min='0.01' 
                            className='w-full rounded-lg bg-black/10 p-2 text-sm max-sm:text-xs' />

                        {
                            errors.amount && (
                                <span className="p-3 bg-red-100 text-red-800 rounded text-sm max-sm:text-xs">{errors.amount}</span>
                            )
                        }
                    </div>

                    {/* Description - required */}
                    <div className='flex flex-col gap-2'>
                        <label className='text-gray-500'>Description</label>
                        <textarea name='description' rows={3} required 
                            className='w-full rounded-lg bg-black/10 p-2 text-sm max-sm:text-xs'/>

                        {
                            errors.description && (
                                <span className="p-3 bg-red-100 text-red-800 rounded text-sm max-sm:text-xs">{errors.description}</span>
                            )
                        }
                    </div>

                    {/* Due Date - required */}
                    <div className='flex flex-col gap-2'>
                        <label className='text-gray-500'>Due date</label>
                        <input name='dueDate' type='date' required 
                            className='w-full rounded-lg bg-black/10 p-2 text-sm max-sm:text-xs'/>

                        {
                            errors.dueDate && (
                                <span className="p-3 bg-red-100 text-red-800 rounded text-sm max-sm:text-xs">{errors.dueDate}</span>
                            )
                        }
                    </div>


                    {/* Action buttons */}
                    <div className='flex flex-row gap-4 max-sm:justify-center justify-end mt-10'>
                        {/* Cancel button */}
                        <button className = 'bg-red-300 hover:bg-red-400 text-red-900 \
                            transition-colors duration-300 px-4 py-2 rounded-lg cursor-pointer'
                            onClick={onClose}>
                            Cancel
                        </button>
                        {/* Submit button */}
                        <button type='submit' className = 'bg-slate-400 hover:bg-slate-500 \
                            transition-colors duration-300 text-black px-4 py-2 rounded-lg cursor-pointer \
                            disabled:opacity-50 disabled:pointer-events-none'
                            disabled={isSubmitting}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
           
        </div>
    )
}

export default CreateInvoiceModal