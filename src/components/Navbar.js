import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import './styles/Navbar.css';

function Navbar() {
  return (
    <div className='sidenav'>
      <Logo />
      <nav className='navbar'>
        <ul>
          <li>
            <Link to="/"><img src="/assets/icons/home.png" alt="Home" className="icon" /> Home</Link>
          </li>
          <li>
            <Link to="/adminDashboard"><img src="/assets/icons/dashboard.png" alt="Dashboard" className="icon" /> Dashboard</Link>
          </li>
          <li>
            <Link to="/categories"><img src="/assets/icons/categories.png" alt="Categories" className="icon" /> Categories</Link>
          </li>
          <li>
            <Link to="/users"><img src="/assets/icons/users.png" alt="Users" className="icon" /> Users</Link>
          </li>
          <li>
            <Link to="/contact"><img src="/assets/icons/contact.png" alt="Contact Us" className="icon" /> Contact Us</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
