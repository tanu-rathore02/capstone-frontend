import React from 'react'
import { useNavigate } from 'react-router-dom'
import FormComponent from '../components/FormComponent'


function RegisterUser() {

  const navigate = useNavigate();

  const onSubmitHandler = (form, callback) => {
   console.log("Form Submitted:", form);
    callback();
    navigate('/adminDashboard');
  };

  return (
    <div>
      
      <FormComponent
        title={"Add New User"}
        formArr={formArr}
        submitBtn={"Submit"}
        onsubmit={onSubmitHandler}
      />
    </div>
  );
};

const formArr = [
  {
    label: "Username",
    name: "username",
    type: "text",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
  },
  {
    label: "Phone Number",
    name: "phone number",
    type: "tel",
  },
  {
    label: "Password",
    name: "password",
    type: "Password",
  },
  {
    label: "Confirm Password",
    name: "password",
    type: "password",
  },
];

export default RegisterUser

