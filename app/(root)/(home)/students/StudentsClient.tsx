'use client'

import { useState } from "react";
import { removeStudent } from "@/actions/students";

type Student = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
}

const StudentsClient = ( {students} : {students : Student[]} ) => {
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleRemove = async(id: string, firstName: string, lastName: string) => {
        // confirmation dialog
        const confirm = window.confirm(
            `Remove ${firstName} ${lastName}? Their invoices will also be deleted.`
        )

        if (!confirm) return

        // removal logic : call upon removeStudent function from server actions - students.ts
        setDeletingId(id)
        const result = await removeStudent(deletingId as string)
        setDeletingId(null)

        if (!result.success) {
            alert(result.errors?._form || 'Failed to remove student')
        }

    }

    return (
        <div>
            {/* Header */}
            <section>
                <h1>Students</h1>
                <button>
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


        </div>
    )
} 

export default StudentsClient