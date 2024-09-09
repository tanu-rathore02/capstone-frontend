import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import HocWrapper from "../components/HocWrapper";
import Button from "../components/Button";
import Searchbar from "../components/Searchbar";
import BooksTable from "../components/BooksTable";
import "../styles/Pages.css";
import Modal from "../components/Modal";
import { postRequest, getRequest } from "../api/ApiManager";
import { GET_ALL_CATEGORY, CREATE_BOOK } from "../api/ApiConstants";

function Books() {
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

  useEffect(() => {
    const fetchCategories = () => {
      getRequest(GET_ALL_CATEGORY, (response) => {
        if (response?.status === 200) {
          setCategories(response.data);
        } else {
          console.error("Error fetching categories", response?.data);
        }
      });
    };

    fetchCategories();
  }, [isModalOpen]);

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
    setErrors({
      title: "",
      author: "",
      availability: "",
      category: "",
    });
  };


  const validateForm = () => {
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!title || !author || !availability || !category) {
      setMessage("Please fill all the fields!");
      setIsError(true);
      return false;
    }
    if (specialCharacterRegex.test(title) || specialCharacterRegex.test(author)) {
      setMessage("Title and Author cannot contain special characters!");
      setIsError(true);
      return false;
    }
    if (availability < 0) {
      setMessage("Availability cannot be a negative number!");
      setIsError(true);
      return false;
    }
    return true;
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const bookData = {
      title: title,
      author: author,
      categoryId: category,
      availability: availability,
    };

    postRequest(CREATE_BOOK, bookData, (response) => {
      if (response?.status === 200 || response?.status === 201) {
        setMessage("Book added successfully!");
        setIsError(false);
        console.log("Book created:", response.data);
        setTimeout(() => {
          handleCloseModal();
        }, 2000);

        setRefresh((prev) => !prev);
      } else if (response?.status === 409) {
        setMessage("Book with this name already exists!");
        setIsError(true);
      } else {
        console.error("Error creating book", response?.data);
        setMessage("Failed to add book. Please try again");
        setIsError(true);
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
          name="Add Book"
          className="page-btn"
          onClick={handleButtonClick}
        />
      </div>
      <BooksTable
        showPagination={true}
        refresh={refresh}
        searchTerm={searchTerm}
      />

      <Modal title="Add Book" isOpen={isModalOpen} onClose={handleCloseModal}
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
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          
          <label htmlFor="availability">Availability</label>
          <input
            type="number"
            id="availability"
            placeholder="Enter available copies"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
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

export default HocWrapper(Navbar, Header)(Books);
