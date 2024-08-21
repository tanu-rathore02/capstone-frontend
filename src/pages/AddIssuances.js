import React from 'react'
import { useNavigate } from 'react-router-dom'
import FormComponent from '../components/form/FormComponent'


function AddIssuances() {

    const navigate = useNavigate();

    const onSubmitHandler = (form, callback) => {
        console.log("Form Submitted", form)
        callback();
        navigate('/users')
    }
  return (
    <div className='reg-container'>
        <h2>Add New Issuance</h2>
        <FormComponent
          title={"Add Issuance"}
          formArr={formArr}
          submitBtn={"Submit"}
          onsubmit={onSubmitHandler}
        />
    </div>
  )
}

const formArr = [
    {
        label: "Book Name",
        name: "bookname",
        type: "text",
    },
    {
        label: "User Name",
        name: " username",
        type: "text",
    },
    {
        label: "Issued Date",
        name: "issued date",
        type: "date",
    },
    {
        label: "Return Date",
        name: "return date",
        type: "date",
    },
    {
        label: "Status",
        name: "status",
        type: "text",
    },
];

export default AddIssuances

