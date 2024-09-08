
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import HocWrapper from '../components/HocWrapper';
import Button from '../components/Button';
import Searchbar from '../components/Searchbar';
import UsersTable from '../components/UsersTable';
import '../styles/Pages.css';

import Modal from '../components/Modal';
import { postRequest } from '../api/ApiManager';
import { CREATE_USER } from '../api/ApiConstants';

function Users() {
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState("");
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
    setMessage('');
    setErrors({
      name: "",
      mobileNumber: "",
      email: "",
      
    });
  };

  
  const validateForm = () => {
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!name || !mobileNumber || !email) {
      setMessage("Please fill all the fields!");
      setIsError(true);
      return false;
    }
    if (specialCharacterRegex.test(name) || specialCharacterRegex.test(mobileNumber)) {
      setMessage("Username cannot contain special characters!");
      setIsError(true);
      return false;
    }
   
    if (!email) {
      setMessage("Email is required.");
      setIsError(true);
      return false;
    } else {
      let atIndex = email.indexOf('@');
      let dotIndex = email.indexOf('.');
  
      if (atIndex === -1 || dotIndex === -1 || email.slice(dotIndex) !== ".com" || dotIndex < atIndex) {
        setMessage("Invalid email format. Domain must end with .com");
        setIsError(true);
        return false;
      }
    }

    if (!/^\d+$/.test(mobileNumber)) {
      setMessage("Phone number must contain only digits.");
      return false;
    }else if (mobileNumber.length <10){
      setMessage("Phone number must be 10 digits long");
      return false;
    }
    return true;
  };

 
  const handleUserSubmit = async (e) => {
    e.preventDefault();

    
    if (!validateForm()) {
      return;
    }

    const userData = {
      name: name,
      mobileNumber: mobileNumber,
      email: email,
      password: password,
      role: "ROLE_USER", 
    };

    postRequest(CREATE_USER, userData, (response) => {
        if (response?.status === 200 || 201){
          setMessage("User Added Successfully!");
          setIsError(false);
          console.log("Book created:", response.data);
        setTimeout(() => {
          handleCloseModal();
        }, 2000);

        setRefresh((prev) => !prev);
        }else if (response?.status === 409) {
          setMessage("User with this credentials already exists!");
          setIsError(true);
        } else {
          console.error("Error creating user", response?.data);
          setMessage("Failed to add user. Please try again");
          setIsError(true);
        }
    });
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
      >
        {message && (
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        )}
        <form onSubmit={handleUserSubmit} className="user-form">
        <label htmlFor="Nname">Username</label>
          <input
            type="text"
            
            value={name}
            onChange={(e) => setName(e.target.value)}
           
          />
           <label htmlFor="email">Email</label>
          <input
            type="email" 
           
            value={email}
            onChange={(e) => setEmail(e.target.value)}
      
          />
           <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            type="tel" 
          
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
     
          />
          <div className='modal-button-group'>
            <Button type="submit" name="Add" className="table-btn" />
          <Button type="submit" name="Cancel" className="table-btn"  onClick={handleCloseModal}/>
          </div>
          
        </form>
      </Modal>
    </div>
  );
}

export default HocWrapper(Navbar, Header)(Users);
