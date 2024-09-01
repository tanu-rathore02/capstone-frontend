// import React from "react";
// import { useNavigate } from "react-router-dom";
// import FormComponent from "../components/FormComponent";

// function AddCategory() {

//     const navigate = useNavigate();

//     const onSubmitHandler = (form, callback) => {
//         console.log("Form Submitted:", form);
//         callback();
//         navigate('/categories')
//     }
//     return (
//         <div className="reg-container">
//             <h2>Add new Category</h2>
//             <FormComponent
//             title={"Add Category"}
//              formArr ={formArr}
//              submitBtn={"Submit"}
//              onsubmit={onSubmitHandler}
//              />
//          </div>
//     );
// };

// const formArr = [
//     {
//         label: "Category Name",
//         name: "category name",
//         type: "text",
//     }
// ];

// export default AddCategory;

// import React, { useState } from 'react';
// import Navbar from '../components/Navbar';
// import Header from '../components/Header';
// import HocWrapper from '../components/HocWrapper';
// import Button from '../components/Button';
// import Searchbar from '../components/Searchbar';
// import CategoryTable from '../components/CategoryTable';
// import Modal from '../components/Modal';
// import FormComponent from '../components/FormComponent'; // Reusing the form
// import '../styles/Pages.css';

// function Categories() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleButtonClick = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const onSubmitHandler = (form, callback) => {
//     console.log('Form Submitted:', form);
//     callback();
//     setIsModalOpen(false);
//   };

//   return (
//     <div className='pages-container'>
//       <div className='controls-container'>
//         <Searchbar />
//         <Button name="Add Category" className="page-btn" onClick={handleButtonClick} />
//       </div>
//       <CategoryTable showPagination={true} />

//       <Modal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         title="Add New Category"
//       >
//         <FormComponent
//           formArr={[
//             { label: 'Category Name', name: 'category_name', type: 'text' },
//           ]}
//           submitBtn="Submit"
//           onsubmit={onSubmitHandler}
//         />
//       </Modal>
//     </div>
//   );
// }

// export default HocWrapper(Navbar, Header)(Categories);
