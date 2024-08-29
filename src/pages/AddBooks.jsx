import React from 'react'
import { useNavigate } from 'react-router-dom'
import FormComponent from '../components/FormComponent'


function AddBooks() {

    const navigate = useNavigate();

    const onSubmitHandler = (form, callback) => {
        console.log("Form Submitted", form);
        callback();
        navigate('/books');
    };

  return (
    <div className='reg-container'>
        
        <FormComponent
        title={"Add Book"}
        formArr={formArr}
        submitBtn={"Submit"}
        onsubmit={onSubmitHandler}
        />
     </div>
  )
}

const formArr = [
    {
        label: "Title",
        name: "title",
        type: "text"
    },
    {
        label: "Author",
        name: "author",
        type: "text",
    },
    {
        label: "Number of Books",
        name: "number of books",
        type: "number",
    }
];

export default AddBooks