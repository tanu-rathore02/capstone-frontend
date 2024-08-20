import React from 'react'
import { Link } from 'react-router-dom'
import  './styles/Navbar.css';

function Navbar() {
  return (
    <div className='nav-wrapper'>
    <nav className='navbar'>
      <ul>
        <li>
          <Link to="/">Home</Link>
         </li>
         <li>
          <Link to="/adminDashboard">Dashboard</Link>
         </li>
         <li>
          <Link to="/categories">Categories</Link>
         </li>
         <li>
          <Link to="/users">Users</Link>
         </li>
         <li>
          <Link to="/contact">Contact Us</Link>
         </li>
      </ul>
    </nav>
    </div>
  )
}

export default Navbar