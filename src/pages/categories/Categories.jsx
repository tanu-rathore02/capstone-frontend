import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import HocWrapper from "../../components/HocWrapper";
import Button from "../../components/Button";
import Searchbar from "../../components/Searchbar";
import CategoryTable from "./CategoryTable"
import Modal from "../../components/Modal"
import { postRequest } from "../../api/ApiManager";
import { CREATE_CATEGORY } from "../../api/ApiConstants";
import "../../styles/Pages.css";

function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isError, setIsError] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoryName("");
    setMessage("");
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();

    const specialCharacterRegex = /[^a-zA-Z0-9 ]/;

    if (categoryName.trim() === "") {
      setMessage("Category name cannot be empty!");
      setIsError(true);
      return;
    }

    if (specialCharacterRegex.test(categoryName)) {
      setMessage("Category name cannot contain special characters!");
      setIsError(true);
      return;
    }

    const categoryData = {
      categoryName: categoryName,
    };

    postRequest(CREATE_CATEGORY, categoryData, (response) => {
      if (response?.status === 200 || response?.status === 201) {
        setMessage("Category added successfully!");
        setIsError(false);
        setRefresh((prev) => !prev); 
        setTimeout(() => {
          setIsModalOpen(false);
          setCategoryName("");
        }, 2000);
      }else if (response?.status === 409) { 
        setMessage("Category with this name already exists!");
        setIsError(true);
      } else {
        setMessage("Failed to add category. Please try again");
        setIsError(true);
        console.error("Error creating category", response?.data);
      } 
    });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="pages-container">
      <div className="controls-container">
        <Searchbar onSearch={handleSearch} />
        <Button
          name="Add Category"
          className="page-btn"
          onClick={handleButtonClick}
        />
      </div>
      <CategoryTable showPagination={true} refresh={refresh} searchTerm={searchTerm} />

      <Modal
        title="Add Category"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
         {message && (
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        )}
        <form onSubmit={handleCategorySubmit}>
          <label htmlFor="categoryName">Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <div className="modal-button-group">
            <Button name="Add" className="table-btn" />
            <Button
              name="Cancel"
              className="table-btn"
              onClick={handleCloseModal}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default HocWrapper(Navbar, Header)(Categories);
