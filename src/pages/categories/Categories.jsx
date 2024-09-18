import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar"
import Header from "../../components/Header";
import HocWrapper from "../../components/HocWrapper";
import Button from "../../components/Button";
import Searchbar from "../../components/Searchbar";
import CategoryTable from "./CategoryTable"
import Modal from "../../components/Modal";
import { postRequest } from "../../api/ApiManager";
import { CREATE_CATEGORY } from "../../api/ApiConstants";
import "../../styles/Pages.css";

function Categories({setLoading}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [isMessage, setIsMessage] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isError, setIsError] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
    setIsMessage(false);
    setIsError(false);
    setMessage("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoryName("");
    setMessage("");
    setIsMessage(false);
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();

    const specialCharacterRegex = /[^a-zA-Z0-9 ]/;

    if (categoryName.trim() === "") {
      setMessage("Category name cannot be empty!");
      setIsMessage(true);
      setIsError(true);
      return;
    }

    if (specialCharacterRegex.test(categoryName)) {
      setMessage("Category name cannot contain special characters!");
      setIsMessage(true);
      setIsError(true);
      return;
    }

    

    const categoryData = {
      categoryName: categoryName.trim(),
    };

    postRequest(CREATE_CATEGORY, categoryData, (response) => {
      if (response?.status === 200 || response?.status === 201) {
        setMessage(response?.data.statusMsg);
        setIsMessage(true);
        setIsError(false);
        setRefresh((prev) => !prev);
        setTimeout(() => {
          setIsModalOpen(false);
          setCategoryName("");
        }, 2000);
      } else if (response?.status === 409) {
        setMessage(response?.data.statusMsg);
        setIsMessage(true);
        setIsError(true);
      } else {
        setMessage(response?.data.statusMsg);
        setIsMessage(true);
        setIsError(true);
      
      }
    });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  const modalDimension = isMessage
    ? { height: "310px", width: "300px" }
    : { height: "280px", width: "300px" };

    useEffect(()=>{
      // alert(setLoading)
    },[])

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
      <CategoryTable
        showPagination={true}
        refresh={refresh}
        searchTerm={searchTerm}
        setLoading={setLoading}
      />

      <Modal
        title="Add Category"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        height={modalDimension.height}
        width={modalDimension.width}
      >
        {message && (
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        )}
        <form onSubmit={handleCategorySubmit}>
          <label htmlFor="categoryName">Category Name</label>
          <input
           id="categoryName"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <div className="modal-button-group">
            <Button name="Add" className="modal-btn" />
            <Button
              name="Cancel"
              className="modal-btn"
              onClick={handleCloseModal}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default HocWrapper(Navbar, Header)(Categories);
