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
            <section>
                <h1>Students</h1>
                <button onClick={() => setIsStudentModalOpen(true)} 
                    className = 'cursor-pointer'
                >
                    + New Student
                </button>
            </section>

            {/* Student Grid */}
            <section>
                {
                    students.length === 0
                    ? <p>No students yet. Add a new student!</p>
                    : (
                        <div>
                            {   
                                students.map((student) => (
                                    <div key={student.id}>
                                        <span>{student.first_name}</span>
                                        <span>{student.last_name}</span>

                                        <button onClick={() => handleRemove(student.id, student.first_name, student.last_name)}>
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