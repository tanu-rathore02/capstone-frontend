import React from 'react';
import { NavLink } from 'react-router-dom'; 
import Logo from './Logo';
import dashboardIcon from '../assets/dashboardIcon.svg';
import categoriesIcon from '../assets/categoriesIcon.svg';
import usersIcon from '../assets/usersIcon.svg';
import booksIcon from '../assets/booksIcon.svg';
import issuancesIcon from '../assets/issuancesIcon.svg';

import '../styles/Navbar.css';

function Navbar({ role }) {
  return (
    <div className='navbar-container'>
      <Logo />
      <nav className='navbar'>
        <ul>
        
          {role === 'ADMIN' && (
            <>
              <li>
                <NavLink 
                  to="/adminDashboard"
                  className={({ isActive }) => (isActive ? 'active-link' : '')}
                >
                  <img src={dashboardIcon} alt="Dashboard" className="icon" /> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/categories"
                  className={({ isActive }) => (isActive ? 'active-link' : '')}
                >
                  <img src={categoriesIcon} alt="Categories" className="icon" /> Categories
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/books"
                  className={({ isActive }) => (isActive ? 'active-link' : '')}
                >
                  <img src={booksIcon} alt="Books" className="icon" /> Books
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/issuances"
                  className={({ isActive }) => (isActive ? 'active-link' : '')}
                >
                  <img src={issuancesIcon} alt="Issuances" className="icon" /> Issuances
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/users"
                  className={({ isActive }) => (isActive ? 'active-link' : '')}
                >
                  <img src={usersIcon} alt="Users" className="icon" /> Users
                </NavLink>
              </li>
            </>
          )}

        
          {role === 'USER' && (
            <li>
              <NavLink 
                to="/userDashboard"
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <img src={dashboardIcon} alt="User Dashboard" className="icon" /> Dashboard
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
