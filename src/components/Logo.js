
import React from 'react';
import './styles/Logo.css';
import logo from '../images/bookshelf.png'

function Logo() {
  return (
    <div className="logo">
      <img src={logo} alt="Logo" />
    </div>
  );
}

export default Logo;
