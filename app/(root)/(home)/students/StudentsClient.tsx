'use client'

import { useState } from "react";
import { removeStudent } from "@/actions/students";
import CreateStudentModal from "@/components/CreateStudentModal";

type Student = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
}

const StudentsClient = ( {students} : {students : Student[]} ) => {
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)

    const handleRemove = async(id: string, firstName: string, lastName: string) => {
        // confirmation dialog
        const confirm = window.confirm(
            `Remove ${firstName} ${lastName}? Their invoices will also be deleted.`
        )

        if (!confirm) return

        // removal logic : call upon removeStudent function from server actions - students.ts
        const result = await removeStudent(id)

        if (!result.success) {
            alert(result.errors?._form || 'Failed to remove student')
        }

    }

    return (
        <div>
            {/* Header */}
            <section className='flex flex-col lg:flex-row justify-between items-center gap-5 mb-10'>
                <h1 className='text-4xl md:text-5xl font-bold'>Students</h1>
                <button onClick={() => setIsStudentModalOpen(true)} 
                    className = 'cursor-pointer bg-slate-400 rounded-2xl px-4 py-2 \
                    hover:bg-slate-500 transition-colors duration-300'
                >
                    +
                </button>
            </section>

            {/* Student Grid */}
            <section>
                {
                    students.length === 0
                    ? <p>No students yet. Add a new student!</p>
                    : (
                        <div className='grid grid-cols-3 max-sm:grid-cols-1 gap-3'>
                            {   
                                students.map((student) => (
                                    <div key={student.id} className='flex flex-col justify-center items-center bg-create-join-buttons \
                                    rounded-2xl py-10 px-5 gap-10'>
                                        <div className='flex flex-col items-center justify-center'>
                                            <span className='font-medium text-xl'>{student.first_name} {student.last_name}</span>
                                            <span className='text-xs opacity-80 italic'>{student.email}</span>
                                        </div>

                                        <button onClick={() => handleRemove(student.id, student.first_name, student.last_name)}
                                            className='bg-gray-400 hover:bg-gray-500 text-sm \
                                            transition-colors duration-300 px-4 py-2 rounded-lg cursor-pointer'>
                                            Remove
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </section>

            {/* Create Student Modal */}
            {
                isStudentModalOpen && (
                    <CreateStudentModal onClose = {() => setIsStudentModalOpen(false)} />
                )
            }
        </div>
    )
} 

export default StudentsClient