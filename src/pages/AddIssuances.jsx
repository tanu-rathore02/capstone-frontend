// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import FormComponent from '../components/FormComponent'


// function AddIssuances() {

//     const navigate = useNavigate();

//     const onSubmitHandler = (form, callback) => {
//         console.log("Form Submitted", form)
//         callback();
//         navigate('/users')
//     }
//   return (
//     <div className='reg-container'>
        
//         <FormComponent
//           title={"Add Issuance"}
//           formArr={formArr}
//           submitBtn={"Submit"}
//           onsubmit={onSubmitHandler}
//         />
//     </div>
//   )
// }

// const formArr = [
//     {
//         label: "Book Name",
//         name: "bookname",
//         type: "text",
//     },
//     {
//         label: "User Name",
//         name: " username",
//         type: "text",
//     },
//     {
//         label: "Issued Date",
//         name: "issued date",
//         type: "date",
//     },
//     {
//         label: "Return Date",
//         name: "return date",
//         type: "date",
//     },
//     {
//         label: "Status",
//         name: "status",
//         type: "text",
//     },
// ];

// export default AddIssuances

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormComponent from '../components/FormComponent';

function AddIssuances() {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const formArr = [
    {
      label: 'Book Name',
      name: 'bookname',
      type: 'text',
    },
    {
      label: 'User Name',
      name: 'username',
      type: 'text',
    },
    {
      label: 'Issued Date',
      name: 'issued date',
      type: 'date',
    },
    {
      label: 'Return Date',
      name: 'return date',
      type: 'date',
    },
    {
      label: 'Status',
      name: 'status',
      type: 'text',
    },
  ];

  const onSubmitHandler = (form, callback) => {
    console.log('Form Submitted', form);
    callback(); // Reset the form in the modal
    navigate('/users'); // Navigate to another route
  };

  return (
    <div className='reg-container'>
      <button onClick={() => setModalOpen(true)}>Add Issuance</button>
      <FormComponent
        title={'Add Issuance'}
        formArr={formArr}
        submitBtn={'Submit'}
        onsubmit={onSubmitHandler}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

export default AddIssuances;
