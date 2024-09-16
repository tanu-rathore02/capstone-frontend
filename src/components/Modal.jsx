import React from 'react';
import Button from './Button.jsx';
import '../styles/Modal.css';

function Modal({ isOpen, onClose, title, children, height = 'auto', width = 'auto' }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: width, height: height }}>
        <h2>{title}</h2>
        <Button className="modal-close-btn" onClick={onClose}>
          &times;
        </Button>
        {children}
      </div>
    </div>
  );
}

export default Modal;


