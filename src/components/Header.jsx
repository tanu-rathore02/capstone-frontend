import React, { useState } from 'react';
import Button from './Button';
import Modal from './Modal'; 
import '../styles/Header.css';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const openModal = () => {
    setIsModalOpen(true); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmLogout = () => {
    handleLogout();
    setIsModalOpen(false); 
  };

  return (
    <div className="header">
      <h1>Welcome</h1>
      <div className="header-btn">
        <Button name="Sign-out" className="form-btn" onClick={openModal} />
      </div>

  
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Confirm Logout"
        height="250px"
        width="400px"
      >
        <p>Are you sure you want to log out?</p>
        <div className="modal-button-group">
          <Button name="Yes, Log Out" className="table-btn" onClick={confirmLogout} />
          <Button name="Cancel" className="table-btn" onClick={closeModal} />
        </div>
      </Modal>
    </div>
  );
}

export default Header;
