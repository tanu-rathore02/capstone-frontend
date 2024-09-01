import React from 'react'
import Button from './Button'
import '../styles/Header.css'
import { useNavigate } from 'react-router-dom';



function Header() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
    };

  return (
    <div className='header'>
      <h1>Welcome Admin</h1>
      <div className='header-btn'>
         <Button name="Sign-out" className="form-btn" onClick={handleLogout}/>
      </div>
    
    </div>
  )
}

export default Header