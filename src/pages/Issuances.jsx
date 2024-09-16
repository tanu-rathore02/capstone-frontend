import React, { useState, useEffect } from "react";
import '../styles/Pages.css';
import IssuancesTable from "../components/IssuancesTable";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Loader from "../components/Loader";
import HocWrapper from "../components/HocWrapper";
import Button from "../components/Button";
import axios from "axios";
import Modal from "../components/Modal";
import Searchbar from "../components/Searchbar";


function Issuances({setLoading}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [returnDate, setReturnDate] = useState('');
  const [status, setStatus] = useState('');
  const [issuanceType, setIssuanceType] = useState('');
  const [users, setUsers] = useState([]); 
  const [books, setBooks] = useState([]);
  const [username, setUsername] = useState( );
  const [bookname, setBookname] = useState( );
  const [mobileNumber, setMobileNumber] = useState('');
  const [issueDate, setIssueDate] = useState(''); 
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [message, setMessage] = useState();
  const [isError, setIsError] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/allUsersForDropDown", {
          headers: {
            Authorization: token,
          },
        });
        setUsers(response.data); 
      } catch (error) {
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
        setBooks(response.data); 
      } catch (error) {
       
      }
    };

    fetchUsers();
    fetchBooks();
  }, [isModalOpen]);

  const handleButtonClick = () => {
    setIsModalOpen(true);
    setMessage('');
    const now = new Date();
    const formattedIssueDate = now.toISOString().slice(0, 16);
    setIssueDate(formattedIssueDate);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStatus('');
    setReturnDate('');
    setIssuanceType('');
    setBookname();
    setUsername();
    setMessage('');
    setIsMessage(false);
  };

  
const validateForm = () => {
   

  const issueDateObj = new Date(issueDate); 
  const returnDateObj = new Date(returnDate);

  if(!returnDate || !issuanceType || !username || !bookname || !status ){
    setMessage("Please fill all the fields");
    setIsError(true);
    setIsMessage(true);
    return false;
  }
  
  if (returnDateObj <= issueDateObj) {
    setMessage("Return date must be greater than the issued date!");
    setIsError(true);
    setIsMessage(true)
    return false;
  }

   return true;
}

  const handleIssuanceSubmit = async (e) => {
    e.preventDefault();
   
    if(!validateForm){
      return;
    }

    const formattedStatus = status.toUpperCase();
    const formattedReturnDate = returnDate ? new Date(returnDate).toISOString() : "";
    const formattedIssuanceType = issuanceType.replace(/\s+/g, '-').toUpperCase(); 
 


    try {
      const token = localStorage.getItem("token");
      const issuanceData = {
       
        userId: mobileNumber,
        bookId: parseInt(bookname),
        status: formattedStatus,
        issuanceType: formattedIssuanceType,
        returnDate: formattedReturnDate,
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
      setMessage("Issuance created successfully!");
      setIsError(false);
      setIsMessage(true);
    
      handleCloseModal();
      setRefresh((prev) => !prev);
    } catch (error) {
     
      setMessage("Failed to add issuance. Please try again");
      setIsError(true);
      setIsMessage(true);
    }
  };

  
  
  const handleSearch = (term) => {
    setSearchTerm(term); 
  };

  const modalDimension = isMessage ? {height: "650", width:"400px"} : {height: "550", width:"400px"};

  return (
    <div className="pages-container">
      <div className="controls-container">
        <Searchbar onClick={handleSearch}/>
        <Button name="Add Issuance" className="page-btn" onClick={handleButtonClick} />
      </div>
      <IssuancesTable showPagination={true} refresh={refresh} searchTerm= {searchTerm} setLoading={setLoading} />
      <Modal
        title="Add Issuance"
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
        <form onSubmit={handleIssuanceSubmit}>
       
          <label htmlFor="mobileNumber">Mobile Number</label>
          <select
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.mobileNumber}
              </option>
            ))}
          </select>
          <label htmlFor="book">Book</label>
          <select
            value={bookname}
            onChange={(e) => setBookname(e.target.value)}
           
          >
            <option value="">Select Book</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
          <label htmlFor="returnDate">Return Date</label>
          <input
            type="datetime-local"
            placeholder="Return Date"
            value={returnDate}
            min={issueDate}
            onChange={(e) => setReturnDate(e.target.value)}
            
          />
        
          <label htmlFor="status">Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="ISSUED">Issued</option>
          </select>

          <div>
            <label>Issuance Type:</label>
            <input
              type="radio"
              value="IN-HOUSE"
              checked={issuanceType === 'IN-HOUSE'}
              onChange={(e) => setIssuanceType(e.target.value)}
             
            />
            <label>In House</label>
            <input
              type="radio"
              value="TAKE-AWAY"
              checked={issuanceType === 'TAKE-AWAY'}
              onChange={(e) => setIssuanceType(e.target.value)}
             
            />
            <label>Take Away</label>
          </div>
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

export default HocWrapper(Navbar, Header, Loader)(Issuances);


