import React, { useState, useEffect} from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import HocWrapper from "../components/HocWrapper";
import Button from "../components/Button";
import Searchbar from "../components/Searchbar";
import BooksTable from '../components/BooksTable';
import apiManager from '../api/apiManager'
import '../styles/Pages.css';
import axios from "axios";
import Modal from "../components/Modal";
import InputField from "../components/InputField";


function Books() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [availability, setAvailability] = useState(null);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]); 
  const [errorMessage, setErrorMessage] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/categories/allForDropDown", {
          headers: {
            Authorization: token,
          },
        });
        setCategories(response.data); 
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, [isModalOpen]);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setAuthor('');
    setAvailability(null);
    setCategory('');
    setErrorMessage('');
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const bookData = {
        title: title,
        author: author,
        categoryId: category, 
        availability: availability,
      };

      const response = await axios.post(
        "http://localhost:8080/api/books/createBook",
        bookData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("Book created:", response.data);
      handleCloseModal();
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error creating book", error);
      setErrorMessage("Failed to add book. Please try again");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className='pages-container'>
      <div className='controls-container'>
        <Searchbar onSearch={handleSearch} />
        <Button name="Add Book" className="page-btn" onClick={handleButtonClick} />
      </div>
      <BooksTable showPagination={true} refresh={refresh} searchTerm={searchTerm}/>

      <Modal
        title="Add Book"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        height="300px"
        width="350px"
      >
        <form onSubmit={handleBookSubmit}>
          <InputField
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <InputField
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)} // Set category ID
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          <InputField
            type="number"
            placeholder="Availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Button name="Add" className="page-btn" />
        </form>
      </Modal>
    </div>
  );
}

export default HocWrapper(Navbar, Header)(Books);

