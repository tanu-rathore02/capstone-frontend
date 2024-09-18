import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import HocWrapper from "../components/HocWrapper";
import Button from "../components/Button";
import Searchbar from "../components/Searchbar";
import BooksTable from "../components/BooksTable";
import DropDown from "../components/Dropdown";
import "../styles/Pages.css";
import Modal from "../components/Modal";
import { postRequest, getRequest } from "../api/ApiManager";
import { GET_ALL_CATEGORY, CREATE_BOOK } from "../api/ApiConstants";

function Books({ setLoading }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [availability, setAvailability] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState("");
  const [isError, setIsError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMessage, setIsMessage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = () => {
      getRequest(GET_ALL_CATEGORY, (response) => {
        if (response?.status === 200) {
          setCategories(
            response.data.map((cat) => ({
              value: cat.id,
              label: cat.categoryName,
            }))
          );
        }
      });
    };

    fetchCategories();
  }, [isModalOpen]);

  const handleCategorySelect = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setCategory(selectedOption.value);
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setAuthor("");
    setAvailability(null);
    setCategory("");
    setMessage("");
    setIsMessage(false);
    setErrors({
      title: "",
      author: "",
      availability: "",
      category: "",
    });
    setIsError(false);
  };

  const validateForm = () => {
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();

    if (!trimmedTitle || !trimmedAuthor || !availability || !category) {
      setMessage("Please fill all the fields!");
      setIsMessage(true);
      setIsError(true);
      return false;
    }

    if (
      specialCharacterRegex.test(title) ||
      specialCharacterRegex.test(author)
    ) {
      setMessage("Title and Author cannot contain special characters!");
      setIsError(true);
      setIsMessage(true);
      return false;
    }
    const availabilityNumber = parseFloat(availability);

    if (isNaN(availabilityNumber)) {
      setMessage("Availability must be a valid number!");
      setIsError(true);
      setIsMessage(true);
      return false;
    }

    if (availabilityNumber < 0) {
      setMessage("Availability cannot be a negative number!");
      setIsError(true);
      setIsMessage(true);
      return false;
    }
    if (availabilityNumber % 1 !== 0) {
      setMessage("Availability cannot be a decimal value!");
      setIsError(true);
      setIsMessage(true);
      return false;
    }

    return true;
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const trimmedTitle = title.trim();

    const bookData = {
      title: trimmedTitle,
      author: author,
      categoryId: category,
      availability: availability,
    };

    postRequest(CREATE_BOOK, bookData, (response) => {
      if (response?.status === 200 || response?.status === 201) {
     
        setMessage(response?.data.statusMsg);
        setIsMessage(true);
        setIsError(false);

        setTimeout(() => {
          handleCloseModal();
        }, 2000);

        setRefresh((prev) => !prev);
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

  useEffect(() => {
    // alert(setLoading)
  }, []);

  const modalDimension = isMessage
    ? { height: "650", width: "400px" }
    : { height: "550", width: "400px" };

  return (
    <div className="pages-container">
      <div className="controls-container">
        <Searchbar onSearch={handleSearch} />
        <Button
          name="Add Book"
          className="page-btn"
          onClick={handleButtonClick}
        />
      </div>
      <BooksTable
        showPagination={true}
        refresh={refresh}
        searchTerm={searchTerm}
        height={modalDimension.height}
        width={modalDimension.width}
        setLoading={setLoading}
      />

      <Modal
        title="Add Book"
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

        <form onSubmit={handleBookSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            placeholder="Enter author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <label htmlFor="category">Category</label>
          <DropDown
            options={categories}
            onSelect={handleCategorySelect}
            placeholder="Select Category"
          />

          <label htmlFor="availability">Availability</label>
          <input
            type="text"
            id="availability"
            placeholder="Enter available copies"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
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

export default HocWrapper(Navbar, Header)(Books);
