import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import HocWrapper from "../components/HocWrapper";
import Button from "../components/Button";
import Searchbar from "../components/Searchbar";
import CategoryTable from "../components/CategoryTable";
import Modal from "../components/Modal";
import "../styles/Pages.css";
import axios from "axios";

function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoryName("");
    setErrorMessage("");
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const categoryData = {
        categoryName: categoryName,
      };

      const response = await axios.post(
        "http://localhost:8080/api/categories/createCategory",
        categoryData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("Category created:", response.data);

      handleCloseModal();
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error creating category", error);
      setErrorMessage("Failed to add category. Please try again");
    }
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
        height="230px"
        width="300px"
      >
        <form onSubmit={handleCategorySubmit}>
          <label htmlFor="categoryName">Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
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
