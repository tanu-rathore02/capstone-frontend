import React, { useState} from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import HocWrapper from "../components/HocWrapper";
import Button from "../components/Button";
import Searchbar from "../components/Searchbar";
import BooksTable from '../components/BooksTable';
import '../styles/Pages.css';
import axios from "axios";
import Modal from "../components/Modal";


function Books() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [availabilty, setAvailability] = useState(null);
  const [category, setCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


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

  const handleBookSumbit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const bookData = {
        title: title,
        author: author,
        category: category,
        availabilty: availabilty,
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
    }catch (error) {
      console.error("Error creating book", error);
      setErrorMessage("Failed to add book. Please try again");
    }
  };

  return (
    <div className='pages-container'>
      <div className='controls-container'>
        <Searchbar/>
        <Button name= "Add Book" className="page-btn" onClick={handleButtonClick}/>
      </div>
      <BooksTable showPagination={true}/>

      <Modal
       title ="Add Book"
       isOpen = {isModalOpen}
       onClose = {handleCloseModal}
       height= "200px"
       width= "300px"
      >
        <form onSubmit={handleBookSumbit}>
        <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="number"
            placeholder="Availability"
            value={availabilty}
            onChange={(e) => setAvailability(e.target.value)}
          />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Button name="Add" className="page-btn" />
        </form>
      </Modal>
    </div>
  )
}

export default HocWrapper(Navbar, Header)(Books);
