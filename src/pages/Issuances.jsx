import React, { useState, useEffect } from "react";
import '../styles/Pages.css';
import IssuancesTable from "../components/IssuancesTable";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import HocWrapper from "../components/HocWrapper";
import Searchbar from "../components/Searchbar";
import Button from "../components/Button";
import axios from "axios";
import Modal from "../components/Modal";
import InputField from "../components/InputField";

function Issuances() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [returnDate, setReturnDate] = useState('');
  const [status, setStatus] = useState('');
  const [issuanceType, setIssuanceType] = useState('');
  const [users, setUsers] = useState([]); // State to hold users in dropdown
  const [books, setBooks] = useState([]); // State to hold books in dropdown
  const [username, setUsername] = useState('');
  const [bookname, setBookname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/allUsersForDropDown", {
          headers: {
            Authorization: token,
          },
        });
        setUsers(response.data); // Set users in state
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/books/allForDropDown", {
          headers: {
            Authorization: token,
          },
        });
        setBooks(response.data); // Set books in state
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };

    fetchUsers();
    fetchBooks();
  }, [isModalOpen]);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStatus('');
    setReturnDate('');
    setIssuanceType('');
    setBookname('');
    setUsername('');
    setErrorMessage('');
  };

  const handleIssuanceSubmit = async (e) => {
    e.preventDefault();

    
    const formattedStatus = status.toUpperCase(); // Convert to uppercase if that's what the backend expects
    const formattedIssuanceType = issuanceType.replace(/\s+/g, '-').toUpperCase(); // Replace spaces with hyphens and convert to uppercase

    console.log({
      userId: username,
      bookId: bookname,
      status: formattedStatus,
      issuanceType: formattedIssuanceType,
      returnDate: returnDate,
    });

    try {
      const token = localStorage.getItem("token");
      const issuanceData = {
        userId: username,
        bookId: bookname,
        status: formattedStatus,
        issuanceType: formattedIssuanceType,
        returnDate: returnDate,
      };
      const response = await axios.post(
        "http://localhost:8080/api/issuances/createIssuance",
        issuanceData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("Issuance created:", response.data);
      handleCloseModal();
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error creating issuance", error);
      setErrorMessage("Failed to add issuance. Please try again");
    }
  };

  
  const handleSearch = (term) => {
    setSearchTerm(term); 
  };

  return (
    <div className="pages-container">
      <div className="controls-container">
        <Searchbar onClick={handleSearch}/>
        <Button name="Add Issuance" className="page-btn" onClick={handleButtonClick} />
      </div>
      <IssuancesTable showPagination={true} refresh={refresh} searchTerm= {searchTerm} />
      <Modal
        title="Add Issuance"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        height="350px"
        width="400px"
      >
        <form onSubmit={handleIssuanceSubmit}>
          <select
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <select
            value={bookname}
            onChange={(e) => setBookname(e.target.value)}
            required
          >
            <option value="">Select Book</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
          <InputField
            type="date"
            placeholder="Return Date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            required
          />
          <div>
            <label>Status:</label>
            <input
              type="radio"
              value="ISSUED"
              checked={status === 'ISSUED'}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
            <label>ISSUED</label>
            <input
              type="radio"
              value="RETURNED"
              checked={status === 'RETURNED'}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
            <label>RETURNED</label>
          </div>
          <div>
            <label>Issuance Type:</label>
            <input
              type="radio"
              value="IN-HOUSE"
              checked={issuanceType === 'IN-HOUSE'}
              onChange={(e) => setIssuanceType(e.target.value)}
              required
            />
            <label>In House</label>
            <input
              type="radio"
              value="TAKE-AWAY"
              checked={issuanceType === 'TAKE-AWAY'}
              onChange={(e) => setIssuanceType(e.target.value)}
              required
            />
            <label>Take Away</label>
          </div>
          <Button name="Add" className="page-btn" />
          <Button
            name="Cancel"
            className="page-btn"
            onClick={handleCloseModal}
          />
        </form>
      </Modal>
    </div>
  );
}

export default HocWrapper(Navbar, Header)(Issuances);


