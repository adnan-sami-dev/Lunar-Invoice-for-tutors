'use client'

import { addStudent } from "@/actions/students";
import { useState, useEffect } from "react";

type FormErrors = {
    firstName?: string;
    lastName?: string;
    email?: string;
    _form?: string;
}

const CreateStudentModal = ({onClose} : {onClose: () => void}) => {
    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // escape to close
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleEscape)

        return window.removeEventListener('keydown', handleEscape)
    }, [onClose])

    // lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    // handle form submission
    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)   // disables submit button in UI
        setErrors({})           // set errors to empty upon the start of every form submission

        const result = await addStudent(formData)

        if (result.success) {
            onClose()
        } else {
            setErrors(result.errors || {})
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
                <h1 className='font-bold text-2xl text-center mb-10'>Add a Student</h1>

                <form action={handleSubmit} className='space-y-4'>

                    {errors._form && (
                        <div className="p-3 bg-red-100 text-red-800 rounded text-sm max-sm:text-xs">
                            {errors._form}
                        </div>
                    )}

                    {/* Enter first name - required */}
                    <div className='flex flex-col gap-2'>
                        <label className='text-gray-500'>First Name</label>
                        <input name='firstName' type='text' required
                            className='w-full rounded-lg bg-black/10 p-2 text-sm max-sm:text-xs' />

                        {
                            errors.firstName && (
                                <span className="p-3 bg-red-100 text-red-800 rounded text-sm max-sm:text-xs">{errors.firstName}</span>
                            )
                        }
                    </div>

                    {/* Last name - required */}
                    <div className='flex flex-col gap-2'>
                        <label className='text-gray-500'>Last Name</label>
                        <input name='lastName' type='text' required 
                            className='w-full rounded-lg bg-black/10 p-2 text-sm max-sm:text-xs'/>

                        {
                            errors.lastName && (
                                <span className="p-3 bg-red-100 text-red-800 rounded text-sm max-sm:text-xs">{errors.lastName}</span>
                            )
                        }
                    </div>

                    {/* Email - required */}
                    <div className='flex flex-col gap-2'>
                        <label className='text-gray-500'>Email</label>
                        <input name='email' type='email' required 
                            className='w-full rounded-lg bg-black/10 p-2 text-sm max-sm:text-xs'/>

                        {
                            errors.email && (
                                <span className="p-3 bg-red-100 text-red-800 rounded text-sm max-sm:text-xs">{errors.email}</span>
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

export default CreateStudentModal