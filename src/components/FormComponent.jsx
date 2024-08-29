import React, { useMemo, useState } from "react";
import Button from './Button';
import '../styles/FormComponent.css'

const prepareForm = (formArr) => {
    return formArr.reduce((r,v) => ({...r,[v.name]: ""}), {});
};

function FormComponent({ title, formArr, submitBtn, onsubmit }) {
  const initialForm = useMemo(() => prepareForm(formArr), [formArr]);
  const [forms, setForms] = useState(initialForm);

  const onChangeHandler = (e) => setForms((previousState) => ({...previousState, [e.target.name]: e.target.value}));
  const onSubmitHandler = () => onsubmit(forms, () => setForms(initialForm));

  return (
    <div className="form-container">
      <form className="form" autoComplete={"off"}>
        <h2 className="form-title">{title}</h2>
        {formArr.map(({label, name, type}, index) =>(
            <div key = {index} className="form-input-field">
                <label htmlFor={name} className="form-label">{label}</label>
                <input 
                id={name} 
                name={name} 
                type={type} 
                value={forms[name]} 
                onChange={(e) => onChangeHandler(e)}
                />
            </div>
        ))}
        <div className="formBtn">
          <Button onClick={(e) => {
            e.preventDefault();
            onSubmitHandler();
        }} name = {submitBtn} className= "form-btn"/>
        </div>
        
      </form>
    </div>
  );
}

FormComponent.defaultProps = {
 
  title: "Register",
  formArr: [
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
],
  submitBtn: "Submit",
  onsubmit: (forms) => console.log(forms),
};

export default FormComponent;
