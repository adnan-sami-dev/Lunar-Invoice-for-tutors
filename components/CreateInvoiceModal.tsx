'use client'

import {useState, useEffect} from 'react'


type Student = {
    id : string;
    first_name : string;
    last_name : string;
}

const CreateInvoiceModal = ({students, onClose} : {
    students : Student[];
    onClose : () => void;
}) => {

    return (
        <div>

        </div>
    )
}

export default CreateInvoiceModal