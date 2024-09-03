
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import HocWrapper from '../components/HocWrapper';
import Button from '../components/Button';
import Searchbar from '../components/Searchbar';
import UsersTable from '../components/UsersTable';
import '../styles/Pages.css';
import axios from 'axios';
import Modal from '../components/Modal';

function Users() {
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

 
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setName('');
    setEmail('');
    setMobileNumber('');
    setPassword('');
    setErrorMessage('');
  };

 
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      
      const userData = {
        name: name,
        mobileNumber: mobileNumber,
        email: email,
        password: password,
        role: "ROLE_USER", 
      };

      
      const response = await axios.post(
        "http://localhost:8080/api/register",
        userData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log("User Registered:", response.data);
      
      
      handleCloseModal();

      
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error registering user", error);
      setErrorMessage("Failed to register user. Please try again.");
    }
  };

  
  const handleSearch = (term) => {
    setSearchTerm(term); 
  };

  return (
    <div className='pages-container'>
      <div className='controls-container'>
        <Searchbar onSearch={handleSearch}/>
        <Button name="Add User" className="page-btn" onClick={handleButtonClick} />
      </div>
      
      
      <UsersTable showPagination={true} refresh={refresh} searchTerm={searchTerm}/>
      
      <Modal
        title="Add User"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        height="300px"
        width="350px"
      >
        <form onSubmit={handleUserSubmit} className="user-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
          <input
            type="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="tel" 
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
          
          <input
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          
          <Button type="submit" name="Add" className="page-btn" />
        </form>
      </Modal>
    </div>
  );
}

export default HocWrapper(Navbar, Header)(Users);
