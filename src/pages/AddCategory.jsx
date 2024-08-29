import React from "react";
import { useNavigate } from "react-router-dom";
import FormComponent from "../components/FormComponent";

function AddCategory() {

    const navigate = useNavigate();

    const onSubmitHandler = (form, callback) => {
        console.log("Form Submitted:", form);
        callback();
        navigate('/categories')
    }
    return (
        <div className="reg-container">
            <h2>Add new Category</h2>
            <FormComponent
            title={"Add Category"}
             formArr ={formArr}
             submitBtn={"Submit"}
             onsubmit={onSubmitHandler}
             />
         </div>
    );
};

const formArr = [
    {
        label: "Category Name",
        name: "category name",
        type: "text",
    }
];

export default AddCategory;