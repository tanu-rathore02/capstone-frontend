import React from "react";
import { useNavigate } from "react-router-dom";
import FormComponent from "../components/FormComponent";
import { useDispatch } from "react-redux";
import { signupUser } from "../features/auth/authSlice";

function RegisterUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmitHandler = async (form, callback) => {
    try {
      await dispatch(signupUser(form)).unwrap();
      console.log("Form Submitted:", form);
      callback();
      navigate("/adminDashboard");
    } catch (error) {
      console.error("Signup failed:", error);
    }
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
}

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
    type: "password",
  },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
  },
];

export default RegisterUser;
