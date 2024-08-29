import React from 'react'
import logo from '../assets/logo.png'
import '../styles/Logo.css'

function Logo() {
  return (
    <div className='logo-container'>
        <img src={logo} alt='logo' className='logo-img'/> 
    
    </div>
  )
}

export default Logo