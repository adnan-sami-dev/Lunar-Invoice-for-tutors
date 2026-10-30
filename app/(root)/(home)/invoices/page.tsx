// server-side

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import InvoicesClient from "./InvoicesClient"
import { sql } from "@/lib/db"

type Invoice = {
  id: string;
  amount_owing: number;
  description: string;
  created_at: string;
  status: string;
  due_date: string;
  first_name: string;
  last_name: string;
  email: string;
}

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const Invoices = async() => {

  // retrieve user ID
  const {userId} = await auth()
  if (!userId) redirect('/sign-in')

  // fetch invoices for this tutor
  const invoices: Invoice[] = (await sql`
    select 
      i.id,
      i.amount_owing,
      i.invoice_description as description,
      i.created_at,
      i.status,
      i.due_date,
      s.first_name,
      s.last_name,
      s.email
    from
      invoices as i
    join
      students s on i.student_id = s.id
    where 
      i.tutor_id = ${userId}
  `) as Invoice[]   // asserting that proper types were received from sql query
  

  // fetch students for modal dropdown
  const students: Student[] = (await sql`
    select id, first_name, last_name
    from students
    where tutor_id = ${userId} 
  `) as Student[]   // asserting that proper types were received from sql query


  return (
    <InvoicesClient invoices = {invoices} students = {students} />
  )
}

export default Invoices