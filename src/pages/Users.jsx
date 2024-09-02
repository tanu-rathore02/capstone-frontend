import React, { useState} from 'react';
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
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setName('');
    setEmail('');
    setMobileNumber('');
    setPassword('');
    setRole('');
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
      role: role,
    };

    const response = await axios.post(
      "http://localhost:8080/api/register",
      userData,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    
    console.log("User Registered:", response.data);
    handleCloseModal();
  }catch (error) {
    console.error("Error registering user", error);
    setErrorMessage("Failed to register user. Please try again");
  }
 };

  return (
    <div className='page-container'>
      <div className='controls-container'>
      <Searchbar/>
      <Button name= "Add User" className="page-btn" onClick={handleButtonClick}/>
      </div>
      {/* <UsersTable showPagination={true}/> */}
      <Modal
      title ="Add User"
      isOpen = {isModalOpen}
      onClose = {handleCloseModal}
      height= "200px"
      width= "300px"
      >
        <form onSubmit={handleUserSubmit}>
        <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Button name="Add" className="page-btn" />
        </form>
      </Modal>
    </div>
  )
}

export default HocWrapper(Navbar, Header)(Users);