import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import dashboardIcon from '../assets/dashboardIcon.svg'
import categoriesIcon from '../assets/categoriesIcon.svg';
import usersIcon from '../assets/usersIcon.svg';
import contactsIcon from '../assets/contactsIcon.svg';
import booksIcon from '../assets/booksIcon.svg';

import './styles/Navbar.css';

function Navbar() {
  return (
    <div className='navbar-container'>
      <Logo/>
      <nav className='navbar'>
        <ul>
         
          <li>
            <Link to="/adminDashboard"><img src={dashboardIcon} alt="Dashboard" className="icon" /> Dashboard</Link>
          </li>
          <li>
            <Link to="/categories"><img src={categoriesIcon} alt="Categories" className="icon" /> Categories</Link>
          </li>
          <li>
            <Link to="/books"><img src={booksIcon} alt="Categories" className="icon" />Books</Link>
          </li>
          <li>
            <Link to="/issuances"><img src={usersIcon} alt="Users" className="icon" />Issuances</Link>
          </li>
          <li>
            <Link to="/contact"><img src={contactsIcon}alt="Contact Us" className="icon" /> Contact Us</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
