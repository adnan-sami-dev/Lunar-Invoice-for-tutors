// function that returns an html structure for an invoice email template

type InvoiceEmailProps = {
    studentName: string
    amount: number
    description: string
    tutorName: string
}

export function InvoiceEmail({studentName, amount, description, tutorName}: InvoiceEmailProps) {
    return (
        <div>
            <h1>Invoice from {tutorName}</h1>
            <p>Hi, {studentName}</p>
            <p>Here are the details for your recent invoice:</p>
            <ul>
            <li><strong>Description:</strong> {description}</li>
            <li><strong>Amount:</strong> ${amount.toFixed(2)}</li>
            </ul>
            <p>Please reach out if you have any questions.</p>
        </div>
    )
}