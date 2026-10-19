'use client'

import { useState } from "react";
import CreateInvoiceModal from "@/components/CreateInvoiceModal";

type Invoice = {
    id : string;
    amount_owing : number;
    description : string;
    created_at : string;
    status : string;
    first_name : string;
    last_name : string;
}

type Student = {
    id : string;
    first_name : string;
    last_name : string;
}

const InvoicesClient = ({invoices, students} : {
    invoices: Invoice[]; 
    students: Student[];
}) => {

  console.log(invoices)
  console.log(students)

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
        {/* Header */}
        <section>
            <h1>Invoices</h1>
            <button onClick = {() => setIsModalOpen(true)}>
                + Invoice
            </button>
        </section>

        {/* Invoices List */}
        {/* see and delete invoices + see how many days overdue + send manual reminders */}
        <section>

        </section>


        {/* Modal */}
        {isModalOpen && (
            <CreateInvoiceModal 
                students = {students}
                onClose = {() => setIsModalOpen(false)} />
        )}
    
    </div>
  )
}

export default InvoicesClient