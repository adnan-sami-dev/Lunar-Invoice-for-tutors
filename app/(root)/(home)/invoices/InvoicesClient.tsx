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
    due_date: string;
    email: string;
}

type Student = {
    id : string;
    first_name : string;
    last_name : string;
    email : string;
}

const InvoicesClient = ({invoices, students} : {
    invoices: Invoice[]; 
    students: Student[];
}) => {

  const handleDelete = () => {
    // function to delete an invoice permanently + show a confirmation dialog before doing so ...
  }

  const markAsPaid = () => {
    
  }

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
            {
                invoices.length === 0 ? (
                    <p>
                        No Invoices yet. Create your first one!
                    </p>
                ) : (
                    <div>
                        {
                            invoices.map( (invoice) => (
                                <div key={invoice.id} >
                                    <h1>{invoice.amount_owing}</h1>
                                    <span>{new Date(invoice.due_date).toLocaleDateString()}</span>

                                    <div>
                                        <span>
                                            {invoice.first_name}
                                            {invoice.last_name}
                                        </span>
                                        <span>{invoice.email}</span>
                                    </div>

                                    <div>
                                        <button onClick={markAsPaid}>
                                            Mark as Paid
                                        </button>
                                        <button onClick={handleDelete}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
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