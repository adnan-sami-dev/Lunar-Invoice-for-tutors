'use client'

import { useState } from "react";
import CreateInvoiceModal from "@/components/CreateInvoiceModal";
import { deleteInvoice, markAsPaid } from "@/actions/invoices";

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

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
        {/* Header */}
        <section className='flex flex-col lg:flex-row justify-between items-center gap-5 mb-10'>
            <h1 className='text-4xl md:text-5xl font-bold'>Invoices</h1>
            <button onClick = {() => setIsModalOpen(true)}
                className = 'cursor-pointer bg-slate-400 rounded-2xl px-4 py-2 \
                 hover:bg-slate-500 transition-colors duration-300'>
                + 
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
                    <div className='grid grid-cols-3 max-sm:grid-cols-1 gap-3'>
                        {
                            invoices.map( (invoice) => (
                                <div key={invoice.id} className='flex flex-col justify-center items-center bg-create-join-buttons \
                                    rounded-2xl py-10 px-5 gap-10'>
                                    <h1 className='text-4xl font-bold'>${invoice.amount_owing}</h1>

                                    <div className='flex flex-col items-center justify-center'>
                                        <div className='flex flex-row gap-2 font-bold text-lg'>
                                            <span>
                                                {invoice.first_name}
                                            </span>
                                            <span>
                                                {invoice.last_name}
                                            </span>
                                        </div>
                                        <span className='text-sm italic'>{invoice.email}</span>
                                    </div>

                                    <div className='flex flex-col items-center justify-center gap-2'>
                                        <span className={`rounded-2xl px-3 py-1 border-2
                                        ${invoice.status === 'pending' ? 'bg-red-400 border-red-800' : 'bg-amber-500 border-amber-600'}`}>
                                            {invoice.status}
                                        </span>
                                        <span className='max-sm:text-xs text-sm opacity-80'>Due : {new Date(invoice.due_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}</span>
                                    </div>

                                    <div className='flex max-sm:flex-col flex-row items-center justify-center gap-2'>
                                        <button onClick={() => markAsPaid(invoice.id)}
                                            className='bg-gray-400 hover:bg-gray-500 text-sm \
                                            transition-colors duration-300 px-4 py-2 rounded-lg cursor-pointer'>
                                            Mark as Paid
                                        </button>
                                        <button onClick={() => deleteInvoice(invoice.id)}
                                            className='bg-gray-400 hover:bg-gray-500 text-sm \
                                            transition-colors duration-300 px-4 py-2 rounded-lg cursor-pointer'>
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